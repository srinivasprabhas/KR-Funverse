"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatMoney } from "@/components/dashboard/money";
import { ChartReveal } from "@/components/dashboard/chart-reveal";

/** Compact ₹ for axis ticks — "₹12k" beats "₹12,000" on a crowded axis. */
const compactMoney = (n: number) =>
  n >= 1000 ? `₹${Math.round(n / 100) / 10}k` : `₹${n}`;

/* ------------------------------------------------------------------ *
 * Revenue: collected vs outstanding, stacked over time.
 * Two series, so a legend is always present.
 * ------------------------------------------------------------------ */

const revenueConfig = {
  collected: { label: "Collected", color: "var(--chart-2)" },
  outstanding: { label: "Outstanding", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function RevenueTrendChart({
  data,
}: {
  data: { label: string; collected: number; outstanding: number }[];
}) {
  return (
    <ChartReveal>
      {({ chartKey, anim }) => (
        <ChartContainer
          config={revenueConfig}
          className="aspect-auto h-64 w-full"
        >
          <AreaChart
            key={chartKey}
            data={data}
            margin={{ left: 4, right: 8, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={52}
              tickFormatter={compactMoney}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-3">
                      <span className="text-muted-foreground">
                        {
                          revenueConfig[name as keyof typeof revenueConfig]
                            ?.label
                        }
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatMoney(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              {...anim}
              dataKey="collected"
              type="monotone"
              stackId="revenue"
              stroke="var(--color-collected)"
              fill="var(--color-collected)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              {...anim}
              dataKey="outstanding"
              type="monotone"
              stackId="revenue"
              stroke="var(--color-outstanding)"
              fill="var(--color-outstanding)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </ChartReveal>
  );
}

/* ------------------------------------------------------------------ *
 * Occupancy by hour — single series, so no legend: the title names it.
 * ------------------------------------------------------------------ */

const occupancyConfig = {
  rate: { label: "Utilisation", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function OccupancyByHourChart({
  data,
}: {
  data: { label: string; rate: number; booked: number; capacity: number }[];
}) {
  return (
    <ChartReveal>
      {({ chartKey, anim }) => (
        <ChartContainer
          config={occupancyConfig}
          className="aspect-auto h-56 w-full"
        >
          <BarChart
            key={chartKey}
            data={data}
            margin={{ left: 4, right: 8, top: 8 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const p = item?.payload as {
                      booked: number;
                      capacity: number;
                    };
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium tabular-nums">
                          {value}% full
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {p?.booked} of {p?.capacity} slots
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              {...anim}
              dataKey="rate"
              fill="var(--color-rate)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </ChartReveal>
  );
}

/* ------------------------------------------------------------------ *
 * Payment mix — capped at 4 hues + "Other" so the palette stays inside
 * its validated all-pairs range. Slices are direct-labelled, which is
 * also the required relief for the light-mode contrast warning.
 * ------------------------------------------------------------------ */

const SLICE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PaymentMixChart({
  data,
}: {
  data: { label: string; amount: number; share: number }[];
}) {
  // Fold the tail into "Other" rather than inventing a 6th hue.
  const top = data.slice(0, 4);
  const rest = data.slice(4);
  const slices = rest.length
    ? [
        ...top,
        {
          label: "Other",
          amount: rest.reduce((s, d) => s + d.amount, 0),
          share: rest.reduce((s, d) => s + d.share, 0),
        },
      ]
    : top;

  const config = Object.fromEntries(
    slices.map((s, i) => [s.label, { label: s.label, color: SLICE_COLORS[i] }]),
  ) satisfies ChartConfig;

  return (
    <ChartReveal>
      {({ chartKey, anim }) => (
        <ChartContainer config={config} className="aspect-auto h-56 w-full">
          <PieChart key={chartKey}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-3">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium tabular-nums">
                        {formatMoney(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              {...anim}
              data={slices}
              dataKey="amount"
              nameKey="label"
              innerRadius={45}
              outerRadius={75}
              // 2px surface gap between segments.
              paddingAngle={2}
              stroke="var(--background)"
              strokeWidth={2}
            >
              {slices.map((s, i) => (
                <Cell key={s.label} fill={SLICE_COLORS[i]} />
              ))}
              <LabelList
                dataKey="share"
                className="fill-background"
                stroke="none"
                fontSize={11}
                // Hide labels on slivers too small to hold text.
                formatter={(v) => (Number(v) >= 8 ? `${v}%` : "")}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
      )}
    </ChartReveal>
  );
}

/* ------------------------------------------------------------------ *
 * Top games by revenue — horizontal bars, direct-labelled.
 * ------------------------------------------------------------------ */

const gamesConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TopGamesChart({
  data,
}: {
  data: { name: string; revenue: number; bookings: number }[];
}) {
  return (
    <ChartReveal>
      {({ chartKey, anim }) => (
        <ChartContainer
          config={gamesConfig}
          className="aspect-auto w-full"
          style={{ height: Math.max(140, data.length * 44) }}
        >
          <BarChart
            key={chartKey}
            data={data}
            layout="vertical"
            margin={{ left: 4, right: 56, top: 4, bottom: 4 }}
          >
            <XAxis type="number" dataKey="revenue" hide />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={96}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const p = item?.payload as { bookings: number };
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium tabular-nums">
                          {formatMoney(Number(value))}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          {p?.bookings} booking{p?.bookings === 1 ? "" : "s"}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              {...anim}
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey="revenue"
                position="right"
                className="fill-foreground"
                fontSize={12}
                formatter={(v) => formatMoney(Number(v))}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </ChartReveal>
  );
}
