import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { AuthScreen } from './components/auth/AuthScreen'
import { Header } from './components/layout/Header'
import { MobileBottomNav, MobileTabType } from './components/layout/MobileBottomNav'
import { HeroKpiStrip } from './components/dashboard/HeroKpiStrip'
import { AssetsColumn } from './components/dashboard/AssetsColumn'
import { LiabilitiesColumn } from './components/dashboard/LiabilitiesColumn'
import { CashflowColumn } from './components/dashboard/CashflowColumn'
import { RatRaceChart } from './components/dashboard/RatRaceChart'
import { QuickAddModal, QuickAddTab } from './components/modals/QuickAddModal'
import { MonthlyCheckinModal } from './components/modals/MonthlyCheckinModal'
import { EditItemModal, EditableItem } from './components/modals/EditItemModal'
import { ProfileModal } from './components/modals/ProfileModal'
import { ConfirmDialog } from './components/ui/ConfirmDialog'
import { Skeleton } from './components/ui/Skeleton'
import { useFinanceData } from './hooks/useFinanceData'
import { useFinanceMutations } from './hooks/useFinanceMutations'
import { format } from 'date-fns'

export function App() {
  const { user, isLoading: isAuthLoading } = useAuth()

  // Selected financial month (format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    format(new Date(), 'yyyy-MM')
  )

  // Mobile navigation active tab
  const [mobileTab, setMobileTab] = useState<MobileTabType>('overview')

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickAddTab, setQuickAddTab] = useState<QuickAddTab>('income')
  const [isCheckinOpen, setIsCheckinOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null)

  // Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    type: 'asset' | 'liability' | 'income' | 'expense'
    id: string
    name: string
  }>({
    isOpen: false,
    type: 'asset',
    id: '',
    name: '',
  })

  // Queries & Mutations
  const {
    isLoading: isDataLoading,
    assets,
    liabilities,
    currentMonthIncomes,
    currentMonthExpenses,
    currentMonthCash,
    metrics,
    monthlyTrends,
  } = useFinanceData(selectedMonth)

  const {
    deleteAsset,
    deleteLiability,
    deleteIncome,
    deleteExpense,
  } = useFinanceMutations()

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
          <p className="text-xs font-semibold text-zinc-500">Loading My Quadrant...</p>
        </div>
      </div>
    )
  }

  // Unauthenticated screen
  if (!user) {
    return <AuthScreen />
  }

  // Handle open quick add with pre-selected tab
  const handleOpenQuickAdd = (tab: QuickAddTab = 'income') => {
    setQuickAddTab(tab)
    setIsQuickAddOpen(true)
  }

  // Contextual quick add from mobile center button
  const handleMobileCenterAdd = () => {
    if (mobileTab === 'assets') {
      handleOpenQuickAdd('asset')
    } else if (mobileTab === 'liabilities') {
      handleOpenQuickAdd('liability')
    } else if (mobileTab === 'cashflow') {
      handleOpenQuickAdd('income')
    } else {
      handleOpenQuickAdd('income')
    }
  }

  // Handle deletion triggers
  const handleDeleteTrigger = (
    type: 'asset' | 'liability' | 'income' | 'expense',
    id: string,
    name: string
  ) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      name,
    })
  }

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirm.type === 'asset') {
        await deleteAsset(deleteConfirm.id)
      } else if (deleteConfirm.type === 'liability') {
        await deleteLiability(deleteConfirm.id)
      } else if (deleteConfirm.type === 'income') {
        await deleteIncome(deleteConfirm.id)
      } else if (deleteConfirm.type === 'expense') {
        await deleteExpense(deleteConfirm.id)
      }
    } finally {
      setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))
    }
  }

  const totalAssetCashflow = assets.reduce(
    (sum, a) => sum + (Number(a.monthly_income_generated) || 0),
    0
  )

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <Header
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenQuickAdd={() => handleOpenQuickAdd('income')}
        onOpenCheckin={() => setIsCheckinOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-5 flex flex-col gap-3.5 pb-28 lg:pb-8">
        {isDataLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Skeleton className="h-72" />
              <Skeleton className="h-72" />
              <Skeleton className="h-72" />
            </div>
            <Skeleton className="h-44" />
          </div>
        ) : (
          <>
            {/* ==================================================== */}
            {/* DESKTOP LAYOUT (>= 1024px)                          */}
            {/* ==================================================== */}
            <div className="hidden lg:flex lg:flex-col lg:gap-3.5">
              {/* 1. Hero KPI Strip */}
              <HeroKpiStrip metrics={metrics} />

              {/* 2. 3-Column Core Action Matrix */}
              <div className="grid grid-cols-3 gap-3.5 items-stretch">
                {/* Column 1: Assets & Liquid Cash */}
                <AssetsColumn
                  assets={assets}
                  cashHolding={currentMonthCash}
                  totalAssetsValue={metrics.totalAssets}
                  totalAssetCashflow={totalAssetCashflow}
                  onAddNew={() => handleOpenQuickAdd('asset')}
                  onAddCash={() => handleOpenQuickAdd('cash')}
                  onEdit={setEditingItem}
                  onDelete={(type, id, name) =>
                    handleDeleteTrigger(type as any, id, name)
                  }
                />

                {/* Column 2: Liabilities & Good/Bad Debt */}
                <LiabilitiesColumn
                  liabilities={liabilities}
                  totalLiabilities={metrics.totalLiabilities}
                  totalEmi={metrics.emiExpenses}
                  onAddNew={() => handleOpenQuickAdd('liability')}
                  onEdit={setEditingItem}
                  onDelete={(id, name) => handleDeleteTrigger('liability', id, name)}
                />

                {/* Column 3: Monthly Cashflow (Incomes & Expenses) */}
                <CashflowColumn
                  incomeEntries={currentMonthIncomes}
                  expenseEntries={currentMonthExpenses}
                  totalIncome={metrics.totalIncome}
                  activeIncome={metrics.activeIncome}
                  passiveIncome={metrics.passiveIncome}
                  totalExpenses={metrics.totalExpenses}
                  netCashflow={metrics.netMonthlyCashflow}
                  onAddNewIncome={() => handleOpenQuickAdd('income')}
                  onAddNewExpense={() => handleOpenQuickAdd('expense')}
                  onEdit={setEditingItem}
                  onDeleteIncome={(id, name) => handleDeleteTrigger('income', id, name)}
                  onDeleteExpense={(id, name) =>
                    handleDeleteTrigger('expense', id, name)
                  }
                />
              </div>

              {/* 3. Bottom Full-Width "Escape the Rat Race" Area Chart */}
              <RatRaceChart data={monthlyTrends} />
            </div>

            {/* ==================================================== */}
            {/* MOBILE & TABLET LAYOUT (< 1024px)                    */}
            {/* ==================================================== */}
            <div className="flex flex-col gap-3 lg:hidden">
              {mobileTab === 'overview' && (
                <div className="flex flex-col gap-3.5 animate-fadeIn">
                  <HeroKpiStrip metrics={metrics} />
                  <RatRaceChart data={monthlyTrends} />
                </div>
              )}

              {mobileTab === 'assets' && (
                <div className="animate-fadeIn">
                  <AssetsColumn
                    assets={assets}
                    cashHolding={currentMonthCash}
                    totalAssetsValue={metrics.totalAssets}
                    totalAssetCashflow={totalAssetCashflow}
                    onAddNew={() => handleOpenQuickAdd('asset')}
                    onAddCash={() => handleOpenQuickAdd('cash')}
                    onEdit={setEditingItem}
                    onDelete={(type, id, name) =>
                      handleDeleteTrigger(type as any, id, name)
                    }
                  />
                </div>
              )}

              {mobileTab === 'liabilities' && (
                <div className="animate-fadeIn">
                  <LiabilitiesColumn
                    liabilities={liabilities}
                    totalLiabilities={metrics.totalLiabilities}
                    totalEmi={metrics.emiExpenses}
                    onAddNew={() => handleOpenQuickAdd('liability')}
                    onEdit={setEditingItem}
                    onDelete={(id, name) => handleDeleteTrigger('liability', id, name)}
                  />
                </div>
              )}

              {mobileTab === 'cashflow' && (
                <div className="animate-fadeIn">
                  <CashflowColumn
                    incomeEntries={currentMonthIncomes}
                    expenseEntries={currentMonthExpenses}
                    totalIncome={metrics.totalIncome}
                    activeIncome={metrics.activeIncome}
                    passiveIncome={metrics.passiveIncome}
                    totalExpenses={metrics.totalExpenses}
                    netCashflow={metrics.netMonthlyCashflow}
                    onAddNewIncome={() => handleOpenQuickAdd('income')}
                    onAddNewExpense={() => handleOpenQuickAdd('expense')}
                    onEdit={setEditingItem}
                    onDeleteIncome={(id, name) => handleDeleteTrigger('income', id, name)}
                    onDeleteExpense={(id, name) =>
                      handleDeleteTrigger('expense', id, name)
                    }
                  />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* MOBILE BOTTOM APP NAVIGATION DOCK */}
      <MobileBottomNav
        activeTab={mobileTab}
        onChangeTab={setMobileTab}
        onOpenQuickAdd={handleMobileCenterAdd}
        assetsCount={assets.length}
        liabilitiesCount={liabilities.length}
        cashflowCount={currentMonthIncomes.length + currentMonthExpenses.length}
      />

      {/* MODALS */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialTab={quickAddTab}
        selectedMonthStr={selectedMonth}
      />

      <MonthlyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        selectedMonthStr={selectedMonth}
      />

      <EditItemModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteConfirm.name}?`}
        description="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  )
}
export default App
