import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/dashboard/types";

const BOOKING_VARIANTS: Record<
  BookingStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  confirmed: { label: "Confirmed", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, variant } = BOOKING_VARIANTS[status];
  return <Badge variant={variant}>{label}</Badge>;
}

/** Slot board states. "Open" reads better than "not booked" on a dense grid. */
export function SlotStatusBadge({
  booked,
  continuation,
}: {
  booked: boolean;
  continuation?: boolean;
}) {
  if (!booked) return <Badge variant="outline">Open</Badge>;
  // Distinguish the slot a booking starts in from the ones it runs through.
  if (continuation) return <Badge variant="secondary">In progress</Badge>;
  return <Badge variant="default">Booked</Badge>;
}
