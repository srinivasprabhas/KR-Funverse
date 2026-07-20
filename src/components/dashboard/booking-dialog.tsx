"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookingForm,
  type BookingFormPreset,
} from "@/components/dashboard/booking-form";
import type { Booking } from "@/lib/dashboard/types";

/**
 * Wrapper around the one booking form. Opened blank from the bookings list and
 * pre-filled from a slot card, so both entry points share identical behaviour.
 */
export function BookingDialog({
  open,
  onOpenChange,
  booking,
  preset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking;
  preset?: BookingFormPreset;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit booking" : "New booking"}</DialogTitle>
          <DialogDescription>
            {booking
              ? "Update the details. The slot stays locked to this customer."
              : "Take a fixed advance to lock this slot to one customer."}
          </DialogDescription>
        </DialogHeader>
        {/* Remount on open so the form always starts from fresh preset values. */}
        {open ? (
          <BookingForm
            booking={booking}
            preset={preset}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
