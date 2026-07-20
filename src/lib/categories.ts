import type { Category } from "../types";

export const SPEND_CATEGORIES: Category[] = [
  "Housing",
  "Debt payments",
  "Food",
  "Transportation",
  "Healthcare",
  "Investments",
  "Other",
];

export const CATEGORY_COLOR_VAR: Record<Category, string> = {
  Income: "var(--income)",
  Housing: "var(--cat-housing)",
  "Debt payments": "var(--cat-debt)",
  Food: "var(--cat-food)",
  Transportation: "var(--cat-transport)",
  Healthcare: "var(--cat-healthcare)",
  Investments: "var(--cat-investments)",
  Other: "var(--cat-other)",
};

export const CATEGORY_CLASS: Record<Category, string> = {
  Income: "bg-income",
  Housing: "bg-cat-housing",
  "Debt payments": "bg-cat-debt",
  Food: "bg-cat-food",
  Transportation: "bg-cat-transport",
  Healthcare: "bg-cat-healthcare",
  Investments: "bg-cat-investments",
  Other: "bg-cat-other",
};
