import React from 'react'
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  ArrowLeftRight,
  Plus,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export type MobileTabType = 'overview' | 'assets' | 'liabilities' | 'cashflow'

interface MobileBottomNavProps {
  activeTab: MobileTabType
  onChangeTab: (tab: MobileTabType) => void
  onOpenQuickAdd: () => void
  assetsCount?: number
  liabilitiesCount?: number
  cashflowCount?: number
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenQuickAdd,
  assetsCount = 0,
  liabilitiesCount = 0,
  cashflowCount = 0,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-zinc-200/90 bg-white/95 dark:border-zinc-800/90 dark:bg-zinc-950/95 backdrop-blur-md px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Overview Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('overview')}
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200',
            activeTab === 'overview'
              ? 'text-zinc-900 dark:text-white font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-all',
              activeTab === 'overview'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-current'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
        </button>

        {/* 2. Assets Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('assets')}
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative',
            activeTab === 'assets'
              ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-all relative',
              activeTab === 'assets'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 shadow-xs'
                : 'text-current'
            )}
          >
            <TrendingUp className="h-4 w-4" />
            {assetsCount > 0 && activeTab !== 'assets' && (
              <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-[8px] font-mono font-bold flex items-center justify-center">
                {assetsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Assets</span>
        </button>

        {/* 3. Center Elevated Quick Add Button */}
        <div className="flex items-center justify-center px-1">
          <button
            type="button"
            onClick={onOpenQuickAdd}
            aria-label="Quick Add Entry"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md hover:scale-105 active:scale-95 transition-all duration-150 border-2 border-white dark:border-zinc-900"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Liabilities Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('liabilities')}
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative',
            activeTab === 'liabilities'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-all relative',
              activeTab === 'liabilities'
                ? 'bg-rose-600 text-white dark:bg-rose-500 dark:text-zinc-950 shadow-xs'
                : 'text-current'
            )}
          >
            <CreditCard className="h-4 w-4" />
            {liabilitiesCount > 0 && activeTab !== 'liabilities' && (
              <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-[8px] font-mono font-bold flex items-center justify-center">
                {liabilitiesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Debts</span>
        </button>

        {/* 5. Cashflow Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('cashflow')}
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative',
            activeTab === 'cashflow'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg transition-all relative',
              activeTab === 'cashflow'
                ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-zinc-950 shadow-xs'
                : 'text-current'
            )}
          >
            <ArrowLeftRight className="h-4 w-4" />
            {cashflowCount > 0 && activeTab !== 'cashflow' && (
              <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-[8px] font-mono font-bold flex items-center justify-center">
                {cashflowCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cashflow</span>
        </button>
      </div>
    </nav>
  )
}
