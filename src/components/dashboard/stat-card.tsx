import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** KPI tile. Shared by the overview and the slot board. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClassName,
  loading,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: LucideIcon;
  /** Per-metric tint, e.g. "text-chart-2". Defaults to neutral. */
  iconClassName?: string;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {Icon ? (
          <Icon className={cn("size-4", iconClassName ?? "text-muted-foreground")} />
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </div>
        )}
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
