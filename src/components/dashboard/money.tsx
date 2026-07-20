import { cn } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatMoney = (amount: number) => formatter.format(amount);

/** Tabular numerals keep columns of amounts aligned in tables and cards. */
export function Money({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <span className={cn("tabular-nums", className)}>{formatMoney(amount)}</span>
  );
}
