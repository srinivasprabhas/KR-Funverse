"use client";

import * as React from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TriangleAlertIcon } from "lucide-react";

import { DatePicker } from "@/components/dashboard/filter-bar";
import { formatMoney } from "@/components/dashboard/money";
import { newId, useStore } from "@/lib/dashboard/store";
import {
  availableCourts,
  findConflict,
  formatDuration,
  formatTime,
} from "@/lib/dashboard/availability";
import {
  PAYMENT_METHODS,
  balanceOf,
  type Booking,
  type PaymentMethod,
} from "@/lib/dashboard/types";

export interface BookingFormPreset {
  gameId?: string;
  courtId?: string;
  date?: string;
  startTime?: string;
}

/**
 * The single booking form, used for both create and edit and opened from both
 * the slot board and the bookings list.
 *
 * Availability is enforced here by disabling taken courts rather than by
 * validating on submit — an unavailable slot is never selectable in the first
 * place. The reducer re-checks anyway as a backstop.
 */
export function BookingForm({
  booking,
  preset,
  onDone,
}: {
  booking?: Booking;
  preset?: BookingFormPreset;
  onDone: () => void;
}) {
  const { state, dispatch, today } = useStore();
  const activeGames = state.games.filter((g) => g.status === "active");

  const [gameId, setGameId] = React.useState(
    booking?.gameId ?? preset?.gameId ?? activeGames[0]?.id ?? ""
  );
  const game = state.games.find((g) => g.id === gameId);

  const [customerName, setCustomerName] = React.useState(booking?.customerName ?? "");
  const [phone, setPhone] = React.useState(booking?.phone ?? "");
  const [date, setDate] = React.useState(booking?.date ?? preset?.date ?? today);
  const [durationMin, setDurationMin] = React.useState(
    booking?.durationMin ?? game?.durations[0] ?? 30
  );
  const [startTime, setStartTime] = React.useState(
    booking?.startTime ?? preset?.startTime ?? ""
  );
  const [courtId, setCourtId] = React.useState(booking?.courtId ?? preset?.courtId ?? "");
  const [total, setTotal] = React.useState(booking?.total ?? game?.basePrice ?? 0);
  const [advance, setAdvance] = React.useState(
    booking?.advance ?? game?.defaultAdvance ?? 0
  );
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(
    booking?.paymentMethod ?? "cash"
  );
  const [notes, setNotes] = React.useState(booking?.notes ?? "");

  // Switching game invalidates the court, slot time and pricing, so reset them
  // to that game's defaults instead of leaving stale values behind.
  const onGameChange = (nextId: string) => {
    const next = state.games.find((g) => g.id === nextId);
    setGameId(nextId);
    setCourtId("");
    setStartTime("");
    if (next) {
      setDurationMin(next.durations[0]);
      setTotal(next.basePrice);
      setAdvance(next.defaultAdvance);
    }
  };

  const slotTimes = game?.slotTimes.filter((t) => t.active) ?? [];

  const freeCourts = React.useMemo(() => {
    if (!game || !startTime || !date) return [];
    return availableCourts(
      game,
      state.bookings,
      date,
      startTime,
      durationMin,
      booking?.id
    );
  }, [game, state.bookings, date, startTime, durationMin, booking?.id]);

  const activeCourts = game?.courts.filter((c) => c.active) ?? [];
  const isFree = (id: string) => freeCourts.some((c) => c.id === id);

  // Drop a court that a duration or time change has just made unavailable.
  React.useEffect(() => {
    if (courtId && startTime && !isFree(courtId)) setCourtId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, durationMin, date, gameId]);

  const balance = balanceOf({ total, advance });
  const noCourtsLeft = Boolean(startTime) && freeCourts.length === 0;

  const canSubmit =
    customerName.trim() !== "" &&
    phone.trim() !== "" &&
    gameId !== "" &&
    date !== "" &&
    startTime !== "" &&
    courtId !== "" &&
    total >= 0 &&
    advance >= 0 &&
    advance <= total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !game) return;

    const payload: Booking = {
      id: booking?.id ?? newId("bk"),
      customerName: customerName.trim(),
      phone: phone.trim(),
      gameId,
      courtId,
      date,
      startTime,
      durationMin,
      total,
      advance,
      paymentMethod,
      status: booking?.status ?? "confirmed",
      notes: notes.trim() || undefined,
      createdAt: booking?.createdAt ?? new Date().toISOString(),
      cancelledAt: booking?.cancelledAt,
      resoldBy: booking?.resoldBy,
    };

    const clash = findConflict(state.bookings, {
      ...payload,
      ignoreBookingId: payload.id,
    });
    if (clash) {
      toast.error("That slot was just taken", {
        description: `${clash.customerName} holds this court at ${formatTime(clash.startTime)}.`,
      });
      return;
    }

    dispatch(
      booking
        ? { type: "UPDATE_BOOKING", booking: payload }
        : { type: "ADD_BOOKING", booking: payload }
    );
    toast.success(booking ? "Booking updated" : "Slot confirmed", {
      description: `${payload.customerName} · ${game.name} · ${formatTime(payload.startTime)}`,
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="bk-name">Customer name</FieldLabel>
            <Input
              id="bk-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Arjun Reddy"
              autoComplete="off"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bk-phone">Phone</FieldLabel>
            <Input
              id="bk-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              inputMode="tel"
              autoComplete="off"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="bk-game">Sport</FieldLabel>
            <Select
              items={activeGames.map((g) => ({ label: g.name, value: g.id }))}
              value={gameId}
              onValueChange={(v) => onGameChange(v as string)}
            >
              <SelectTrigger id="bk-game" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activeGames.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Date</FieldLabel>
            <DatePicker value={date} onChange={setDate} />
          </Field>
        </div>

        <Field>
          <FieldLabel>Duration</FieldLabel>
          <ToggleGroup
            value={[String(durationMin)]}
            onValueChange={(v) => v[0] && setDurationMin(Number(v[0]))}
            variant="outline"
          >
            {(game?.durations ?? []).map((d) => (
              <ToggleGroupItem key={d} value={String(d)}>
                {formatDuration(d)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="bk-start">Start time</FieldLabel>
            <Select
              items={slotTimes.map((t) => ({
                label: formatTime(t.start),
                value: t.start,
              }))}
              value={startTime}
              onValueChange={(v) => setStartTime(v as string)}
            >
              <SelectTrigger id="bk-start" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {slotTimes.map((t) => (
                    <SelectItem key={t.id} value={t.start}>
                      {formatTime(t.start)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Only slot times marked active for this game.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="bk-court">Court</FieldLabel>
            <Select
              items={activeCourts.map((c) => ({ label: c.name, value: c.id }))}
              value={courtId}
              onValueChange={(v) => setCourtId(v as string)}
              disabled={!startTime}
            >
              <SelectTrigger id="bk-court" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activeCourts.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      // The guard: a court already taken for this window can't
                      // be picked at all.
                      disabled={!isFree(c.id)}
                    >
                      {c.name}
                      {isFree(c.id) ? "" : " — already booked"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              {startTime
                ? `${freeCourts.length} of ${activeCourts.length} free at this time`
                : "Choose a start time first"}
            </FieldDescription>
          </Field>
        </div>

        {noCourtsLeft ? (
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>No courts free</AlertTitle>
            <AlertDescription>
              Every court is taken for {formatTime(startTime)} on{" "}
              {date ? format(new Date(date), "d MMM") : "this date"}. Pick
              another time or shorten the duration.
            </AlertDescription>
          </Alert>
        ) : null}

        <Separator />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="bk-total">Total amount</FieldLabel>
            <Input
              id="bk-total"
              type="number"
              min={0}
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
            />
            <FieldDescription>Prefilled from the game price.</FieldDescription>
          </Field>

          <Field data-invalid={advance > total ? true : undefined}>
            <FieldLabel htmlFor="bk-advance">Advance paid</FieldLabel>
            <Input
              id="bk-advance"
              type="number"
              min={0}
              value={advance}
              aria-invalid={advance > total || undefined}
              onChange={(e) => setAdvance(Number(e.target.value))}
            />
            <FieldDescription>
              {advance > total
                ? "Advance can't exceed the total."
                : "Locks the slot."}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="bk-balance">Balance due</FieldLabel>
            <Input
              id="bk-balance"
              readOnly
              value={formatMoney(balance)}
              className="font-medium"
            />
            <FieldDescription>Collected at the venue.</FieldDescription>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="bk-payment">Advance paid via</FieldLabel>
          <Select
            items={PAYMENT_METHODS}
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          >
            <SelectTrigger id="bk-payment" className="w-full sm:w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="bk-notes">Notes</FieldLabel>
          <Textarea
            id="bk-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional — birthday group, needs 3 karts, etc."
            rows={2}
          />
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {booking ? "Save changes" : `Confirm slot · ${formatMoney(advance)} advance`}
        </Button>
      </div>
    </form>
  );
}
