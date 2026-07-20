"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  BanknoteIcon,
  CalendarCheckIcon,
  PlusIcon,
  RecycleIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookingDialog } from "@/components/dashboard/booking-dialog";
import { BookingDetailsSheet } from "@/components/dashboard/booking-details";
import { BookingStatusBadge } from "@/components/dashboard/status-badge";
import { Money, formatMoney } from "@/components/dashboard/money";
import {
  OccupancyByHourChart,
  PaymentMixChart,
  RevenueTrendChart,
  TopGamesChart,
} from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useStore } from "@/lib/dashboard/store";
import { formatTime } from "@/lib/dashboard/availability";
import {
  bookingsOn,
  cancellationStats,
  occupancyByGame,
  occupancyByHour,
  paymentMethodMix,
  recentBookings,
  upcomingToday,
  revenueByGame,
  revenueSeries,
  totalsFor,
} from "@/lib/dashboard/analytics";
import { balanceOf, type Booking } from "@/lib/dashboard/types";

export default function OverviewPage() {
  const { state, today, hydrated } = useStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Booking | undefined>();

  const metrics = React.useMemo(() => {
    if (!hydrated || !today) return null;
    const now = parseISO(today);
    const todays = bookingsOn(state.bookings, today);
    return {
      todayTotals: totalsFor(todays),
      allTotals: totalsFor(state.bookings),
      revenue: revenueSeries(state.bookings, now, 14),
      occupancyHour: occupancyByHour(state.games, state.bookings, now, 7),
      occupancyGame: occupancyByGame(state.games, state.bookings, today),
      cancellations: cancellationStats(state.bookings),
      topGames: revenueByGame(state.games, state.bookings).slice(0, 5),
      payments: paymentMethodMix(state.bookings),
      recent: recentBookings(state.bookings, 6),
      // What's still to come today. On a busy day the full list runs to dozens
      // of rows, so the card shows the next few and links to the slot board.
      upcoming: upcomingToday(
        state.bookings,
        today,
        new Date().toTimeString().slice(0, 5)
      ),
      todayCount: todays.filter((b) => b.status !== "cancelled").length,
    };
  }, [state, today, hydrated]);

  if (!metrics) {
    return (
      <PageShell title="Overview" description="Loading your numbers…">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
      </PageShell>
    );
  }

  const {
    todayTotals,
    allTotals,
    revenue,
    occupancyHour,
    occupancyGame,
    cancellations,
    topGames,
    payments,
    recent,
    upcoming,
    todayCount,
  } = metrics;
  const UPCOMING_LIMIT = 8;
  const shownUpcoming = upcoming.slice(0, UPCOMING_LIMIT);

  return (
    <PageShell
      title="Overview"
      description={`Today is ${format(parseISO(today), "EEEE, d MMMM yyyy")}.`}
      action={
        <Button onClick={() => setDialogOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          New booking
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Bookings today"
          value={todayTotals.bookings}
          hint={`${formatMoney(todayTotals.revenue)} booked value`}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label="Advance collected"
          value={formatMoney(todayTotals.collected)}
          hint="Today, across all games"
          icon={WalletIcon}
        />
        <StatCard
          label="Balance outstanding"
          value={formatMoney(todayTotals.outstanding)}
          hint="To collect at the venue today"
          icon={BanknoteIcon}
        />
        <StatCard
          label="Resale rate"
          value={`${cancellations.resaleRate}%`}
          hint={`${cancellations.resold} of ${cancellations.cancelled} cancelled slots resold`}
          icon={RecycleIcon}
        />
      </div>

      {/* The number this whole system exists to move. */}
      {cancellations.lost > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lost to cancellations</CardTitle>
            <CardDescription>
              {cancellations.lost} cancelled slot
              {cancellations.lost === 1 ? "" : "s"} were never resold — about{" "}
              <Money amount={cancellations.revenueLost} /> of missed revenue.
              Cancelled slots reopen instantly on the slot board so they can be
              filled again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Revenue, last 14 days</CardTitle>
          <CardDescription>
            Advance collected versus balance still outstanding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueTrendChart data={revenue} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Slot utilisation by hour</CardTitle>
            <CardDescription>
              Share of slots booked over the last 7 days — your peaks and dead
              hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OccupancyByHourChart data={occupancyHour} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How advances are paid</CardTitle>
            <CardDescription>
              Share of collected advance by payment method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length ? (
              <PaymentMixChart data={payments} />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No payments yet</EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top games by revenue</CardTitle>
            <CardDescription>All time, cancellations excluded.</CardDescription>
          </CardHeader>
          <CardContent>
            {topGames.length ? (
              <TopGamesChart data={topGames} />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No bookings yet</EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s fill rate</CardTitle>
            <CardDescription>Booked slots per game, today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {occupancyGame.map((g) => (
              <div key={g.gameId} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium">{g.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {g.booked}/{g.capacity} · {g.rate}%
                  </span>
                </div>
                <Progress value={g.rate} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coming up today</CardTitle>
            <CardDescription>
              {upcoming.length} of {todayCount} booking
              {todayCount === 1 ? "" : "s"} still ahead.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {shownUpcoming.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Nothing left today</EmptyTitle>
                  <EmptyDescription>
                    Open the slot board to fill tomorrow.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              shownUpcoming.map((b, i) => (
                <React.Fragment key={b.id}>
                  {i > 0 ? <Separator /> : null}
                  <button
                    type="button"
                    onClick={() => setSelected(b)}
                    className="flex items-center justify-between gap-3 py-2.5 text-left"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {b.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {state.games.find((g) => g.id === b.gameId)?.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm tabular-nums">
                        {formatTime(b.startTime)}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {balanceOf(b) > 0
                          ? `${formatMoney(balanceOf(b))} due`
                          : "Paid"}
                      </span>
                    </div>
                  </button>
                </React.Fragment>
              ))
            )}
            {upcoming.length > UPCOMING_LIMIT ? (
              <>
                <Separator />
                <Link
                  href="/dashboard/slots"
                  className="py-2.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  +{upcoming.length - UPCOMING_LIMIT} more on the slot board
                </Link>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Lifetime: {allTotals.bookings} bookings ·{" "}
              <Money amount={allTotals.collected} /> collected.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {recent.map((b, i) => (
              <React.Fragment key={b.id}>
                {i > 0 ? <Separator /> : null}
                <button
                  type="button"
                  onClick={() => setSelected(b)}
                  className="flex items-center justify-between gap-3 py-2.5 text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{b.customerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(b.date), "d MMM")} ·{" "}
                      {formatTime(b.startTime)}
                    </span>
                  </div>
                  <BookingStatusBadge status={b.status} />
                </button>
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </div>

      <Button
        variant="outline"
        className="w-fit"
        // Rendering as an anchor, so opt out of the native-button assertion.
        nativeButton={false}
        render={<Link href="/dashboard/slots" />}
      >
        <TrendingUpIcon data-icon="inline-start" />
        Open the slot board
      </Button>

      <BookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BookingDetailsSheet
        booking={selected}
        onOpenChange={(open) => !open && setSelected(undefined)}
      />
    </PageShell>
  );
}
