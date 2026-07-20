/**
 * Domain model for the KR Funverse admin panel.
 *
 * Everything here must stay JSON-serialisable — the whole store is persisted to
 * localStorage. That's why `Game.icon` is a lucide icon *name* rather than a
 * component reference.
 */

export type BookingStatus = "confirmed" | "cancelled" | "completed";

export type PaymentMethod =
  | "phonepe"
  | "gpay"
  | "paytm"
  | "supermoney"
  | "amazonpay"
  | "cash";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "phonepe", label: "PhonePe" },
  { value: "gpay", label: "GPay" },
  { value: "paytm", label: "Paytm" },
  { value: "supermoney", label: "SuperMoney" },
  { value: "amazonpay", label: "Amazon Pay" },
  { value: "cash", label: "Cash / Offline" },
];

/** A bookable unit within a game — a kart track, a cricket pitch, a pool table. */
export interface Court {
  id: string;
  name: string;
  active: boolean;
}

/** A start time the venue offers for a game. Inactive times are not bookable. */
export interface SlotTime {
  id: string;
  start: string; // "HH:mm", 24h
  active: boolean;
}

/** Per-game extras: go-karting has "Laps", box cricket has "Overs". */
export interface GameAttribute {
  id: string;
  label: string;
  value: string;
}

export interface Game {
  id: string;
  name: string;
  /** lucide-react icon name, e.g. "FlagIcon". Resolved at render time. */
  icon: string;
  status: "active" | "coming-soon";
  /** Default charge for one booking, in ₹. Editable per booking. */
  basePrice: number;
  /** Advance that locks the slot, in ₹. */
  defaultAdvance: number;
  /** Durations offered, in minutes. */
  durations: number[];
  slotTimes: SlotTime[];
  courts: Court[];
  attributes: GameAttribute[];
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  gameId: string;
  courtId: string;
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm"
  durationMin: number;
  total: number;
  /** Amount actually collected. Balance is derived, never stored. */
  advance: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  /** Set when cancelled — powers the cancellation/resale metric. */
  cancelledAt?: string;
  /** Id of the booking that later refilled this slot, if any. */
  resoldBy?: string;
  notes?: string;
  createdAt: string;
}

/** Balance is always computed, so it can never drift out of sync with advance. */
export const balanceOf = (b: Pick<Booking, "total" | "advance">) =>
  Math.max(0, b.total - b.advance);

export interface DashboardState {
  games: Game[];
  bookings: Booking[];
}
