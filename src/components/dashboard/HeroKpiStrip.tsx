import React from 'react'
import { FinancialMetrics } from '../../types/finance'
import { RatRaceBadge } from './RatRaceBadge'
import { formatIndianCurrency, formatPercent } from '../../utils/currency'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react'

interface HeroKpiStripProps {
  metrics: FinancialMetrics
}

export const HeroKpiStrip: React.FC<HeroKpiStripProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {/* KPI 1: Rat Race Status Hero Badge */}
      <RatRaceBadge
        isFree={metrics.isFinanciallyFree}
        passiveIncome={metrics.passiveIncome}
        totalExpenses={metrics.totalExpenses}
        freedomRatio={metrics.freedomRatio}
      />

      {/* KPI 2: Net Worth */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Net Worth (Assets - Debt + Cash)
          </span>
          <span className="rounded bg-zinc-100 p-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Wallet className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="my-2">
          <div className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatIndianCurrency(metrics.netWorth)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 border-t border-zinc-100 pt-2 text-[11px] dark:border-zinc-800">
          <div>
            <span className="text-zinc-400 block text-[10px]">Assets</span>
            <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">
              {formatIndianCurrency(metrics.totalAssets, { compact: true })}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">Liabilities</span>
            <span className="font-mono font-medium text-rose-600 dark:text-rose-400 tabular-nums">
              {formatIndianCurrency(metrics.totalLiabilities, { compact: true })}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">Liquid Cash</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatIndianCurrency(metrics.liquidCash, { compact: true })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI 3: Passive Income vs Expenses Gap */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Monthly Passive Cashflow Gap
          </span>
          <span
            className={`rounded p-1 ${
              metrics.passiveIncomeGap >= 0
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {metrics.passiveIncomeGap >= 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
          </span>
        </div>

        <div className="my-2">
          <div
            className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
              metrics.passiveIncomeGap >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {formatIndianCurrency(metrics.passiveIncomeGap, { showSign: true })}
            <span className="text-xs font-normal text-zinc-400 ml-1">/ mo</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-2 text-[11px] dark:border-zinc-800">
          <div>
            <span className="text-zinc-400 block text-[10px]">Passive Income</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatIndianCurrency(metrics.passiveIncome)}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">Total Expenses</span>
            <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200 tabular-nums">
              {formatIndianCurrency(metrics.totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI 4: Good Debt vs Bad Debt & Savings Rate */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Debt Quality & Savings Rate
          </span>
          <span className="rounded bg-zinc-100 p-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Percent className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              Good Debt Ratio
            </span>
            <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatPercent(metrics.goodDebtPercentage, 0)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              Savings Rate
            </span>
            <div className="font-mono text-lg font-bold text-zinc-800 dark:text-zinc-200 tabular-nums">
              {formatPercent(metrics.savingsRate, 0)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] text-zinc-500 dark:border-zinc-800">
          <span>Good: <strong className="font-mono text-zinc-700 dark:text-zinc-300">{formatIndianCurrency(metrics.goodDebtTotal, { compact: true })}</strong></span>
          <span>Bad: <strong className="font-mono text-rose-600 dark:text-rose-400">{formatIndianCurrency(metrics.badDebtTotal, { compact: true })}</strong></span>
        </div>
      </div>
    </div>
  )
}
