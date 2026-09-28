import { GoogleGenAI } from '@google/genai';
import type { BudgetData } from '../types';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const budget = (await req.json()) as BudgetData;
    if (!budget || !budget.income || !Array.isArray(budget.expenses)) {
      return new Response(JSON.stringify({ error: 'Invalid budget payload.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const totalExpenses = budget.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const balance = budget.income - totalExpenses;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = [
      'You are a practical budgeting assistant. Give general educational budgeting guidance, not regulated financial advice.',
      `Currency: ${budget.currency}`,
      `Monthly income: ${budget.income}`,
      `Financial goal: ${budget.financialGoal || 'Not provided'}`,
      'Current-month transactions:',
      ...budget.expenses.map((item) => `- ${item.category}: ${item.amount} (${item.date})${item.note ? ` — ${item.note}` : ''}`),
      `Total spending: ${totalExpenses}`,
      `Remaining: ${balance}`,
      '',
      'Return 4 short sections: Assessment, 3 Actions, Goal Plan, Reminder. Keep it under 220 words and use plain text only.'
    ].join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return new Response(JSON.stringify({ advice: response.text || 'No advice was generated.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Financial advice error:', error);
    return new Response(JSON.stringify({ error: 'Unable to generate financial advice.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
