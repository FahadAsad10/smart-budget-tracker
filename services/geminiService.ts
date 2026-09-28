import { BudgetData } from "../types";

export const getFinancialAdvice = async (budget: BudgetData): Promise<string> => {
  try {
    const response = await fetch('/api/financial-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget),
    });

    const data = await response.json() as { advice?: string; error?: string };
    if (!response.ok) throw new Error(data.error || 'Unable to generate advice.');
    return data.advice || 'No advice was returned.';
  } catch (error) {
    console.error('Error fetching AI advice:', error);
    return 'AI advice is temporarily unavailable. Check that the server has GEMINI_API_KEY configured and try again.';
  }
};
