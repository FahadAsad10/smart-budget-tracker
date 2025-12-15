import { GoogleGenAI } from "@google/genai";
import { BudgetData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (budget: BudgetData): Promise<string> => {
  try {
    const totalExpenses = budget.expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = budget.income - totalExpenses;

    const prompt = `
      You are a helpful, empathetic financial advisor. 
      Analyze the following budget profile:
      
      Currency: ${budget.currency}
      Monthly Income: ${budget.income}
      Financial Goal: "${budget.financialGoal}"
      
      Expenses Breakdown:
      ${budget.expenses.map(e => `- ${e.category}: ${e.amount}`).join('\n')}
      
      Total Expenses: ${totalExpenses}
      Remaining Balance: ${balance}
      
      Please provide:
      1. A brief assessment of their financial health (1 sentence).
      2. 3 specific, actionable tips to help them reach their goal of "${budget.financialGoal}".
      3. A motivating closing sentence.
      
      Keep the tone encouraging but realistic. Format with HTML tags like <ul>, <li>, <strong> for readability, but do not return a full markdown block, just the inner HTML content.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate advice at this time. Please try again.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "I'm having trouble connecting to the financial wisdom database right now. Please try again later.";
  }
};