import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { useFinanceMutations } from '../../hooks/useFinanceMutations'
import { formatIndianCurrency } from '../../utils/currency'
import { Check, ArrowRight, Plus, Trash2, Sparkles, Wallet, TrendingUp, Receipt } from 'lucide-react'
import { format } from 'date-fns'

interface MonthlyCheckinModalProps {
  isOpen: boolean
  onClose: () => void
  selectedMonthStr: string
}

export const MonthlyCheckinModal: React.FC<MonthlyCheckinModalProps> = ({
  isOpen,
  onClose,
  selectedMonthStr,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { batchMonthlyCheckin } = useFinanceMutations()

  // Form states
  const [cashAmount, setCashAmount] = useState<string>('')
  const [cashNotes, setCashNotes] = useState<string>('')

  const [incomes, setIncomes] = useState<
    { id: string; source: string; type: 'active' | 'passive'; amount: string }[]
  >([
    { id: '1', source: 'Monthly Salary / Professional Income', type: 'active', amount: '' },
  ])

  const [expenses, setExpenses] = useState<
    { id: string; description: string; category: 'needs' | 'wants' | 'emi_payments' | 'other'; amount: string }[]
  >([
    { id: '1', description: 'Rent & Household Needs', category: 'needs', amount: '' },
    { id: '2', description: 'Dining Out, Entertainment & Shopping', category: 'wants', amount: '' },
  ])

  const addIncomeRow = () => {
    setIncomes([
      ...incomes,
      { id: String(Date.now()), source: '', type: 'passive', amount: '' },
    ])
  }

  const removeIncomeRow = (id: string) => {
    setIncomes(incomes.filter((i) => i.id !== id))
  }

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      { id: String(Date.now()), description: '', category: 'needs', amount: '' },
    ])
  }

  const removeExpenseRow = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    try {
      const monthDate = `${selectedMonthStr}-01`
      const validIncomes = incomes
        .filter((i) => i.source.trim() && Number(i.amount) > 0)
        .map((i) => ({
          month: monthDate,
          source: i.source.trim(),
          type: i.type,
          amount: Number(i.amount),
        }))

      const validExpenses = expenses
        .filter((e) => e.description.trim() && Number(e.amount) > 0)
        .map((e) => ({
          month: monthDate,
          description: e.description.trim(),
          category: e.category,
          amount: Number(e.amount),
        }))

      await batchMonthlyCheckin({
        month: monthDate,
        cashAmount: cashAmount ? Number(cashAmount) : undefined,
        incomes: validIncomes,
        expenses: validExpenses,
      })

      onClose()
      setStep(1)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalStepIncome = incomes.reduce(
    (sum, i) => sum + (Number(i.amount) || 0),
    0
  )
  const totalStepPassive = incomes
    .filter((i) => i.type === 'passive')
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0)

  const totalStepExpenses = expenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  )

  const displayDateStr = format(new Date(`${selectedMonthStr}-15`), 'MMMM yyyy')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Monthly Check-in</span>
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {displayDateStr}
          </span>
        </div>
      }
      description="A quick 3-step guided flow to record cash on hand, income sources, and expenses for this month."
      maxWidth="lg"
    >
      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { num: 1, title: 'Cash Balance', icon: <Wallet className="h-3.5 w-3.5" /> },
          { num: 2, title: 'Incomes', icon: <TrendingUp className="h-3.5 w-3.5" /> },
          { num: 3, title: 'Expenses', icon: <Receipt className="h-3.5 w-3.5" /> },
          { num: 4, title: 'Review', icon: <Sparkles className="h-3.5 w-3.5" /> },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
              step === s.num
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : step > s.num
                ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50'
            }`}
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]">
              {step > s.num ? <Check className="h-3 w-3" /> : s.num}
            </span>
            <span className="truncate hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: CASH */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
              Step 1 of 3: Bank & Cash Balances
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              What is your total liquid cash across all bank accounts and emergency funds as of {displayDateStr}?
            </p>
          </div>
          <Input
            label="Total Liquid Cash (₹)"
            type="number"
            min="0"
            step="any"
            leftPrefix="₹"
            placeholder="e.g. 3,50,000"
            value={cashAmount}
            onChange={(e) => setCashAmount(e.target.value)}
            autoFocus
          />
          <Input
            label="Notes / Account Breakdown (Optional)"
            placeholder="e.g. ₹2.5L in HDFC salary + ₹1L in ICICI emergency sweep"
            value={cashNotes}
            onChange={(e) => setCashNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue to Incomes
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: INCOMES */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Step 2 of 3: Log Incomes
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Log all active salaries, freelancing, dividends, or passive distributions.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={addIncomeRow}
              leftIcon={<Plus className="h-3 w-3" />}
            >
              Add Row
            </Button>
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {incomes.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs"
              >
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Income source name"
                    value={item.source}
                    onChange={(e) => {
                      const updated = [...incomes]
                      updated[idx].source = e.target.value
                      setIncomes(updated)
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 sm:w-36">
                    <Select
                      value={item.type}
                      onChange={(e) => {
                        const updated = [...incomes]
                        updated[idx].type = e.target.value as any
                        setIncomes(updated)
                      }}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'passive', label: 'Passive ⭐' },
                      ]}
                    />
                  </div>
                  <div className="flex-1 sm:w-32">
                    <Input
                      type="number"
                      leftPrefix="₹"
                      placeholder="0"
                      value={item.amount}
                      onChange={(e) => {
                        const updated = [...incomes]
                        updated[idx].amount = e.target.value
                        setIncomes(updated)
                      }}
                    />
                  </div>
                  {incomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIncomeRow(item.id)}
                      className="p-2 text-zinc-400 hover:text-rose-600 active:scale-95 transition-colors shrink-0"
                      title="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Total Logged: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{formatIndianCurrency(totalStepIncome)}</strong>
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue to Expenses
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EXPENSES */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Step 3 of 3: Log Monthly Expenses
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Log living expenses, needs, wants, and EMIs paid during this month.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={addExpenseRow}
              leftIcon={<Plus className="h-3 w-3" />}
            >
              Add Row
            </Button>
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {expenses.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs"
              >
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Expense description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...expenses]
                      updated[idx].description = e.target.value
                      setExpenses(updated)
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 sm:w-36">
                    <Select
                      value={item.category}
                      onChange={(e) => {
                        const updated = [...expenses]
                        updated[idx].category = e.target.value as any
                        setExpenses(updated)
                      }}
                      options={[
                        { value: 'needs', label: 'Needs' },
                        { value: 'wants', label: 'Wants' },
                        { value: 'emi_payments', label: 'EMI / Debt' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                  <div className="flex-1 sm:w-32">
                    <Input
                      type="number"
                      leftPrefix="₹"
                      placeholder="0"
                      value={item.amount}
                      onChange={(e) => {
                        const updated = [...expenses]
                        updated[idx].amount = e.target.value
                        setExpenses(updated)
                      }}
                    />
                  </div>
                  {expenses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpenseRow(item.id)}
                      className="p-2 text-zinc-400 hover:text-rose-600 active:scale-95 transition-colors shrink-0"
                      title="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Total Expenses: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{formatIndianCurrency(totalStepExpenses)}</strong>
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(4)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Review Summary
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SAVE */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Check-in Summary for {displayDateStr}
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500 text-[11px]">Liquid Cash Balance</span>
                <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {formatIndianCurrency(Number(cashAmount) || 0)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500 text-[11px]">Total Monthly Income</span>
                <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {formatIndianCurrency(totalStepIncome)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500 text-[11px]">Total Monthly Expenses</span>
                <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {formatIndianCurrency(totalStepExpenses)}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-zinc-500 text-[11px]">Passive Cashflow</span>
                <p className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatIndianCurrency(totalStepPassive)}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/40 text-xs">
              <span className="text-zinc-500 text-[11px]">Net Monthly Cash Surplus / Deficit</span>
              <p
                className={`font-mono text-base font-bold mt-0.5 ${
                  totalStepIncome >= totalStepExpenses
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatIndianCurrency(totalStepIncome - totalStepExpenses, { showSign: true })}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" size="sm" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleFinish}
              isLoading={isSubmitting}
              leftIcon={<Check className="h-4 w-4" />}
            >
              Complete Check-in
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
