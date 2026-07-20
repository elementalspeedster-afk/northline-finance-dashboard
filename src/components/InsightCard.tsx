import { Lightbulb } from "lucide-react";
import { Card, CardHeader } from "./ui/Card";
import { formatPercent } from "../lib/format";
import type { BudgetUsage } from "../lib/metrics";

interface Props {
  budgetUsage: BudgetUsage[];
}

export function InsightCard({ budgetUsage }: Props) {
  const ranked = [...budgetUsage]
    .filter((b) => b.limit > 0)
    .sort((a, b) => b.percent - a.percent);
  const top = ranked[0];

  return (
    <Card>
      <CardHeader title="Budget insight" subtitle="Computed from this month's activity" />
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <Lightbulb size={16} />
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed">
          {top ? (
            <>
              <span className="font-medium text-ink-primary">{top.category}</span>{" "}
              is your closest-to-limit category this month at{" "}
              <span className="font-medium text-ink-primary">
                {formatPercent(top.percent, 0)}
              </span>{" "}
              of its monthly budget.
              {top.percent >= 100
                ? " You've gone over — consider trimming it next cycle."
                : top.percent >= 80
                  ? " Keep an eye on it for the rest of the month."
                  : " You're comfortably within range."}
            </>
          ) : (
            "Budget data will appear here once categories have spending."
          )}
        </p>
      </div>
    </Card>
  );
}
