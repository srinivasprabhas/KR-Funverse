import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

/**
 * Slot / booking lifecycle states, each with its own hue so the board is
 * scannable at a glance. Rendered as a soft tint with coloured text rather than
 * a solid fill — every text/fill pair clears 4.5:1 in both themes.
 */
export type SlotState =
  | "open" // available to sell
  | "pending" // held, advance taken, balance still due
  | "confirmed" // secured and paid in full
  | "progress" // session running through this slot
  | "done" // finished
  | "missed"; // cancelled / no-show

const STATE: Record<SlotState, { label: string; className: string }> = {
  open: {
    label: "Available",
    className: "bg-state-open/12 text-state-open border-state-open/25",
  },
  pending: {
    label: "Pending",
    className:
      "bg-state-pending/12 text-state-pending border-state-pending/25",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-state-confirmed/12 text-state-confirmed border-state-confirmed/25",
  },
  progress: {
    label: "In progress",
    className:
      "bg-state-progress/12 text-state-progress border-state-progress/25",
  },
  done: {
    label: "Finished",
    className: "bg-state-done/12 text-state-done border-state-done/25",
  },
  missed: {
    label: "Cancelled",
    className: "bg-state-missed/12 text-state-missed border-state-missed/25",
  },
};

export function StateBadge({
  state,
  label,
  className,
}: {
  state: SlotState;
  /** Overrides the default wording, e.g. "No-show". */
  label?: string;
  className?: string;
}) {
  const s = STATE[state];
  return (
    <Badge variant="outline" className={cn(s.className, className)}>
      {label ?? s.label}
    </Badge>
  );
}

/** Booking status as stored (bookings table, details sheet). */
const BOOKING_STATE: Record<BookingStatus, SlotState> = {
  confirmed: "confirmed",
  completed: "done",
  cancelled: "missed",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <StateBadge state={BOOKING_STATE[status]} />;
}
