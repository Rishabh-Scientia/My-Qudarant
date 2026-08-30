import React, { useState, useMemo } from 'react'
import {
  calculateLoanDetails,
  downloadAmortizationCsv,
  LoanCalculationResult,
  AmortizationYear,
} from '../../utils/emiCalculator'
import { formatIndianCurrency } from '../../utils/currency'
import { format } from 'date-fns'
import {
  Calculator,
  Calendar,
  Percent,
  Download,
  Printer,
  Sparkles,
  Home,
  Car,
  User,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  Info,
  Layers,
  CalendarDays,
  ArrowLeft,
  Sun,
  Moon,
  Zap,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

interface LoanPreset {
  name: string
  icon: React.ReactNode
  principal: number
  rate: number
  tenureYears: number
  description: string
}

const PRESET_LOANS: LoanPreset[] = [
  {
    name: 'Home Loan',
    icon: <Home className="h-3.5 w-3.5" />,
    principal: 4000000,
    rate: 8.5,
    tenureYears: 20,
    description: 'Long tenure, asset-backed, tax deductions',
  },
  {
    name: 'Car Loan',
    icon: <Car className="h-3.5 w-3.5" />,
    principal: 800000,
    rate: 9.2,
    tenureYears: 5,
    description: 'Fixed tenure, depreciating vehicle asset',
  },
  {
    name: 'Personal Loan',
    icon: <User className="h-3.5 w-3.5" />,
    principal: 300000,
    rate: 12.5,
    tenureYears: 3,
    description: 'Unsecured, higher interest rate',
  },
  {
    name: 'Education Loan',
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    principal: 1500000,
    rate: 9.8,
    tenureYears: 7,
    description: 'Moratorium period, career investment',
  },
  {
    name: 'Business Loan',
    icon: <Briefcase className="h-3.5 w-3.5" />,
    principal: 2500000,
    rate: 13.5,
    tenureYears: 5,
    description: 'Working capital or business expansion',
  },
]

export const EmiCalculatorPage: React.FC = () => {
  // State for Inputs
  const [principal, setPrincipal] = useState<number>(2500000)
  const [annualRate, setAnnualRate] = useState<number>(8.5)
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years')
  const [tenureValue, setTenureValue] = useState<number>(15)
  const [disbursementDate, setDisbursementDate] = useState<string>(() =>
    format(new Date(), 'yyyy-MM-dd')
  )
  const [extraPayment, setExtraPayment] = useState<number>(0)
  const [showPrepayment, setShowPrepayment] = useState<boolean>(false)

  // Table view state
  const [tableMode, setTableMode] = useState<'yearly' | 'monthly'>('yearly')
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({ 1: true })
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Toggle Theme helper
  const handleToggleTheme = () => {
    const next = !darkMode
    setDarkMode(next)
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Calculate actual tenure in months
  const tenureMonths = useMemo(() => {
    return tenureType === 'years' ? tenureValue * 12 : tenureValue
  }, [tenureType, tenureValue])

  // Calculation result
  const result: LoanCalculationResult = useMemo(() => {
    return calculateLoanDetails(
      principal,
      annualRate,
      tenureMonths,
      disbursementDate,
      showPrepayment ? extraPayment : 0
    )
  }, [principal, annualRate, tenureMonths, disbursementDate, showPrepayment, extraPayment])

  // Baseline calculation (without prepayment) to show savings
  const baselineResult: LoanCalculationResult = useMemo(() => {
    return calculateLoanDetails(principal, annualRate, tenureMonths, disbursementDate, 0)
  }, [principal, annualRate, tenureMonths, disbursementDate])

  const interestSaved = useMemo(() => {
    if (!showPrepayment || extraPayment <= 0) return 0
    return Math.max(0, baselineResult.totalInterest - result.totalInterest)
  }, [baselineResult, result, showPrepayment, extraPayment])

  const monthsSaved = useMemo(() => {
    if (!showPrepayment || extraPayment <= 0) return 0
    return Math.max(0, baselineResult.tenureMonths - result.tenureMonths)
  }, [baselineResult, result, showPrepayment, extraPayment])

  // Preset Applicator
  const applyPreset = (preset: LoanPreset) => {
    setPrincipal(preset.principal)
    setAnnualRate(preset.rate)
    setTenureType('years')
    setTenureValue(preset.tenureYears)
  }

  // Quick Amount Adders
  const addPrincipal = (delta: number) => {
    setPrincipal((prev) => Math.max(10000, prev + delta))
  }

  // Toggle year accordion
  const toggleYear = (yearNum: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearNum]: !prev[yearNum],
    }))
  }

  const expandAllYears = () => {
    const all: Record<number, boolean> = {}
    result.yearlySchedule.forEach((y) => {
      all[y.yearNumber] = true
    })
    setExpandedYears(all)
  }

  const collapseAllYears = () => {
    setExpandedYears({})
  }

  // Pie chart data
  const pieData = useMemo(() => {
    return [
      {
        name: 'Principal Loan Amount',
        value: result.principal,
        color: '#10b981', // emerald-500
      },
      {
        name: 'Total Interest Payable',
        value: result.totalInterest,
        color: '#f59e0b', // amber-500
      },
    ]
  }, [result])

  // Trajectory area chart data (annual checkpoints)
  const trajectoryData = useMemo(() => {
    return result.yearlySchedule.map((y) => {
      const lastMonth = y.months[y.months.length - 1]
      return {
        name: `Yr ${y.yearNumber}`,
        yearLabel: y.yearLabel,
        remainingBalance: y.endingBalance,
        principalPaidSoFar: lastMonth.totalPrincipalPaidSoFar,
        interestPaidSoFar: lastMonth.totalInterestPaidSoFar,
      }
    })
  }, [result])

  // Filtered monthly schedule
  const filteredMonths = useMemo(() => {
    if (!searchTerm.trim()) return result.monthlySchedule
    const term = searchTerm.toLowerCase()
    return result.monthlySchedule.filter(
      (m) =>
        m.paymentDate.toLowerCase().includes(term) ||
        `month ${m.installmentNumber}`.includes(term) ||
        `year ${m.yearNumber}`.includes(term)
    )
  }, [result.monthlySchedule, searchTerm])

  const handlePrint = () => {
    window.print()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION HEADER                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-md transition-all shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleGoHome()
              }}
              className="flex items-center gap-2.5 group"
              title="Return to My Quadrant Home"
            >
              <div className="grid grid-cols-2 grid-rows-2 h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 p-0.5 text-[9px] font-bold text-white dark:text-zinc-900 leading-none shadow-xs group-hover:scale-105 transition-transform">
                <span className="flex items-center justify-center border-r border-b border-zinc-700 dark:border-zinc-300">E</span>
                <span className="flex items-center justify-center border-b border-zinc-700 dark:border-zinc-300 text-emerald-400 dark:text-emerald-600 font-extrabold">B</span>
                <span className="flex items-center justify-center border-r border-zinc-700 dark:border-zinc-300">S</span>
                <span className="flex items-center justify-center text-emerald-400 dark:text-emerald-600 font-extrabold">I</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    MY QUADRANT
                  </span>
                  <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 uppercase tracking-wide leading-none">
                    PRO TOOL
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium -mt-0.5 hidden xs:inline">
                  Loan EMI & Amortization Calculator
                </span>
              </div>
            </a>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Print Amortization Schedule"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>

            {/* CSV Export Button */}
            <button
              type="button"
              onClick={() => downloadAmortizationCsv(result)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-900 transition-colors shadow-xs"
              title="Download Amortization Schedule as CSV Spreadsheet"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xs:inline">Export</span> CSV
            </button>

            {/* Back to Quadrant App */}
            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to App</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO / PRESET BAR                                                     */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                Indian Loan EMI & Amortization Schedule Calculator
              </h1>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Accurate reducing-balance calculation with exact disbursement dates & month-by-month principal breakdown.
              </p>
            </div>
          </div>

          {/* Quick Loan Benchmark Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
              Presets:
            </span>
            {PRESET_LOANS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-2xs"
                title={`${preset.name}: ₹${(preset.principal / 100000).toFixed(1)}L @ ${preset.rate}% for ${preset.tenureYears} yrs`}
              >
                {preset.icon}
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CALCULATOR CORE MATRIX                                           */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: INTERACTIVE INPUT CONTROLS (5 Cols)                      */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold text-xs">
                    ₹
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                    Loan Parameters
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                  INR Format
                </span>
              </div>

              {/* 1. PRINCIPAL LOAN AMOUNT */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <span>Principal Loan Amount</span>
                    <span className="text-zinc-400 font-normal text-[11px]">(P)</span>
                  </label>
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-sm font-bold font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                    <span className="text-zinc-400 text-xs">₹</span>
                    <input
                      type="number"
                      min={10000}
                      max={100000000}
                      step={10000}
                      value={principal}
                      onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
                      className="w-28 bg-transparent text-right font-bold focus:outline-none tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="text-[11px] text-zinc-400 font-normal">Formatted in Words:</span>
                  <span className="font-mono">{formatIndianCurrency(principal)}</span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={50000}
                  max={20000000}
                  step={50000}
                  value={Math.min(20000000, principal)}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-200 rounded-lg dark:bg-zinc-800"
                />

                {/* Quick Add Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[100000, 500000, 1000000, 2500000, 5000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => addPrincipal(amt)}
                      className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      +₹{amt >= 10000000 ? `${amt / 10000000}Cr` : `${amt / 100000}L`}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPrincipal(2500000)}
                    className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* 2. INTEREST RATE (% P.A.) */}
              <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Annual Interest Rate</span>
                    <span className="text-zinc-400 font-normal text-[11px]">(R % P.A.)</span>
                  </label>
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-sm font-bold font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                    <input
                      type="number"
                      min={1}
                      max={35}
                      step={0.05}
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Math.max(0.1, Number(e.target.value) || 0))}
                      className="w-16 bg-transparent text-right font-bold focus:outline-none tabular-nums"
                    />
                    <span className="text-zinc-400 text-xs">%</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.1}
                  value={Math.min(25, annualRate)}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-200 rounded-lg dark:bg-zinc-800"
                />

                {/* Benchmark Interest Rates */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { label: '8.5% Home', val: 8.5 },
                    { label: '9.0% Car', val: 9.0 },
                    { label: '10.5% Edu', val: 10.5 },
                    { label: '12.0% Personal', val: 12.0 },
                    { label: '14.0% Biz', val: 14.0 },
                  ].map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => setAnnualRate(r.val)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        annualRate === r.val
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. LOAN TENURE (DURATION) */}
              <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Loan Tenure / Duration</span>
                    <span className="text-zinc-400 font-normal text-[11px]">(N)</span>
                  </label>

                  <div className="flex items-center gap-1">
                    {/* Tenure Mode Switcher */}
                    <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-800/80 mr-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (tenureType === 'months') {
                            setTenureType('years')
                            setTenureValue(Math.max(1, Math.round(tenureValue / 12)))
                          }
                        }}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition-all ${
                          tenureType === 'years'
                            ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-white'
                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        Years
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (tenureType === 'years') {
                            setTenureType('months')
                            setTenureValue(tenureValue * 12)
                          }
                        }}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition-all ${
                          tenureType === 'months'
                            ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-white'
                            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        Months
                      </button>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-50 px-2 py-1 text-sm font-bold font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                      <input
                        type="number"
                        min={1}
                        max={tenureType === 'years' ? 40 : 480}
                        value={tenureValue}
                        onChange={(e) => setTenureValue(Math.max(1, Number(e.target.value) || 1))}
                        className="w-12 bg-transparent text-right font-bold focus:outline-none tabular-nums"
                      />
                      <span className="text-zinc-400 text-xs">
                        {tenureType === 'years' ? 'Yrs' : 'Mos'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={1}
                  max={tenureType === 'years' ? 30 : 360}
                  step={1}
                  value={tenureValue}
                  onChange={(e) => setTenureValue(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-zinc-200 rounded-lg dark:bg-zinc-800"
                />

                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>Total Installments: <strong>{tenureMonths} Monthly EMIs</strong></span>
                  <span>{tenureType === 'years' ? `${tenureValue * 12} Mos` : `${(tenureValue / 12).toFixed(1)} Yrs`}</span>
                </div>
              </div>

              {/* 4. LOAN DISBURSEMENT DATE */}
              <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Loan Disbursement Date</span>
                    </label>
                    <p className="text-[10px] text-zinc-400">
                      1st EMI starts 1 month after this date
                    </p>
                  </div>
                  <input
                    type="date"
                    value={disbursementDate}
                    onChange={(e) => setDisbursementDate(e.target.value)}
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium font-mono text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* 5. ADVANCED: PREPAYMENT / PART-PAYMENT SIMULATOR */}
              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPrepayment(!showPrepayment)}
                  className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Extra Monthly Prepayment Simulator</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Save Lakhs
                    </span>
                  </span>
                  {showPrepayment ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {showPrepayment && (
                  <div className="mt-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                        Extra Monthly Payment towards Principal:
                      </label>
                      <div className="flex items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs font-mono font-bold dark:border-zinc-600 dark:bg-zinc-900">
                        <span>₹</span>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={extraPayment}
                          onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value) || 0))}
                          placeholder="e.g. 5000"
                          className="w-20 bg-transparent text-right focus:outline-none"
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={1000}
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-200 rounded dark:bg-zinc-700"
                    />

                    {extraPayment > 0 && interestSaved > 0 && (
                      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 p-2.5 text-xs space-y-1">
                        <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                          <span>Total Interest Saved:</span>
                          <span className="font-mono text-sm">{formatIndianCurrency(interestSaved)}</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-[11px]">
                          <span>Loan Closes Early By:</span>
                          <span className="font-mono font-bold">{monthsSaved} Months ({(monthsSaved / 12).toFixed(1)} Years)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Pro Tip Card */}
            <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-zinc-50 to-white p-4 dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-900 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                <Info className="h-4 w-4 text-blue-500" />
                <span>Rich Dad Golden Rule on Debt</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <strong>Good Debt:</strong> Debt paid off by assets or tenants (e.g. rental real estate where rental income &gt; EMI).<br />
                <strong>Bad Debt:</strong> Debt paid from your own pocket & active salary (e.g. luxury cars, credit cards, high personal loans).
              </p>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: LIVE EMI RESULTS & VISUAL CHARTS (7 Cols)               */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* HERO MONTHLY EMI DISPLAY */}
            <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 text-white p-5 sm:p-6 shadow-xl border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    <span>Monthly Loan Installment</span>
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                      {formatIndianCurrency(result.monthlyEmi + (showPrepayment ? extraPayment : 0))}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">/ month</span>
                  </div>
                  {showPrepayment && extraPayment > 0 && (
                    <div className="text-[11px] text-emerald-400 mt-1">
                      (Includes ₹{extraPayment.toLocaleString('en-IN')} extra principal prepayment)
                    </div>
                  )}
                </div>

                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Loan Payoff Date
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400 block mt-0.5">
                    {result.loanEndDate}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Total Duration: {result.tenureMonths} Months
                  </span>
                </div>
              </div>
            </div>

            {/* 4 CORE METRIC CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Principal */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Principal (P)
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 block mt-1 tabular-nums">
                  {formatIndianCurrency(result.principal, { compact: true })}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
                  {result.principalRatio}% of Total
                </span>
              </div>

              {/* Card 2: Total Interest */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Total Interest
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 block mt-1 tabular-nums">
                  {formatIndianCurrency(result.totalInterest, { compact: true })}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block mt-0.5">
                  {result.interestRatio}% of Total
                </span>
              </div>

              {/* Card 3: Total Payable */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Total Payable
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 block mt-1 tabular-nums">
                  {formatIndianCurrency(result.totalPayment, { compact: true })}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  (P + Interest)
                </span>
              </div>

              {/* Card 4: Monthly Rate */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Interest Rate
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 block mt-1 tabular-nums">
                  {result.annualRate}% <span className="text-xs font-normal text-zinc-400">p.a.</span>
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  {(result.annualRate / 12).toFixed(3)}%/mo
                </span>
              </div>
            </div>

            {/* CHARTS CONTAINER (Donut Breakdown & Loan Trajectory) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chart 1: Donut Pie Share */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Payment Breakdown
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Principal vs Interest</span>
                </div>

                <div className="h-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any) => [formatIndianCurrency(Number(value)), '']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#18181b' : '#ffffff',
                          borderColor: darkMode ? '#27272a' : '#e4e4e7',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Total</span>
                    <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {formatIndianCurrency(result.totalPayment, { compact: true })}
                    </span>
                  </div>
                </div>

                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-zinc-500 block text-[10px]">Principal</span>
                      <strong className="font-mono text-zinc-900 dark:text-zinc-100">{result.principalRatio}%</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-zinc-500 block text-[10px]">Total Interest</span>
                      <strong className="font-mono text-zinc-900 dark:text-zinc-100">{result.interestRatio}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 2: Outstanding Balance Trajectory */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Loan Balance Paydown
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Over Tenure</span>
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#27272a' : '#f4f4f5'} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: darkMode ? '#a1a1aa' : '#71717a' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: darkMode ? '#a1a1aa' : '#71717a' }}
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                        tickLine={false}
                      />
                      <RechartsTooltip
                        formatter={(value: any) => [formatIndianCurrency(Number(value)), '']}
                        contentStyle={{
                          backgroundColor: darkMode ? '#18181b' : '#ffffff',
                          borderColor: darkMode ? '#27272a' : '#e4e4e7',
                          borderRadius: '8px',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="remainingBalance"
                        name="Remaining Principal"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#balanceGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-blue-500" />
                    <span>Principal reduces with every monthly installment</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 4. DETAILED AMORTIZATION SCHEDULE TABLE                                 */}
        {/* ======================================================================= */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-hidden mt-2">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Detailed Loan Amortization Schedule
                </h2>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Exact month-by-month breakdown of Principal, Interest, Remaining Balance & Payment Dates.
              </p>
            </div>

            {/* View Mode Switcher & Tools */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Yearly vs Monthly Toggle */}
              <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setTableMode('yearly')}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    tableMode === 'yearly'
                      ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  Yearly Summary
                </button>
                <button
                  type="button"
                  onClick={() => setTableMode('monthly')}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    tableMode === 'monthly'
                      ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-900 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  All Months ({result.monthlySchedule.length})
                </button>
              </div>

              {tableMode === 'yearly' && (
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={expandAllYears}
                    className="text-[11px] font-semibold px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllYears}
                    className="text-[11px] font-semibold px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                  >
                    Collapse All
                  </button>
                </div>
              )}

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={() => downloadAmortizationCsv(result)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 transition-colors"
                title="Download CSV"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Search bar in monthly mode */}
          {tableMode === 'monthly' && (
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by date (e.g. 'Oct 2027') or installment #..."
                className="w-full sm:w-72 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                Showing {filteredMonths.length} installments
              </span>
            </div>
          )}

          {/* TABLE RENDERING */}
          <div className="overflow-x-auto">
            {tableMode === 'yearly' ? (
              /* YEARLY ACCORDION TABLE */
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {result.yearlySchedule.map((year: AmortizationYear) => {
                  const isExpanded = Boolean(expandedYears[year.yearNumber])
                  return (
                    <div key={year.yearNumber} className="transition-colors">
                      {/* Year Row Summary */}
                      <button
                        type="button"
                        onClick={() => toggleYear(year.yearNumber)}
                        className="w-full flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:px-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-left gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-5 w-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {year.yearLabel}
                            </span>
                            <span className="text-[10px] text-zinc-400 block">
                              {year.months.length} Monthly Installments
                            </span>
                          </div>
                        </div>

                        {/* Year Totals Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-xs font-mono pl-7 md:pl-0">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-sans block">
                              EMI Paid
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {formatIndianCurrency(year.totalEmi)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans block">
                              Principal Paid
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {formatIndianCurrency(year.totalPrincipal)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-sans block">
                              Interest Paid
                            </span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {formatIndianCurrency(year.totalInterest)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-sans block">
                              Ending Balance
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {formatIndianCurrency(year.endingBalance)}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Nested Months Inside Year */}
                      {isExpanded && (
                        <div className="bg-zinc-50/80 dark:bg-zinc-950/50 border-t border-b border-zinc-100 dark:border-zinc-800/80 px-2 sm:px-6 py-2 overflow-x-auto animate-fadeIn">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans border-b border-zinc-200 dark:border-zinc-800">
                                <th className="py-2 px-2">#</th>
                                <th className="py-2 px-2">Payment Date</th>
                                <th className="py-2 px-2 text-right">EMI (₹)</th>
                                <th className="py-2 px-2 text-right text-emerald-600 dark:text-emerald-400">Principal (₹)</th>
                                <th className="py-2 px-2 text-right text-amber-600 dark:text-amber-400">Interest (₹)</th>
                                <th className="py-2 px-2 text-right">Remaining Balance (₹)</th>
                                <th className="py-2 px-2 text-right font-sans">Loan Paid</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60">
                              {year.months.map((m) => (
                                <tr key={m.installmentNumber} className="hover:bg-zinc-100/60 dark:hover:bg-zinc-900/80 transition-colors">
                                  <td className="py-1.5 px-2 text-zinc-400">{m.installmentNumber}</td>
                                  <td className="py-1.5 px-2 font-medium text-zinc-800 dark:text-zinc-200 font-sans">
                                    {m.paymentDate}
                                  </td>
                                  <td className="py-1.5 px-2 text-right font-bold text-zinc-900 dark:text-zinc-100">
                                    {formatIndianCurrency(m.emiAmount, { hideSymbol: true })}
                                  </td>
                                  <td className="py-1.5 px-2 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                    {formatIndianCurrency(m.principalPaid, { hideSymbol: true })}
                                  </td>
                                  <td className="py-1.5 px-2 text-right text-amber-600 dark:text-amber-400 font-medium">
                                    {formatIndianCurrency(m.interestPaid, { hideSymbol: true })}
                                  </td>
                                  <td className="py-1.5 px-2 text-right text-zinc-800 dark:text-zinc-200 font-medium">
                                    {formatIndianCurrency(m.remainingBalance, { hideSymbol: true })}
                                  </td>
                                  <td className="py-1.5 px-2 text-right font-sans">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                                        <div
                                          className="h-full bg-emerald-500 rounded-full"
                                          style={{ width: `${m.percentagePaid}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] text-zinc-500 font-mono">
                                        {m.percentagePaid}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              /* CONTINUOUS MONTHLY TABLE */
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Payment Date</th>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3 text-right">Monthly EMI (₹)</th>
                    <th className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">Principal (₹)</th>
                    <th className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400">Interest (₹)</th>
                    <th className="py-2.5 px-3 text-right">Remaining Balance (₹)</th>
                    <th className="py-2.5 px-3 text-right font-sans">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredMonths.map((m) => (
                    <tr key={m.installmentNumber} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-2 px-3 text-zinc-400 font-mono">{m.installmentNumber}</td>
                      <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100 font-sans">
                        {m.paymentDate}
                      </td>
                      <td className="py-2 px-3 text-zinc-500 font-sans text-[11px]">
                        Yr {m.yearNumber} (M{m.monthInYear})
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                        {formatIndianCurrency(m.emiAmount, { hideSymbol: true })}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatIndianCurrency(m.principalPaid, { hideSymbol: true })}
                      </td>
                      <td className="py-2 px-3 text-right text-amber-600 dark:text-amber-400 font-semibold">
                        {formatIndianCurrency(m.interestPaid, { hideSymbol: true })}
                      </td>
                      <td className="py-2 px-3 text-right text-zinc-800 dark:text-zinc-200 font-semibold">
                        {formatIndianCurrency(m.remainingBalance, { hideSymbol: true })}
                      </td>
                      <td className="py-2 px-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-14 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${m.percentagePaid}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {m.percentagePaid}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 5. EDUCATIONAL CALL TO ACTION & QUADRANT ADVICE                         */}
        {/* ======================================================================= */}
        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/50 p-6 dark:border-emerald-900/80 dark:bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Want to eliminate Bad Debt & build Passive Income?
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Track your complete Cashflow Quadrant (Assets, Liabilities, Incomes & Expenses) and see when your Passive Income crosses your living costs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Open Full My Quadrant App</span>
          </button>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 6. CALCULATOR FOOTER                                                     */}
      {/* ========================================================================= */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">MY QUADRANT</span>
            <span>— Free Online Indian Loan EMI & Amortization Calculator</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Formulas: Reducing Balance EMI • ISO Calendar Amortization • Standard INR Format
          </div>
        </div>
      </footer>
    </div>
  )
}

export default EmiCalculatorPage
