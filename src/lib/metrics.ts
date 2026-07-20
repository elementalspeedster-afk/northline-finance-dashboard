import type { Budget, Category, Transaction } from "../types";
import { SPEND_CATEGORIES } from "./categories";

export interface DailyPoint {
  dateKey: string;
  date: Date;
  income: number;
  expenses: number;
  savings: number;
}

export interface Totals {
  income: number;
  expenses: number;
  saved: number;
}

export interface CategorySlice {
  category: Category;
  amount: number;
  percent: number;
}

export interface MerchantFrequency {
  merchant: string;
  count: number;
  total: number;
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function withinLastDays(
  transactions: Transaction[],
  days: number,
  from: Date = new Date(),
): Transaction[] {
  const cutoff = new Date(from);
  cutoff.setDate(cutoff.getDate() - days);
  return transactions.filter((t) => new Date(t.occurred_at) >= cutoff);
}

export function computeTotals(transactions: Transaction[]): Totals {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (t.amount > 0) income += t.amount;
    else expenses += -t.amount;
  }
  return { income, expenses, saved: income - expenses };
}

export function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function computeDailySeries(
  transactions: Transaction[],
  days: number,
  now: Date = new Date(),
): DailyPoint[] {
  const buckets = new Map<string, DailyPoint>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    buckets.set(key, { dateKey: key, date: d, income: 0, expenses: 0, savings: 0 });
  }

  for (const t of transactions) {
    const key = dateKey(new Date(t.occurred_at));
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (t.amount > 0) bucket.income += t.amount;
    else bucket.expenses += -t.amount;
  }

  const points = Array.from(buckets.values());
  for (const p of points) p.savings = p.income - p.expenses;
  return points;
}

export function computeCategoryBreakdown(
  transactions: Transaction[],
): CategorySlice[] {
  const sums = new Map<Category, number>();
  let total = 0;
  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const amt = -t.amount;
    sums.set(t.category, (sums.get(t.category) ?? 0) + amt);
    total += amt;
  }
  return SPEND_CATEGORIES.map((category) => {
    const amount = sums.get(category) ?? 0;
    return { category, amount, percent: total > 0 ? (amount / total) * 100 : 0 };
  }).sort((a, b) => b.amount - a.amount);
}

export function computeTopMerchants(
  transactions: Transaction[],
  limit = 5,
): MerchantFrequency[] {
  const map = new Map<string, MerchantFrequency>();
  for (const t of transactions) {
    const entry = map.get(t.merchant) ?? { merchant: t.merchant, count: 0, total: 0 };
    entry.count += 1;
    entry.total += Math.abs(t.amount);
    map.set(t.merchant, entry);
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export interface BudgetUsage {
  category: Category;
  limit: number;
  spent: number;
  percent: number;
}

export function computeBudgetUsage(
  budgets: Budget[],
  monthTransactions: Transaction[],
): BudgetUsage[] {
  const spentByCategory = new Map<Category, number>();
  for (const t of monthTransactions) {
    if (t.amount >= 0) continue;
    spentByCategory.set(t.category, (spentByCategory.get(t.category) ?? 0) + -t.amount);
  }
  return budgets.map((b) => {
    const spent = spentByCategory.get(b.category) ?? 0;
    return {
      category: b.category,
      limit: b.monthly_limit,
      spent,
      percent: b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0,
    };
  });
}

export interface FinancialHealth {
  score: number;
  savingsRate: number;
  budgetAdherence: number;
}

export function computeFinancialHealth(
  totals: Totals,
  budgetUsage: BudgetUsage[],
): FinancialHealth {
  const savingsRate = totals.income > 0 ? totals.saved / totals.income : 0;
  const savingsScore = Math.max(0, Math.min(1, savingsRate / 0.3));

  const overBudgetCount = budgetUsage.filter((b) => b.percent > 100).length;
  const budgetAdherence =
    budgetUsage.length > 0
      ? Math.max(0, 1 - overBudgetCount / budgetUsage.length)
      : 1;

  const score = Math.round((savingsScore * 0.65 + budgetAdherence * 0.35) * 100);
  return {
    score: Math.max(0, Math.min(100, score)),
    savingsRate: savingsRate * 100,
    budgetAdherence: budgetAdherence * 100,
  };
}
