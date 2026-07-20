import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import clsx from "clsx";
import type { DailyPoint } from "../lib/metrics";
import { formatCurrency, formatCurrencyCents, formatDate, formatDay } from "../lib/format";
import { Card } from "./ui/Card";
import type { Period } from "../hooks/useDashboardData";

interface Props {
  series: DailyPoint[];
  period: Period;
  onPeriodChange: (p: Period) => void;
  saved: number;
}

const SERIES = [
  { key: "income", label: "Income", varName: "--income" },
  { key: "expenses", label: "Expenses", varName: "--expense" },
  { key: "savings", label: "Net savings", varName: "--savings" },
] as const;

export function BalanceOverviewChart({ series, period, onPeriodChange, saved }: Props) {
  const data = useMemo(
    () =>
      series.map((p) => ({
        ...p,
        label: period === 7 ? formatDay(p.date) : formatDate(p.date),
      })),
    [series, period],
  );

  return (
    <Card className="flex-1 min-w-0">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p
            className={clsx(
              "font-display text-3xl font-semibold tabular-nums tracking-tight",
              saved >= 0 ? "text-ink-primary" : "text-expense",
            )}
          >
            {formatCurrency(saved)}
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            Balance overview · last {period} days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Legend />
          <div className="flex rounded-lg border border-border-hairline overflow-hidden text-xs">
            {([7, 30] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={clsx(
                  "px-2.5 py-1.5 font-medium transition-colors",
                  p === period
                    ? "bg-brand text-white"
                    : "bg-transparent text-ink-secondary hover:bg-surface-sunken",
                )}
              >
                {p}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-64 mt-4 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} barGap={2} barCategoryGap={period === 7 ? "28%" : "14%"}>
            <CartesianGrid vertical={false} stroke="var(--grid-hairline)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--axis-baseline)" }}
              tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
              interval={period === 30 ? 3 : 0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--ink-muted)", fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v)}
              width={56}
            />
            <ReferenceLine y={0} stroke="var(--axis-baseline)" />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--surface-sunken)" }} />
            <Bar
              dataKey="income"
              name="Income"
              fill="var(--income)"
              radius={[3, 3, 0, 0]}
              maxBarSize={period === 7 ? 16 : 6}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="var(--expense)"
              radius={[3, 3, 0, 0]}
              maxBarSize={period === 7 ? 16 : 6}
            />
            <Line
              dataKey="savings"
              name="Net savings"
              stroke="var(--savings)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--savings)", strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Legend() {
  return (
    <div className="hidden md:flex items-center gap-3">
      {SERIES.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: `var(${s.varName})` }}
          />
          {s.label}
        </div>
      ))}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border-hairline bg-surface-1 shadow-lg px-3 py-2.5 text-xs min-w-[160px]">
      <p className="font-medium text-ink-primary mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-ink-secondary">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="tabular-nums font-medium text-ink-primary">
              {formatCurrencyCents(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
