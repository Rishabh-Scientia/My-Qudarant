import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  Asset,
  Liability,
  IncomeEntry,
  ExpenseEntry,
} from '../types/finance'
import { useToast } from '../components/ui/Toast'

export function useFinanceMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const toast = useToast()

  const userId = user?.id || ''

  // ==========================================
  // ASSET MUTATIONS
  // ==========================================
  const addAssetMutation = useMutation({
    mutationFn: async (newAsset: Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const item = {
        ...newAsset,
        user_id: user.id,
      }
      const { data, error } = await supabase.from('assets').insert(item).select().single()
      if (error) throw error
      return data
    },
    onMutate: async (newAsset) => {
      await queryClient.cancelQueries({ queryKey: ['assets', userId] })
      const previousAssets = queryClient.getQueryData<Asset[]>(['assets', userId]) || []
      const optimisticAsset: Asset = {
        ...newAsset,
        id: `temp-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData<Asset[]>(['assets', userId], [optimisticAsset, ...previousAssets])
      return { previousAssets }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets', userId], context.previousAssets)
      }
      toast.error('Failed to add asset', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', userId] })
      toast.success('Asset added successfully')
    },
  })

  const updateAssetMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Asset> }) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['assets', userId] })
      const previousAssets = queryClient.getQueryData<Asset[]>(['assets', userId]) || []
      queryClient.setQueryData<Asset[]>(
        ['assets', userId],
        previousAssets.map((a) => (a.id === id ? { ...a, ...updates } : a))
      )
      return { previousAssets }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets', userId], context.previousAssets)
      }
      toast.error('Failed to update asset', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', userId] })
      toast.success('Asset updated')
    },
  })

  const deleteAssetMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { error } = await supabase.from('assets').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['assets', userId] })
      const previousAssets = queryClient.getQueryData<Asset[]>(['assets', userId]) || []
      queryClient.setQueryData<Asset[]>(
        ['assets', userId],
        previousAssets.filter((a) => a.id !== id)
      )
      return { previousAssets }
    },
    onError: (err: any, _id, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets', userId], context.previousAssets)
      }
      toast.error('Failed to delete asset', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', userId] })
      toast.success('Asset removed')
    },
  })

  // ==========================================
  // LIABILITY MUTATIONS
  // ==========================================
  const addLiabilityMutation = useMutation({
    mutationFn: async (newLiability: Omit<Liability, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const item = {
        ...newLiability,
        user_id: user.id,
      }
      const { data, error } = await supabase.from('liabilities').insert(item).select().single()
      if (error) throw error
      return data
    },
    onMutate: async (newLiability) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', userId] })
      const previousLiabilities = queryClient.getQueryData<Liability[]>(['liabilities', userId]) || []
      const optimistic: Liability = {
        ...newLiability,
        id: `temp-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData<Liability[]>(['liabilities', userId], [optimistic, ...previousLiabilities])
      return { previousLiabilities }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousLiabilities) {
        queryClient.setQueryData(['liabilities', userId], context.previousLiabilities)
      }
      toast.error('Failed to add liability', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liabilities', userId] })
      toast.success('Liability added')
    },
  })

  const updateLiabilityMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Liability> }) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('liabilities')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', userId] })
      const previousLiabilities = queryClient.getQueryData<Liability[]>(['liabilities', userId]) || []
      queryClient.setQueryData<Liability[]>(
        ['liabilities', userId],
        previousLiabilities.map((l) => (l.id === id ? { ...l, ...updates } : l))
      )
      return { previousLiabilities }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousLiabilities) {
        queryClient.setQueryData(['liabilities', userId], context.previousLiabilities)
      }
      toast.error('Failed to update liability', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liabilities', userId] })
      toast.success('Liability updated')
    },
  })

  const deleteLiabilityMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { error } = await supabase.from('liabilities').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', userId] })
      const previousLiabilities = queryClient.getQueryData<Liability[]>(['liabilities', userId]) || []
      queryClient.setQueryData<Liability[]>(
        ['liabilities', userId],
        previousLiabilities.filter((l) => l.id !== id)
      )
      return { previousLiabilities }
    },
    onError: (err: any, _id, context) => {
      if (context?.previousLiabilities) {
        queryClient.setQueryData(['liabilities', userId], context.previousLiabilities)
      }
      toast.error('Failed to delete liability', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liabilities', userId] })
      toast.success('Liability removed')
    },
  })

  // ==========================================
  // INCOME MUTATIONS
  // ==========================================
  const addIncomeMutation = useMutation({
    mutationFn: async (newIncome: Omit<IncomeEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const item = {
        ...newIncome,
        user_id: user.id,
      }
      const { data, error } = await supabase.from('income_entries').insert(item).select().single()
      if (error) throw error
      return data
    },
    onMutate: async (newIncome) => {
      await queryClient.cancelQueries({ queryKey: ['income_entries', userId] })
      const previousIncomes = queryClient.getQueryData<IncomeEntry[]>(['income_entries', userId]) || []
      const optimistic: IncomeEntry = {
        ...newIncome,
        id: `temp-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData<IncomeEntry[]>(['income_entries', userId], [optimistic, ...previousIncomes])
      return { previousIncomes }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['income_entries', userId], context.previousIncomes)
      }
      toast.error('Failed to add income entry', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income_entries', userId] })
      toast.success('Income logged')
    },
  })

  const updateIncomeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<IncomeEntry> }) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('income_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['income_entries', userId] })
      const previousIncomes = queryClient.getQueryData<IncomeEntry[]>(['income_entries', userId]) || []
      queryClient.setQueryData<IncomeEntry[]>(
        ['income_entries', userId],
        previousIncomes.map((i) => (i.id === id ? { ...i, ...updates } : i))
      )
      return { previousIncomes }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['income_entries', userId], context.previousIncomes)
      }
      toast.error('Failed to update income', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income_entries', userId] })
      toast.success('Income updated')
    },
  })

  const deleteIncomeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { error } = await supabase.from('income_entries').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['income_entries', userId] })
      const previousIncomes = queryClient.getQueryData<IncomeEntry[]>(['income_entries', userId]) || []
      queryClient.setQueryData<IncomeEntry[]>(
        ['income_entries', userId],
        previousIncomes.filter((i) => i.id !== id)
      )
      return { previousIncomes }
    },
    onError: (err: any, _id, context) => {
      if (context?.previousIncomes) {
        queryClient.setQueryData(['income_entries', userId], context.previousIncomes)
      }
      toast.error('Failed to delete income', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income_entries', userId] })
      toast.success('Income entry removed')
    },
  })

  // ==========================================
  // EXPENSE MUTATIONS
  // ==========================================
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: Omit<ExpenseEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const item = {
        ...newExpense,
        user_id: user.id,
      }
      const { data, error } = await supabase.from('expense_entries').insert(item).select().single()
      if (error) throw error
      return data
    },
    onMutate: async (newExpense) => {
      await queryClient.cancelQueries({ queryKey: ['expense_entries', userId] })
      const previousExpenses = queryClient.getQueryData<ExpenseEntry[]>(['expense_entries', userId]) || []
      const optimistic: ExpenseEntry = {
        ...newExpense,
        id: `temp-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData<ExpenseEntry[]>(['expense_entries', userId], [optimistic, ...previousExpenses])
      return { previousExpenses }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(['expense_entries', userId], context.previousExpenses)
      }
      toast.error('Failed to log expense', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_entries', userId] })
      toast.success('Expense logged')
    },
  })

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ExpenseEntry> }) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('expense_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['expense_entries', userId] })
      const previousExpenses = queryClient.getQueryData<ExpenseEntry[]>(['expense_entries', userId]) || []
      queryClient.setQueryData<ExpenseEntry[]>(
        ['expense_entries', userId],
        previousExpenses.map((e) => (e.id === id ? { ...e, ...updates } : e))
      )
      return { previousExpenses }
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(['expense_entries', userId], context.previousExpenses)
      }
      toast.error('Failed to update expense', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_entries', userId] })
      toast.success('Expense updated')
    },
  })

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const { error } = await supabase.from('expense_entries').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['expense_entries', userId] })
      const previousExpenses = queryClient.getQueryData<ExpenseEntry[]>(['expense_entries', userId]) || []
      queryClient.setQueryData<ExpenseEntry[]>(
        ['expense_entries', userId],
        previousExpenses.filter((e) => e.id !== id)
      )
      return { previousExpenses }
    },
    onError: (err: any, _id, context) => {
      if (context?.previousExpenses) {
        queryClient.setQueryData(['expense_entries', userId], context.previousExpenses)
      }
      toast.error('Failed to delete expense', err.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_entries', userId] })
      toast.success('Expense deleted')
    },
  })

  // ==========================================
  // CASH HOLDINGS MUTATIONS
  // ==========================================
  const setCashHoldingMutation = useMutation({
    mutationFn: async ({ month, amount, notes }: { month: string; amount: number; notes?: string }) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const monthDate = `${month.slice(0, 7)}-01`

      // Check if existing record for this month
      const { data: existing } = await supabase
        .from('cash_holdings')
        .select('id')
        .eq('month', monthDate)
        .maybeSingle()

      if (existing?.id) {
        const { data, error } = await supabase
          .from('cash_holdings')
          .update({ amount, notes })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('cash_holdings')
          .insert({
            user_id: user.id,
            month: monthDate,
            amount,
            notes,
          })
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash_holdings', userId] })
      toast.success('Cash balance updated')
    },
    onError: (err: any) => {
      toast.error('Failed to update cash balance', err.message)
    },
  })

  // ==========================================
  // BATCH GUIDED MONTHLY CHECKIN MUTATION
  // ==========================================
  const batchMonthlyCheckinMutation = useMutation({
    mutationFn: async ({
      month,
      cashAmount,
      incomes,
      expenses,
    }: {
      month: string
      cashAmount?: number
      incomes: Omit<IncomeEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]
      expenses: Omit<ExpenseEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]
    }) => {
      if (!isSupabaseConfigured || !user) throw new Error('Not authenticated')
      const monthDate = `${month.slice(0, 7)}-01`

      // Insert cash
      if (cashAmount !== undefined) {
        await supabase.from('cash_holdings').upsert(
          {
            user_id: user.id,
            month: monthDate,
            amount: cashAmount,
          },
          { onConflict: 'user_id,month' }
        )
      }

      // Insert incomes
      if (incomes.length > 0) {
        const incomeRows = incomes.map((i) => ({ ...i, user_id: user.id }))
        const { error: incErr } = await supabase.from('income_entries').insert(incomeRows)
        if (incErr) throw incErr
      }

      // Insert expenses
      if (expenses.length > 0) {
        const expenseRows = expenses.map((e) => ({ ...e, user_id: user.id }))
        const { error: expErr } = await supabase.from('expense_entries').insert(expenseRows)
        if (expErr) throw expErr
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash_holdings', userId] })
      queryClient.invalidateQueries({ queryKey: ['income_entries', userId] })
      queryClient.invalidateQueries({ queryKey: ['expense_entries', userId] })
      toast.success('Monthly check-in logged successfully!')
    },
    onError: (err: any) => {
      toast.error('Failed to complete check-in', err.message)
    },
  })

  return {
    addAsset: addAssetMutation.mutateAsync,
    updateAsset: updateAssetMutation.mutateAsync,
    deleteAsset: deleteAssetMutation.mutateAsync,
    isAddingAsset: addAssetMutation.isPending,
    isUpdatingAsset: updateAssetMutation.isPending,
    isDeletingAsset: deleteAssetMutation.isPending,

    addLiability: addLiabilityMutation.mutateAsync,
    updateLiability: updateLiabilityMutation.mutateAsync,
    deleteLiability: deleteLiabilityMutation.mutateAsync,
    isAddingLiability: addLiabilityMutation.isPending,

    addIncome: addIncomeMutation.mutateAsync,
    updateIncome: updateIncomeMutation.mutateAsync,
    deleteIncome: deleteIncomeMutation.mutateAsync,
    isAddingIncome: addIncomeMutation.isPending,

    addExpense: addExpenseMutation.mutateAsync,
    updateExpense: updateExpenseMutation.mutateAsync,
    deleteExpense: deleteExpenseMutation.mutateAsync,
    isAddingExpense: addExpenseMutation.isPending,

    setCashHolding: setCashHoldingMutation.mutateAsync,
    batchMonthlyCheckin: batchMonthlyCheckinMutation.mutateAsync,
  }
}
