import React from 'react'
import {
  IndianRupee,
  ShieldCheck,
  Zap,
  LineChart,
  Scale,
  Smartphone,
} from 'lucide-react'

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <IndianRupee className="h-6 w-6 text-emerald-500" />,
      title: 'Indian Rupee & Asset Ecosystem',
      description:
        'Custom built with Indian number system (Lakhs & Crores), Indian asset categories (Mutual Fund SIPs, Sovereign Gold Bonds, Real Estate, PPF/EPF), and ₹ currency formatting.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      title: '100% Private & Row-Level Security',
      description:
        'Your financial records are strictly isolated with Supabase Row-Level Security (auth.uid()). No third-party data tracking, no ads, and no selling of your portfolio data.',
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: '2-Minute Monthly Check-In',
      description:
        'Forget tracking every cup of chai daily. My Quadrant focuses on the high-leverage macro numbers — updated in under 2 minutes at the end of each month.',
    },
    {
      icon: <LineChart className="h-6 w-6 text-emerald-500" />,
      title: 'The Crossover Trajectory Chart',
      description:
        'A single high-conviction visual showing the Green Line (Passive Cashflow) racing towards and overtaking the Red Line (Total Living Expenses).',
    },
    {
      icon: <Scale className="h-6 w-6 text-purple-500" />,
      title: 'Good Debt vs Bad Debt Scoring',
      description:
        'Separate debt that builds cashflow (e.g. tenant-paid rental mortgages) from wealth-killing debt (36% APR credit cards and personal loans).',
    },
    {
      icon: <Smartphone className="h-6 w-6 text-teal-500" />,
      title: 'PWA & Mobile Native Ergonomics',
      description:
        'Engineered with fixed top headers, bottom navigation docks, responsive bottom-sheets, and thumb-friendly touch targets for seamless on-the-go tracking.',
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3">
            <span>Engineered for Serious Wealth Builders</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Why My Quadrant is Different
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Unlike traditional budgeting apps that focus on cutting small expenses, My Quadrant focuses on accelerating your passive cashflow to replace your job.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/80 mb-4 shadow-xs group-hover:scale-105 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
