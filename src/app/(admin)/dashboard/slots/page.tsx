"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { CalendarX2Icon, PlusIcon } from "lucide-react";

import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { SlotCard } from "@/components/dashboard/slot-card";
import { BookingDialog } from "@/components/dashboard/booking-dialog";
import { BookingDetailsSheet } from "@/components/dashboard/booking-details";
import {
  DatePicker,
  FilterBar,
  GameSelect,
} from "@/components/dashboard/filter-bar";
import { formatMoney } from "@/components/dashboard/money";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/dashboard/store";
import { slotGrid, slotStepOf } from "@/lib/dashboard/availability";
import { balanceOf, type Booking } from "@/lib/dashboard/types";
import type { BookingFormPreset } from "@/components/dashboard/booking-form";

export default function SlotsPage() {
  const { state, today, hydrated } = useStore();
  const activeGames = React.useMemo(
    () => state.games.filter((g) => g.status === "active"),
    [state.games]
  );

  const [gameId, setGameId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [preset, setPreset] = React.useState<BookingFormPreset | undefined>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Booking | undefined>();

  // Default the date to today, once it's known after hydration.
  React.useEffect(() => {
    if (today) setDate((d) => d || today);
  }, [today]);

  // Default the game to the first active one. Depends only on the game list, so
  // it doesn't re-fire on every render the way a derived array would.
  React.useEffect(() => {
    const first = activeGames[0];
    if (first) setGameId((g) => g || first.id);
  }, [activeGames]);

  const game = state.games.find((g) => g.id === gameId);
  const slotStep = game ? slotStepOf(game) : 30;

  const cells = React.useMemo(
    () => (game && date ? slotGrid(game, state.bookings, date) : []),
    [game, state.bookings, date]
  );

  const courts = game?.courts.filter((c) => c.active) ?? [];
  const bookedCount = cells.filter((c) => c.booking).length;
  const dayBookings = cells.filter((c) => c.booking).map((c) => c.booking!);
  const uniqueBookings = [...new Map(dayBookings.map((b) => [b.id, b])).values()];

  const openNew = (p?: BookingFormPreset) => {
    setPreset(p);
    setDialogOpen(true);
  };

  if (!hydrated) {
    return (
      <PageShell title="Slots" description="Loading slot board…">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Slots"
      description="Pick a date and a game to see every slot and who holds it."
      action={
        <Button onClick={() => openNew({ gameId, date })}>
          <PlusIcon data-icon="inline-start" />
          New booking
        </Button>
      }
    >
      <FilterBar>
        <DatePicker value={date} onChange={setDate} />
        <GameSelect
          games={activeGames}
          value={gameId}
          onChange={setGameId}
          className="min-w-40"
        />
      </FilterBar>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Slots booked"
          value={`${bookedCount} / ${cells.length}`}
          hint={
            cells.length
              ? `${Math.round((bookedCount / cells.length) * 100)}% of the day filled`
              : "No active slots"
          }
        />
        <StatCard label="Bookings" value={uniqueBookings.length} hint="On this date" />
        <StatCard
          label="Advance collected"
          value={formatMoney(uniqueBookings.reduce((s, b) => s + b.advance, 0))}
          hint="Already received"
        />
        <StatCard
          label="Balance due"
          value={formatMoney(uniqueBookings.reduce((s, b) => s + balanceOf(b), 0))}
          hint="To collect at venue"
        />
      </div>

      {!game || courts.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarX2Icon />
            </EmptyMedia>
            <EmptyTitle>No courts set up</EmptyTitle>
            <EmptyDescription>
              Add a court to this game before you can take bookings.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Tabs defaultValue={courts[0]?.id} key={game.id}>
          <TabsList>
            {courts.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {courts.map((court) => {
            const courtCells = cells.filter((c) => c.court.id === court.id);
            return (
              <TabsContent key={court.id} value={court.id}>
                {courtCells.length === 0 ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No active slot times</EmptyTitle>
                      <EmptyDescription>
                        Activate slot times for {game.name} on the Games page.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courtCells.map((cell) => (
                      <SlotCard
                        key={`${cell.court.id}-${cell.time.id}`}
                        startTime={cell.time.start}
                        durationMin={slotStep}
                        courtName={cell.court.name}
                        booking={cell.booking}
                        onOpenBooking={setSelected}
                        onBook={() =>
                          openNew({
                            gameId: game.id,
                            courtId: cell.court.id,
                            date,
                            startTime: cell.time.start,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {date ? (
        <p className="text-xs text-muted-foreground">
          Showing {format(parseISO(date), "EEEE, d MMMM yyyy")}
        </p>
      ) : null}

      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        preset={preset}
      />
      <BookingDetailsSheet
        booking={selected}
        onOpenChange={(open) => !open && setSelected(undefined)}
      />
    </PageShell>
  );
}
