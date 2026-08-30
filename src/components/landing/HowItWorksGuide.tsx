import {
  Wallet,
  CreditCard,
  ArrowUpDown,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export const HowItWorksGuide: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: <Wallet className="h-6 w-6 text-emerald-500" />,
      title: 'Log Capital & Cash-Flowing Assets',
      subtitle: 'Build your asset fortress',
      description:
        'Record Indian Mutual Funds (SIPs), Direct Equities, Rental Properties, Sovereign Gold Bonds (SGB), FDs, and Liquid Emergency Cash. Add the monthly yield or rental income each asset puts in your pocket.',
      badge: 'Assets Column',
      bulletPoints: [
        'Track asset value & monthly passive yield',
        'Keep tabs on liquid bank balances & emergency fund',
        'Calculates gross asset capital in ₹ Lakhs/Crores',
      ],
    },
    {
      number: '02',
      icon: <CreditCard className="h-6 w-6 text-rose-500" />,
      title: 'Classify Good Debt vs. Bad Debt',
      subtitle: 'Stop wealth bleeding',
      description:
        'Not all debt is evil. Bad Debt (Credit Cards, Personal Loans, Car EMIs) drains your cashflow. Good Debt (Rental Property Mortgages) is paid by someone else and generates positive net cashflow.',
      badge: 'Liabilities Column',
      bulletPoints: [
        'Flag loans as Good Debt vs Bad Debt',
        'Automatic Good Debt Quality Ratio (Aim for 80%+)',
        'Track monthly EMIs reducing your cashflow',
      ],
    },
    {
      number: '03',
      icon: <ArrowUpDown className="h-6 w-6 text-blue-500" />,
      title: 'Record Active & Passive Cashflow',
      subtitle: 'Identify income DNA',
      description:
        'Log monthly paychecks, consulting fees (Active Income), alongside dividends, business royalties, and rental inflows (Passive Income). Track total living expenses divided into Needs, Wants, and EMIs.',
      badge: 'Cashflow Column',
      bulletPoints: [
        'Clear monthly Inflow, Outflow & Net Cashflow',
        'Immediate calculation of Savings Rate',
        'Real-time calculation of the Passive Cashflow Gap',
      ],
    },
    {
      number: '04',
      icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
      title: '2-Minute Monthly Check-In & Trajectory',
      subtitle: 'Watch the Green Line cross the Red Line',
      description:
        'Spend 2 minutes at the end of each month running the guided Monthly Check-in wizard. Watch your historical chart track the Green Line (Passive Income) rise until it permanently crosses above living expenses.',
      badge: 'Rat Race Exit Curve',
      bulletPoints: [
        'Guided step-by-step 2-minute monthly checkin',
        'Visual crossover trajectory chart over time',
        'Automated "Financially Free" crossover detection',
      ],
    },
  ]

  return (
    <section id="guide" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Step-by-Step User Guide</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            How to Use My Quadrant
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            A simple, repeatable 4-step financial system engineered to replace your living expenses with real passive income.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900 shadow-subtle hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      {step.icon}
                    </div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Step {step.number}
                    </span>
                  </div>
                  <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {step.title}
                </h3>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block mb-2">
                  {step.subtitle}
                </span>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                {step.bulletPoints.map((bp, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
