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

      <div className="rounded-2xl bg-gradient-to-br from-brand via-brand to-savings p-4 text-white relative overflow-hidden h-36 flex flex-col justify-between shadow-lg shadow-brand/25 ring-1 ring-white/10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-3 bottom-2 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="flex items-start justify-between relative">
          <span className="text-xs font-medium opacity-90">
            {account?.name ?? "Everyday Checking"}
          </span>
          <span className="font-display text-xs font-semibold tracking-wide opacity-90">
            NORTHLINE
          </span>
        </div>
        <div className="relative">
          <p className="text-lg font-semibold tabular-nums tracking-[0.15em]">
            &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;{" "}
            {account?.last_four ?? "0000"}
          </p>
          <div className="flex items-end justify-between mt-1.5">
            <p className="font-display text-2xl font-semibold tabular-nums tracking-tight">
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
