"use client";

import * as React from "react";
import { toast } from "sonner";
import { PlusIcon, Trash2Icon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { newId, useStore } from "@/lib/dashboard/store";
import { formatTime } from "@/lib/dashboard/availability";
import type { Court, Game, GameAttribute, SlotTime } from "@/lib/dashboard/types";

const blankGame = (): Game => ({
  id: newId("game"),
  name: "",
  icon: "GamepadIcon",
  status: "active",
  basePrice: 300,
  defaultAdvance: 100,
  durations: [30, 60],
  slotTimes: [],
  courts: [],
  attributes: [],
});

/** Create or edit a game, its courts, slot times, pricing and custom fields. */
export function GameFormDialog({
  open,
  onOpenChange,
  game,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: Game;
}) {
  const { dispatch } = useStore();
  const [draft, setDraft] = React.useState<Game>(game ?? blankGame());

  // Reset the draft whenever the dialog opens so it never shows stale edits.
  React.useEffect(() => {
    if (open) setDraft(game ? structuredClone(game) : blankGame());
  }, [open, game]);

  const patch = (p: Partial<Game>) => setDraft((d) => ({ ...d, ...p }));

  const [newCourt, setNewCourt] = React.useState("");
  const [newSlot, setNewSlot] = React.useState("");
  const [newAttr, setNewAttr] = React.useState({ label: "", value: "" });

  const addCourt = () => {
    const name = newCourt.trim();
    if (!name) return;
    const court: Court = { id: newId("court"), name, active: true };
    patch({ courts: [...draft.courts, court] });
    setNewCourt("");
  };

  const addSlot = () => {
    if (!/^\d{2}:\d{2}$/.test(newSlot)) return;
    if (draft.slotTimes.some((t) => t.start === newSlot)) return;
    const slot: SlotTime = { id: newId("slot"), start: newSlot, active: true };
    patch({
      slotTimes: [...draft.slotTimes, slot].sort((a, b) =>
        a.start.localeCompare(b.start)
      ),
    });
    setNewSlot("");
  };

  const addAttribute = () => {
    const label = newAttr.label.trim();
    if (!label) return;
    const attr: GameAttribute = {
      id: newId("attr"),
      label,
      value: newAttr.value.trim(),
    };
    patch({ attributes: [...draft.attributes, attr] });
    setNewAttr({ label: "", value: "" });
  };

  const canSave =
    draft.name.trim() !== "" &&
    draft.basePrice >= 0 &&
    draft.defaultAdvance >= 0 &&
    draft.defaultAdvance <= draft.basePrice &&
    draft.durations.length > 0;

  const save = () => {
    if (!canSave) return;
    const payload = { ...draft, name: draft.name.trim() };
    dispatch(
      game ? { type: "UPDATE_GAME", game: payload } : { type: "ADD_GAME", game: payload }
    );
    toast.success(game ? "Game updated" : "Game created", {
      description: payload.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{game ? "Edit game" : "New game"}</DialogTitle>
          <DialogDescription>
            Set pricing, courts and the slot times this game can be booked in.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="g-name">Game name</FieldLabel>
              <Input
                id="g-name"
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Laser Tag"
              />
            </Field>

            <Field orientation="horizontal">
              <FieldLabel htmlFor="g-active">Bookable now</FieldLabel>
              <Switch
                id="g-active"
                checked={draft.status === "active"}
                onCheckedChange={(checked) =>
                  patch({ status: checked ? "active" : "coming-soon" })
                }
              />
              <FieldDescription>
                Turn off to show it as coming soon.
              </FieldDescription>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="g-price">Price per booking (₹)</FieldLabel>
              <Input
                id="g-price"
                type="number"
                min={0}
                value={draft.basePrice}
                onChange={(e) => patch({ basePrice: Number(e.target.value) })}
              />
            </Field>

            <Field data-invalid={draft.defaultAdvance > draft.basePrice || undefined}>
              <FieldLabel htmlFor="g-advance">Advance to lock slot (₹)</FieldLabel>
              <Input
                id="g-advance"
                type="number"
                min={0}
                value={draft.defaultAdvance}
                aria-invalid={draft.defaultAdvance > draft.basePrice || undefined}
                onChange={(e) => patch({ defaultAdvance: Number(e.target.value) })}
              />
              <FieldDescription>
                {draft.defaultAdvance > draft.basePrice
                  ? "Advance can't exceed the price."
                  : "Prefilled on every new booking."}
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="g-durations">Durations offered (minutes)</FieldLabel>
            <Input
              id="g-durations"
              value={draft.durations.join(", ")}
              onChange={(e) =>
                patch({
                  durations: e.target.value
                    .split(",")
                    .map((s) => Number(s.trim()))
                    .filter((n) => Number.isFinite(n) && n > 0),
                })
              }
              placeholder="30, 60, 90"
            />
            <FieldDescription>
              Comma separated. The first is the default slot length.
            </FieldDescription>
          </Field>

          <Separator />

          <FieldSet>
            <FieldLegend variant="label">Courts</FieldLegend>
            <FieldDescription>
              Each court can hold one booking at a time.
            </FieldDescription>
            <div className="flex flex-col gap-2">
              {draft.courts.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <Input
                    value={c.name}
                    onChange={(e) =>
                      patch({
                        courts: draft.courts.map((x) =>
                          x.id === c.id ? { ...x, name: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Switch
                    checked={c.active}
                    aria-label={`${c.name} active`}
                    onCheckedChange={(checked) =>
                      patch({
                        courts: draft.courts.map((x) =>
                          x.id === c.id ? { ...x, active: checked } : x
                        ),
                      })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${c.name}`}
                    onClick={() =>
                      patch({ courts: draft.courts.filter((x) => x.id !== c.id) })
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  value={newCourt}
                  onChange={(e) => setNewCourt(e.target.value)}
                  placeholder="Add a court, e.g. Track 3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCourt();
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={addCourt}>
                  <PlusIcon data-icon="inline-start" />
                  Add
                </Button>
              </div>
            </div>
          </FieldSet>

          <Separator />

          <FieldSet>
            <FieldLegend variant="label">Slot times</FieldLegend>
            <FieldDescription>
              Only active times can be booked. Click a time to toggle it.
            </FieldDescription>
            <div className="flex flex-wrap gap-1.5">
              {draft.slotTimes.map((t) => (
                <Badge
                  key={t.id}
                  variant={t.active ? "default" : "outline"}
                  className="cursor-pointer"
                  render={
                    <button
                      type="button"
                      onClick={() =>
                        patch({
                          slotTimes: draft.slotTimes.map((x) =>
                            x.id === t.id ? { ...x, active: !x.active } : x
                          ),
                        })
                      }
                    />
                  }
                >
                  {formatTime(t.start)}
                </Badge>
              ))}
              {draft.slotTimes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No slot times yet.
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="w-36"
              />
              <Button variant="outline" size="sm" onClick={addSlot}>
                <PlusIcon data-icon="inline-start" />
                Add time
              </Button>
            </div>
          </FieldSet>

          <Separator />

          <FieldSet>
            <FieldLegend variant="label">Custom details</FieldLegend>
            <FieldDescription>
              Anything specific to this game — laps, overs, equipment.
            </FieldDescription>
            <div className="flex flex-col gap-2">
              {draft.attributes.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <Input
                    value={a.label}
                    onChange={(e) =>
                      patch({
                        attributes: draft.attributes.map((x) =>
                          x.id === a.id ? { ...x, label: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    value={a.value}
                    onChange={(e) =>
                      patch({
                        attributes: draft.attributes.map((x) =>
                          x.id === a.id ? { ...x, value: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${a.label}`}
                    onClick={() =>
                      patch({
                        attributes: draft.attributes.filter((x) => x.id !== a.id),
                      })
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  value={newAttr.label}
                  onChange={(e) =>
                    setNewAttr((s) => ({ ...s, label: e.target.value }))
                  }
                  placeholder="Label, e.g. Laps"
                />
                <Input
                  value={newAttr.value}
                  onChange={(e) =>
                    setNewAttr((s) => ({ ...s, value: e.target.value }))
                  }
                  placeholder="Value, e.g. 12"
                />
                <Button variant="outline" size="sm" onClick={addAttribute}>
                  <PlusIcon data-icon="inline-start" />
                  Add
                </Button>
              </div>
            </div>
          </FieldSet>
        </FieldGroup>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave}>
            {game ? "Save changes" : "Create game"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
