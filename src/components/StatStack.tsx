import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
      />
      <Stat
        label="Total expenses"
        value={totals.expenses}
        delta={deltas.expenses}
        period={period}
        goodDirection="down"
      />
      <Stat
        label="Saved balance"
        value={totals.saved}
        delta={deltas.saved}
        period={period}
        goodDirection="up"
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
}: {
  label: string;
  value: number;
  delta: number | null;
  period: number;
  goodDirection: "up" | "down";
}) {
  const isUp = (delta ?? 0) >= 0;
  const isGood = delta === null ? null : isUp === (goodDirection === "up");

  return (
    <Card className="flex-1" padded={false}>
      <div className="p-4">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="text-xl font-semibold text-ink-primary tabular-nums mt-1.5">
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
