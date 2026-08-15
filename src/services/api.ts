import { Account, Category, Transaction, TransactionType, Budget, SavingsGoal, CreditCardData } from '../types';

const USE_MOCK_FALLBACK = true;

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Moradia', hexColor: '#8b5cf6' }, // violet-500
  { id: 'cat-2', name: 'Alimentação', hexColor: '#f59e0b' }, // amber-500
  { id: 'cat-3', name: 'Transporte', hexColor: '#3b82f6' }, // blue-500
  { id: 'cat-4', name: 'Salário', hexColor: '#10b981' }, // emerald-500
  { id: 'cat-5', name: 'Lazer', hexColor: '#ec4899' }, // pink-500
];

const mockAccounts: Account[] = [
  { id: 'acc-1', name: 'Conta Principal', balance: 14500.50 },
  { id: 'acc-2', name: 'Investimentos', balance: 45000.00 },
];

let mockTransactions: Transaction[] = [
  { id: 'tx-1', amount: 8500.00, description: 'Salário Mensal', date: new Date().toISOString(), type: TransactionType.Income, categoryId: 'cat-4', accountId: 'acc-1' },
  { id: 'tx-2', amount: 2500.00, description: 'Aluguel e Condomínio', date: new Date(Date.now() - 86400000).toISOString(), type: TransactionType.Expense, categoryId: 'cat-1', accountId: 'acc-1' },
  { id: 'tx-3', amount: 1250.00, description: 'Mercado Mensal', date: new Date(Date.now() - 172800000).toISOString(), type: TransactionType.Expense, categoryId: 'cat-2', accountId: 'acc-1' },
  { id: 'tx-4', amount: 385.00, description: 'Combustível', date: new Date(Date.now() - 259200000).toISOString(), type: TransactionType.Expense, categoryId: 'cat-3', accountId: 'acc-1' },
  { id: 'tx-5', amount: 450.00, description: 'Restaurante', date: new Date(Date.now() - 400000000).toISOString(), type: TransactionType.Expense, categoryId: 'cat-5', accountId: 'acc-1' },
];

const mockBudgets: Budget[] = [
  { id: 'b-1', categoryId: 'cat-1', limitAmount: 3000, spentAmount: 2500 },
  { id: 'b-2', categoryId: 'cat-2', limitAmount: 1500, spentAmount: 1250 }, // 83% (yellow)
  { id: 'b-3', categoryId: 'cat-5', limitAmount: 400, spentAmount: 450 }, // 112% (red)
];

const mockGoals: SavingsGoal[] = [
  { id: 'g-1', name: 'Reserva de Emergência', targetAmount: 50000, currentAmount: 32000, deadline: '2027-12-31' },
  { id: 'g-2', name: 'Viagem Japão', targetAmount: 25000, currentAmount: 8500, deadline: '2028-06-15' }
];

const mockCards: CreditCardData[] = [
  { id: 'cc-1', name: 'Black Infinite', limit: 35000, used: 4250, closingDay: 25, dueDay: 5 },
  { id: 'cc-2', name: 'Platinum', limit: 12000, used: 10500, closingDay: 10, dueDay: 20 },
];

export const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    if (USE_MOCK_FALLBACK) return [...mockTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const res = await fetch('/api/transactions');
    if (!res.ok) throw new Error('Falha ao buscar transações');
    return res.json();
  },

  createTransaction: async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    if (USE_MOCK_FALLBACK) {
      const newTx = { ...data, id: `tx-${Date.now()}` };
      mockTransactions.push(newTx);
      return newTx;
    }
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar transação');
    return res.json();
  },

  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK_FALLBACK) return mockCategories;
    const res = await fetch('/api/categories');
    return res.json();
  },

  getAccounts: async (): Promise<Account[]> => {
    if (USE_MOCK_FALLBACK) return mockAccounts;
    const res = await fetch('/api/accounts');
    return res.json();
  },

  getBudgets: async (): Promise<Budget[]> => {
    if (USE_MOCK_FALLBACK) return mockBudgets;
    return [];
  },

  getSavingsGoals: async (): Promise<SavingsGoal[]> => {
    if (USE_MOCK_FALLBACK) return mockGoals;
    return [];
  },
  
  getCreditCards: async (): Promise<CreditCardData[]> => {
    if (USE_MOCK_FALLBACK) return mockCards;
    return [];
  }
};
