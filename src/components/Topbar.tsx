import { useState } from "react";
import { Bell, Search, Sparkles, Moon, Sun, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { initials } from "../lib/format";

interface TopbarProps {
  dark: boolean;
  onToggleDark: () => void;
  notificationCount: number;
  onClearNotifications: () => void;
}

export function Topbar({
  dark,
  onToggleDark,
  notificationCount,
  onClearNotifications,
}: TopbarProps) {
  const [simulating, setSimulating] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  async function handleSimulate() {
    if (simulating) return;
    setSimulating(true);
    try {
      await supabase.functions.invoke("simulate-activity");
    } finally {
      setSimulating(false);
    }
  }

  return (
    <header className="h-16 shrink-0 border-b border-border-hairline bg-surface-1 flex items-center gap-4 px-6">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Quick search"
          className="w-full rounded-lg border border-border-hairline bg-surface-sunken pl-9 pr-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted outline-none focus:border-brand/50 transition-colors"
        />
      </div>

      <div className="flex-1" />

      <button
        onClick={onToggleDark}
        className="w-9 h-9 rounded-lg border border-border-hairline flex items-center justify-center text-ink-secondary hover:bg-surface-sunken transition-colors"
        title="Toggle theme"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative">
        <button
          onClick={() => {
            setShowNotifications((s) => !s);
            if (!showNotifications) onClearNotifications();
          }}
          className="relative w-9 h-9 rounded-lg border border-border-hairline flex items-center justify-center text-ink-secondary hover:bg-surface-sunken transition-colors"
          title="Notifications"
        >
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-expense text-white text-[10px] font-medium flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border-hairline bg-surface-1 shadow-lg p-3 z-20 text-xs text-ink-secondary">
            New transactions land here in real time as the demo simulator
            (or your own click on &ldquo;Simulate&rdquo;) inserts them into
            Supabase.
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pl-2 border-l border-border-hairline">
        <div className="w-8 h-8 rounded-full bg-brand/15 text-brand flex items-center justify-center text-xs font-semibold">
          {initials("Demo User")}
        </div>
        <div className="hidden sm:block leading-tight">
          <p className="text-xs font-medium text-ink-primary">Demo User</p>
          <p className="text-[11px] text-ink-muted">Portfolio preview</p>
        </div>
      </div>

      <button
        onClick={handleSimulate}
        disabled={simulating}
        className="flex items-center gap-1.5 rounded-lg bg-brand text-white text-sm font-medium px-3.5 py-2 hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-60"
      >
        {simulating ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Sparkles size={15} />
        )}
        Simulate transaction
      </button>
    </header>
  );
}
