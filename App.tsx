import React, { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Receipt, Target, Settings, Plus, Trash2, Sparkles, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { InputSection } from './components/InputSection';
import { Currency, ExpenseItem, CategoryBudget, FinancialGoal, CATEGORIES } from './types';

const STORAGE_KEY = 'smart-budget-tracker:v3';
type View = 'dashboard' | 'transactions' | 'budgets' | 'goals';

const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState<Currency>(Currency.PKR);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [goal, setGoal] = useState('');
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      setIncome(data.income ?? 0);
      setCurrency(data.currency ?? Currency.PKR);
      setExpenses(data.expenses ?? []);
      setGoal(data.goal ?? '');
      setBudgets(data.budgets ?? []);
      setFinancialGoals(data.financialGoals ?? []);
    } catch (error) {
      console.error('Unable to restore budget:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      income, currency, expenses, goal, budgets, financialGoals
    }));
  }, [income, currency, expenses, goal, budgets, financialGoals]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(currentMonth)),
    [expenses]
  );
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = income - totalSpent;
  const spentPercent = income ? (totalSpent / income) * 100 : 0;

  const filteredTransactions = expenses.filter((expense) => {
    const matchesSearch = !search || expense.category.toLowerCase().includes(search.toLowerCase()) || expense.note?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addGoal = () => {
    const name = window.prompt('Goal name');
    if (!name) return;
    const target = Number(window.prompt('Target amount'));
    if (!Number.isFinite(target) || target <= 0) return;
    setFinancialGoals((current) => [...current, { name, target, saved: 0 }]);
  };

  const nav = [
    { id: 'dashboard' as View, label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions' as View, label: 'Transactions', icon: Receipt },
    { id: 'budgets' as View, label: 'Budgets', icon: Settings },
    { id: 'goals' as View, label: 'Goals', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Wallet size={21} /></div>
            <span className="text-xl font-bold text-slate-900">Smart Budget</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setView(id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${view === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon size={17} />{label}
              </button>
            ))}
          </nav>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">This month</p>
            <p className="font-semibold text-slate-800">{currency}{remaining.toLocaleString()} left</p>
          </div>
        </div>
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex gap-1 overflow-x-auto">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)} className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap ${view === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {view === 'dashboard' && (
          <Dashboard income={income} currency={currency} expenses={expenses} goal={goal} budgets={budgets} financialGoals={financialGoals} />
        )}

        {view === 'transactions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
              <p className="text-slate-500 mt-1">Search and manage every expense you've recorded.</p>
            </div>
            <InputSection income={income} setIncome={setIncome} currency={currency} setCurrency={setCurrency} expenses={expenses} setExpenses={setExpenses} goal={goal} setGoal={setGoal} compact />
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col md:flex-row gap-3 mb-5">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className="flex-1 border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-slate-300 rounded-lg p-2.5">
                  <option>All</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                {filteredTransactions.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-100">
                    <div><p className="font-medium text-slate-800">{expense.category}</p><p className="text-xs text-slate-400">{expense.date}{expense.note ? ' · ' + expense.note : ''}</p></div>
                    <div className="flex items-center gap-4"><strong>{currency}{expense.amount.toLocaleString()}</strong><button onClick={() => setExpenses((x) => x.filter((e) => e.id !== expense.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={17} /></button></div>
                  </div>
                ))}
                {!filteredTransactions.length && <p className="text-center py-10 text-slate-400">No transactions match your filters.</p>}
              </div>
            </div>
          </div>
        )}

        {view === 'budgets' && (
          <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-slate-900">Category Budgets</h1><p className="text-slate-500 mt-1">Set spending limits and see which categories need attention.</p></div>
            <div className="grid md:grid-cols-2 gap-4">
              {CATEGORIES.map((category) => {
                const budget = budgets.find((b) => b.category === category);
                const spent = monthExpenses.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0);
                const limit = budget?.limit ?? 0;
                const percent = limit ? (spent / limit) * 100 : 0;
                return <div key={category} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex justify-between gap-3 mb-3"><div><p className="font-semibold text-slate-800">{category}</p><p className="text-sm text-slate-500">{currency}{spent.toLocaleString()} spent</p></div><input type="number" min="0" value={limit || ''} placeholder="Set limit" onChange={(e) => { const value = Number(e.target.value) || 0; setBudgets((current) => [...current.filter((b) => b.category !== category), ...(value > 0 ? [{ category, limit: value }] : [])]); }} className="w-28 border rounded-lg p-2 text-right" /></div>
                  {limit > 0 && <><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${percent > 100 ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: Math.min(100, percent) + '%' }} /></div><p className="text-xs text-slate-500 mt-2">{percent.toFixed(0)}% of {currency}{limit.toLocaleString()} used</p></>}
                </div>;
              })}
            </div>
          </div>
        )}

        {view === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold text-slate-900">Financial Goals</h1><p className="text-slate-500 mt-1">Turn your savings targets into measurable progress.</p></div><button onClick={addGoal} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2"><Plus size={17} /> New goal</button></div>
            {financialGoals.length === 0 ? <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center"><Target className="mx-auto text-slate-300 mb-3" size={40}/><h3 className="font-semibold text-slate-700">No goals yet</h3><p className="text-slate-500 text-sm mt-1">Create a goal to start tracking your progress.</p></div> : <div className="grid md:grid-cols-2 gap-4">{financialGoals.map((g, i) => { const percent = Math.min(100, (g.saved / g.target) * 100); return <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6"><div className="flex justify-between"><div><h3 className="font-bold text-slate-800">{g.name}</h3><p className="text-sm text-slate-500">{currency}{g.saved.toLocaleString()} of {currency}{g.target.toLocaleString()}</p></div><button onClick={() => setFinancialGoals((x) => x.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500"><Trash2 size={17}/></button></div><div className="h-3 bg-slate-100 rounded-full mt-5 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: percent + '%'}}/></div><div className="flex justify-between mt-2 text-xs text-slate-500"><span>{percent.toFixed(0)}% complete</span><span>{currency}{Math.max(0, g.target-g.saved).toLocaleString()} remaining</span></div><div className="mt-5 flex gap-2"><input type="number" placeholder="Add saved amount" className="flex-1 border rounded-lg p-2" onKeyDown={(e) => { if (e.key === 'Enter') { const value=Number((e.target as HTMLInputElement).value); if(value>0) setFinancialGoals((x)=>x.map((item,idx)=>idx===i?{...item,saved:Math.min(item.target,item.saved+value)}:item)); (e.target as HTMLInputElement).value=''; }}}/><span className="text-xs self-center text-slate-400">Press Enter</span></div></div>})}</div>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
