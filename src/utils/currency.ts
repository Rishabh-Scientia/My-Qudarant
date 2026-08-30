/**
 * Formats a number into Indian Rupees (INR) with standard Indian comma grouping (Lakhs/Crores)
 * e.g., 1234567 -> "₹12,34,567"
 */
export function formatIndianCurrency(
  amount: number | null | undefined,
  options?: {
    compact?: boolean
    autoCompact?: boolean
    showSign?: boolean
    hideSymbol?: boolean
  }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return options?.hideSymbol ? '0' : '₹0'
  }

  const isNegative = amount < 0
  const absAmount = Math.abs(amount)
  const prefix = options?.hideSymbol ? '' : '₹'

  // If compact is explicitly true, or autoCompact is true and amount >= 10 Lakhs (1,000,000)
  const shouldCompact = options?.compact || (options?.autoCompact && absAmount >= 1000000)

  if (shouldCompact) {
    let formattedCompact = ''
    if (absAmount >= 10000000) {
      // Crores (>= 1 Cr)
      const inCr = absAmount / 10000000
      const formattedNum = inCr >= 10 ? inCr.toFixed(1).replace(/\.0$/, '') : inCr.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1')
      formattedCompact = `${formattedNum} Cr`
    } else if (absAmount >= 100000) {
      // Lakhs (>= 1 Lakh)
      const inL = absAmount / 100000
      const formattedNum = inL >= 10 ? inL.toFixed(1).replace(/\.0$/, '') : inL.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1')
      formattedCompact = `${formattedNum} L`
    } else if (absAmount >= 1000 && options?.compact) {
      // Thousands (only for explicit compact)
      formattedCompact = `${(absAmount / 1000).toFixed(1).replace(/\.0$/, '')} K`
    } else {
      formattedCompact = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(absAmount)
    }

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

  if (isNegative) {
    return `-${prefix}${formatted}`
  }
  if (options?.showSign && amount > 0) {
    return `+${prefix}${formatted}`
  }
  return `${prefix}${formatted}`
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
