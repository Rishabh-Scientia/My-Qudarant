import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { useFinanceMutations } from '../../hooks/useFinanceMutations'
import { PlusCircle, TrendingUp, CreditCard, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'

export type QuickAddTab = 'asset' | 'liability' | 'income' | 'expense' | 'cash'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: QuickAddTab
  selectedMonthStr: string
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'income',
  selectedMonthStr,
}) => {
  const [activeTab, setActiveTab] = useState<QuickAddTab>(initialTab)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    addAsset,
    addLiability,
    addIncome,
    addExpense,
    setCashHolding,
  } = useFinanceMutations()

  // Form states
  const [assetData, setAssetData] = useState({
    name: '',
    category: 'mutual_funds' as any,
    current_value: '',
    monthly_income_generated: '',
    notes: '',
  })

  const [liabilityData, setLiabilityData] = useState({
    name: '',
    category: 'home_loan',
    is_good_debt: false,
    outstanding_amount: '',
    monthly_emi: '',
    interest_rate: '',
  })

  const [incomeData, setIncomeData] = useState({
    source: '',
    type: 'active' as any,
    amount: '',
  })

  const [expenseData, setExpenseData] = useState({
    description: '',
    category: 'needs' as any,
    amount: '',
  })

  const [cashData, setCashData] = useState({
    amount: '',
    notes: '',
  })

  const resetForms = () => {
    setAssetData({
      name: '',
      category: 'mutual_funds',
      current_value: '',
      monthly_income_generated: '',
      notes: '',
    })
    setLiabilityData({
      name: '',
      category: 'home_loan',
      is_good_debt: false,
      outstanding_amount: '',
      monthly_emi: '',
      interest_rate: '',
    })
    setIncomeData({
      source: '',
      type: 'active',
      amount: '',
    })
    setExpenseData({
      description: '',
      category: 'needs',
      amount: '',
    })
    setCashData({
      amount: '',
      notes: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const monthDate = `${selectedMonthStr}-01`

    try {
      if (activeTab === 'asset') {
        await addAsset({
          name: assetData.name,
          category: assetData.category,
          current_value: Number(assetData.current_value) || 0,
          monthly_income_generated: Number(assetData.monthly_income_generated) || 0,
          notes: assetData.notes || undefined,
        })
      } else if (activeTab === 'liability') {
        await addLiability({
          name: liabilityData.name,
          category: liabilityData.category,
          is_good_debt: liabilityData.is_good_debt,
          outstanding_amount: Number(liabilityData.outstanding_amount) || 0,
          monthly_emi: Number(liabilityData.monthly_emi) || 0,
          interest_rate: Number(liabilityData.interest_rate) || 0,
        })
      } else if (activeTab === 'income') {
        await addIncome({
          month: monthDate,
          source: incomeData.source,
          type: incomeData.type,
          amount: Number(incomeData.amount) || 0,
        })
      } else if (activeTab === 'expense') {
        await addExpense({
          month: monthDate,
          category: expenseData.category,
          description: expenseData.description || null,
          amount: Number(expenseData.amount) || 0,
        })
      } else if (activeTab === 'cash') {
        await setCashHolding({
          month: monthDate,
          amount: Number(cashData.amount) || 0,
          notes: cashData.notes || undefined,
        })
      }
      resetForms()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs: { id: QuickAddTab; label: string; icon: React.ReactNode }[] = [
    { id: 'income', label: 'Income', icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
    { id: 'expense', label: 'Expense', icon: <ArrowDownRight className="h-3.5 w-3.5" /> },
    { id: 'asset', label: 'Asset', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { id: 'liability', label: 'Liability', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: 'cash', label: 'Liquid Cash', icon: <Wallet className="h-3.5 w-3.5" /> },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Add Entry"
      description="Quickly record assets, liabilities, income, expenses or liquid cash."
      maxWidth="md"
    >
      {/* Category selector pills */}
      <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* INCOME TAB */}
        {activeTab === 'income' && (
          <>
            <Input
              label="Income Source"
              required
              placeholder="e.g. Infosys Monthly Salary, Freelance Frontend Work, ITC Dividends"
              value={incomeData.source}
              onChange={(e) => setIncomeData({ ...incomeData, source: e.target.value })}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Quadrant Type"
                value={incomeData.type}
                onChange={(e) =>
                  setIncomeData({ ...incomeData, type: e.target.value as any })
                }
                options={[
                  { value: 'active', label: 'Active Income (E / S quadrant)' },
                  { value: 'passive', label: 'Passive Income (B / I quadrant)' },
                ]}
              />
              <Input
                label="Monthly Amount"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                placeholder="1,50,000"
                value={incomeData.amount}
                onChange={(e) => setIncomeData({ ...incomeData, amount: e.target.value })}
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              {incomeData.type === 'passive'
                ? '⭐ Passive income moves you directly towards escaping the rat race.'
                : 'Active income funds your savings and asset accumulation.'}
            </p>
          </>
        )}

        {/* EXPENSE TAB */}
        {activeTab === 'expense' && (
          <>
            <Input
              label="Expense Description"
              required
              placeholder="e.g. House Rent & Groceries, Swiggy / Dining Out, Electricity Bill"
              value={expenseData.description}
              onChange={(e) =>
                setExpenseData({ ...expenseData, description: e.target.value })
              }
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Expense Category"
                value={expenseData.category}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, category: e.target.value as any })
                }
                options={[
                  { value: 'needs', label: 'Needs (Rent, Groceries, Utilities)' },
                  { value: 'wants', label: 'Wants (Dining, Gadgets, Vacation)' },
                  { value: 'emi_payments', label: 'EMI / Debt Payments' },
                  { value: 'other', label: 'Other Miscellaneous' },
                ]}
              />
              <Input
                label="Amount"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                placeholder="25,000"
                value={expenseData.amount}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, amount: e.target.value })
                }
              />
            </div>
          </>
        )}

        {/* ASSET TAB */}
        {activeTab === 'asset' && (
          <>
            <Input
              label="Asset Name"
              required
              placeholder="e.g. Paranjape 2BHK Flat, Nifty 50 SIP, Gold ETF, SaaS Startup"
              value={assetData.name}
              onChange={(e) => setAssetData({ ...assetData, name: e.target.value })}
              autoFocus
            />
            <Select
              label="Asset Class"
              value={assetData.category}
              onChange={(e) =>
                setAssetData({ ...assetData, category: e.target.value as any })
              }
              options={[
                { value: 'mutual_funds', label: 'Mutual Funds / SIP' },
                { value: 'stocks', label: 'Direct Indian Stocks' },
                { value: 'real_estate', label: 'Real Estate / Land / Flat' },
                { value: 'gold', label: 'Gold / SGB' },
                { value: 'business', label: 'Business / Side Hustle / IP' },
                { value: 'fd_rd', label: 'Fixed Deposit / RD / PPF / EPF' },
                { value: 'other', label: 'Other Asset' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Current Portfolio Value"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                placeholder="10,00,000"
                value={assetData.current_value}
                onChange={(e) =>
                  setAssetData({ ...assetData, current_value: e.target.value })
                }
              />
              <Input
                label="Monthly Cashflow Yield"
                type="number"
                min="0"
                step="any"
                leftPrefix="₹"
                placeholder="0"
                helperText="Monthly rent, dividend, or royalties generated"
                value={assetData.monthly_income_generated}
                onChange={(e) =>
                  setAssetData({
                    ...assetData,
                    monthly_income_generated: e.target.value,
                  })
                }
              />
            </div>
            <Input
              label="Notes (Optional)"
              placeholder="e.g. 5-year lockin, 12% target CAGR"
              value={assetData.notes}
              onChange={(e) => setAssetData({ ...assetData, notes: e.target.value })}
            />
          </>
        )}

        {/* LIABILITY TAB */}
        {activeTab === 'liability' && (
          <>
            <Input
              label="Liability Name"
              required
              placeholder="e.g. SBI Home Loan, ICICI Car Loan, HDFC Diners Card"
              value={liabilityData.name}
              onChange={(e) =>
                setLiabilityData({ ...liabilityData, name: e.target.value })
              }
              autoFocus
            />
            <Select
              label="Debt Type"
              value={liabilityData.category}
              onChange={(e) =>
                setLiabilityData({ ...liabilityData, category: e.target.value })
              }
              options={[
                { value: 'home_loan', label: 'Home Loan' },
                { value: 'car_loan', label: 'Car Loan' },
                { value: 'personal_loan', label: 'Personal Loan' },
                { value: 'credit_card', label: 'Credit Card Debt' },
                { value: 'business_loan', label: 'Business / Commercial Loan' },
                { value: 'education_loan', label: 'Education Loan' },
                { value: 'gold_loan', label: 'Gold Loan' },
                { value: 'other', label: 'Other Debt' },
              ]}
            />
            <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={liabilityData.is_good_debt}
                  onChange={(e) =>
                    setLiabilityData({
                      ...liabilityData,
                      is_good_debt: e.target.checked,
                    })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Good Debt (funds cash-flowing / appreciating assets)
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Check this if someone else pays the debt (e.g. rental flat tenant) or if it generates more cashflow than the interest cost.
                  </p>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Outstanding Principal"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                placeholder="25,00,000"
                value={liabilityData.outstanding_amount}
                onChange={(e) =>
                  setLiabilityData({
                    ...liabilityData,
                    outstanding_amount: e.target.value,
                  })
                }
              />
              <Input
                label="Monthly EMI"
                type="number"
                min="0"
                step="any"
                leftPrefix="₹"
                placeholder="22,000"
                value={liabilityData.monthly_emi}
                onChange={(e) =>
                  setLiabilityData({ ...liabilityData, monthly_emi: e.target.value })
                }
              />
              <Input
                label="Interest %"
                type="number"
                min="0"
                step="0.01"
                rightSuffix="%"
                placeholder="8.5"
                value={liabilityData.interest_rate}
                onChange={(e) =>
                  setLiabilityData({
                    ...liabilityData,
                    interest_rate: e.target.value,
                  })
                }
              />
            </div>
          </>
        )}

        {/* CASH TAB */}
        {activeTab === 'cash' && (
          <>
            <Input
              label="Liquid Cash / Bank Balance for Month"
              type="number"
              min="0"
              step="any"
              required
              leftPrefix="₹"
              placeholder="3,50,000"
              helperText="Includes all savings accounts, emergency fund, and cash on hand for the current month."
              value={cashData.amount}
              onChange={(e) => setCashData({ ...cashData, amount: e.target.value })}
              autoFocus
            />
            <Input
              label="Notes"
              placeholder="e.g. HDFC Salary account + ICICI emergency fund in sweep-in FD"
              value={cashData.notes}
              onChange={(e) => setCashData({ ...cashData, notes: e.target.value })}
            />
          </>
        )}

        <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
