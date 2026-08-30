import React from 'react'
import { Button } from '../ui/Button'
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Clock,
  Coins,
  Calculator,
} from 'lucide-react'

interface HeroSectionProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth }) => {
  const scrollToGuide = () => {
    const el = document.querySelector('#guide')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-950">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Built for Indian Wealth Builders & Investors</span>
            <span className="text-zinc-400">•</span>
            <span className="font-mono">INR ₹</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            Escape the 9-to-5 Rat Race.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
              Master Your Cashflow.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
            Track real monthly passive cashflow, separate good debt from wealth-destroying bad debt, and watch the{' '}
            <strong className="font-semibold text-emerald-600 dark:text-emerald-400">Green Line (Passive Income)</strong> cross above your living expenses in real-time.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              leftIcon={<Sparkles className="h-4 w-4 text-amber-300" />}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto font-bold text-sm shadow-md px-6 py-3"
            >
              Start Tracking for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToGuide}
              className="w-full sm:w-auto font-semibold text-sm px-5 py-3"
            >
              See How It Works
            </Button>
            <a
              href="/emi-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:hover:bg-emerald-900 transition-all shadow-xs group"
              title="Open Loan EMI Calculator in a new tab"
            >
              <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>EMI Calculator</span>
              <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 text-[10px] font-bold dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                Free
              </span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Private (Supabase RLS)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span>2-Min Monthly Check-In</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Preview Mockup */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-zinc-200/90 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/80 p-2 sm:p-3 shadow-2xl backdrop-blur-md">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-mono text-[11px] text-zinc-400 ml-2 hidden sm:inline">
                  my-quadrant.app — Dashboard Live Preview
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle className="h-3 w-3" /> Crossover Simulation
              </span>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1 sm:p-2">
              {/* Card 1: Rat Race Status */}
              <div className="rounded-xl border border-amber-200/90 bg-amber-50/40 p-4 dark:border-amber-900/80 dark:bg-amber-950/20 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      QUADRANT STATUS
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      IN THE RAT RACE
                    </h3>
                  </div>
                  <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    68% TO FREEDOM
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-xs mb-1.5">
                    <span className="text-zinc-500 text-[11px]">Monthly Gap to Cover:</span>
                    <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
                      ₹15,000/mo
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[68%]" />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Passive: ₹32,000</span>
                    <span>Expenses: ₹47,000</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Net Worth */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    NET WORTH (ASSETS - DEBT + CASH)
                  </span>
                  <div className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1 tabular-nums">
                    ₹58,40,000
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 border-t border-zinc-100 pt-2 text-[11px] dark:border-zinc-800 mt-4">
                  <div>
                    <span className="text-zinc-400 block text-[9px]">Assets</span>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">₹72.5 L</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px]">Debt</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">₹18.0 L</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px]">Liquid Cash</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹3.9 L</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Good Debt Ratio */}
              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    DEBT QUALITY & SAVINGS RATE
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="text-[9px] text-zinc-400 uppercase">Good Debt Ratio</span>
                      <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        82%
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-zinc-400 uppercase">Savings Rate</span>
                      <div className="font-mono text-xl font-bold text-zinc-800 dark:text-zinc-200">
                        34%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-[10px] text-zinc-500 dark:border-zinc-800 mt-4">
                  <span>Good Debt: <strong className="font-mono text-zinc-700 dark:text-zinc-300">₹14.8 L</strong></span>
                  <span>Bad Debt: <strong className="font-mono text-rose-600 dark:text-rose-400">₹3.2 L</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
