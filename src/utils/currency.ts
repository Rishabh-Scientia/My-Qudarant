/**
 * Formats a number into Indian Rupees (INR) with standard Indian comma grouping (Lakhs/Crores)
 * e.g., 1234567 -> "₹12,34,567"
 */
export function formatIndianCurrency(
  amount: number | null | undefined,
  options?: {
    compact?: boolean
    showSign?: boolean
    hideSymbol?: boolean
  }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return options?.hideSymbol ? '0' : '₹0'
  }

  const isNegative = amount < 0
  const absAmount = Math.abs(amount)

  if (options?.compact) {
    let formattedCompact = ''
    if (absAmount >= 10000000) {
      // Crores
      formattedCompact = `${(absAmount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
    } else if (absAmount >= 100000) {
      // Lakhs
      formattedCompact = `${(absAmount / 100000).toFixed(2).replace(/\.00$/, '')} L`
    } else if (absAmount >= 1000) {
      // Thousands
      formattedCompact = `${(absAmount / 1000).toFixed(1).replace(/\.0$/, '')} K`
    } else {
      formattedCompact = absAmount.toString()
    }

    const prefix = options?.hideSymbol ? '' : '₹'
    if (isNegative) {
      return `-${prefix}${formattedCompact}`
    }
    if (options?.showSign && amount > 0) {
      return `+${prefix}${formattedCompact}`
    }
    return `${prefix}${formattedCompact}`
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  const formatted = formatter.format(absAmount)
  const symbol = options?.hideSymbol ? '' : '₹'

  if (isNegative) {
    return `-${symbol}${formatted}`
  }
  if (options?.showSign && amount > 0) {
    return `+${symbol}${formatted}`
  }
  return `${symbol}${formatted}`
}

/**
 * Parses numeric input string that may contain commas or ₹ signs
 */
export function parseCurrencyInput(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value
  if (!value) return 0
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) return '0%'
  return `${value.toFixed(decimals)}%`
}
