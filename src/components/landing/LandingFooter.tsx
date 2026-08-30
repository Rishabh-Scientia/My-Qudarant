import React from 'react'
import { Button } from '../ui/Button'
import { Sparkles, ArrowRight } from 'lucide-react'

interface LandingFooterProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenAuth }) => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80">
      {/* Final Pre-Footer Call to Action Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12">
        <div className="rounded-3xl bg-zinc-900 text-white dark:bg-zinc-900 border border-zinc-800 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/20 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Your Freedom Journey Today</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Escape the Rat Race?
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
              Take 2 minutes to create your private account and start tracking your real monthly cashflow trajectory in Indian Rupees.
            </p>

            <div className="pt-2 flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenAuth('signup')}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white shadow-lg px-8 py-3.5"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          {/* Logo Symbol */}
          <div className="grid grid-cols-2 grid-rows-2 h-6 w-6 rounded-md bg-zinc-900 dark:bg-zinc-100 p-0.5 text-[7px] font-bold text-white dark:text-zinc-900 leading-none">
            <span className="flex items-center justify-center border-r border-b border-zinc-700 dark:border-zinc-300">E</span>
            <span className="flex items-center justify-center border-b border-zinc-700 dark:border-zinc-300 text-emerald-400 dark:text-emerald-600 font-extrabold">B</span>
            <span className="flex items-center justify-center border-r border-zinc-700 dark:border-zinc-300">S</span>
            <span className="flex items-center justify-center text-emerald-400 dark:text-emerald-600 font-extrabold">I</span>
          </div>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">MY QUADRANT</span>
          <span>© {new Date().getFullYear()} — Built for Indian Wealth Builders.</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <a
            href="/emi-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>EMI Calculator</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1 rounded">PRO</span>
          </a>
          <a href="#quadrants" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            4 Quadrants
          </a>
          <a href="#guide" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            User Guide
          </a>
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Features
          </a>
          <a href="#faq" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  )
}
