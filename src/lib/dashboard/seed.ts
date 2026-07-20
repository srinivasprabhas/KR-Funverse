/**
 * Demo seed data.
 *
 * MUST stay fully deterministic — no Date.now(), no Math.random(). The store
 * initialises from this on the server and on the first client render, so any
 * non-determinism here becomes a hydration mismatch.
 *
 * Dates are expressed as offsets from a fixed anchor and resolved to real dates
 * only after hydration (see store.tsx), which keeps SSR output stable.
 *
 * Venue values (hours, go-karting price) mirror the marketing site but are
 * copied deliberately rather than imported — this app must stay liftable to
 * admin.<domain> without dragging marketing code along.
 */

import type { Booking, DashboardState, Game } from "./types";
import { findConflict, isoDate, shiftDays } from "./availability";

/** 11:00 – 22:00, on the half hour. */
function slotTimes(startHour: number, endHour: number, stepMin: number) {
  const out = [];
  for (let m = startHour * 60; m < endHour * 60; m += stepMin) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const start = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    out.push({ id: `t-${start}`, start, active: true });
  }
  return out;
}

export const SEED_GAMES: Game[] = [
  {
    id: "go-karting",
    name: "Go-Karting",
    icon: "FlagIcon",
    status: "active",
    basePrice: 500,
    defaultAdvance: 200,
    durations: [15, 30, 45],
    slotTimes: slotTimes(11, 22, 30),
    courts: [
      { id: "kart-1", name: "Track 1", active: true },
      { id: "kart-2", name: "Track 2", active: true },
    ],
    attributes: [
      { id: "a-laps", label: "Laps", value: "12" },
      { id: "a-karts", label: "Karts available", value: "8" },
    ],
  },
  {
    id: "box-cricket",
    name: "Box Cricket",
    icon: "TargetIcon",
    status: "active",
    basePrice: 1200,
    defaultAdvance: 400,
    durations: [60, 90, 120],
    slotTimes: slotTimes(11, 22, 60),
    courts: [
      { id: "pitch-a", name: "Pitch A", active: true },
      { id: "pitch-b", name: "Pitch B", active: true },
    ],
    attributes: [
      { id: "a-overs", label: "Overs", value: "6" },
      { id: "a-players", label: "Max players", value: "12" },
    ],
  },
  {
    id: "foosball",
    name: "Foosball",
    icon: "GamepadIcon",
    status: "active",
    basePrice: 200,
    defaultAdvance: 100,
    durations: [30, 60],
    slotTimes: slotTimes(11, 22, 30),
    courts: [
      { id: "foos-1", name: "Table 1", active: true },
      { id: "foos-2", name: "Table 2", active: true },
    ],
    attributes: [{ id: "a-teams", label: "Players", value: "2v2" }],
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    icon: "CircleDotIcon",
    status: "active",
    basePrice: 250,
    defaultAdvance: 100,
    durations: [30, 60],
    slotTimes: slotTimes(11, 22, 30),
    courts: [
      { id: "tt-1", name: "Table 1", active: true },
      { id: "tt-2", name: "Table 2", active: true },
    ],
    attributes: [{ id: "a-bats", label: "Bats included", value: "Yes" }],
  },
  {
    id: "8-ball-pool",
    name: "8-Ball Pool",
    icon: "Circle8Icon",
    status: "active",
    basePrice: 300,
    defaultAdvance: 100,
    durations: [30, 60],
    slotTimes: slotTimes(11, 22, 30),
    courts: [
      { id: "pool-1", name: "Table 1", active: true },
      { id: "pool-2", name: "Table 2", active: true },
    ],
    attributes: [{ id: "a-cues", label: "Cues", value: "4" }],
  },
  {
    id: "bowling",
    name: "Bowling",
    icon: "BowlingIcon",
    status: "coming-soon",
    basePrice: 400,
    defaultAdvance: 150,
    durations: [30, 60],
    slotTimes: slotTimes(12, 22, 60),
    courts: [{ id: "lane-1", name: "Lane 1", active: true }],
    attributes: [],
  },
  {
    id: "arcade-zone",
    name: "Arcade Zone",
    icon: "JoystickIcon",
    status: "coming-soon",
    basePrice: 350,
    defaultAdvance: 150,
    durations: [30, 60],
    slotTimes: slotTimes(11, 22, 60),
    courts: [{ id: "arcade-1", name: "Zone 1", active: true }],
    attributes: [],
  },
];

/**
 * Booking templates, positioned by day offset relative to "today".
 * Resolved into real dates by `buildSeedBookings` after hydration.
 */
interface SeedBooking {
  dayOffset: number;
  gameId: string;
  courtId: string;
  startTime: string;
  durationMin: number;
  customerName: string;
  phone: string;
  advanceRatio: number;
  payment: Booking["paymentMethod"];
  status?: Booking["status"];
  /** Marks this as the booking that resold a cancelled slot. */
  resoldFrom?: number;
}

const SEED_BOOKINGS: SeedBooking[] = [
  // ---- Today: a busy evening, so the slot board looks alive on first load ----
  { dayOffset: 0, gameId: "go-karting", courtId: "kart-1", startTime: "17:00", durationMin: 30, customerName: "Arjun Reddy", phone: "9848012345", advanceRatio: 0.4, payment: "phonepe" },
  { dayOffset: 0, gameId: "go-karting", courtId: "kart-2", startTime: "17:30", durationMin: 30, customerName: "Sneha Rao", phone: "9701122334", advanceRatio: 1, payment: "gpay" },
  { dayOffset: 0, gameId: "go-karting", courtId: "kart-1", startTime: "18:30", durationMin: 45, customerName: "Vikram S", phone: "9885566778", advanceRatio: 0.4, payment: "cash" },
  { dayOffset: 0, gameId: "box-cricket", courtId: "pitch-a", startTime: "19:00", durationMin: 90, customerName: "Yamnampet XI", phone: "9440099887", advanceRatio: 0.33, payment: "paytm" },
  { dayOffset: 0, gameId: "box-cricket", courtId: "pitch-b", startTime: "20:00", durationMin: 60, customerName: "Rahul Verma", phone: "9966554433", advanceRatio: 0.33, payment: "phonepe" },
  { dayOffset: 0, gameId: "8-ball-pool", courtId: "pool-1", startTime: "19:30", durationMin: 60, customerName: "Kiran Kumar", phone: "9393939393", advanceRatio: 0.33, payment: "gpay" },
  { dayOffset: 0, gameId: "table-tennis", courtId: "tt-1", startTime: "18:00", durationMin: 30, customerName: "Divya M", phone: "9000011122", advanceRatio: 0.4, payment: "supermoney" },
  // A cancelled slot that was successfully resold — the happy path we're building for.
  { dayOffset: 0, gameId: "go-karting", courtId: "kart-2", startTime: "20:00", durationMin: 30, customerName: "Imran Q", phone: "9700088776", advanceRatio: 0.4, payment: "gpay", status: "cancelled" },
  { dayOffset: 0, gameId: "go-karting", courtId: "kart-2", startTime: "20:00", durationMin: 30, customerName: "Nikhil T", phone: "9704455667", advanceRatio: 0.4, payment: "phonepe", resoldFrom: 7 },

  // ---- Tomorrow ----
  { dayOffset: 1, gameId: "box-cricket", courtId: "pitch-a", startTime: "18:00", durationMin: 120, customerName: "Ghatkesar Strikers", phone: "9848111222", advanceRatio: 0.25, payment: "phonepe" },
  { dayOffset: 1, gameId: "go-karting", courtId: "kart-1", startTime: "16:00", durationMin: 30, customerName: "Priya N", phone: "9666554433", advanceRatio: 0.4, payment: "amazonpay" },
  { dayOffset: 1, gameId: "foosball", courtId: "foos-1", startTime: "19:00", durationMin: 60, customerName: "Sai Teja", phone: "9912345678", advanceRatio: 0.5, payment: "cash" },

  // ---- Past three weeks: gives the analytics charts real shape ----
  ...([
    [-1, "go-karting", "kart-1", "18:00", 30, "Manoj K", "9848223344", "phonepe"],
    [-1, "box-cricket", "pitch-a", "19:00", 90, "Rampally Royals", "9848334455", "cash"],
    [-2, "go-karting", "kart-2", "17:00", 45, "Harsha V", "9848445566", "gpay"],
    [-2, "8-ball-pool", "pool-2", "20:00", 60, "Sandeep R", "9848556677", "paytm"],
    [-3, "table-tennis", "tt-2", "18:30", 30, "Anita J", "9848667788", "phonepe"],
    [-3, "go-karting", "kart-1", "19:00", 30, "Farhan A", "9848778899", "cash"],
    [-4, "box-cricket", "pitch-b", "20:00", 60, "Sunrisers Gully", "9848889900", "gpay"],
    [-5, "go-karting", "kart-2", "16:30", 30, "Lakshmi P", "9848990011", "supermoney"],
    [-5, "foosball", "foos-2", "17:00", 30, "Rohit D", "9849001122", "phonepe"],
    [-6, "go-karting", "kart-1", "20:30", 45, "Zara K", "9849112233", "amazonpay"],
    [-7, "box-cricket", "pitch-a", "18:00", 120, "Corporate Cup", "9849223344", "paytm"],
    [-8, "8-ball-pool", "pool-1", "19:00", 60, "Naveen B", "9849334455", "cash"],
    [-9, "go-karting", "kart-2", "18:00", 30, "Tanya S", "9849445566", "phonepe"],
    [-10, "table-tennis", "tt-1", "17:30", 60, "Deepak M", "9849556677", "gpay"],
    [-11, "go-karting", "kart-1", "19:30", 30, "Ishaan G", "9849667788", "phonepe"],
    [-12, "box-cricket", "pitch-b", "19:00", 90, "Weekend Warriors", "9849778899", "cash"],
    [-13, "foosball", "foos-1", "20:00", 30, "Meera L", "9849889900", "paytm"],
    [-14, "go-karting", "kart-2", "17:30", 45, "Aditya R", "9849990011", "gpay"],
    [-16, "8-ball-pool", "pool-2", "18:30", 60, "Sameer H", "9850001122", "phonepe"],
    [-18, "go-karting", "kart-1", "16:00", 30, "Pooja V", "9850112233", "cash"],
    [-20, "box-cricket", "pitch-a", "20:00", 60, "Night Owls", "9850223344", "supermoney"],
  ] as const).map(([dayOffset, gameId, courtId, startTime, durationMin, customerName, phone, payment]) => ({
    dayOffset: dayOffset as number,
    gameId: gameId as string,
    courtId: courtId as string,
    startTime: startTime as string,
    durationMin: durationMin as number,
    customerName: customerName as string,
    phone: phone as string,
    advanceRatio: 1,
    payment: payment as Booking["paymentMethod"],
    status: "completed" as Booking["status"],
  })),

  // A couple of cancellations that were never resold — the loss the panel exists to reduce.
  { dayOffset: -4, gameId: "go-karting", courtId: "kart-1", startTime: "21:00", durationMin: 30, customerName: "Cancelled — Ravi", phone: "9850334455", advanceRatio: 0.4, payment: "phonepe", status: "cancelled" },
  { dayOffset: -9, gameId: "box-cricket", courtId: "pitch-b", startTime: "21:00", durationMin: 60, customerName: "Cancelled — Team Blaze", phone: "9850445566", advanceRatio: 0.33, payment: "gpay", status: "cancelled" },
];

/**
 * Deterministic PRNG (mulberry32). Math.random() would break SSR/client
 * agreement, so filler demand is generated from a fixed seed instead.
 */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FILLER_NAMES = [
  "Rakesh P", "Swathi K", "Imran S", "Nikhil R", "Ayesha B", "Varun T",
  "Kavya S", "Dinesh M", "Rohan A", "Neha G", "Sameer P", "Tarun V",
  "Ishita R", "Girish N", "Bhavya L", "Akash D", "Ritu S", "Vamsi K",
];
const FILLER_PAYMENTS: Booking["paymentMethod"][] = [
  "phonepe", "gpay", "cash", "paytm", "phonepe", "gpay", "cash", "amazonpay",
];

/**
 * The venue runs 11:00–22:00 across many courts, so a handful of hand-written
 * bookings leaves utilisation near zero and the charts look broken. This fills
 * the recent past with evening-weighted demand — busy 5–9pm, quiet midday —
 * which is what the occupancy chart is meant to reveal.
 */
function fillerBookings(games: Game[], today: Date): Booking[] {
  const rand = rng(20260721);
  const out: Booking[] = [];
  const active = games.filter((g) => g.status === "active");

  for (let dayOffset = -13; dayOffset <= 2; dayOffset++) {
    const date = isoDate(shiftDays(today, dayOffset));
    const isWeekend = [0, 6].includes(shiftDays(today, dayOffset).getDay());

    for (const game of active) {
      for (const court of game.courts.filter((c) => c.active)) {
        for (const slot of game.slotTimes.filter((t) => t.active)) {
          const hour = Number(slot.start.slice(0, 2));
          // Demand curve: dead late morning, building afternoon, peak evening.
          let chance = hour < 14 ? 0.06 : hour < 17 ? 0.22 : hour < 21 ? 0.55 : 0.3;
          if (isWeekend) chance += 0.15;
          if (dayOffset > 0) chance *= 0.45; // future days fill up gradually
          if (rand() > chance) continue;

          const i = out.length;
          const duration = game.durations[Math.floor(rand() * game.durations.length)];
          const paid = dayOffset < 0; // past bookings were settled at the venue
          out.push({
            id: `fill-${i}`,
            customerName: FILLER_NAMES[i % FILLER_NAMES.length],
            phone: `9${String(800000000 + ((i * 7919) % 99999999)).slice(0, 9)}`,
            gameId: game.id,
            courtId: court.id,
            date,
            startTime: slot.start,
            durationMin: duration,
            total: game.basePrice,
            advance: paid ? game.basePrice : game.defaultAdvance,
            paymentMethod: FILLER_PAYMENTS[i % FILLER_PAYMENTS.length],
            status: dayOffset < 0 ? "completed" : "confirmed",
            createdAt: shiftDays(today, dayOffset - 1).toISOString(),
          });
        }
      }
    }
  }
  return out;
}

/**
 * Resolves the seed templates into real bookings relative to `today`.
 * Called only on the client after mount, so it never affects SSR output.
 */
export function buildSeedBookings(today: Date): Booking[] {
  const gamesById = new Map(SEED_GAMES.map((g) => [g.id, g]));
  const built: Booking[] = [];

  SEED_BOOKINGS.forEach((s, i) => {
    const game = gamesById.get(s.gameId);
    if (!game) return;
    const date = isoDate(shiftDays(today, s.dayOffset));
    const total = game.basePrice;
    const booking: Booking = {
      id: `seed-${i}`,
      customerName: s.customerName,
      phone: s.phone,
      gameId: s.gameId,
      courtId: s.courtId,
      date,
      startTime: s.startTime,
      durationMin: s.durationMin,
      total,
      advance: Math.round(total * s.advanceRatio),
      paymentMethod: s.payment,
      status: s.status ?? "confirmed",
      createdAt: shiftDays(today, s.dayOffset - 1).toISOString(),
    };
    if (booking.status === "cancelled") {
      booking.cancelledAt = shiftDays(today, s.dayOffset).toISOString();
    }
    built.push(booking);
  });

  // Link resold pairs so the resale-rate metric can be computed.
  SEED_BOOKINGS.forEach((s, i) => {
    if (s.resoldFrom === undefined) return;
    const original = built[s.resoldFrom];
    if (original) original.resoldBy = built[i].id;
  });

  // Background demand. Hand-written bookings take precedence, and each filler
  // is checked against everything already placed — the seed must satisfy the
  // same no-double-booking rule the UI enforces.
  for (const candidate of fillerBookings(SEED_GAMES, today)) {
    if (!findConflict(built, candidate)) built.push(candidate);
  }

  return built;
}

/** Server-safe initial state: games only, no date-dependent bookings. */
export const INITIAL_STATE: DashboardState = {
  games: SEED_GAMES,
  bookings: [],
};
