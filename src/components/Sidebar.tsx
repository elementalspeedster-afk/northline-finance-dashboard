import { useState } from "react";
import clsx from "clsx";
import {
  LayoutGrid,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  LineChart,
  GraduationCap,
  LifeBuoy,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Accounts", icon: Wallet, active: false },
  { label: "Transactions", icon: ArrowLeftRight, active: false },
  { label: "Budget", icon: PiggyBank, active: false },
  { label: "Investments", icon: LineChart, active: false },
];

const NAV_ITEMS_SECONDARY = [
  { label: "Learning center", icon: GraduationCap },
  { label: "Support", icon: LifeBuoy },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "shrink-0 border-r border-border-hairline bg-surface-1 flex flex-col transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[240px]",
      )}
    >
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-brand to-savings text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-md shadow-brand/30">
          N
        </div>
        {!collapsed && (
          <span className="font-display font-semibold text-ink-primary tracking-tight text-[15px]">
            Northline
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.label} {...item} collapsed={collapsed} />
        ))}
        <div className="h-px bg-border-hairline my-3 mx-2" />
        {NAV_ITEMS_SECONDARY.map((item) => (
          <NavButton key={item.label} {...item} active={false} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-3 shrink-0 space-y-2">
        {!collapsed && (
          <div className="relative overflow-hidden rounded-xl border border-border-hairline bg-surface-sunken p-3.5">
            <div className="absolute -right-4 -top-6 w-20 h-20 rounded-full bg-status-good/10 blur-xl pointer-events-none" />
            <div className="relative flex items-center gap-1.5 text-xs font-medium text-status-good">
              <Radio size={13} className="animate-pulse" />
              Live demo
            </div>
            <p className="relative text-xs text-ink-muted mt-1.5 leading-relaxed">
              Activity here is simulated automatically every ~2 min via a
              scheduled Supabase Edge Function — not a mock.
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-ink-muted hover:bg-surface-sunken transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
  collapsed: boolean;
}) {
  return (
    <button
      title={collapsed ? label : undefined}
      className={clsx(
        "group relative w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-brand/10 text-brand font-medium"
          : "text-ink-secondary hover:bg-surface-sunken cursor-default",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-brand" />
      )}
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
