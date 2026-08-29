import React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, subMonths, addMonths, parseISO } from 'date-fns'

interface MonthPickerProps {
  selectedMonth: string // YYYY-MM
  onChange: (newMonth: string) => void
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  selectedMonth,
  onChange,
}) => {
  const currentDate = parseISO(`${selectedMonth}-01`)
  const displayLabel = format(currentDate, 'MMM yyyy')
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
    <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80">
      <button
        type="button"
        onClick={handlePrev}
        title="Previous Month"
        className="rounded p-1 text-zinc-500 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1.5 px-2 font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 select-none">
        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
        <span>{displayLabel}</span>
      </div>

      <button
        type="button"
        onClick={handleNext}
        title="Next Month"
        className="rounded p-1 text-zinc-500 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {!isCurrentMonth && (
        <button
          type="button"
          onClick={handleCurrent}
          className="ml-1 rounded bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-200"
        >
          Today
        </button>
      )}
    </div>
  )
}
