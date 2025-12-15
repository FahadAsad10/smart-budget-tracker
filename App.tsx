import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { Dashboard } from './components/Dashboard';
import { ExpenseItem, Currency } from './types';

function App() {
  const [income, setIncome] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>(Currency.PKR);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [goal, setGoal] = useState<string>('');

  return (
    <Layout>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Budget Planner
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Your personal tool for budgeting and saving. Take control of your finances with smart tracking and AI-powered insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
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

        {/* Right Column: Dashboard */}
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