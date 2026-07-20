"use client";

import * as React from "react";
import { toast } from "sonner";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { PageShell } from "@/components/dashboard/page-shell";
import { GameFormDialog } from "@/components/dashboard/game-form-dialog";
import { Money } from "@/components/dashboard/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/dashboard/store";
import { formatDuration, formatTime } from "@/lib/dashboard/availability";
import type { Game } from "@/lib/dashboard/types";

export default function GamesPage() {
  const { state, dispatch, hydrated } = useStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Game | undefined>();

  const open = (game?: Game) => {
    setEditing(game);
    setDialogOpen(true);
  };

  const remove = (game: Game) => {
    dispatch({ type: "DELETE_GAME", gameId: game.id });
    toast.success("Game deleted", {
      description: `${game.name} and its bookings were removed.`,
    });
  };

  if (!hydrated) {
    return (
      <PageShell title="Games" description="Loading games…">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Games"
      description="Create games, set pricing, and manage courts and slot times."
      action={
        <Button onClick={() => open()}>
          <PlusIcon data-icon="inline-start" />
          New game
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.games.map((game) => {
          const activeCourts = game.courts.filter((c) => c.active);
          const activeSlots = game.slotTimes.filter((t) => t.active);
          const bookingCount = state.bookings.filter(
            (b) => b.gameId === game.id && b.status !== "cancelled"
          ).length;

          return (
            <Card key={game.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{game.name}</CardTitle>
                  <Badge
                    variant={game.status === "active" ? "default" : "secondary"}
                  >
                    {game.status === "active" ? "Bookable" : "Coming soon"}
                  </Badge>
                </div>
                <CardDescription>
                  <Money amount={game.basePrice} /> per booking ·{" "}
                  <Money amount={game.defaultAdvance} /> advance
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Courts</span>
                    <span className="font-medium tabular-nums">
                      {activeCourts.length} active
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Slot times</span>
                    <span className="font-medium tabular-nums">
                      {activeSlots.length} active
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Bookings</span>
                    <span className="font-medium tabular-nums">{bookingCount}</span>
                  </div>
                </div>

                {activeCourts.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {activeCourts.map((c) => (
                      <Badge key={c.id} variant="outline">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <div className="text-xs text-muted-foreground">
                  {game.durations.map(formatDuration).join(" · ")}
                  {activeSlots.length ? (
                    <>
                      {" · "}
                      {formatTime(activeSlots[0].start)}–
                      {formatTime(activeSlots[activeSlots.length - 1].start)}
                    </>
                  ) : null}
                </div>

                {game.attributes.length ? (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {game.attributes.map((a) => (
                      <span key={a.id}>
                        {a.label}: <span className="font-medium">{a.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}

                <Separator className="mt-auto" />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => open(game)}
                  >
                    <PencilIcon data-icon="inline-start" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${game.name}`}
                        />
                      }
                    >
                      <Trash2Icon />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {game.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This removes the game along with its {bookingCount}{" "}
                          booking{bookingCount === 1 ? "" : "s"}. This cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep game</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(game)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <GameFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        game={editing}
      />
    </PageShell>
  );
}
