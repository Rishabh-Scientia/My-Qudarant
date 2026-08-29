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

## 🚀 Quickstart & Setup Guide

### 1. Clone & Install Dependencies

```bash
cd dharmner
npm install
```

### 2. Configure Supabase

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Open your project's **SQL Editor**.
3. Copy and run the entire SQL migration located at:
   ```
   /supabase/migrations/20260101000000_init_schema.sql
   ```
   This automatically creates all 6 tables, triggers, indexes, and strict RLS policies.
4. In your Supabase Project Dashboard, go to **Project Settings -> API** and copy:
   - **Project URL**
   - **anon / public key**

### 3. Configure Environment Variables

Create or edit `.env` in the root folder:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!TIP]
> **Interactive Demo Mode**: If you want to test and explore the dashboard before configuring your Supabase instance, click **"Try Interactive Demo with Sample Indian Portfolio"** on the login screen.

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub/GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Add the following **Environment Variables** in the Vercel project settings:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
5. Click **Deploy**. Vercel will automatically build the Vite TypeScript bundle.

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
