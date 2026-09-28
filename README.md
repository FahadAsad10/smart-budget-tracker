# Smart Budget Tracker

Smart Budget Tracker is a React + TypeScript personal-finance dashboard that combines everyday expense tracking with budgeting analytics and an AI budget coach.

## What it does

- **Overview dashboard** — income, spending, available balance, savings rate, weekly spending and category mix.
- **Transactions** — record expenses with category, amount, date and notes; search and filter history.
- **Category budgets** — set limits for groceries, transport, dining, housing and other categories with live usage indicators.
- **Financial goals** — create savings targets and track progress.
- **AI Budget Coach** — sends the current month's budget data to a server-side Gemini endpoint for personalized educational budgeting suggestions.
- **Local persistence** — data is automatically saved in the browser with localStorage.
- **Responsive UI** — desktop navigation plus a mobile-friendly navigation bar.

## Tech stack

- React 19
- TypeScript
- Vite
- Recharts
- Lucide React
- Google Gemini API

## Run locally

npm install
npm run dev

Create .env.local:

GEMINI_API_KEY=your_gemini_api_key_here

The Gemini key is used by the server-side /api/financial-advice endpoint and is not exposed through the browser bundle.

## Build

npm run build

## Project structure

api/financial-advice.ts
components/Dashboard.tsx
components/InputSection.tsx
components/Layout.tsx
services/geminiService.ts
App.tsx
types.ts
vite.config.ts

## Notes

This is a client-side MVP: financial data currently stays in the user's browser. A future production version can add authentication and a database for cross-device synchronization, recurring transactions, bank integrations and shared budgets.

AI output is intended for general educational budgeting support and should not be treated as regulated financial advice.
