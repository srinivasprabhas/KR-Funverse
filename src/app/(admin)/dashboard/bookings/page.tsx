"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  TicketXIcon,
} from "lucide-react";

import { PageShell } from "@/components/dashboard/page-shell";
import { BookingDialog } from "@/components/dashboard/booking-dialog";
import { BookingDetailsSheet } from "@/components/dashboard/booking-details";
import { FilterBar, GameSelect } from "@/components/dashboard/filter-bar";
import { BookingStatusBadge } from "@/components/dashboard/status-badge";
import { Money } from "@/components/dashboard/money";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/dashboard/store";
import { formatDuration, formatTime } from "@/lib/dashboard/availability";
import { balanceOf, type Booking, type BookingStatus } from "@/lib/dashboard/types";

const STATUS_ITEMS = [
  { label: "All statuses", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function BookingsPage() {
  const { state, hydrated, gameById, courtById } = useStore();

  const [query, setQuery] = React.useState("");
  const [gameId, setGameId] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Booking | undefined>();

  const [page, setPage] = React.useState(0);
  const PER_PAGE = 25;

  const allRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...state.bookings]
      .filter((b) => (gameId === "all" ? true : b.gameId === gameId))
      .filter((b) => (status === "all" ? true : b.status === status))
      .filter((b) =>
        q
          ? b.customerName.toLowerCase().includes(q) || b.phone.includes(q)
          : true
      )
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime)
      );
  }, [state.bookings, query, gameId, status]);

  // Filtering can shrink the list past the current page — snap back to the start.
  React.useEffect(() => setPage(0), [query, gameId, status]);

  const pageCount = Math.max(1, Math.ceil(allRows.length / PER_PAGE));
  const current = Math.min(page, pageCount - 1);
  const rows = allRows.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  if (!hydrated) {
    return (
      <PageShell title="Bookings" description="Loading bookings…">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-80 w-full" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Bookings"
      description="Every booking taken, across all games and dates."
      action={
        <Button onClick={() => setDialogOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          New booking
        </Button>
      }
    >
      <FilterBar>
        <InputGroup className="w-full sm:w-64">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search name or phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>

        <GameSelect
          games={state.games}
          value={gameId}
          onChange={setGameId}
          allowAll
          className="min-w-36"
        />

        <Select
          items={STATUS_ITEMS}
          value={status}
          onValueChange={(v) => setStatus(v as string)}
        >
          <SelectTrigger className="min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUS_ITEMS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <span className="ml-auto text-sm text-muted-foreground">
          {allRows.length} booking{allRows.length === 1 ? "" : "s"}
        </span>
      </FilterBar>

      {allRows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TicketXIcon />
            </EmptyMedia>
            <EmptyTitle>No bookings match</EmptyTitle>
            <EmptyDescription>
              Try clearing the filters, or take a new booking.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* Desktop: dense table. */}
          <Card className="hidden py-0 md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Game / Court</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((b) => {
                    const balance = balanceOf(b);
                    return (
                      <TableRow
                        key={b.id}
                        onClick={() => setSelected(b)}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{b.customerName}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {b.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {gameById(b.gameId)?.name} ·{" "}
                          {courtById(b.gameId, b.courtId)?.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums">
                          {format(parseISO(b.date), "d MMM")} ·{" "}
                          {formatTime(b.startTime)}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({formatDuration(b.durationMin)})
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Money amount={b.total} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Money
                            amount={balance}
                            className={balance > 0 ? "text-destructive" : undefined}
                          />
                        </TableCell>
                        <TableCell>
                          <BookingStatusBadge status={b.status as BookingStatus} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile: the same rows as tappable cards. */}
          <div className="flex flex-col gap-2 md:hidden">
            {rows.map((b) => {
              const balance = balanceOf(b);
              return (
                <Card key={b.id} className="py-0">
                  <CardContent className="p-3">
                    <button
                      type="button"
                      onClick={() => setSelected(b)}
                      className="flex w-full flex-col gap-2 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{b.customerName}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {b.phone}
                          </span>
                        </div>
                        <BookingStatusBadge status={b.status as BookingStatus} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {gameById(b.gameId)?.name} ·{" "}
                        {courtById(b.gameId, b.courtId)?.name}
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm tabular-nums">
                        <span>
                          {format(parseISO(b.date), "d MMM")} ·{" "}
                          {formatTime(b.startTime)}
                        </span>
                        <span>
                          {balance > 0 ? (
                            <>
                              <Money amount={balance} className="text-destructive" />{" "}
                              due
                            </>
                          ) : (
                            "Paid"
                          )}
                        </span>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span className="text-sm text-muted-foreground tabular-nums">
              Showing {current * PER_PAGE + 1}–
              {Math.min((current + 1) * PER_PAGE, allRows.length)} of{" "}
              {allRows.length}
            </span>
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeftIcon data-icon="inline-start" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Page {current + 1} of {pageCount}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                Next
                <ChevronRightIcon data-icon="inline-end" />
              </Button>
            </ButtonGroup>
          </div>
        </>
      )}

      <BookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BookingDetailsSheet
        booking={selected}
        onOpenChange={(open) => !open && setSelected(undefined)}
      />
    </PageShell>
  );
}
