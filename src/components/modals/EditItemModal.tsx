import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Asset, Liability, IncomeEntry, ExpenseEntry, CashHolding } from '../../types/finance'
import { useFinanceMutations } from '../../hooks/useFinanceMutations'

export type EditableItem =
  | { type: 'asset'; data: Asset }
  | { type: 'liability'; data: Liability }
  | { type: 'income'; data: IncomeEntry }
  | { type: 'expense'; data: ExpenseEntry }
  | { type: 'cash'; data: CashHolding }

interface EditItemModalProps {
  item: EditableItem | null
  isOpen: boolean
  onClose: () => void
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const {
    updateAsset,
    updateLiability,
    updateIncome,
    updateExpense,
    setCashHolding,
  } = useFinanceMutations()

  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({ ...item.data })
    }
  }, [item])

  if (!item) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (item.type === 'asset') {
        await updateAsset({
          id: item.data.id,
          updates: {
            name: formData.name,
            category: formData.category,
            current_value: Number(formData.current_value) || 0,
            monthly_income_generated: Number(formData.monthly_income_generated) || 0,
            notes: formData.notes,
          },
        })
      } else if (item.type === 'liability') {
        await updateLiability({
          id: item.data.id,
          updates: {
            name: formData.name,
            category: formData.category,
            is_good_debt: Boolean(formData.is_good_debt),
            outstanding_amount: Number(formData.outstanding_amount) || 0,
            monthly_emi: Number(formData.monthly_emi) || 0,
            interest_rate: Number(formData.interest_rate) || 0,
          },
        })
      } else if (item.type === 'income') {
        await updateIncome({
          id: item.data.id,
          updates: {
            source: formData.source,
            type: formData.type,
            amount: Number(formData.amount) || 0,
          },
        })
      } else if (item.type === 'expense') {
        await updateExpense({
          id: item.data.id,
          updates: {
            description: formData.description,
            category: formData.category,
            amount: Number(formData.amount) || 0,
          },
        })
      } else if (item.type === 'cash') {
        await setCashHolding({
          month: item.data.month,
          amount: Number(formData.amount) || 0,
          notes: formData.notes,
        })
      }
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitle = () => {
    switch (item.type) {
      case 'asset':
        return 'Edit Asset'
      case 'liability':
        return 'Edit Liability'
      case 'income':
        return 'Edit Income'
      case 'expense':
        return 'Edit Expense'
      case 'cash':
        return 'Edit Cash on Hand'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      description="Update record details and recalculated metrics will update instantly."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* ASSET FORM */}
        {item.type === 'asset' && (
          <>
            <Input
              label="Asset Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. 2BHK Flat, Nifty 50 Index SIP, Gold"
            />
            <Select
              label="Category"
              value={formData.category || 'other'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'real_estate', label: 'Real Estate' },
                { value: 'mutual_funds', label: 'Mutual Funds / SIP' },
                { value: 'stocks', label: 'Direct Stocks' },
                { value: 'business', label: 'Business / Side-hustle' },
                { value: 'gold', label: 'Gold / SGB' },
                { value: 'fd_rd', label: 'FD / RD / PPF' },
                { value: 'other', label: 'Other Asset' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Current Market Value"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                value={formData.current_value ?? ''}
                onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
              />
              <Input
                label="Monthly Passive Income"
                type="number"
                min="0"
                step="any"
                leftPrefix="₹"
                helperText="Rental, dividends or royalties"
                value={formData.monthly_income_generated ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_income_generated: e.target.value })
                }
              />
            </div>
            <Input
              label="Notes (Optional)"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        )}

        {/* LIABILITY FORM */}
        {item.type === 'liability' && (
          <>
            <Input
              label="Liability Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. SBI Home Loan, HDFC Regalia"
            />
            <Select
              label="Category"
              value={formData.category || 'personal_loan'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'home_loan', label: 'Home Loan' },
                { value: 'car_loan', label: 'Car Loan' },
                { value: 'personal_loan', label: 'Personal Loan' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'business_loan', label: 'Business Loan' },
                { value: 'education_loan', label: 'Education Loan' },
                { value: 'gold_loan', label: 'Gold Loan' },
                { value: 'other', label: 'Other Debt' },
              ]}
            />
            <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_good_debt)}
                  onChange={(e) =>
                    setFormData({ ...formData, is_good_debt: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Good Debt (Rich Dad Principle)
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Funds an asset that pays you or appreciates (e.g. rental property loan, business loan) rather than depreciating consumption.
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
                value={formData.outstanding_amount ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, outstanding_amount: e.target.value })
                }
              />
              <Input
                label="Monthly EMI"
                type="number"
                min="0"
                step="any"
                leftPrefix="₹"
                value={formData.monthly_emi ?? ''}
                onChange={(e) => setFormData({ ...formData, monthly_emi: e.target.value })}
              />
              <Input
                label="Interest Rate"
                type="number"
                min="0"
                step="0.01"
                rightSuffix="%"
                value={formData.interest_rate ?? ''}
                onChange={(e) =>
                  setFormData({ ...formData, interest_rate: e.target.value })
                }
              />
            </div>
          </>
        )}

        {/* INCOME FORM */}
        {item.type === 'income' && (
          <>
            <Input
              label="Source Description"
              required
              value={formData.source || ''}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g. Primary Tech Salary, Consulting, Stock Dividends"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Income Type"
                value={formData.type || 'active'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: 'active', label: 'Active Income (E / S quadrant - requires time)' },
                  { value: 'passive', label: 'Passive Income (B / I quadrant - cashflow)' },
                ]}
              />
              <Input
                label="Amount"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                value={formData.amount ?? ''}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </>
        )}

        {/* EXPENSE FORM */}
        {item.type === 'expense' && (
          <>
            <Input
              label="Description"
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Groceries & Rent, Dining out, Electricity"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category"
                value={formData.category || 'needs'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: 'needs', label: 'Needs (Groceries, Utilities, Healthcare)' },
                  { value: 'wants', label: 'Wants (Entertainment, Dining, Shopping)' },
                  { value: 'emi_payments', label: 'EMI Payments' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <Input
                label="Amount"
                type="number"
                min="0"
                step="any"
                required
                leftPrefix="₹"
                value={formData.amount ?? ''}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </>
        )}

        {/* CASH FORM */}
        {item.type === 'cash' && (
          <>
            <Input
              label="Liquid Cash / Bank Balance"
              type="number"
              min="0"
              step="any"
              required
              leftPrefix="₹"
              value={formData.amount ?? ''}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              helperText="Combined total across all savings accounts and emergency cash for this month."
            />
            <Input
              label="Notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. HDFC Salary account + ICICI emergency fund"
            />
          </>
        )}

        <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
