import React from 'react'
import { Asset, CashHolding } from '../../types/finance'
import { formatIndianCurrency } from '../../utils/currency'
import { Plus, Edit2, Trash2, TrendingUp, Building2, LineChart, Coins, Briefcase, Landmark, Wallet } from 'lucide-react'
import { EditableItem } from '../modals/EditItemModal'

interface AssetsColumnProps {
  assets: Asset[]
  cashHolding: CashHolding | null
  totalAssetsValue: number
  totalAssetCashflow: number
  onAddNew: () => void
  onEdit: (item: EditableItem) => void
  onDelete: (type: 'asset' | 'cash', id: string, name: string) => void
  onAddCash: () => void
}

export const AssetsColumn: React.FC<AssetsColumnProps> = ({
  assets,
  cashHolding,
  totalAssetsValue,
  totalAssetCashflow,
  onAddNew,
  onEdit,
  onDelete,
  onAddCash,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real_estate':
        return <Building2 className="h-3.5 w-3.5 text-blue-500" />
      case 'mutual_funds':
      case 'stocks':
        return <LineChart className="h-3.5 w-3.5 text-emerald-500" />
      case 'gold':
        return <Coins className="h-3.5 w-3.5 text-amber-500" />
      case 'business':
        return <Briefcase className="h-3.5 w-3.5 text-purple-500" />
      case 'fd_rd':
        return <Landmark className="h-3.5 w-3.5 text-cyan-500" />
      default:
        return <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
    }
  }

  const formatCategoryLabel = (category: string) => {
    switch (category) {
      case 'real_estate':
        return 'Real Estate'
      case 'mutual_funds':
        return 'Mutual Funds'
      case 'stocks':
        return 'Stocks'
      case 'gold':
        return 'Gold / SGB'
      case 'business':
        return 'Business'
      case 'fd_rd':
        return 'FD / RD / PPF'
      default:
        return 'Asset'
    }
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle overflow-hidden">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              1. Assets & Capital
            </h3>
            <span className="inline-flex items-center rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 leading-none">
              {assets.length}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 whitespace-nowrap">
            <span>Val: <strong className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{formatIndianCurrency(totalAssetsValue, { autoCompact: true })}</strong></span>
            {totalAssetCashflow > 0 && (
              <span>• Yield: <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+{formatIndianCurrency(totalAssetCashflow, { autoCompact: true })}/mo</strong></span>
            )}
          </div>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add Asset</span>
        </button>
      </div>

      {/* Liquid Cash Callout Card */}
      <div className="p-3 bg-zinc-50/70 border-b border-zinc-100 dark:bg-zinc-900/30 dark:border-zinc-800/80">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <div className="rounded p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 block leading-tight">
                Liquid Cash & Emergency Fund
              </span>
              <span className="text-[10px] text-zinc-400 truncate max-w-[150px] block">
                {cashHolding?.notes || 'Bank accounts / cash on hand'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatIndianCurrency(cashHolding?.amount || 0)}
            </span>
            <button
              onClick={() => {
                if (cashHolding) {
                  onEdit({ type: 'cash', data: cashHolding })
                } else {
                  onAddCash()
                }
              }}
              title="Edit Liquid Cash"
              className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Asset Items List */}
      <div className="flex-1 overflow-y-auto max-h-none lg:max-h-[300px] divide-y divide-zinc-100 dark:divide-zinc-800/60 p-1">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <TrendingUp className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              No assets added yet
            </p>
            <p className="text-[11px] text-zinc-400 max-w-[200px] mt-0.5">
              Add mutual funds, real estate, stocks, or businesses that put money in your pocket.
            </p>
            <button
              onClick={onAddNew}
              className="mt-3 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              + Add First Asset
            </button>
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset.id}
              className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 rounded p-1 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  {getCategoryIcon(asset.category)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {asset.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span>{formatCategoryLabel(asset.category)}</span>
                    {asset.notes && <span>• {asset.notes}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {formatIndianCurrency(asset.current_value)}
                  </div>
                  {Number(asset.monthly_income_generated) > 0 && (
                    <div className="font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{formatIndianCurrency(asset.monthly_income_generated)}/mo
                    </div>
                  )}
                </div>

                {/* Inline Actions (visible on hover / always on touch) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  <button
                    onClick={() => onEdit({ type: 'asset', data: asset })}
                    title="Edit"
                    className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDelete('asset', asset.id, asset.name)}
                    title="Delete"
                    className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
