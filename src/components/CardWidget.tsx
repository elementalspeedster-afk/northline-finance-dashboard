import { Card, CardHeader } from "./ui/Card";
import { formatCurrency } from "../lib/format";
import { initials } from "../lib/format";
import type { Account } from "../types";
import type { MerchantFrequency } from "../lib/metrics";

interface Props {
  account: Account | undefined;
  topMerchants: MerchantFrequency[];
}

export function CardWidget({ account, topMerchants }: Props) {
  return (
    <Card>
      <CardHeader title="My card" subtitle="Primary checking account" />

      <div className="rounded-xl bg-gradient-to-br from-brand to-savings p-4 text-white relative overflow-hidden h-36 flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-4 w-16 h-16 rounded-full bg-white/10" />
        <div className="flex items-start justify-between relative">
          <span className="text-xs font-medium opacity-90">
            {account?.name ?? "Everyday Checking"}
          </span>
          <span className="text-xs font-semibold tracking-wide opacity-90">
            NORTHLINE
          </span>
        </div>
        <div className="relative">
          <p className="text-lg font-semibold tabular-nums tracking-wide">
            &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;{" "}
            {account?.last_four ?? "0000"}
          </p>
          <div className="flex items-end justify-between mt-1.5">
            <p className="text-xl font-semibold tabular-nums">
              {formatCurrency(account?.balance ?? 0)}
            </p>
            <span className="text-[11px] opacity-80">Demo User</span>
          </div>
        </div>
      </div>

      {topMerchants.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wide mb-2">
            Top merchants this month
          </p>
          <div className="flex items-center gap-2">
            {topMerchants.map((m) => (
              <div
                key={m.merchant}
                title={`${m.merchant} · ${m.count} transactions · ${formatCurrency(m.total)}`}
                className="w-9 h-9 rounded-full bg-surface-sunken text-ink-secondary flex items-center justify-center text-[11px] font-semibold shrink-0"
              >
                {initials(m.merchant)}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
