import React, { useState } from 'react'
import { Briefcase, UserCheck, Building2, TrendingUp, CheckCircle2 } from 'lucide-react'

export const QuadrantExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'E' | 'S' | 'B' | 'I'>('I')

  const quadrants = [
    {
      id: 'E',
      letter: 'E',
      title: 'Employee',
      subtitle: 'Active Linear Income',
      taxRate: 'High TDS (Up to 30%+)',
      motto: '“Looking for a safe, secure job with good benefits”',
      icon: <Briefcase className="h-5 w-5 text-blue-500" />,
      color: 'border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
      activeBadge: 'bg-blue-600 text-white',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
      description:
        'You trade your time and energy directly for a monthly salary. If you stop working or take leave, the income stops immediately.',
      characteristics: [
        'Trades hours for fixed salary',
        'Highest personal tax bracket in India',
        'Dependent on single employer income source',
      ],
    },
    {
      id: 'S',
      letter: 'S',
      title: 'Self-Employed / Professional',
      subtitle: 'Active Solo Income',
      taxRate: 'Moderate / Presumptive 44ADA',
      motto: '“If you want something done right, do it yourself”',
      icon: <UserCheck className="h-5 w-5 text-amber-500" />,
      color: 'border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
      activeBadge: 'bg-amber-600 text-white',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      description:
        'You own a specialized job (Doctor, Freelancer, Lawyer, Agency owner). You have more autonomy than an employee, but time is still your primary revenue bottleneck.',
      characteristics: [
        'Higher hourly rate & independence',
        'No income if you fall sick or take vacation',
        'Difficult to scale beyond personal work hours',
      ],
    },
    {
      id: 'B',
      letter: 'B',
      title: 'Business Owner',
      subtitle: 'System & Team Cashflow',
      taxRate: 'Corporate Tax (22% + cess)',
      motto: '“Looking for the smartest people to run systems”',
      icon: <Building2 className="h-5 w-5 text-purple-500" />,
      color: 'border-purple-500/30 bg-purple-50/40 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
      activeBadge: 'bg-purple-600 text-white',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
      description:
        'You own a system, brand, or team. The business generates monthly operating profits and cashflow whether you are present in the office or traveling.',
      characteristics: [
        'Leverages other people’s time and systems',
        'Cashflow continues during absence',
        'High equity value creation',
      ],
    },
    {
      id: 'I',
      letter: 'I',
      title: 'Investor',
      subtitle: 'Pure Passive Asset Cashflow',
      taxRate: 'LTCG / Tax-Optimized',
      motto: '“How fast does my capital work to replace my living expenses?”',
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      color: 'border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
      activeBadge: 'bg-emerald-600 text-white',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      description:
        'Your money works for you. Cash flows in from rental property yields, index funds, dividends, SGB interest, and royalty streams without requiring your physical time.',
      characteristics: [
        '100% passive cashflow generated 24/7',
        'Ultimate financial freedom & time sovereignty',
        'The primary engine of rat race escape',
      ],
    },
  ]

  const selectedQ = quadrants.find((q) => q.id === activeTab)!

  return (
    <section id="quadrants" className="py-16 md:py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3">
            <span>Robert Kiyosaki’s CASHFLOW Principle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            The 4 Quadrants of Money
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Financial freedom is not about how much salary you earn — it is about which quadrant produces your monthly cashflow.
          </p>
        </div>

        {/* 2x2 Matrix Selector on Desktop / Pills on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
          {quadrants.map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveTab(q.id as any)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                activeTab === q.id
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-md scale-[1.02]'
                  : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-2xl font-black">{q.letter}</span>
                {q.icon}
              </div>
              <p className="text-xs font-bold truncate">{q.title}</p>
              <span className="text-[10px] opacity-75 block truncate">{q.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Detailed Quadrant Card */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-xl font-black bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {selectedQ.letter}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedQ.title} Quadrant
                  </h3>
                  <span className="text-xs font-medium text-zinc-500">
                    {selectedQ.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {selectedQ.description}
              </p>

              <blockquote className="border-l-2 border-zinc-400 dark:border-zinc-600 pl-3 py-1 text-xs italic text-zinc-500 dark:text-zinc-400">
                {selectedQ.motto}
              </blockquote>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                  Core Characteristics:
                </span>
                {selectedQ.characteristics.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Mechanism Box */}
            <div className="w-full md:w-72 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-4 space-y-3 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                The My Quadrant Strategy
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Use your active income from <strong>E</strong> or <strong>S</strong> to continuously accumulate cash-flowing assets in <strong>I</strong> and <strong>B</strong>.
              </p>

              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  Freedom Formula
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Passive Income ≥ Living Expenses
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
