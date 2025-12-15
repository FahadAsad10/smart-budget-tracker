import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
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

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - totalExpenses;
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : '0';

  // Group expenses by category for the chart
  const chartData = Object.values(expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { name: curr.category, value: 0 };
    }
    acc[curr.category].value += curr.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>));

  const generateAdvice = async () => {
    setLoading(true);
    const budgetData: BudgetData = {
      income,
      currency,
      expenses,
      financialGoal: goal
    };
    const response = await getFinancialAdvice(budgetData);
    setAdvice(response);
    setLoading(false);
  };

  useEffect(() => {
      // Clear advice if inputs change drastically to encourage re-generation
      if (advice) setAdvice(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, expenses.length, goal]);

  const hasData = expenses.length > 0 && income > 0;

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Sparkles className="text-slate-400 h-8 w-8" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">Ready to Visualize?</h3>
        <p className="text-slate-500 max-w-xs">
          Enter your income and at least one expense to see your financial breakdown and AI insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-slate-900">{currency}{totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`p-5 rounded-2xl shadow-sm border border-slate-100 ${balance >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <p className={`text-sm font-medium mb-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>Remaining Balance</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {currency}{balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Breakdown</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${currency}${value.toLocaleString()}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
            Savings Rate: {savingsRate}%
          </span>
        </div>
      </div>

      {/* AI Advisor Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg text-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Sparkles className="mr-2 text-yellow-300" size={20} />
              AI Financial Advisor
            </h3>
            {!advice && !loading && (
              <button
                onClick={generateAdvice}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                Get Insights <ArrowRight size={16} className="ml-2" />
              </button>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-white/80 mb-3" />
              <p className="text-white/80 text-sm">Analyzing your budget...</p>
            </div>
          )}

          {advice && (
            <div className="animate-fade-in bg-white/10 rounded-xl p-5 backdrop-blur-sm">
               <div 
                 className="prose prose-invert prose-sm max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-2"
                 dangerouslySetInnerHTML={{ __html: advice }} 
               />
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
              Click "Get Insights" to receive personalized tips based on your {currency}{income.toLocaleString()} income and spending habits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};