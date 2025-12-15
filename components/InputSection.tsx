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
}

export const InputSection: React.FC<InputSectionProps> = ({
  income,
  setIncome,
  currency,
  setCurrency,
  expenses,
  setExpenses,
  goal,
  setGoal
}) => {
  const [newExpenseCategory, setNewExpenseCategory] = useState(CATEGORIES[0]);
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');

  const addExpense = () => {
    const amount = parseFloat(newExpenseAmount);
    if (!amount || amount <= 0) return;

    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: newExpenseCategory,
      amount: amount
    };

    setExpenses([...expenses, newItem]);
    setNewExpenseAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addExpense();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Income Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" aria-labelledby="income-heading">
        <h2 id="income-heading" className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-green-100 text-green-700 p-1.5 rounded-md mr-2 text-sm">Step 1</span>
          Monthly Income
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              {Object.entries(Currency).map(([key, value]) => (
                <option key={key} value={value}>{key} ({value})</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label htmlFor="income" className="block text-sm font-medium text-slate-700 mb-1">Total Monthly Income</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold">{currency}</span>
              </div>
              <input
                type="number"
                id="income"
                min="0"
                value={income || ''}
                onChange={(e) => setIncome(parseFloat(e.target.value))}
                className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Expenses Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" aria-labelledby="expenses-heading">
        <h2 id="expenses-heading" className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-red-100 text-red-700 p-1.5 rounded-md mr-2 text-sm">Step 2</span>
          Monthly Expenses
        </h2>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="md:col-span-2">
              <label htmlFor="category" className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Category</label>
              <select
                id="category"
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="amount" className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 text-sm">{currency}</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-8 block w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <button
              onClick={addExpense}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded-lg flex items-center justify-center transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Add expense to list"
            >
              <Plus size={18} className="mr-1" /> Add
            </button>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <DollarSign className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No expenses added yet.</p>
          </div>
        ) : (
          <ul className="space-y-3" aria-label="List of expenses">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-blue-100 transition-colors shadow-sm">
                <span className="font-medium text-slate-700">{expense.category}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-slate-900">{currency}{expense.amount.toLocaleString()}</span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                    aria-label={`Remove ${expense.category} expense`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Goal Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" aria-labelledby="goal-heading">
        <h2 id="goal-heading" className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-purple-100 text-purple-700 p-1.5 rounded-md mr-2 text-sm">Step 3</span>
          Financial Goal
        </h2>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1">What is your main financial target?</label>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="block w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. Save 30,000 for a new laptop by December"
          />
        </div>
      </section>
    </div>
  );
};