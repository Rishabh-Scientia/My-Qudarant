import { CheckCircle, AlertTriangle } from 'lucide-react'
import { formatIndianCurrency } from '../../utils/currency'

interface RatRaceBadgeProps {
  isFree: boolean
  passiveIncome: number
  totalExpenses: number
  freedomRatio: number
}

export const RatRaceBadge: React.FC<RatRaceBadgeProps> = ({
  isFree,
  passiveIncome,
  totalExpenses,
  freedomRatio,
}) => {
  const gap = passiveIncome - totalExpenses
  const clampedRatio = Math.min(Math.max(freedomRatio, 0), 100)

  if (isFree) {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-emerald-300/80 bg-emerald-50/40 p-4 dark:border-emerald-800/80 dark:bg-emerald-950/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500">
              <CheckCircle className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                Quadrant Status
              </span>
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                FINANCIALLY FREE
              </h3>
            </div>
          </div>
          <span className="rounded-md bg-emerald-600 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
            {freedomRatio.toFixed(0)}% COVERED
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between text-xs mb-1.5">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              Passive Cashflow Surplus:
            </span>
            <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
              +{formatIndianCurrency(gap)}/mo
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/60">
            <div
              className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-emerald-700/90 dark:text-emerald-400/90 font-medium">
            Your passive cashflow covers 100% of your living expenses without working for money.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-amber-200/90 bg-amber-50/30 p-4 dark:border-amber-900/80 dark:bg-amber-950/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
              Quadrant Status
            </span>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              IN THE RAT RACE
            </h3>
          </div>
        </div>
        <span className="rounded-md bg-amber-100 border border-amber-200 px-2 py-0.5 font-mono text-xs font-bold text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
          {clampedRatio.toFixed(0)}% TO FREEDOM
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between text-xs mb-1.5">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Monthly Gap to Cover:
          </span>
          <span className="font-mono text-base font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {formatIndianCurrency(Math.abs(gap))}/mo
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${clampedRatio}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Passive: {formatIndianCurrency(passiveIncome)}</span>
          <span>Expenses: {formatIndianCurrency(totalExpenses)}</span>
        </div>
      </div>
    </div>
  )
}
