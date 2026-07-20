export type AccountType = "checking" | "savings" | "credit";

export type Category =
  | "Income"
  | "Housing"
  | "Debt payments"
  | "Food"
  | "Transportation"
  | "Healthcare"
  | "Investments"
  | "Other";

export type TransactionStatus = "completed" | "pending";

export type GoalTerm = "short" | "long";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  last_four: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  occurred_at: string;
  description: string;
  merchant: string;
  category: Category;
  amount: number;
  status: TransactionStatus;
  created_at: string;
}

export interface Budget {
  id: string;
  category: Category;
  monthly_limit: number;
  period: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  target_amount: number;
  current_amount: number;
  term: GoalTerm;
  target_date: string | null;
  created_at: string;
}
