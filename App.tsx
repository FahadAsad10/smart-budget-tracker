import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { ExpenseItem, Currency } from './types';

const STORAGE_KEY = 'smart-budget-tracker:v2';

function App() {
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState<Currency>(Currency.PKR);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [goal, setGoal] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setIncome(parsed.income ?? 0);
      setCurrency(parsed.currency ?? Currency.PKR);
      setExpenses(parsed.expenses ?? []);
      setGoal(parsed.goal ?? '');
    } catch (error) {
      console.error('Unable to restore saved budget:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ income, currency, expenses, goal })
    );
  }, [income, currency, expenses, goal]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthCount = useMemo(
    () => expenses.filter((expense) => expense.date.startsWith(currentMonth)).length,
    [expenses, currentMonth]
  );

  return (
    <Layout>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Smart Budget Tracker
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Track spending, understand where your money goes, and use AI to turn your budget into practical next steps.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          {currentMonthCount} transaction{currentMonthCount === 1 ? '' : 's'} this month · Saved automatically on this device
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <InputSection
            income={income}
            setIncome={setIncome}
            currency={currency}
            setCurrency={setCurrency}
            expenses={expenses}
            setExpenses={setExpenses}
            goal={goal}
            setGoal={setGoal}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <Dashboard
              income={income}
              currency={currency}
              expenses={expenses}
              goal={goal}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
