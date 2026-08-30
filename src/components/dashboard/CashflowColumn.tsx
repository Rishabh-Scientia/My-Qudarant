import React, { useState } from 'react'
import { IncomeEntry, ExpenseEntry } from '../../types/finance'
import { formatIndianCurrency } from '../../utils/currency'
import { Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'
import { EditableItem } from '../modals/EditItemModal'
import { cn } from '../../lib/utils'

interface CashflowColumnProps {
  incomeEntries: IncomeEntry[]
  expenseEntries: ExpenseEntry[]
  totalIncome: number
  activeIncome: number
  passiveIncome: number
  totalExpenses: number
  netCashflow: number
  onAddNewIncome: () => void
  onAddNewExpense: () => void
  onEdit: (item: EditableItem) => void
  onDeleteIncome: (id: string, name: string) => void
  onDeleteExpense: (id: string, name: string) => void
}

export const CashflowColumn: React.FC<CashflowColumnProps> = ({
  incomeEntries,
  expenseEntries,
  totalIncome,
  activeIncome: _activeIncome,
  passiveIncome: _passiveIncome,
  totalExpenses,
  netCashflow,
  onAddNewIncome,
  onAddNewExpense,
  onEdit,
  onDeleteIncome,
  onDeleteExpense,
}) => {
  const [subTab, setSubTab] = useState<'all' | 'income' | 'expense'>('all')

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle overflow-hidden">
      {/* Column Header */}
      <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
              3. Monthly Cashflow
            </h3>
            <span className="inline-flex items-center rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 leading-none">
              {incomeEntries.length + expenseEntries.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onAddNewIncome}
              title="Add Income"
              className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 transition-all shadow-xs whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              <span>Income</span>
            </button>
            <button
              onClick={onAddNewExpense}
              title="Add Expense"
              className="flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-xs whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              <span>Expense</span>
            </button>
          </div>
        </div>

        {/* 3-Part Summary Bar */}
        <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-zinc-200/70 dark:border-zinc-800/70">
          <div>
            <span className="text-zinc-400 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-0.5">
              Inflow
            </span>
            <span className="font-mono text-sm sm:text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap tracking-tight">
              +{formatIndianCurrency(totalIncome, { autoCompact: true })}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-0.5">
              Outflow
            </span>
            <span className="font-mono text-sm sm:text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums whitespace-nowrap tracking-tight">
              -{formatIndianCurrency(totalExpenses, { autoCompact: true })}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-0.5">
              Net Cashflow
            </span>
            <span
              className={cn(
                'font-mono text-sm sm:text-base md:text-lg font-bold tabular-nums whitespace-nowrap tracking-tight',
                netCashflow >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {netCashflow >= 0 ? '+' : ''}{formatIndianCurrency(netCashflow, { autoCompact: true })}
              <span className="text-[11px] sm:text-xs font-normal text-zinc-400 ml-0.5">/mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tabs for switching between Incomes and Expenses or Viewing Combined */}
      <div className="flex border-b border-zinc-100 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/20 text-xs px-2 pt-1 gap-1">
        <button
          onClick={() => setSubTab('all')}
          className={cn(
            'px-2.5 py-1 font-medium rounded-t-md transition-colors text-xs border-b-2 whitespace-nowrap',
            subTab === 'all'
              ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          All ({incomeEntries.length + expenseEntries.length})
        </button>
        <button
          onClick={() => setSubTab('income')}
          className={cn(
            'px-2.5 py-1 font-medium rounded-t-md transition-colors text-xs border-b-2 whitespace-nowrap',
            subTab === 'income'
              ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400 bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          Incomes ({incomeEntries.length})
        </button>
        <button
          onClick={() => setSubTab('expense')}
          className={cn(
            'px-2.5 py-1 font-medium rounded-t-md transition-colors text-xs border-b-2 whitespace-nowrap',
            subTab === 'expense'
              ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 bg-white dark:bg-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          )}
        >
          Expenses ({expenseEntries.length})
        </button>
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto max-h-none lg:max-h-[320px] divide-y divide-zinc-100 dark:divide-zinc-800/60 p-1">
        {incomeEntries.length === 0 && expenseEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Sparkles className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              No cashflow logged for this month
            </p>
            <p className="text-[11px] text-zinc-400 max-w-[200px] mt-0.5">
              Click Monthly Check-in or use quick buttons above to log this month's numbers.
            </p>
          </div>
        ) : (
          <>
            {/* Show Incomes */}
            {(subTab === 'all' || subTab === 'income') &&
              incomeEntries.map((income) => (
                <div
                  key={income.id}
                  className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 rounded p-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {income.source}
                        </p>
                        {income.type === 'passive' ? (
                          <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap leading-none">
                            PASSIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 whitespace-nowrap leading-none">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {income.type === 'passive' ? 'B/I Quadrant Cashflow' : 'E/S Salary / Fee'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                        +{formatIndianCurrency(income.amount)}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      <button
                        onClick={() => onEdit({ type: 'income', data: income })}
                        title="Edit"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDeleteIncome(income.id, income.source)}
                        title="Delete"
                        className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* Show Expenses */}
            {(subTab === 'all' || subTab === 'expense') &&
              expenseEntries.map((expense) => (
                <div
                  key={expense.id}
                  className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 rounded p-1 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shrink-0">
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {expense.description || 'Expense'}
                        </p>
                        <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase whitespace-nowrap leading-none">
                          {expense.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 capitalize">
                        {expense.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        -{formatIndianCurrency(expense.amount)}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      <button
                        onClick={() => onEdit({ type: 'expense', data: expense })}
                        title="Edit"
                        className="p-1 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() =>
                          onDeleteExpense(expense.id, expense.description || 'Expense')
                        }
                        title="Delete"
                        className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  )
}
