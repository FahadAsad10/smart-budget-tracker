import React, { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { ExpenseItem, Currency, CATEGORIES } from '../types';

interface InputSectionProps {
  income: number;
  setIncome: (val: number) => void;
  currency: Currency;
  setCurrency: (val: Currency) => void;
  expenses: ExpenseItem[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseItem[]>>;
  goal: string;
  setGoal: (val: string) => void;
  compact?: boolean;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export const InputSection: React.FC<InputSectionProps> = ({
  income, setIncome, currency, setCurrency, expenses, setExpenses, goal, setGoal, compact = false
}) => {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getToday());
  const [note, setNote] = useState('');

  const addExpense = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    setExpenses((current) => [{
      id: crypto.randomUUID(), category, amount: value, date: date || getToday(), note: note.trim() || undefined
    }, ...current]);
    setAmount('');
    setNote('');
    setDate(getToday());
  };

  const removeExpense = (id: string) => setExpenses((current) => current.filter((e) => e.id !== id));

  return (
    <div className="space-y-6">
      {!compact && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Monthly Income</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="rounded-lg border border-slate-300 p-2.5">
              {Object.entries(Currency).map(([key, value]) => <option key={key} value={value}>{key} ({value})</option>)}
            </select>
            <div className="md:col-span-3 relative">
              <span className="absolute left-3 top-2.5 text-slate-500">{currency}</span>
              <input type="number" min="0" value={income || ''} onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))} className="pl-10 w-full rounded-lg border border-slate-300 p-2.5" placeholder="e.g. 50000" />
            </div>
          </div>
        </section>
      )}

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">{compact ? 'Add Transaction' : 'Monthly Transactions'}</h2>
          <span className="text-sm font-semibold text-slate-500">{expenses.length} total</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="md:col-span-2 rounded-lg border border-slate-300 p-2.5 text-sm">
              {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-sm">{currency}</span>
              <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExpense()} className="pl-8 w-full rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Amount" />
            </div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 text-sm" />
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Note" />
            <button onClick={addExpense} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2.5 font-medium flex items-center justify-center gap-1"><Plus size={17}/>Add</button>
          </div>
        </div>

        {!compact && (
          expenses.length === 0 ? (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl"><DollarSign className="mx-auto mb-2" size={28}/><p>No transactions yet.</p></div>
          ) : (
            <ul className="space-y-2 max-h-[420px] overflow-y-auto">
              {expenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between gap-4 p-3 border border-slate-100 rounded-lg">
                  <div><p className="font-medium text-slate-700">{expense.category}</p><p className="text-xs text-slate-400">{expense.date}{expense.note ? ' · ' + expense.note : ''}</p></div>
                  <div className="flex items-center gap-3"><strong>{currency}{expense.amount.toLocaleString()}</strong><button onClick={() => removeExpense(expense.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button></div>
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      {!compact && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Main Financial Goal</h2>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3" placeholder="e.g. Save 30,000 for a new laptop by December" />
        </section>
      )}
    </div>
  );
};
