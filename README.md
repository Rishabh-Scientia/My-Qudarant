# 🧭 My Quadrant — CASHFLOW & Freedom Tracker

A production-grade, single-screen personal finance dashboard inspired by Robert Kiyosaki's **CASHFLOW Quadrant** (*Rich Dad Poor Dad*), customized specifically for the **Indian market (₹ INR)**.

Built with **React 18, Vite, TypeScript, TailwindCSS, Supabase (PostgreSQL + RLS Auth), TanStack React Query, and Recharts**.

---

## ⚡ The Philosophy: Escaping the Rat Race

In *Rich Dad Poor Dad*, financial freedom is achieved when your **Passive Income (B & I quadrants) exceeds your Total Living Expenses**.

$$\text{Financial Freedom Status} = \begin{cases} 
\text{Financially Free} & \text{if } \text{Passive Income} \ge \text{Total Expenses} \\ 
\text{In the Rat Race} & \text{if } \text{Passive Income} < \text{Total Expenses} 
\end{cases}$$

- **Good Debt vs Bad Debt**: Debt that finances cashflowing/appreciating assets (e.g., rental property loans, business growth) vs debt that funds depreciating consumption (credit cards, personal loans).
- **Passive Income Gap**: The exact monthly cashflow deficit needed to escape the rat race.
- **Single-Screen High-Signal Design**: Dense, Linear/Stripe-inspired interface with zero unnecessary scrolling, monospace tabular numbers, and dynamic gap shading.

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS (Minimalist, subtle 1px borders, Inter typography, tabular numbers)
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security + Auto Profile Trigger)
- **Data Fetching & Cache**: TanStack React Query (`@tanstack/react-query`) with optimistic mutations and rollback toasts
- **Forms & Validation**: `react-hook-form` + `zod`
- **Charts**: Recharts (Dual-line "Escape the Rat Race" area chart with dynamic gap shading)
- **Icons**: `lucide-react`
- **Formatting**: `Intl.NumberFormat('en-IN')` (Indian Lakhs & Crores formatting, e.g. `₹12,45,000`)
- **Deployment**: Vercel

---

## 🗄 Database Schema & Security (RLS)

All 6 tables are strictly protected by **Postgres Row Level Security (RLS)**. No user can ever read, insert, update, or delete data belonging to another user.

### Tables

1. **`profiles`**: User profile, currency preference (`INR`), and personal monthly freedom exit target.
2. **`assets`**: Portfolio assets (`real_estate`, `mutual_funds`, `stocks`, `gold`, `business`, `fd_rd`, `other`), current market value, and monthly cashflow yield.
3. **`liabilities`**: Debts and loans, classified as **Good Debt** or **Bad Debt**, with outstanding principal, monthly EMI, and interest rate.
4. **`income_entries`**: Monthly incomes classified as **Active** (E / S quadrant) or **Passive** (B / I quadrant).
5. **`expense_entries`**: Monthly expenses classified as **Needs**, **Wants**, **EMI Payments**, or **Other**.
6. **`cash_holdings`**: Liquid bank and emergency cash balance tracked per month.

---

## 📱 Features & Highlights

- **Hero KPIs**: Prominent Rat Race Badge (% Covered / Financially Free status), Net Worth, Monthly Passive Gap, and Good Debt Ratio.
- **3-Column Matrix**: Dense grid for Assets & Liquid Cash, Liabilities & Good/Bad Debt, and Monthly Cashflow with inline hover editing and delete affordances.
- **Escaping the Rat Race Trajectory Chart**: Recharts area visualization comparing Passive Income vs Living Expenses across months, highlighting when you achieve the financial crossover point.
- **Unified Quick-Add**: Fast modal with tabs for Assets, Liabilities, Incomes, Expenses, and Cash with sensible Indian presets (PPF, Nifty SIP, SGB, Home Loan SBI, etc.).
- **Monthly Check-in Flow**: A guided 3-step checklist to record bank balances, incomes, and expenses for any month.
- **Optimistic UI Updates**: Instant interface response with automatic rollback on network errors and toast alerts.

---

## 📄 License

MIT © [My Quadrant](https://github.com/)
