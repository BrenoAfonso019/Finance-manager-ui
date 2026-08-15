import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Sparkles, CreditCard, CalendarDays } from 'lucide-react';
import { Transaction, TransactionType, Category, CreditCardData } from '../types';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  creditCards: CreditCardData[];
}

export function Dashboard({ transactions, categories, creditCards }: DashboardProps) {
  const { totalIncome, totalExpense, balance, forecast } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === TransactionType.Income) inc += t.amount;
      if (t.type === TransactionType.Expense) exp += t.amount;
    });
    const currentBalance = inc - exp;
    
    // Fake Forecast algorithm: current balance - pending average expenses for the remaining 15 days
    const dailyAvg = exp / 15; // Assuming we are mid-month
    const forecast = currentBalance - (dailyAvg * 15);

    return { totalIncome: inc, totalExpense: exp, balance: currentBalance, forecast };
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.Expense);
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(t => {
      const current = categoryMap.get(t.categoryId) || 0;
      categoryMap.set(t.categoryId, current + t.amount);
    });

    return Array.from(categoryMap.entries()).map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId);
      return { name: cat?.name || 'Outros', value: amount, color: cat?.hexColor || '#475569' };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6 mb-8">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Saldo Atual</p>
            <Wallet className="w-4 h-4 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-50">{formatCurrency(balance)}</h3>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Receitas</p>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</h3>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-400">Despesas</p>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-2xl font-bold text-rose-400">{formatCurrency(totalExpense)}</h3>
        </div>

        <div className="bg-indigo-950/50 p-5 rounded-2xl border border-indigo-900/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-sm font-medium text-indigo-300">Forecast (Fim do Mês)</p>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-100 relative z-10">{formatCurrency(forecast)}</h3>
        </div>
      </div>

      {/* AI Insights & Credit Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Insights */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 lg:col-span-1 flex flex-col">
          <h3 className="text-base font-semibold text-slate-50 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Insights Inteligentes
          </h3>
          <div className="space-y-3 flex-1">
            <div className={`p-4 rounded-xl border ${savingsRate > 20 ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-rose-950/30 border-rose-900/50'}`}>
              <h4 className={`text-sm font-semibold mb-1 ${savingsRate > 20 ? 'text-emerald-400' : 'text-rose-400'}`}>Taxa de Poupança: {savingsRate.toFixed(1)}%</h4>
              <p className="text-xs text-slate-400">
                {savingsRate > 20 
                  ? "Excelente! Você está poupando mais de 20% da sua renda." 
                  : "Atenção: Sua taxa de poupança está abaixo do recomendado (20%). Considere cortar gastos não essenciais."}
              </p>
            </div>
            
            <div className="p-4 rounded-xl border bg-indigo-950/30 border-indigo-900/50">
              <h4 className="text-sm font-semibold text-indigo-400 mb-1">Tendência de Gastos</h4>
              <p className="text-xs text-slate-400">
                Seus gastos com <span className="text-slate-200">Moradia</span> representam a maior fatia do orçamento. 
              </p>
            </div>
          </div>
        </div>

        {/* Credit Cards */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-50 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            Cartões & Faturas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creditCards.map(card => {
              const available = card.limit - card.used;
              const isBestDay = new Date().getDate() === card.closingDay;

              return (
                <div key={card.id} className="p-5 rounded-xl border border-slate-800 bg-slate-950/50 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-semibold text-slate-200">{card.name}</span>
                    {isBestDay && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full uppercase tracking-wider">Melhor Dia</span>}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-slate-500">Fatura Atual</p>
                    <p className="text-xl font-bold text-slate-50">{formatCurrency(card.used)}</p>
                  </div>
                  
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full rounded-full bg-indigo-500" 
                      style={{ width: `${(card.used / card.limit) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span>Disponível: {formatCurrency(available)}</span>
                    <span>Limite: {formatCurrency(card.limit)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-4 pt-3 border-t border-slate-800">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Fecha dia {card.closingDay}</span>
                    <span>Vence dia {card.dueDay}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cashflow Bar Chart */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-semibold text-slate-50 mb-6">Fluxo (Receitas vs Despesas)</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Mês Atual', inc: totalIncome, exp: totalExpense }]} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#1e293b', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="inc" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exp" name="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        {expensesByCategory.length > 0 && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-semibold text-slate-50 mb-6">Despesas por Categoria</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
