"use client";

import * as React from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { PencilIcon, PhoneIcon, XCircleIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Item, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import { BookingStatusBadge } from "@/components/dashboard/status-badge";
import { Money } from "@/components/dashboard/money";
import { BookingDialog } from "@/components/dashboard/booking-dialog";
import { useStore } from "@/lib/dashboard/store";
import { endTimeOf, formatDuration, formatTime } from "@/lib/dashboard/availability";
import { PAYMENT_METHODS, balanceOf, type Booking } from "@/lib/dashboard/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

export function BookingDetailsSheet({
  booking,
  onOpenChange,
}: {
  booking?: Booking;
  onOpenChange: (open: boolean) => void;
}) {
  const { dispatch, gameById, courtById } = useStore();
  const [editing, setEditing] = React.useState(false);

  if (!booking) return null;

  const game = gameById(booking.gameId);
  const court = courtById(booking.gameId, booking.courtId);
  const payment = PAYMENT_METHODS.find((m) => m.value === booking.paymentMethod);
  const balance = balanceOf(booking);

  const cancel = () => {
    dispatch({
      type: "CANCEL_BOOKING",
      bookingId: booking.id,
      at: new Date().toISOString(),
    });
    toast.success("Booking cancelled", {
      description: "The slot is now open again and can be resold.",
    });
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={Boolean(booking) && !editing} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center justify-between gap-2">
              <SheetTitle>{booking.customerName}</SheetTitle>
              <BookingStatusBadge status={booking.status} />
            </div>
            <SheetDescription>
              {game?.name} · {court?.name}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>
                  {format(parseISO(booking.date), "EEEE, d MMMM yyyy")}
                </ItemTitle>
                <ItemDescription>
                  {formatTime(booking.startTime)} –{" "}
                  {formatTime(endTimeOf(booking.startTime, booking.durationMin))}{" "}
                  · {formatDuration(booking.durationMin)}
                </ItemDescription>
              </ItemContent>
            </Item>

            <div className="flex flex-col divide-y">
              <Row
                label="Phone"
                value={
                  <a
                    href={`tel:${booking.phone}`}
                    className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                  >
                    <PhoneIcon className="size-3.5" />
                    {booking.phone}
                  </a>
                }
              />
              <Row label="Sport" value={game?.name ?? "—"} />
              <Row label="Court" value={court?.name ?? "—"} />
              {game?.attributes.map((a) => (
                <Row key={a.id} label={a.label} value={a.value} />
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex flex-col divide-y">
              <Row label="Total" value={<Money amount={booking.total} />} />
              <Row
                label={`Advance (${payment?.label ?? "—"})`}
                value={<Money amount={booking.advance} />}
              />
              <Row
                label="Balance due at venue"
                value={
                  <Money
                    amount={balance}
                    className={balance > 0 ? "text-destructive" : undefined}
                  />
                }
              />
            </div>

            {booking.notes ? (
              <>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </>
            ) : null}
          </div>

          {booking.status === "confirmed" ? (
            <SheetFooter className="flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditing(true)}
              >
                <PencilIcon data-icon="inline-start" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="destructive" className="flex-1" />}
                >
                  <XCircleIcon data-icon="inline-start" />
                  Cancel slot
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {booking.customerName}&apos;s slot on{" "}
                      {format(parseISO(booking.date), "d MMM")} at{" "}
                      {formatTime(booking.startTime)} will be released and become
                      available to resell immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep booking</AlertDialogCancel>
                    <AlertDialogAction onClick={cancel}>
                      Cancel slot
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SheetFooter>
          ) : null}
        </SheetContent>
      </Sheet>

      <BookingDialog
        open={editing}
        onOpenChange={(open) => {
          setEditing(open);
          if (!open) onOpenChange(false);
        }}
        booking={booking}
      />
    </>
  );
}
