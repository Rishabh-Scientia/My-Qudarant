import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  Asset,
  Liability,
  IncomeEntry,
  ExpenseEntry,
  CashHolding,
} from '../types/finance'
import {
  calculateFinancialMetrics,
  calculateMonthlyTrends,
} from '../utils/calculations'
import { useMemo } from 'react'

export function useFinanceData(selectedMonthStr: string) {
  const { user } = useAuth()

  // 1. Assets Query
  const assetsQuery = useQuery({
    queryKey: ['assets', user?.id],
    queryFn: async (): Promise<Asset[]> => {
      if (!user || !isSupabaseConfigured) return []

      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('current_value', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: Boolean(user),
  })

  // 2. Liabilities Query
  const liabilitiesQuery = useQuery({
    queryKey: ['liabilities', user?.id],
    queryFn: async (): Promise<Liability[]> => {
      if (!user || !isSupabaseConfigured) return []

      const { data, error } = await supabase
        .from('liabilities')
        .select('*')
        .order('outstanding_amount', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: Boolean(user),
  })

  // 3. Income Entries Query
  const incomeEntriesQuery = useQuery({
    queryKey: ['income_entries', user?.id],
    queryFn: async (): Promise<IncomeEntry[]> => {
      if (!user || !isSupabaseConfigured) return []

      const { data, error } = await supabase
        .from('income_entries')
        .select('*')
        .order('month', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: Boolean(user),
  })

  // 4. Expense Entries Query
  const expenseEntriesQuery = useQuery({
    queryKey: ['expense_entries', user?.id],
    queryFn: async (): Promise<ExpenseEntry[]> => {
      if (!user || !isSupabaseConfigured) return []

      const { data, error } = await supabase
        .from('expense_entries')
        .select('*')
        .order('month', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: Boolean(user),
  })

  // 5. Cash Holdings Query
  const cashHoldingsQuery = useQuery({
    queryKey: ['cash_holdings', user?.id],
    queryFn: async (): Promise<CashHolding[]> => {
      if (!user || !isSupabaseConfigured) return []

      const { data, error } = await supabase
        .from('cash_holdings')
        .select('*')
        .order('month', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: Boolean(user),
  })

  const isLoading =
    assetsQuery.isLoading ||
    liabilitiesQuery.isLoading ||
    incomeEntriesQuery.isLoading ||
    expenseEntriesQuery.isLoading ||
    cashHoldingsQuery.isLoading

  const isError =
    assetsQuery.isError ||
    liabilitiesQuery.isError ||
    incomeEntriesQuery.isError ||
    expenseEntriesQuery.isError ||
    cashHoldingsQuery.isError

  const assets = assetsQuery.data || []
  const liabilities = liabilitiesQuery.data || []
  const incomeEntries = incomeEntriesQuery.data || []
  const expenseEntries = expenseEntriesQuery.data || []
  const cashHoldings = cashHoldingsQuery.data || []

  // Memoized Live Financial Calculations
  const metrics = useMemo(() => {
    return calculateFinancialMetrics(
      assets,
      liabilities,
      incomeEntries,
      expenseEntries,
      cashHoldings,
      selectedMonthStr
    )
  }, [assets, liabilities, incomeEntries, expenseEntries, cashHoldings, selectedMonthStr])

  // Memoized Multi-Month Trends for Recharts
  const monthlyTrends = useMemo(() => {
    return calculateMonthlyTrends(
      assets,
      incomeEntries,
      expenseEntries,
      6,
      new Date(`${selectedMonthStr}-15`)
    )
  }, [assets, incomeEntries, expenseEntries, selectedMonthStr])

  // Filtered month entries for display
  const currentMonthIncomes = useMemo(() => {
    return incomeEntries.filter((i) => i.month.startsWith(selectedMonthStr))
  }, [incomeEntries, selectedMonthStr])

  const currentMonthExpenses = useMemo(() => {
    return expenseEntries.filter((e) => e.month.startsWith(selectedMonthStr))
  }, [expenseEntries, selectedMonthStr])

  const currentMonthCash = useMemo(() => {
    return (
      cashHoldings.find((c) => c.month.startsWith(selectedMonthStr)) || null
    )
  }, [cashHoldings, selectedMonthStr])

  return {
    isLoading,
    isError,
    assets,
    liabilities,
    incomeEntries,
    expenseEntries,
    cashHoldings,
    currentMonthIncomes,
    currentMonthExpenses,
    currentMonthCash,
    metrics,
    monthlyTrends,
    refetchAll: () => {
      assetsQuery.refetch()
      liabilitiesQuery.refetch()
      incomeEntriesQuery.refetch()
      expenseEntriesQuery.refetch()
      cashHoldingsQuery.refetch()
    },
  }
}
