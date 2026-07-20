import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency, formatPercent } from "../lib/format";
import { Card } from "./ui/Card";
import type { Totals } from "../lib/metrics";

interface Props {
  totals: Totals;
  deltas: {
    income: number | null;
    expenses: number | null;
    saved: number | null;
  };
  period: number;
}

export function StatStack({ totals, deltas, period }: Props) {
  return (
    <div className="w-full lg:w-56 shrink-0 flex flex-col gap-4">
      <Stat
        label="Total income"
        value={totals.income}
        delta={deltas.income}
        period={period}
        goodDirection="up"
        icon={TrendingUp}
        accent="income"
      />
      <Stat
        label="Total expenses"
        value={totals.expenses}
        delta={deltas.expenses}
        period={period}
        goodDirection="down"
        icon={TrendingDown}
        accent="expense"
      />
      <Stat
        label="Saved balance"
        value={totals.saved}
        delta={deltas.saved}
        period={period}
        goodDirection="up"
        icon={PiggyBank}
        accent="savings"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  period,
  goodDirection,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  delta: number | null;
  period: number;
  goodDirection: "up" | "down";
  icon: typeof TrendingUp;
  accent: "income" | "expense" | "savings";
}) {
  const isUp = (delta ?? 0) >= 0;
  const isGood = delta === null ? null : isUp === (goodDirection === "up");

  return (
    <Card className="flex-1" padded={false}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-muted">{label}</p>
          <div
            className={clsx(
              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
              accent === "income" && "bg-income/10 text-income",
              accent === "expense" && "bg-expense/10 text-expense",
              accent === "savings" && "bg-savings/10 text-savings",
            )}
          >
            <Icon size={14} />
          </div>
        </div>
        <p className="font-display text-2xl font-semibold text-ink-primary tabular-nums mt-2 tracking-tight">
          {formatCurrency(value)}
        </p>
        {delta !== null && (
          <p
            className={clsx(
              "flex items-center gap-1 text-xs mt-1.5 font-medium",
              isGood ? "text-status-good" : "text-status-critical",
            )}
          >
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {formatPercent(Math.abs(delta))} vs prior {period}d
          </p>
        )}
      </div>
    </Card>
  );
}
