/**
 * Pure selectors over the booking list. No React, no side effects — every
 * function takes the data it needs so the pages can memoise freely.
 */

import { balanceOf, type Booking, type Game, type PaymentMethod } from "./types";
import { PAYMENT_METHODS } from "./types";
import { isoDate, shiftDays, toMinutes } from "./availability";

/** Bookings that represent real, still-standing business. */
export const liveBookings = (bookings: Booking[]) =>
  bookings.filter((b) => b.status !== "cancelled");

export interface Totals {
  bookings: number;
  revenue: number;
  collected: number;
  outstanding: number;
}

export function totalsFor(bookings: Booking[]): Totals {
  const live = liveBookings(bookings);
  return {
    bookings: live.length,
    revenue: live.reduce((s, b) => s + b.total, 0),
    collected: live.reduce((s, b) => s + b.advance, 0),
    outstanding: live.reduce((s, b) => s + balanceOf(b), 0),
  };
}

export const bookingsOn = (bookings: Booking[], date: string) =>
  bookings.filter((b) => b.date === date);

/** Daily collected-vs-outstanding series for the revenue chart. */
export function revenueSeries(bookings: Booking[], today: Date, days = 14) {
  const out: { date: string; label: string; collected: number; outstanding: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = shiftDays(today, -i);
    const key = isoDate(d);
    const dayBookings = liveBookings(bookingsOn(bookings, key));
    out.push({
      date: key,
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      collected: dayBookings.reduce((s, b) => s + b.advance, 0),
      outstanding: dayBookings.reduce((s, b) => s + balanceOf(b), 0),
    });
  }
  return out;
}

/**
 * Slot utilisation per hour across a date range — surfaces dead hours and peaks.
 * Capacity = active courts × slots falling in that hour.
 */
export function occupancyByHour(
  games: Game[],
  bookings: Booking[],
  today: Date,
  days = 7
) {
  const dates = new Set<string>();
  for (let i = 0; i < days; i++) dates.add(isoDate(shiftDays(today, -i)));

  const capacity = new Map<number, number>();
  const booked = new Map<number, number>();

  for (const game of games) {
    if (game.status !== "active") continue;
    const courts = game.courts.filter((c) => c.active).length;
    for (const t of game.slotTimes) {
      if (!t.active) continue;
      const hour = Math.floor(toMinutes(t.start) / 60);
      capacity.set(hour, (capacity.get(hour) ?? 0) + courts * dates.size);
    }
  }

  for (const b of liveBookings(bookings)) {
    if (!dates.has(b.date)) continue;
    const hour = Math.floor(toMinutes(b.startTime) / 60);
    booked.set(hour, (booked.get(hour) ?? 0) + 1);
  }

  return [...capacity.keys()]
    .sort((a, b) => a - b)
    .map((hour) => {
      const cap = capacity.get(hour) ?? 0;
      const used = booked.get(hour) ?? 0;
      return {
        hour,
        label: `${hour % 12 === 0 ? 12 : hour % 12}${hour >= 12 ? "pm" : "am"}`,
        booked: used,
        capacity: cap,
        rate: cap ? Math.round((used / cap) * 100) : 0,
      };
    });
}

/** Per-game utilisation for a single day — powers the Progress bars. */
export function occupancyByGame(games: Game[], bookings: Booking[], date: string) {
  const dayBookings = liveBookings(bookingsOn(bookings, date));
  return games
    .filter((g) => g.status === "active")
    .map((g) => {
      const capacity =
        g.courts.filter((c) => c.active).length *
        g.slotTimes.filter((t) => t.active).length;
      const booked = dayBookings.filter((b) => b.gameId === g.id).length;
      return {
        gameId: g.id,
        name: g.name,
        booked,
        capacity,
        rate: capacity ? Math.round((booked / capacity) * 100) : 0,
      };
    })
    .sort((a, b) => b.rate - a.rate);
}

export interface CancellationStats {
  cancelled: number;
  resold: number;
  lost: number;
  resaleRate: number;
  revenueLost: number;
}

/**
 * The headline metric: of the slots that got cancelled, how many were sold
 * again? Every un-resold cancellation is the exact loss this panel exists to
 * prevent.
 */
export function cancellationStats(bookings: Booking[]): CancellationStats {
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const resold = cancelled.filter((b) => b.resoldBy).length;
  const lost = cancelled.length - resold;
  return {
    cancelled: cancelled.length,
    resold,
    lost,
    resaleRate: cancelled.length
      ? Math.round((resold / cancelled.length) * 100)
      : 0,
    revenueLost: cancelled
      .filter((b) => !b.resoldBy)
      .reduce((s, b) => s + b.total, 0),
  };
}

export function revenueByGame(games: Game[], bookings: Booking[]) {
  const live = liveBookings(bookings);
  return games
    .map((g) => {
      const mine = live.filter((b) => b.gameId === g.id);
      return {
        gameId: g.id,
        name: g.name,
        bookings: mine.length,
        revenue: mine.reduce((s, b) => s + b.total, 0),
      };
    })
    .filter((g) => g.bookings > 0)
    .sort((a, b) => b.revenue - a.revenue);
}

export function paymentMethodMix(bookings: Booking[]) {
  const live = liveBookings(bookings);
  const totalCollected = live.reduce((s, b) => s + b.advance, 0);
  return PAYMENT_METHODS.map(({ value, label }) => {
    const mine = live.filter((b) => b.paymentMethod === value);
    const amount = mine.reduce((s, b) => s + b.advance, 0);
    return {
      method: value as PaymentMethod,
      label,
      bookings: mine.length,
      amount,
      share: totalCollected ? Math.round((amount / totalCollected) * 100) : 0,
    };
  })
    .filter((m) => m.bookings > 0)
    .sort((a, b) => b.amount - a.amount);
}

/** Upcoming bookings today, soonest first. */
export function upcomingToday(bookings: Booking[], date: string, nowHHMM: string) {
  return liveBookings(bookingsOn(bookings, date))
    .filter((b) => toMinutes(b.startTime) >= toMinutes(nowHHMM))
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

export function recentBookings(bookings: Booking[], limit = 6) {
  return [...bookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
