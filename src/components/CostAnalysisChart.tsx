import { formatCurrency, formatPercent } from "../lib/format";
import { CATEGORY_COLOR_VAR } from "../lib/categories";
import { Card, CardHeader } from "./ui/Card";
import type { CategorySlice } from "../lib/metrics";

interface Props {
  breakdown: CategorySlice[];
  total: number;
}

export function CostAnalysisChart({ breakdown, total }: Props) {
  const maxPercent = Math.max(...breakdown.map((b) => b.percent), 1);

  return (
    <Card>
      <CardHeader title="Cost analysis" subtitle="Spending overview · this month" />
      <p className="text-2xl font-semibold text-ink-primary tabular-nums mb-4">
        {formatCurrency(total)}
      </p>
      <div className="space-y-2.5">
        {breakdown.map((slice) => (
          <div key={slice.category} className="flex items-center gap-2.5 text-xs">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLOR_VAR[slice.category] }}
            />
            <span className="w-[92px] shrink-0 text-ink-secondary truncate">
              {slice.category}
            </span>
            <div className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(slice.percent / maxPercent) * 100}%`,
                  backgroundColor: CATEGORY_COLOR_VAR[slice.category],
                }}
              />
            </div>
            <span className="w-9 shrink-0 text-right tabular-nums text-ink-muted">
              {formatPercent(slice.percent, 0)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
