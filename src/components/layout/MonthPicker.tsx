import React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, subMonths, addMonths, parseISO } from 'date-fns'

interface MonthPickerProps {
  selectedMonth: string // YYYY-MM
  onChange: (newMonth: string) => void
  compact?: boolean
  className?: string
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  selectedMonth,
  onChange,
  compact = false,
  className = '',
}) => {
  const currentDate = parseISO(`${selectedMonth}-01`)
  const displayLabel = format(currentDate, compact ? 'MMM yy' : 'MMM yyyy')
  const nowMonthStr = format(new Date(), 'yyyy-MM')

  const handlePrev = () => {
    const prev = subMonths(currentDate, 1)
    onChange(format(prev, 'yyyy-MM'))
  }

  const handleNext = () => {
    const next = addMonths(currentDate, 1)
    onChange(format(next, 'yyyy-MM'))
  }

  const handleCurrent = () => {
    onChange(nowMonthStr)
  }

  const isCurrentMonth = selectedMonth === nowMonthStr

  return (
    <div
      className={`inline-flex items-center gap-0.5 sm:gap-1 bg-zinc-100 dark:bg-zinc-800/90 p-0.5 sm:p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 shrink-0 ${className}`}
    >
      <button
        type="button"
        onClick={handlePrev}
        title="Previous Month"
        className="rounded p-1 text-zinc-500 hover:bg-white hover:text-zinc-900 active:scale-95 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-all touch-manipulation"
      >
        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      <div className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2 font-mono text-[11px] sm:text-xs font-semibold text-zinc-900 dark:text-zinc-100 select-none whitespace-nowrap">
        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400 shrink-0" />
        <span>{displayLabel}</span>
      </div>

      <button
        type="button"
        onClick={handleNext}
        title="Next Month"
        className="rounded p-1 text-zinc-500 hover:bg-white hover:text-zinc-900 active:scale-95 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-all touch-manipulation"
      >
        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      {!isCurrentMonth && (
        <button
          type="button"
          onClick={handleCurrent}
          className="ml-0.5 rounded bg-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-200 whitespace-nowrap active:scale-95 transition-all"
        >
          Today
        </button>
      )}
    </div>
  )
}
