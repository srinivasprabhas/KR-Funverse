/**
 * The double-booking guard.
 *
 * This module is the single source of truth for "can this slot be sold?".
 * Every surface (slot board, booking form, reducer) calls into it, which is what
 * makes a slot booked in one place immediately unbookable everywhere else.
 */

import type { Booking, Court, Game, SlotTime } from "./types";

/**
 * Local-time date helpers. Everything in this app — the store's `today`, seed
 * dates, the date picker, and the analytics selectors — must use the SAME
 * convention, or a booking made "today" lands under a different key than the
 * chart looks for. We use LOCAL dates (not UTC) so the calendar day always
 * matches what the venue staff see on the wall clock.
 */
export const isoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const shiftDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

/** Today's local calendar date as "yyyy-MM-dd". */
export const todayISO = () => isoDate(new Date());

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toHHMM = (mins: number) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** "18:00" + 90 → "19:30" */
export const endTimeOf = (start: string, durationMin: number) =>
  toHHMM(toMinutes(start) + durationMin);

/** 90 → "1h 30m" */
export function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** 14:30 → "2:30 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Half-open interval overlap: [aStart, aEnd) vs [bStart, bEnd).
 * Touching ends do NOT overlap — an 18:00–19:00 booking leaves 19:00 free.
 */
export function overlaps(
  aStart: number,
  aDur: number,
  bStart: number,
  bDur: number
) {
  return aStart < bStart + bDur && bStart < aStart + aDur;
}

export interface SlotQuery {
  courtId: string;
  date: string;
  startTime: string;
  durationMin: number;
  /** Excluded from the check so editing a booking doesn't collide with itself. */
  ignoreBookingId?: string;
}

/** Returns the booking occupying this window, or undefined if it's free. */
export function findConflict(
  bookings: Booking[],
  q: SlotQuery
): Booking | undefined {
  const start = toMinutes(q.startTime);
  return bookings.find(
    (b) =>
      b.id !== q.ignoreBookingId &&
      // A cancelled booking releases its slot — this is the resale fix.
      b.status !== "cancelled" &&
      b.courtId === q.courtId &&
      b.date === q.date &&
      overlaps(start, q.durationMin, toMinutes(b.startTime), b.durationMin)
  );
}

export const isCourtFree = (bookings: Booking[], q: SlotQuery) =>
  findConflict(bookings, q) === undefined;

/**
 * Courts that can actually take this booking. Powers the booking form's court
 * dropdown, so an unavailable court is never selectable in the first place.
 */
export function availableCourts(
  game: Game,
  bookings: Booking[],
  date: string,
  startTime: string,
  durationMin: number,
  ignoreBookingId?: string
): Court[] {
  return game.courts.filter(
    (c) =>
      c.active &&
      isCourtFree(bookings, {
        courtId: c.id,
        date,
        startTime,
        durationMin,
        ignoreBookingId,
      })
  );
}

export interface SlotCell {
  court: Court;
  time: SlotTime;
  booking?: Booking;
}

/**
 * The length one slot cell represents on the board — the spacing between
 * consecutive start times, so a game with 30-minute slots shows 30-minute
 * windows regardless of the shorter durations it also offers. Falls back to the
 * game's default duration when there aren't two slot times to measure.
 */
export function slotStepOf(game: Game): number {
  const starts = game.slotTimes
    .filter((t) => t.active)
    .map((t) => toMinutes(t.start))
    .sort((a, b) => a - b);
  let step = Infinity;
  for (let i = 1; i < starts.length; i++) {
    const gap = starts[i] - starts[i - 1];
    if (gap > 0) step = Math.min(step, gap);
  }
  return Number.isFinite(step) ? step : game.durations[0] ?? 30;
}

/**
 * One cell per (active court × active slot time) for a given day.
 * `booking` is set when that cell is occupied.
 *
 * Occupancy is measured over the slot's own window (see `slotStepOf`), so a
 * 90-minute booking starting at 18:00 correctly shows 18:30 as occupied too.
 */
export function slotGrid(
  game: Game,
  bookings: Booking[],
  date: string
): SlotCell[] {
  const step = slotStepOf(game);
  const cells: SlotCell[] = [];

  for (const court of game.courts) {
    if (!court.active) continue;
    for (const time of game.slotTimes) {
      if (!time.active) continue;
      cells.push({
        court,
        time,
        booking: findConflict(bookings, {
          courtId: court.id,
          date,
          startTime: time.start,
          durationMin: step,
        }),
      });
    }
  }
  return cells;
}

/** Start times still open on at least one court — used to pre-filter the form. */
export function availableStartTimes(
  game: Game,
  bookings: Booking[],
  date: string,
  durationMin: number,
  ignoreBookingId?: string
): SlotTime[] {
  return game.slotTimes.filter(
    (t) =>
      t.active &&
      availableCourts(game, bookings, date, t.start, durationMin, ignoreBookingId)
        .length > 0
  );
}
