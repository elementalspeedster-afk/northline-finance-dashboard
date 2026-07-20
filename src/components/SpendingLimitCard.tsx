import clsx from "clsx";
import { formatCurrency } from "../lib/format";
import { Card, CardHeader } from "./ui/Card";

interface Props {
  spent: number;
  limit: number;
}

export function SpendingLimitCard({ spent, limit }: Props) {
  const percent = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const over = spent > limit;

  return (
    <Card>
      <CardHeader
        title="Monthly spending limit"
        subtitle="Current status"
        action={
          <span
            className={clsx(
              "font-display text-sm font-semibold tabular-nums",
              over ? "text-status-critical" : "text-ink-primary",
            )}
          >
            {Math.round(percent)}%
          </span>
        }
      />
      <div className="h-2.5 rounded-full bg-surface-sunken overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all",
            over ? "bg-status-critical" : "bg-gradient-to-r from-brand to-savings",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2.5 text-xs">
        <span className="font-medium text-ink-primary tabular-nums">
          {formatCurrency(spent)}
        </span>
        <span className="text-ink-muted tabular-nums">{formatCurrency(limit)}</span>
      </div>
    </Card>
  );
}
