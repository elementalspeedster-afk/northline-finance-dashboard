import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Card, CardHeader } from "./ui/Card";
import { formatCurrencyCents, initials, relativeTime } from "../lib/format";
import { CATEGORY_COLOR_VAR } from "../lib/categories";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

export function TransactionHistoryList({ transactions }: Props) {
  const seenIds = useRef<Set<string>>(new Set());
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      for (const t of transactions) seenIds.current.add(t.id);
      initialized.current = true;
      return;
    }
    const newlySeen: string[] = [];
    for (const t of transactions) {
      if (!seenIds.current.has(t.id)) {
        seenIds.current.add(t.id);
        newlySeen.push(t.id);
      }
    }
    if (newlySeen.length > 0) {
      setFreshIds((prev) => new Set([...prev, ...newlySeen]));
      const timeout = setTimeout(() => {
        setFreshIds((prev) => {
          const next = new Set(prev);
          for (const id of newlySeen) next.delete(id);
          return next;
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [transactions]);

  const visible = transactions.slice(0, 8);

  return (
    <Card className="flex-1 min-h-0 flex flex-col">
      <CardHeader title="Transaction history" subtitle="Most recent activity" />
      <div className="flex-1 overflow-y-auto -mx-5 px-5 space-y-1">
        {visible.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "flex items-center gap-3 py-2 rounded-lg transition-colors duration-700",
              freshIds.has(t.id) && "bg-brand/10",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-surface-sunken text-ink-secondary flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initials(t.merchant)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink-primary truncate">
                {t.merchant}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLOR_VAR[t.category] }}
                />
                <span className="truncate">{t.category}</span>
                <span>&middot;</span>
                <span className="shrink-0">{relativeTime(t.occurred_at)}</span>
              </div>
            </div>
            <span
              className={clsx(
                "text-xs font-medium tabular-nums shrink-0",
                t.amount >= 0 ? "text-status-good" : "text-ink-primary",
              )}
            >
              {t.amount >= 0 ? "+" : ""}
              {formatCurrencyCents(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
