import { Car, Home, Plane, Shield, Target } from "lucide-react";
import { Card, CardHeader } from "./ui/Card";
import { formatCurrency } from "../lib/format";
import type { Goal } from "../types";

const ICONS: Record<string, typeof Target> = {
  shield: Shield,
  plane: Plane,
  car: Car,
  home: Home,
};

// Thematically linked to the categorical palette (car -> transportation's
// hue, home -> housing's hue) rather than a fresh set of colors.
const ICON_COLOR_VAR: Record<string, string> = {
  shield: "var(--income)",
  plane: "var(--cat-transport)",
  car: "var(--cat-debt)",
  home: "var(--cat-housing)",
};

interface Props {
  goals: Goal[];
}

export function GoalTracker({ goals }: Props) {
  const short = goals.filter((g) => g.term === "short");
  const long = goals.filter((g) => g.term === "long");

  return (
    <Card>
      <CardHeader title="Goal tracker" subtitle="Progress toward targets" />
      <div className="space-y-4">
        {short.length > 0 && <GoalGroup title="This year" goals={short} />}
        {long.length > 0 && <GoalGroup title="Long term" goals={long} />}
      </div>
    </Card>
  );
}

function GoalGroup({ title, goals }: { title: string; goals: Goal[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wide mb-2">
        {title}
      </p>
      <div className="space-y-3">
        {goals.map((goal) => {
          const Icon = ICONS[goal.icon] ?? Target;
          const colorVar = ICON_COLOR_VAR[goal.icon] ?? "var(--ink-secondary)";
          const percent = Math.min(
            100,
            (goal.current_amount / goal.target_amount) * 100,
          );
          return (
            <div key={goal.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklab, ${colorVar} 14%, transparent)`, color: colorVar }}
              >
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-ink-primary truncate">
                    {goal.name}
                  </span>
                  <span className="text-ink-muted tabular-nums shrink-0">
                    {formatCurrency(goal.current_amount)} /{" "}
                    {formatCurrency(goal.target_amount)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: colorVar }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
