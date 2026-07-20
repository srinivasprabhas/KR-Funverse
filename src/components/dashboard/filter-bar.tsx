"use client";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Game } from "@/lib/dashboard/types";

/** Date stepper + picker. Shared by the slot board and the bookings list. */
export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const selected = value ? parseISO(value) : undefined;
  const step = (days: number) =>
    selected && onChange(format(addDays(selected, days), "yyyy-MM-dd"));

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Previous day"
        onClick={() => step(-1)}
      >
        <ChevronLeftIcon />
      </Button>

      <Popover>
        <PopoverTrigger
          render={<Button variant="outline" className="min-w-40 justify-start" />}
        >
          <CalendarIcon data-icon="inline-start" />
          {selected ? format(selected, "EEE, d MMM yyyy") : "Pick a date"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next day"
        onClick={() => step(1)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}

/** Game selector. `allowAll` adds an "All games" option for list views. */
export function GameSelect({
  games,
  value,
  onChange,
  allowAll,
  className,
}: {
  games: Game[];
  value: string;
  onChange: (gameId: string) => void;
  allowAll?: boolean;
  className?: string;
}) {
  const items = [
    ...(allowAll ? [{ label: "All games", value: "all" }] : []),
    ...games.map((g) => ({ label: g.name, value: g.id })),
  ];

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** Layout wrapper so every filter row wraps identically on mobile. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
      {children}
    </div>
  );
}
