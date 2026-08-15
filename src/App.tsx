import React, { useEffect, useState } from 'react';
import { Plus, LayoutDashboard, Settings, CreditCard, Bell, Target, Download, Calculator, Menu, TrendingUp } from 'lucide-react';
import { api } from './services/api';
import { Transaction, Category, Account, Budget, SavingsGoal, CreditCardData } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetsPanel } from './components/BudgetsPanel';
import { SimulatorModal } from './components/SimulatorModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budgets' | 'transactions'>('dashboard');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [txs, cats, accs, bdgs, gls, cards] = await Promise.all([
          api.getTransactions(),
          api.getCategories(),
          api.getAccounts(),
          api.getBudgets(),
          api.getSavingsGoals(),
          api.getCreditCards()
        ]);
        setTransactions(txs);
        setCategories(cats);
        setAccounts(accs);
        setBudgets(bdgs);
        setGoals(gls);
        setCreditCards(cards);
      } catch (error) {
        console.error("Falha ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddTransaction = async (data: Omit<Transaction, 'id'>) => {
    try {
      const newTx = await api.createTransaction(data);
      setTransactions(prev => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Falha ao salvar transação:", error);
    }
  };

  const handleExportCSV = () => {
    const headers = "Data,Descrição,Valor,Tipo,ID Categoria,ID Conta\n";
    const rows = transactions.map(t => `${t.date},"${t.description}",${t.amount},${t.type},${t.categoryId},${t.accountId}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transacoes_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-300 selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            FinanceManager
          </h1>
        </div>
        
        <div className="px-6 pb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Menu Principal</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'transactions' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <CreditCard className="w-5 h-5" />
            Transações
          </button>
          <button 
            onClick={() => setActiveTab('budgets')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'budgets' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Target className="w-5 h-5" />
            Orçamentos & Metas
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button 
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg font-medium transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Simulador
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg font-medium transition-colors">
              <Settings className="w-5 h-5" />
              Configurações
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
              JS
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">João Silva</p>
              <p className="text-xs text-slate-500">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10 sticky top-0">
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-400 hover:text-slate-200">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-50 capitalize">
              {activeTab === 'dashboard' ? 'Visão Geral' : activeTab === 'budgets' ? 'Orçamentos & Metas' : 'Transações'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Period Switcher */}
            <div className="hidden md:flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button onClick={() => setPeriod('month')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === 'month' ? 'bg-slate-800 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}>Mês</button>
              <button onClick={() => setPeriod('quarter')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === 'quarter' ? 'bg-slate-800 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}>Trimestre</button>
              <button onClick={() => setPeriod('year')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === 'year' ? 'bg-slate-800 text-slate-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}>Ano</button>
            </div>

            <button onClick={handleExportCSV} title="Exportar CSV" className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50">
              <Download className="w-5 h-5" />
            </button>

            <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50 relative">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              <Bell className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Transação</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <>
                <Dashboard transactions={transactions} categories={categories} creditCards={creditCards} />
                <TransactionList transactions={transactions.slice(0, 5)} categories={categories} accounts={accounts} />
              </>
            )}

            {activeTab === 'budgets' && (
              <BudgetsPanel budgets={budgets} goals={goals} categories={categories} />
            )}

            {activeTab === 'transactions' && (
              <TransactionList transactions={transactions} categories={categories} accounts={accounts} />
            )}
            
          </div>
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
        categories={categories}
        accounts={accounts}
      />

      <SimulatorModal 
        isOpen={isSimulatorOpen} 
        onClose={() => setIsSimulatorOpen(false)} 
      />
    </div>
  );
}
