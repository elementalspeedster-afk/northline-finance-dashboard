import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { BalanceOverviewChart } from "./components/BalanceOverviewChart";
import { StatStack } from "./components/StatStack";
import { SpendingLimitCard } from "./components/SpendingLimitCard";
import { InsightCard } from "./components/InsightCard";
import { CostAnalysisChart } from "./components/CostAnalysisChart";
import { FinancialHealthGauge } from "./components/FinancialHealthGauge";
import { GoalTracker } from "./components/GoalTracker";
import { CardWidget } from "./components/CardWidget";
import { TransactionHistoryList } from "./components/TransactionHistoryList";
import { useDashboardData, type Period } from "./hooks/useDashboardData";

function usePrefersDark() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark] as const;
}

function App() {
  const [dark, setDark] = usePrefersDark();
  const [period, setPeriod] = useState<Period>(7);
  const data = useDashboardData(period);

  const [notificationCount, setNotificationCount] = useState(0);
  const prevCount = useRef<number | null>(null);

  useEffect(() => {
    if (data.loading) return;
    if (prevCount.current === null) {
      prevCount.current = data.transactions.length;
      return;
    }
    if (data.transactions.length > prevCount.current) {
      setNotificationCount((n) => n + (data.transactions.length - prevCount.current!));
    }
    prevCount.current = data.transactions.length;
  }, [data.transactions.length, data.loading]);

  return (
    <div className="flex h-screen bg-surface-page text-ink-primary overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          notificationCount={notificationCount}
          onClearNotifications={() => setNotificationCount(0)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col xl:flex-row gap-5 max-w-[1400px] mx-auto">
            <div className="flex-1 min-w-0 space-y-5">
              <div className="flex flex-col lg:flex-row gap-5">
                <BalanceOverviewChart
                  series={data.dailySeries}
                  period={period}
                  onPeriodChange={setPeriod}
                  saved={data.totals.saved}
                />
                <StatStack totals={data.totals} deltas={data.deltas} period={period} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SpendingLimitCard
                  spent={data.monthlySpentTotal}
                  limit={data.monthlyLimitTotal}
                />
                <InsightCard budgetUsage={data.budgetUsage} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <CostAnalysisChart
                  breakdown={data.categoryBreakdown}
                  total={data.categoryBreakdown.reduce((s, c) => s + c.amount, 0)}
                />
                <FinancialHealthGauge health={data.financialHealth} />
                <GoalTracker goals={data.goals} />
              </div>
            </div>

            <aside className="w-full xl:w-[340px] shrink-0 flex flex-col gap-5">
              <CardWidget account={data.primaryAccount} topMerchants={data.topMerchants} />
              <TransactionHistoryList transactions={data.transactions} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
