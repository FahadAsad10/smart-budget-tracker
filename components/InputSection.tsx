import React, { useMemo, useState } from 'react';
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
  income,
  setIncome,
  currency,
  setCurrency,
  expenses,
  setExpenses,
  goal,
  setGoal,
  compact = false
}) => {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getToday());
  const [note, setNote] = useState('');

  const total = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const addExpense = () => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return;

    setExpenses((current) => [
      {
        id: crypto.randomUUID(),
        category,
        amount: numericAmount,
        date: date || getToday(),
        note: note.trim() || undefined
      },
      ...current
    ]);

    setAmount('');
    setNote('');
    setDate(getToday());
  };

  const removeExpense = (id: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
{!compact && <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">\n        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">\n          <span className="bg-green-100 text-green-700 p-1.5 rounded-md mr-2 text-sm">Step 1</span>\n          Monthly Income\n        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {Object.entries(Currency).map(([key, value]) => (
                <option key={key} value={value}>{key} ({value})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="income" className="block text-sm font-medium text-slate-700 mb-1">Total Monthly Income</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                {currency}
              </span>
              <input
                type="number"
                id="income"
                min="0"
                step="0.01"
                value={income || ''}
                onChange={(event) => setIncome(Math.max(0, Number(event.target.value) || 0))}
                className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        </div>
      </section>}\n\n      {!compact && <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">\n        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <span className="bg-red-100 text-red-700 p-1.5 rounded-md mr-2 text-sm">Step 2</span>
            Add Transactions
          </h2>
          <span className="text-sm font-semibold text-slate-700">
            Total: {currency}{total.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2">
              <label htmlFor="category" className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Category</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm">{currency}</span>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') addExpense(); }}
                  className="pl-8 block w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Note</label>
              <input
                id="note"
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. supermarket"
              />
            </div>

            <button
              onClick={addExpense}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus size={18} className="mr-1" /> Add
            </button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <DollarSign className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No transactions added yet.</p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[520px] overflow-y-auto pr-1" aria-label="List of expenses">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between gap-4 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                <div className="min-w-0">
                  <p className="font-medium text-slate-700 truncate">{expense.category}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {expense.date}{expense.note ? ' · ' + expense.note : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-4 shrink-0">
                  <span className="font-semibold text-slate-900">{currency}{expense.amount.toLocaleString()}</span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                    aria-label={'Remove ' + expense.category + ' expense'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-purple-100 text-purple-700 p-1.5 rounded-md mr-2 text-sm">Step 3</span>
          Financial Goal
        </h2>
        <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1">What is your main financial target?</label>
        <input
          type="text"
          id="goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          className="block w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. Save 30,000 for a new laptop by December"
        />
      </section>}\n    </div>\n  );
};
