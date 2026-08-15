import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Calculator } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulatorModal({ isOpen, onClose }: SimulatorModalProps) {
  const [principal, setPrincipal] = useState('50000');
  const [rate, setRate] = useState('1.5');
  const [months, setMonths] = useState('36');

  // Basic PMT Formula
  // PMT = P * (r(1+r)^n) / ((1+r)^n - 1)
  const calculate = () => {
    const p = parseFloat(principal);
    const r = (parseFloat(rate) / 100);
    const n = parseInt(months, 10);
    if (!p || !r || !n) return { pmt: 0, total: 0, interest: 0 };
    
    const pmt = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = pmt * n;
    return {
      pmt,
      total,
      interest: total - p
    };
  };

  const results = calculate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Simulador de Financiamento">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
          <Calculator className="w-6 h-6 shrink-0" />
          <p className="text-sm">Simule rapidamente o impacto de juros compostos em empréstimos e financiamentos.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Valor do Empréstimo (R$)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Taxa Mensal (%)</label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Prazo (Meses)</label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Parcela Mensal (Price)</span>
            <span className="font-bold text-lg text-slate-50">{formatCurrency(results.pmt)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total a Pagar</span>
            <span className="font-medium text-slate-200">{formatCurrency(results.total)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total de Juros</span>
            <span className="font-medium text-rose-400">{formatCurrency(results.interest)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-50 font-medium rounded-lg transition-colors border border-slate-700"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
