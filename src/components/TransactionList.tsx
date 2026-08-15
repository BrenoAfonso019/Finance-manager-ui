import React from 'react';
import { Transaction, TransactionType, Category, Account } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

export function TransactionList({ transactions, categories, accounts }: TransactionListProps) {
  
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Sem categoria';
  const getCategoryColor = (id: string) => categories.find(c => c.id === id)?.hexColor || '#475569';
  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Conta desconhecida';

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.Income: return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case TransactionType.Expense: return <ArrowDownLeft className="w-4 h-4 text-rose-500" />;
      case TransactionType.Transfer: return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-50">Transações Recentes</h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          Nenhuma transação registrada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Conta</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                        {getTypeIcon(t.type)}
                      </div>
                      <span className="font-medium text-slate-200">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: getCategoryColor(t.categoryId) }}
                      />
                      {getCategoryName(t.categoryId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getAccountName(t.accountId)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(t.date)}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${
                    t.type === TransactionType.Income ? 'text-emerald-400' : 
                    t.type === TransactionType.Expense ? 'text-slate-200' : 'text-blue-400'
                  }`}>
                    {t.type === TransactionType.Income ? '+' : t.type === TransactionType.Expense ? '-' : ''}
                    {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
