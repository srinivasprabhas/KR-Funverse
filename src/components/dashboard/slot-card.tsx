"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Money } from "@/components/dashboard/money";
import { SlotStatusBadge } from "@/components/dashboard/status-badge";
import { endTimeOf, formatTime } from "@/lib/dashboard/availability";
import { balanceOf, type Booking } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

/**
 * One cell of the slot board. Booked cards open the booking; open cards start a
 * pre-filled new booking, which is the fast path for a walk-in.
 */
export function SlotCard({
  startTime,
  durationMin,
  courtName,
  booking,
  onOpenBooking,
  onBook,
}: {
  startTime: string;
  durationMin: number;
  courtName: string;
  booking?: Booking;
  onOpenBooking: (booking: Booking) => void;
  onBook: () => void;
}) {
  const booked = Boolean(booking);
  const balance = booking ? balanceOf(booking) : 0;
  // A booking longer than one slot occupies the following slots too. Those
  // cards show it as a continuation rather than repeating the customer, so it
  // doesn't read as a duplicate booking.
  const isContinuation = Boolean(booking && booking.startTime !== startTime);

  // A thin left border carries the state: amber still owes money, green is
  // settled, neutral is sellable. Border only — no fills, no glows.
  const stateBorder = !booked
    ? "border-l-status-open/40"
    : balance > 0
      ? "border-l-status-due"
      : "border-l-status-paid";

  return (
    <Card
      className={cn(
        "gap-0 border-l-2 py-0 transition-colors",
        stateBorder,
        // Continuation cells read as secondary to the slot that owns them.
        isContinuation && "border-l-status-open/50",
        booked ? "bg-muted/40" : "border-dashed hover:border-solid hover:bg-accent/40"
      )}
    >
      <CardContent className="flex flex-col gap-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tabular-nums">
              {formatTime(startTime)}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              to {formatTime(endTimeOf(startTime, durationMin))}
            </span>
          </div>
          <SlotStatusBadge booked={booked} continuation={isContinuation} />
        </div>

        <div className="text-xs text-muted-foreground">{courtName}</div>

        {booking ? (
          <button
            type="button"
            onClick={() => onOpenBooking(booking)}
            className="flex flex-col gap-1 rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {isContinuation ? (
              <span className="text-xs text-muted-foreground">
                {booking.customerName}&apos;s session, running from{" "}
                {formatTime(booking.startTime)}
              </span>
            ) : (
              <>
                <span className="truncate text-sm font-medium">
                  {booking.customerName}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {booking.phone}
                </span>
                <span className="text-xs text-muted-foreground">
                  {balance > 0 ? (
                    <>
                      <Money amount={balance} className="text-destructive" /> due
                    </>
                  ) : (
                    "Fully paid"
                  )}
                </span>
              </>
            )}
          </button>
        ) : (
          <Button size="sm" variant="outline" className="w-full" onClick={onBook}>
            <PlusIcon data-icon="inline-start" />
            Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
