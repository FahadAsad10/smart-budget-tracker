import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sparkles, ArrowRight, Loader2, TrendingDown, Wallet, Target } from 'lucide-react';
import { ExpenseItem, Currency, BudgetData } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  income: number;
  currency: Currency;
  expenses: ExpenseItem[];
  goal: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const Dashboard: React.FC<DashboardProps> = ({ income, currency, expenses, goal }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = useMemo(
    () => expenses.filter((expense) => expense.date.startsWith(currentMonth)),
    [expenses, currentMonth]
  );

  const totalExpenses = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - totalExpenses;
  const spentPercent = income > 0 ? (totalExpenses / income) * 100 : 0;

  const chartData = useMemo(() => Object.values(
    monthExpenses.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = { name: item.category, value: 0 };
      acc[item.category].value += item.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  ), [monthExpenses]);

  const generateAdvice = async () => {
    setLoading(true);
    const data: BudgetData = {
      income,
      currency,
      expenses: monthExpenses,
      financialGoal: goal
    };
    setAdvice(await getFinancialAdvice(data));
    setLoading(false);
  };

  useEffect(() => {
    setAdvice(null);
  }, [income, currency, goal, expenses]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-1">
            <TrendingDown size={16} /> Spent this month
          </div>
          <p className="text-2xl font-bold text-slate-900">{currency}{totalExpenses.toLocaleString()}</p>
        </div>

        <div className={`p-5 rounded-2xl shadow-sm border ${balance >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <div className={`flex items-center gap-2 text-sm font-medium mb-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <Wallet size={16} /> Remaining
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {currency}{balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">Monthly health</h3>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${spentPercent <= 100 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {income > 0 ? spentPercent.toFixed(1) + '% spent' : 'Add income'}
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${spentPercent <= 100 ? 'bg-blue-500' : 'bg-red-500'}`}
            style={{ width: Math.min(100, Math.max(0, spentPercent)) + '%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>{monthExpenses.length} transaction{monthExpenses.length === 1 ? '' : 's'}</span>
          <span>{income > 0 ? (Math.max(0, 100 - spentPercent)).toFixed(1) + '% income left' : ''}</span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => currency + Number(value).toLocaleString()}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {goal && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <Target size={18} /> Current goal
          </div>
          <p className="text-slate-600 text-sm">{goal}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg text-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Sparkles className="mr-2 text-yellow-300" size={20} />
              AI Financial Advisor
            </h3>
            {!advice && !loading && (
              <button
                onClick={generateAdvice}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
                disabled={!income || monthExpenses.length === 0}
              >
                Get Insights <ArrowRight size={16} className="ml-2" />
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-white/80 mb-3" />
              <p className="text-white/80 text-sm">Analyzing this month's budget...</p>
            </div>
          )}

          {advice && (
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="whitespace-pre-wrap text-sm leading-6">{advice}</div>
              <button
                onClick={generateAdvice}
                className="mt-4 text-xs text-white/60 hover:text-white underline"
              >
                Refresh Advice
              </button>
            </div>
          )}

          {!advice && !loading && (
            <p className="text-indigo-100 text-sm">
              {income && monthExpenses.length
                ? 'Get personalized suggestions based on this month’s spending and your goal.'
                : 'Add income and at least one current-month transaction to unlock AI advice.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
