import React from 'react'
import { MonthPicker } from './MonthPicker'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import {
  Plus,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react'

interface HeaderProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
  onOpenQuickAdd: () => void
  onOpenCheckin: () => void
  onOpenProfile: () => void
}

export const Header: React.FC<HeaderProps> = ({
  selectedMonth,
  onMonthChange,
  onOpenQuickAdd,
  onOpenCheckin,
  onOpenProfile,
}) => {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* CASHFLOW Quadrant Symbol */}
          <div className="grid grid-cols-2 grid-rows-2 h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 p-0.5 text-[8px] sm:text-[9px] font-bold text-white dark:text-zinc-900 leading-none shrink-0 shadow-xs">
            <span className="flex items-center justify-center border-r border-b border-zinc-700 dark:border-zinc-300">E</span>
            <span className="flex items-center justify-center border-b border-zinc-700 dark:border-zinc-300 text-emerald-400 dark:text-emerald-600 font-extrabold">B</span>
            <span className="flex items-center justify-center border-r border-zinc-700 dark:border-zinc-300">S</span>
            <span className="flex items-center justify-center text-emerald-400 dark:text-emerald-600 font-extrabold">I</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                MY QUADRANT
              </span>
              <span className="inline-flex items-center rounded bg-emerald-100 px-1 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 uppercase tracking-wide leading-none shrink-0">
                INR ₹
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-zinc-400 font-medium -mt-0.5 truncate">
              Cashflow & Freedom Tracker
            </span>
          </div>
        </div>

        {/* Center Month Navigator on Desktop */}
        <div className="hidden md:flex items-center justify-center">
          <MonthPicker selectedMonth={selectedMonth} onChange={onMonthChange} />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Month Navigator */}
          <div className="flex md:hidden items-center">
            <MonthPicker
              selectedMonth={selectedMonth}
              onChange={onMonthChange}
              compact
            />
          </div>

          {/* Desktop Check-in Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCheckin}
            className="hidden lg:inline-flex font-medium text-xs text-zinc-700 dark:text-zinc-300"
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-amber-500" />}
          >
            Monthly Check-in
          </Button>

          {/* Desktop Quick Add Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenQuickAdd}
            className="hidden sm:inline-flex text-xs font-semibold"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Quick Add
          </Button>

          {/* Profile & User */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-zinc-200 dark:border-zinc-800 gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={onOpenProfile}
              title="Account settings"
              className="flex items-center gap-1.5 rounded-lg p-1 sm:p-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors active:scale-95"
            >
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-semibold text-[11px] sm:text-xs">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
              </div>
              <span className="hidden xl:inline text-xs font-medium text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate">
                {profile?.name || user?.email?.split('@')[0] || 'Profile'}
              </span>
            </button>

            <button
              onClick={signOut}
              title="Sign Out"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors active:scale-95"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
