import { Card, CardHeader } from "./ui/Card";
import { formatPercent } from "../lib/format";
import type { FinancialHealth } from "../lib/metrics";

interface Props {
  health: FinancialHealth;
}

function bandFor(score: number) {
  if (score >= 70) return { label: "Excellent", color: "var(--status-good)" };
  if (score >= 40) return { label: "Fair", color: "var(--status-warning)" };
  return { label: "Needs attention", color: "var(--status-critical)" };
}

export function FinancialHealthGauge({ health }: Props) {
  const { score } = health;
  const band = bandFor(score);

  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - score / 100);

  return (
    <Card>
      <CardHeader title="Financial health" subtitle="Based on the last 30 days" />
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 180 100" className="w-full max-w-[220px]">
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="var(--grid-hairline)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={band.color}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className="fill-ink-primary"
            style={{ fontSize: 28, fontWeight: 600 }}
          >
            {formatPercent(score, 0)}
          </text>
        </svg>
        <p className="text-xs font-medium mt-1" style={{ color: band.color }}>
          {band.label}
        </p>
        <p className="text-xs text-ink-muted mt-2 text-center leading-relaxed">
          {formatPercent(health.savingsRate, 0)} savings rate &middot;{" "}
          {formatPercent(health.budgetAdherence, 0)} of budgets on track
        </p>
      </div>
    </Card>
  );
}
