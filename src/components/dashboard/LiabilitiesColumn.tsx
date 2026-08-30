import React from 'react'
import { Liability } from '../../types/finance'
import { formatIndianCurrency } from '../../utils/currency'
import { Plus, Edit2, Trash2, CreditCard, Home, Car, ShoppingBag } from 'lucide-react'
import { EditableItem } from '../modals/EditItemModal'

interface LiabilitiesColumnProps {
  liabilities: Liability[]
  totalLiabilities: number
  totalEmi: number
  onAddNew: () => void
  onEdit: (item: EditableItem) => void
  onDelete: (id: string, name: string) => void
}

export const LiabilitiesColumn: React.FC<LiabilitiesColumnProps> = ({
  liabilities,
  totalLiabilities,
  totalEmi,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home_loan':
        return <Home className="h-3.5 w-3.5 text-blue-500" />
      case 'car_loan':
        return <Car className="h-3.5 w-3.5 text-amber-500" />
      case 'credit_card':
        return <CreditCard className="h-3.5 w-3.5 text-rose-500" />
      default:
        return <ShoppingBag className="h-3.5 w-3.5 text-zinc-400" />
    }
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle overflow-hidden">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              2. Liabilities & Debt
            </h3>
            <span className="inline-flex items-center rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 leading-none">
              {liabilities.length}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 whitespace-nowrap">
            <span>Total: <strong className="font-mono text-rose-600 dark:text-rose-400 font-bold">{formatIndianCurrency(totalLiabilities, { autoCompact: true })}</strong></span>
            {totalEmi > 0 && (
              <span>• EMI: <strong className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">{formatIndianCurrency(totalEmi, { autoCompact: true })}/mo</strong></span>
            )}
          </div>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-xs shrink-0 whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add Debt</span>
        </button>
      </div>

      {/* Liabilities List */}
      <div className="flex-1 overflow-y-auto max-h-none lg:max-h-[360px] divide-y divide-zinc-100 dark:divide-zinc-800/60 p-1">
        {liabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <CreditCard className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Zero debt recorded
            </p>
            <p className="text-[11px] text-zinc-400 max-w-[200px] mt-0.5">
              Record home loans, car loans, credit cards, or business borrowings.
            </p>
            <button
              onClick={onAddNew}
              className="mt-3 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              + Add Liability
            </button>
          </div>
        ) : (
          liabilities.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 rounded p-1 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.name}
                    </p>
                    {item.is_good_debt ? (
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap leading-none">
                        GOOD DEBT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300 whitespace-nowrap leading-none">
                        BAD DEBT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    {Number(item.interest_rate) > 0 && <span>{item.interest_rate}% p.a.</span>}
                    {Number(item.monthly_emi) > 0 && (
                      <span>• EMI: ₹{Number(item.monthly_emi).toLocaleString('en-IN')}/mo</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {formatIndianCurrency(item.outstanding_amount)}
                  </div>
                </div>

                {/* Inline Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  <button
                    onClick={() => onEdit({ type: 'liability', data: item })}
                    title="Edit"
                    className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.name)}
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
