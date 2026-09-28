export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

export interface CategoryBudget {
  category: string;
  limit: number;
}

export interface FinancialGoal {
  name: string;
  target: number;
  saved: number;
  targetDate?: string;
}

export interface BudgetData {
  income: number;
  currency: string;
  expenses: ExpenseItem[];
  financialGoal: string;
}

export enum Currency {
  USD = '$',
  PKR = 'Rs.',
  EUR = '€',
  GBP = '£'
}

export const CATEGORIES = [
  "Housing (Rent/Mortgage)",
  "Utilities",
  "Groceries",
  "Transportation",
  "Insurance",
  "Healthcare",
  "Entertainment",
  "Dining Out",
  "Savings/Investments",
  "Debt Repayment",
  "Education",
  "Other"
] as const;
