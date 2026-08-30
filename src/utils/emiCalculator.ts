import { addMonths, format, parseISO, isValid } from 'date-fns'

export interface AmortizationMonth {
  monthIndex: number
  installmentNumber: number
  paymentDate: string // Formatted e.g. "15 Oct 2026"
  rawDate: Date
  yearNumber: number
  monthInYear: number
  emiAmount: number
  principalPaid: number
  interestPaid: number
  remainingBalance: number
  totalPrincipalPaidSoFar: number
  totalInterestPaidSoFar: number
  percentagePaid: number
  extraPayment?: number
}

export interface AmortizationYear {
  yearNumber: number
  yearLabel: string // e.g. "Year 1 (Oct 2026 - Sep 2027)"
  totalEmi: number
  totalPrincipal: number
  totalInterest: number
  endingBalance: number
  months: AmortizationMonth[]
}

export interface LoanCalculationResult {
  principal: number
  annualRate: number
  tenureMonths: number
  disbursementDate: string
  monthlyEmi: number
  totalInterest: number
  totalPayment: number
  interestRatio: number // % of total payment that is interest
  principalRatio: number // % of total payment that is principal
  loanEndDate: string
  monthlySchedule: AmortizationMonth[]
  yearlySchedule: AmortizationYear[]
}

/**
 * Calculates standard monthly EMI using reducing balance formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || tenureMonths <= 0) return 0
  if (annualInterestRate <= 0) {
    return Math.round(principal / tenureMonths)
  }

  const monthlyRate = annualInterestRate / (12 * 100)
  const compoundFactor = Math.pow(1 + monthlyRate, tenureMonths)
  const emi = (principal * monthlyRate * compoundFactor) / (compoundFactor - 1)

  return Math.round(emi)
}

/**
 * Generates detailed month-by-month and year-by-year amortization schedule
 */
export function calculateLoanDetails(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  disbursementDateStr: string = format(new Date(), 'yyyy-MM-dd'),
  extraMonthlyPayment: number = 0
): LoanCalculationResult {
  const safePrincipal = Math.max(0, principal)
  const safeRate = Math.max(0, annualInterestRate)
  const safeTenure = Math.max(1, Math.min(600, tenureMonths)) // Cap at 50 years max
  const safeExtra = Math.max(0, extraMonthlyPayment)

  let baseDate = new Date()
  try {
    const parsed = parseISO(disbursementDateStr)
    if (isValid(parsed)) {
      baseDate = parsed
    }
  } catch {
    baseDate = new Date()
  }

  const standardEmi = calculateEmi(safePrincipal, safeRate, safeTenure)
  const monthlyRate = safeRate / (12 * 100)

  let currentBalance = safePrincipal
  let totalPrincipalPaid = 0
  let totalInterestPaid = 0
  const monthlySchedule: AmortizationMonth[] = []

  let monthCounter = 0
  // Generate payments until balance is zero or maximum safety iteration
  while (currentBalance > 0.01 && monthCounter < safeTenure * 2) {
    monthCounter++
    const currentDate = addMonths(baseDate, monthCounter)

    // Calculate interest for this month
    const interestForMonth = safeRate > 0 ? currentBalance * monthlyRate : 0
    let principalForMonth = standardEmi - interestForMonth + safeExtra

    // Adjust for final month payoff
    let actualEmiThisMonth = standardEmi + safeExtra
    if (principalForMonth >= currentBalance) {
      principalForMonth = currentBalance
      actualEmiThisMonth = principalForMonth + interestForMonth
      currentBalance = 0
    } else {
      currentBalance = currentBalance - principalForMonth
    }

    totalPrincipalPaid += principalForMonth
    totalInterestPaid += interestForMonth

    const percentagePaid = safePrincipal > 0
      ? Math.min(100, (totalPrincipalPaid / safePrincipal) * 100)
      : 100

    const yearNumber = Math.ceil(monthCounter / 12)
    const monthInYear = ((monthCounter - 1) % 12) + 1

    monthlySchedule.push({
      monthIndex: monthCounter - 1,
      installmentNumber: monthCounter,
      paymentDate: format(currentDate, 'dd MMM yyyy'),
      rawDate: currentDate,
      yearNumber,
      monthInYear,
      emiAmount: Math.round(actualEmiThisMonth),
      principalPaid: Math.round(principalForMonth),
      interestPaid: Math.round(interestForMonth),
      remainingBalance: Math.max(0, Math.round(currentBalance)),
      totalPrincipalPaidSoFar: Math.round(totalPrincipalPaid),
      totalInterestPaidSoFar: Math.round(totalInterestPaid),
      percentagePaid: Number(percentagePaid.toFixed(1)),
      extraPayment: safeExtra > 0 ? safeExtra : undefined,
    })

    if (currentBalance <= 0.01) break
  }

  // Aggregate into Yearly Schedule
  const yearlyMap = new Map<number, AmortizationMonth[]>()
  monthlySchedule.forEach((item) => {
    const existing = yearlyMap.get(item.yearNumber) || []
    existing.push(item)
    yearlyMap.set(item.yearNumber, existing)
  })

  const yearlySchedule: AmortizationYear[] = []
  yearlyMap.forEach((months, yearNumber) => {
    const totalEmi = months.reduce((s, m) => s + m.emiAmount, 0)
    const totalPrincipal = months.reduce((s, m) => s + m.principalPaid, 0)
    const totalInterest = months.reduce((s, m) => s + m.interestPaid, 0)
    const endingBalance = months[months.length - 1].remainingBalance

    const firstMonthDate = format(months[0].rawDate, 'MMM yyyy')
    const lastMonthDate = format(months[months.length - 1].rawDate, 'MMM yyyy')

    yearlySchedule.push({
      yearNumber,
      yearLabel: `Year ${yearNumber} (${firstMonthDate} - ${lastMonthDate})`,
      totalEmi,
      totalPrincipal,
      totalInterest,
      endingBalance,
      months,
    })
  })

  const totalPayment = Math.round(totalPrincipalPaid + totalInterestPaid)
  const interestRatio = totalPayment > 0 ? (totalInterestPaid / totalPayment) * 100 : 0
  const principalRatio = totalPayment > 0 ? (totalPrincipalPaid / totalPayment) * 100 : 0

  const lastInstallment = monthlySchedule[monthlySchedule.length - 1]
  const loanEndDate = lastInstallment ? lastInstallment.paymentDate : format(baseDate, 'dd MMM yyyy')

  return {
    principal: safePrincipal,
    annualRate: safeRate,
    tenureMonths: monthlySchedule.length,
    disbursementDate: disbursementDateStr,
    monthlyEmi: standardEmi,
    totalInterest: Math.round(totalInterestPaid),
    totalPayment,
    interestRatio: Number(interestRatio.toFixed(1)),
    principalRatio: Number(principalRatio.toFixed(1)),
    loanEndDate,
    monthlySchedule,
    yearlySchedule,
  }
}

/**
 * Generates and triggers download of CSV amortization schedule
 */
export function downloadAmortizationCsv(result: LoanCalculationResult) {
  const headers = [
    'Installment #',
    'Payment Date',
    'Year',
    'Monthly EMI (INR)',
    'Principal Component (INR)',
    'Interest Component (INR)',
    'Remaining Balance (INR)',
    'Cumulative Principal Paid (INR)',
    'Cumulative Interest Paid (INR)',
    'Loan Paid (%)',
  ]

  const rows = result.monthlySchedule.map((m) => [
    m.installmentNumber,
    `"${m.paymentDate}"`,
    m.yearNumber,
    m.emiAmount,
    m.principalPaid,
    m.interestPaid,
    m.remainingBalance,
    m.totalPrincipalPaidSoFar,
    m.totalInterestPaidSoFar,
    `${m.percentagePaid}%`,
  ])

  const csvMeta = [
    ['--- LOAN EMI SUMMARY ---'],
    ['Principal Loan Amount', `INR ${result.principal}`],
    ['Annual Interest Rate', `${result.annualRate}%`],
    ['Loan Tenure (Months)', `${result.tenureMonths}`],
    ['Disbursement Date', result.disbursementDate],
    ['Monthly EMI', `INR ${result.monthlyEmi}`],
    ['Total Interest Payable', `INR ${result.totalInterest}`],
    ['Total Amount Payable', `INR ${result.totalPayment}`],
    ['Loan Payoff Date', result.loanEndDate],
    ['Generated By', 'My Quadrant - Cashflow & EMI Pro (my-quadrant.app)'],
    ['Date Generated', format(new Date(), 'dd-MMM-yyyy HH:mm')],
    [],
    ['--- MONTHLY AMORTIZATION SCHEDULE ---'],
  ]

  const metaString = csvMeta.map((row) => row.join(',')).join('\n')
  const tableString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const csvContent = `${metaString}\n\n${tableString}`

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `loan_emi_schedule_${result.principal}_${result.annualRate}pct_${format(new Date(), 'yyyyMMdd')}.csv`
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
