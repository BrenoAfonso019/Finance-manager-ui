import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { TransactionType, Category, Account } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  categories: Category[];
  accounts: Account[];
}

export function TransactionModal({ isOpen, onClose, onSave, categories, accounts }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId || !accountId) return;

    setIsSubmitting(true);
    try {
      await onSave({
        type,
        amount: parseFloat(amount),
        description,
        date: new Date(date).toISOString(),
        categoryId,
        accountId
      });
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo Selector */}
        <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setType(TransactionType.Expense)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === TransactionType.Expense ? 'bg-slate-800 shadow-sm text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.Income)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === TransactionType.Income ? 'bg-slate-800 shadow-sm text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Receita
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Valor</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            placeholder="Ex: Aluguel"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Categoria</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            >
              <option value="" disabled>Selecione</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Conta</label>
          <select
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          >
            <option value="" disabled>Selecione a conta</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-500 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all disabled:opacity-70"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
