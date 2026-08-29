import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { MonthSummaryPoint } from '../../types/finance'
import { formatIndianCurrency } from '../../utils/currency'

interface RatRaceChartProps {
  data?: MonthSummaryPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const passive = payload.find((p: any) => p.dataKey === 'passiveIncome')?.value || 0
    const expenses = payload.find((p: any) => p.dataKey === 'totalExpenses')?.value || 0
    const gap = passive - expenses
    const isFree = gap >= 0

    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 text-xs">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{label}</p>
        <div className="space-y-1 font-mono">
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span>Passive Income:</span>
            <span className="font-bold">{formatIndianCurrency(passive)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-rose-500 dark:text-rose-400">
            <span>Total Expenses:</span>
            <span className="font-bold">{formatIndianCurrency(expenses)}</span>
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1 flex items-center justify-between gap-4">
            <span className="text-zinc-500">Freedom Gap:</span>
            <span
              className={`font-bold ${
                isFree
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isFree ? 'Free (+ ' : 'Short (- '}
              {formatIndianCurrency(Math.abs(gap))}
              {')'}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export const RatRaceChart: React.FC<RatRaceChartProps> = ({ data = [] }) => {
  const chartData = Array.isArray(data) ? data : []
  // Check if passive ever exceeds expenses in the dataset
  const hasFreedomMonth = chartData.some((d) => d.isFree)

  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Escaping the Rat Race — Cashflow Trajectory
            </h3>
            {hasFreedomMonth ? (
              <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap leading-none">
                CROSSOVER ACHIEVED
              </span>
            ) : (
              <span className="inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 whitespace-nowrap leading-none">
                GAP CLOSING
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500">
            Freedom is reached when the <span className="font-semibold text-emerald-600 dark:text-emerald-400">Green Line (Passive Income)</span> crosses above the <span className="font-semibold text-rose-500 dark:text-rose-400">Red Line (Living Expenses)</span>.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-sm bg-emerald-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Passive Income (₹)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-sm bg-rose-500" />
            <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              Expenses (₹)
            </span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full min-h-[176px]">
        <ResponsiveContainer width="100%" height={176} minWidth={0} minHeight={176}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="passiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e4e4e7"
              className="dark:stroke-zinc-800"
              vertical={false}
            />

            <XAxis
              dataKey="displayMonth"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#71717a' }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#71717a' }}
              tickFormatter={(v) => formatIndianCurrency(v, { compact: true, hideSymbol: true })}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="totalExpenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              dot={{ r: 3, fill: '#f43f5e' }}
              activeDot={{ r: 5 }}
            />

            <Area
              type="monotone"
              dataKey="passiveIncome"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#passiveGradient)"
              dot={{ r: 3.5, fill: '#10b981' }}
              activeDot={{ r: 5.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
