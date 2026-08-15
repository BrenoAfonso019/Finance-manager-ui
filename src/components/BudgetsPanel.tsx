import React from 'react';
import { Budget, SavingsGoal, Category } from '../types';
import { formatCurrency } from '../lib/utils';
import { Target, AlertTriangle } from 'lucide-react';

interface BudgetsPanelProps {
  budgets: Budget[];
  goals: SavingsGoal[];
  categories: Category[];
}

export function BudgetsPanel({ budgets, goals, categories }: BudgetsPanelProps) {
  const getCategory = (id: string) => categories.find(c => c.id === id);

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-rose-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Budgets Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-slate-800 rounded-lg text-indigo-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Limites por Categoria</h3>
              <p className="text-sm text-slate-400">Controle seus gastos mensais.</p>
            </div>
          </div>
          
          <div className="space-y-5">
            {budgets.map(budget => {
              const cat = getCategory(budget.categoryId);
              const percent = Math.min((budget.spentAmount / budget.limitAmount) * 100, 100);
              const isOver = budget.spentAmount > budget.limitAmount;

              return (
                <div key={budget.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-200">{cat?.name || 'Desconhecida'}</span>
                    <div className="text-xs text-slate-400">
                      <span className={isOver ? 'text-rose-400 font-medium' : 'text-slate-200'}>
                        {formatCurrency(budget.spentAmount)}
                      </span>
                      {' / '}{formatCurrency(budget.limitAmount)}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percent)}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {isOver && (
                    <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      Você estourou este orçamento.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-slate-800 rounded-lg text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Metas de Economia</h3>
              <p className="text-sm text-slate-400">Acompanhe seus objetivos.</p>
            </div>
          </div>

          <div className="space-y-6">
            {goals.map(goal => {
              const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const dateStr = new Date(goal.deadline).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
              
              return (
                <div key={goal.id} className="p-4 rounded-xl border border-slate-800 bg-slate-800/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-slate-200">{goal.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Até {dateStr}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{percent.toFixed(1)}%</span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>Meta: {formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
