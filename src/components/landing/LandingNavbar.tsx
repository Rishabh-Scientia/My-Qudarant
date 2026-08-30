import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, ArrowRight, Menu, X, LayoutDashboard, Calculator, ExternalLink } from 'lucide-react'

interface LandingNavbarProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void
  onGoToDashboard?: () => void
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenAuth,
  onGoToDashboard,
}) => {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: '4 Quadrants', href: '#quadrants' },
    { label: 'How It Works', href: '#guide' },
    { label: 'Features', href: '#features' },
    { label: 'FAQ', href: '#faq' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <a href="#" className="flex items-center gap-2.5 group">
          {/* CASHFLOW Quadrant Symbol */}
          <div className="grid grid-cols-2 grid-rows-2 h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 p-0.5 text-[9px] font-bold text-white dark:text-zinc-900 leading-none shadow-xs group-hover:scale-105 transition-transform">
            <span className="flex items-center justify-center border-r border-b border-zinc-700 dark:border-zinc-300">E</span>
            <span className="flex items-center justify-center border-b border-zinc-700 dark:border-zinc-300 text-emerald-400 dark:text-emerald-600 font-extrabold">B</span>
            <span className="flex items-center justify-center border-r border-zinc-700 dark:border-zinc-300">S</span>
            <span className="flex items-center justify-center text-emerald-400 dark:text-emerald-600 font-extrabold">I</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                MY QUADRANT
              </span>
              <span className="hidden xs:inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 uppercase tracking-wide leading-none">
                INR ₹
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium block -mt-0.5">
              Cashflow & Freedom Tracker
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}

          {/* Dedicated EMI Calculator Tab (Opens in New Tab) */}
          <a
            href="/?tab=emi-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50/80 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/80 transition-all shadow-2xs group"
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>EMI Calculator</span>
            <ExternalLink className="h-3 w-3 text-emerald-600/70 dark:text-emerald-400/70" />
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {user ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onGoToDashboard}
              leftIcon={<LayoutDashboard className="h-4 w-4" />}
              className="font-semibold text-xs shadow-xs"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAuth('signin')}
                className="text-xs font-medium"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth('signup')}
                leftIcon={<Sparkles className="h-3.5 w-3.5 text-amber-300" />}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                className="text-xs font-semibold shadow-xs"
              >
                Get Started Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 sm:hidden">
          {user ? (
            <Button
              variant="primary"
              size="xs"
              onClick={onGoToDashboard}
              className="text-xs font-semibold"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="primary"
              size="xs"
              onClick={() => onOpenAuth('signup')}
              className="text-xs font-semibold"
            >
              Get Started
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-1.5 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/?tab=emi-calculator"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>EMI Calculator (Free Tool)</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            {user ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onGoToDashboard?.()
                }}
              >
                Open My Quadrant Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center text-xs"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenAuth('signin')
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 justify-center text-xs"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenAuth('signup')
                  }}
                >
                  Sign Up Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
