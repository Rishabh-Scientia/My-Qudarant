import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What is the "Rat Race Exit" condition in My Quadrant?',
      answer:
        'You have officially escaped the rat race when your Monthly Passive Income from cash-flowing assets (e.g. mutual fund yields, rental real estate, dividends, business royalties) is greater than or equal to your Total Monthly Living Expenses. At that moment, working for a monthly salary becomes optional.',
    },
    {
      question: 'How is this different from traditional budgeting apps like Walnut, Fold, or Excel sheets?',
      answer:
        'Traditional budgeting apps focus on micromanaging small expenses (e.g. ₹50 coffee or groceries) which does not create freedom. My Quadrant focuses on macro CASHFLOW — accumulating cash-flowing assets (B & I quadrants), eliminating wealth-destroying bad debt (36% credit cards), and tracking your countdown to zero reliance on active salary.',
    },
    {
      question: 'What qualifies as "Good Debt" vs. "Bad Debt"?',
      answer:
        'Good Debt is any borrowed capital used to acquire an asset that generates more cashflow than the interest cost (e.g. a rental property mortgage where tenant rent covers the EMI). Bad Debt is borrowed capital for depreciating lifestyle consumption (credit cards, personal loans, luxury car EMIs) that you must pay out of your own paycheck.',
    },
    {
      question: 'Is my financial portfolio and net worth data private & secure?',
      answer:
        'Yes, 100%. My Quadrant uses Supabase database security with Row Level Security (RLS) policies. Every single record is locked to your private authentication UID (auth.uid()). We do not connect to bank APIs, do not scrape SMS, and will never sell or monetize your data.',
    },
    {
      question: 'How much time does it take each month?',
      answer:
        'Under 2 minutes. At the end of each month, click "Monthly Check-in", enter your current liquid bank balance, verify your income sources and living expenses, and submit. The app automatically recalculates your Net Worth, Good Debt ratio, and updates your historical trajectory curve.',
    },
    {
      question: 'Can I use My Quadrant on my Android or iPhone without downloading an app?',
      answer:
        'Yes! My Quadrant is built as a responsive Progressive Web App (PWA). You can open it in Chrome or Safari on your phone, click "Add to Home Screen", and enjoy a full native-feeling app experience with fixed navigation docks and touch-optimized bottom sheets.',
    },
  ]

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Got Questions? We’ve Got Answers.
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Everything you need to know about the CASHFLOW tracker, security, and freedom metrics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    openIdx === idx ? 'rotate-180 text-zinc-900 dark:text-zinc-100' : ''
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
