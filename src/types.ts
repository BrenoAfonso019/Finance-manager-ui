export enum TransactionType {
  Income = 1,
  Expense = 2,
  Transfer = 3,
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO Date String
  type: TransactionType;
  categoryId: string;
  accountId: string;
}

export interface Category {
  id: string;
  name: string;
  hexColor: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  limitAmount: number;
  spentAmount: number; // In a real app, this is calculated dynamically or fetched
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface CreditCardData {
  id: string;
  name: string;
  limit: number;
  used: number;
  closingDay: number;
  dueDay: number;
}
