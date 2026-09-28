import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Sparkles, ArrowRight, Wallet, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { ExpenseItem, Currency, CategoryBudget, FinancialGoal } from '../types';

interface DashboardProps {
  income: number;
  currency: Currency;
  expenses: ExpenseItem[];
  goal: string;
  budgets: CategoryBudget[];
  financialGoals: FinancialGoal[];
}

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#6366f1','#14b8a6'];

export const Dashboard: React.FC<DashboardProps> = ({ income, currency, expenses, goal, budgets, financialGoals }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const month = new Date().toISOString().slice(0, 7);
  const monthExpenses = useMemo(() => expenses.filter((e) => e.date.startsWith(month)), [expenses, month]);
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const remaining = income - total;
  const percent = income ? (total / income) * 100 : 0;

  const categoryData = useMemo(() => Object.values(monthExpenses.reduce((acc, e) => {
    acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
    acc[e.category].value += e.amount;
    return acc;
  }, {} as Record<string, {name:string;value:number}>)), [monthExpenses]);

  const weeklyData = useMemo(() => {
    const buckets = [0,0,0,0];
    monthExpenses.forEach((e) => {
      const day = Number(e.date.slice(8,10));
      buckets[Math.min(3, Math.floor((day - 1) / 7))] += e.amount;
    });
    return buckets.map((value, i) => ({ name: 'Week ' + (i + 1), value }));
  }, [monthExpenses]);

  const overspending = budgets.map((b) => {
    const spent = monthExpenses.filter((e) => e.category === b.category).reduce((s,e)=>s+e.amount,0);
    return { ...b, spent, percent: b.limit ? (spent/b.limit)*100 : 0 };
  }).filter((b) => b.percent > 80);

  const generateAdvice = () => {
    const tips: string[] = [];
    if (!income) tips.push('Start by adding your monthly income so the dashboard can calculate your available balance.');
    if (income && total > income) tips.push('Your spending is above your recorded income this month. Review your largest categories first.');
    if (income && total <= income && (remaining / income) < 0.1) tips.push('Less than 10% of your income is currently remaining. Consider tightening one or two flexible categories.');
    if (income && total <= income && (remaining / income) >= 0.3) tips.push('More than 30% of your income remains. Keep tracking so that buffer does not disappear unnoticed.');
    if (overspending.length) tips.push(overspending[0].category + ' is at ' + overspending[0].percent.toFixed(0) + '% of its budget.');
    if (categoryData.length) { const largest = [...categoryData].sort((a,b)=>b.value-a.value)[0]; tips.push(largest.name + ' is your largest spending category at ' + currency + largest.value.toLocaleString() + '.'); }
    if (goal) tips.push('Your current goal is: ' + goal + '. Connect it to a specific monthly saving amount.');
    setAdvice((tips.length ? tips : ['Add a few transactions and budgets to get more useful spending insights.']).slice(0,4).join('\\n\\n'));
  };

  useEffect(() => setAdvice(null), [income, currency, goal, expenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div><p className="text-sm font-medium text-blue-600">MONTHLY OVERVIEW</p><h1 className="text-3xl font-bold text-slate-900 mt-1">Your money at a glance</h1><p className="text-slate-500 mt-1">Track spending, protect your budget, and work toward your goals.</p></div>
        <div className="text-sm text-slate-500">{new Date().toLocaleDateString(undefined,{month:'long',year:'numeric'})}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border p-5"><p className="text-sm text-slate-500">Income</p><p className="text-2xl font-bold mt-1">{currency}{income.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl border p-5"><p className="text-sm text-slate-500">Spent</p><p className="text-2xl font-bold mt-1">{currency}{total.toLocaleString()}</p></div>
        <div className={`rounded-2xl border p-5 ${remaining >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}><p className="text-sm text-slate-500">Available</p><p className={`text-2xl font-bold mt-1 ${remaining >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{currency}{remaining.toLocaleString()}</p></div>
        <div className="bg-white rounded-2xl border p-5"><p className="text-sm text-slate-500">Savings rate</p><p className="text-2xl font-bold mt-1">{income ? Math.max(0,100-percent).toFixed(1) : '0'}%</p></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
          <div className="flex justify-between mb-5"><div><h2 className="font-bold text-slate-800">Weekly spending</h2><p className="text-sm text-slate-500">How spending is distributed across the month</p></div><TrendingUp className="text-blue-500"/></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip formatter={(v:number)=>currency+Number(v).toLocaleString()}/><Bar dataKey="value" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-slate-800 mb-4">Spending mix</h2>
          {categoryData.length ? <div className="h-60"><ResponsiveContainer><PieChart><Pie data={categoryData} dataKey="value" innerRadius={55} outerRadius={80}>{categoryData.map((x,i)=><Cell key={x.name} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={(v:number)=>currency+Number(v).toLocaleString()}/><Legend/></PieChart></ResponsiveContainer></div> : <div className="h-60 flex items-center justify-center text-slate-400 text-sm">Add transactions to see your spending mix.</div>}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between items-center mb-4"><div><h2 className="font-bold text-slate-800">Budget alerts</h2><p className="text-sm text-slate-500">Categories above 80% of their limit</p></div><AlertTriangle className="text-amber-500"/></div>
          {overspending.length ? <div className="space-y-3">{overspending.map((b)=><div key={b.category}><div className="flex justify-between text-sm mb-1"><span>{b.category}</span><strong>{b.percent.toFixed(0)}%</strong></div><div className="h-2 bg-slate-100 rounded-full"><div className={`h-full rounded-full ${b.percent>100?'bg-red-500':'bg-amber-500'}`} style={{width:Math.min(100,b.percent)+'%'}}/></div></div>)}</div> : <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg p-3">No budget alerts right now.</p>}
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4"><Target size={19} className="text-emerald-500"/><h2 className="font-bold text-slate-800">Goal progress</h2></div>
          {financialGoals.length ? <div className="space-y-4">{financialGoals.slice(0,3).map((g)=><div key={g.name}><div className="flex justify-between text-sm"><span>{g.name}</span><span>{Math.min(100,g.saved/g.target*100).toFixed(0)}%</span></div><div className="h-2 bg-slate-100 rounded-full mt-2"><div className="h-full bg-emerald-500 rounded-full" style={{width:Math.min(100,g.saved/g.target*100)+'%'}}/></div></div>)}</div> : <p className="text-sm text-slate-500">Create a savings goal to track progress here.</p>}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold flex items-center"><Sparkles className="mr-2 text-yellow-300" size={20}/>AI Budget Coach</h2>{!advice && <button onClick={generateAdvice} disabled={!income && !monthExpenses.length} className="bg-white/20 hover:bg-white/30 disabled:opacity-40 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">Analyze my budget <ArrowRight size={16}/></button>}</div>
        {advice && <div className="mt-5 bg-white/10 rounded-xl p-5 whitespace-pre-wrap text-sm leading-6">{advice}<button onClick={generateAdvice} className="block mt-4 text-xs underline text-white/70">Refresh</button></div>}
        {!advice && <p className="text-indigo-100 text-sm mt-3">Your AI coach can identify spending patterns and suggest practical next steps based on this month's numbers.</p>}
      </div>
    </div>
  );
};
