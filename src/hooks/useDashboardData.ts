import { useMemo } from "react";
import { useRealtimeTable } from "./useRealtimeTable";
import type { Account, Budget, Goal, Transaction } from "../types";
import {
  computeBudgetUsage,
  computeCategoryBreakdown,
  computeDailySeries,
  computeFinancialHealth,
  computeTopMerchants,
  computeTotals,
  percentDelta,
  withinLastDays,
} from "../lib/metrics";

export type Period = 7 | 30;

export function useDashboardData(period: Period) {
  const { rows: accounts, loading: accountsLoading } = useRealtimeTable<Account>(
    "accounts",
    "created_at",
  );
  const { rows: transactions, loading: transactionsLoading } =
    useRealtimeTable<Transaction>("transactions", "occurred_at", 1000);
  const { rows: budgets, loading: budgetsLoading } = useRealtimeTable<Budget>(
    "budgets",
    "period",
  );
  const { rows: goals, loading: goalsLoading } = useRealtimeTable<Goal>(
    "goals",
    "created_at",
  );

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
      ),
    [transactions],
  );

  const currentPeriodTx = useMemo(
    () => withinLastDays(sortedTransactions, period),
    [sortedTransactions, period],
  );
  const priorPeriodTx = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - period);
    return withinLastDays(sortedTransactions, period, from);
  }, [sortedTransactions, period]);

  const monthTx = useMemo(() => withinLastDays(sortedTransactions, 30), [
    sortedTransactions,
  ]);

  const totals = useMemo(() => computeTotals(currentPeriodTx), [currentPeriodTx]);
  const priorTotals = useMemo(() => computeTotals(priorPeriodTx), [priorPeriodTx]);

  const deltas = useMemo(
    () => ({
      income: percentDelta(totals.income, priorTotals.income),
      expenses: percentDelta(totals.expenses, priorTotals.expenses),
      saved: percentDelta(totals.saved, priorTotals.saved),
    }),
    [totals, priorTotals],
  );

  const dailySeries = useMemo(
    () => computeDailySeries(sortedTransactions, period),
    [sortedTransactions, period],
  );

  const categoryBreakdown = useMemo(
    () => computeCategoryBreakdown(monthTx),
    [monthTx],
  );

  const budgetUsage = useMemo(
    () => computeBudgetUsage(budgets, monthTx),
    [budgets, monthTx],
  );

  const monthlyLimitTotal = useMemo(
    () => budgets.reduce((sum, b) => sum + b.monthly_limit, 0),
    [budgets],
  );
  const monthlySpentTotal = useMemo(
    () => budgetUsage.reduce((sum, b) => sum + b.spent, 0),
    [budgetUsage],
  );

  const financialHealth = useMemo(
    () => computeFinancialHealth(computeTotals(monthTx), budgetUsage),
    [monthTx, budgetUsage],
  );

  const topMerchants = useMemo(
    () => computeTopMerchants(monthTx, 5),
    [monthTx],
  );

  const primaryAccount = useMemo(
    () => accounts.find((a) => a.type === "checking") ?? accounts[0],
    [accounts],
  );

  const topInsight = useMemo(() => {
    if (categoryBreakdown.length === 0 || categoryBreakdown[0].amount === 0) {
      return null;
    }
    const top = categoryBreakdown[0];
    return {
      category: top.category,
      percent: top.percent,
    };
  }, [categoryBreakdown]);

  const loading =
    accountsLoading || transactionsLoading || budgetsLoading || goalsLoading;

  return {
    accounts,
    transactions: sortedTransactions,
    budgets,
    goals,
    loading,
    totals,
    deltas,
    dailySeries,
    categoryBreakdown,
    budgetUsage,
    monthlyLimitTotal,
    monthlySpentTotal,
    financialHealth,
    topMerchants,
    primaryAccount,
    topInsight,
  };
}
