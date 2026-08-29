export type AssetCategory =
  | 'real_estate'
  | 'stocks'
  | 'mutual_funds'
  | 'business'
  | 'gold'
  | 'fd_rd'
  | 'other'

export type LiabilityCategory =
  | 'home_loan'
  | 'car_loan'
  | 'personal_loan'
  | 'credit_card'
  | 'business_loan'
  | 'education_loan'
  | 'gold_loan'
  | 'other'

export type IncomeType = 'active' | 'passive'

export type ExpenseCategory = 'needs' | 'wants' | 'emi_payments' | 'other'

export interface Profile {
  id: string
  name: string | null
  currency: string
  rat_race_exit_target: number | null
  created_at?: string
  updated_at?: string
}

export interface Asset {
  id: string
  user_id: string
  name: string
  category: AssetCategory
  current_value: number
  monthly_income_generated: number
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface Liability {
  id: string
  user_id: string
  name: string
  category: string
  is_good_debt: boolean
  outstanding_amount: number
  monthly_emi: number
  interest_rate: number
  created_at?: string
  updated_at?: string
}

export interface IncomeEntry {
  id: string
  user_id: string
  month: string // YYYY-MM-DD
  type: IncomeType
  source: string
  amount: number
  created_at?: string
  updated_at?: string
}

export interface ExpenseEntry {
  id: string
  user_id: string
  month: string // YYYY-MM-DD
  category: ExpenseCategory
  description: string | null
  amount: number
  created_at?: string
  updated_at?: string
}

export interface CashHolding {
  id: string
  user_id: string
  month: string // YYYY-MM-DD
  amount: number
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface FinancialMetrics {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  liquidCash: number
  activeIncome: number
  passiveIncome: number
  totalIncome: number
  needsExpenses: number
  wantsExpenses: number
  emiExpenses: number
  otherExpenses: number
  totalExpenses: number
  netMonthlyCashflow: number
  passiveIncomeGap: number // Passive Income - Total Expenses
  freedomRatio: number // (Passive Income / Total Expenses) * 100
  isFinanciallyFree: boolean
  goodDebtTotal: number
  badDebtTotal: number
  goodDebtPercentage: number
  badDebtPercentage: number
  debtToAssetRatio: number
  savingsRate: number
}

export interface MonthSummaryPoint {
  month: string // e.g. "2026-03"
  displayMonth: string // e.g. "Mar '26"
  passiveIncome: number
  totalExpenses: number
  activeIncome: number
  netCashflow: number
  isFree: boolean
  gap: number
}
