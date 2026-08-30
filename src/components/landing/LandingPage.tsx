import React, { useState } from 'react'
import { LandingNavbar } from './LandingNavbar'
import { HeroSection } from './HeroSection'
import { QuadrantExplainer } from './QuadrantExplainer'
import { HowItWorksGuide } from './HowItWorksGuide'
import { FeaturesGrid } from './FeaturesGrid'
import { FaqSection } from './FaqSection'
import { LandingFooter } from './LandingFooter'
import { AuthModal } from '../auth/AuthModal'

interface LandingPageProps {
  onGoToDashboard?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToDashboard }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar
        onOpenAuth={handleOpenAuth}
        onGoToDashboard={onGoToDashboard}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Interactive Mockup */}
        <HeroSection onOpenAuth={handleOpenAuth} />

        {/* 2. Robert Kiyosaki 4 Quadrants Explainer */}
        <QuadrantExplainer />

        {/* 3. Step-by-Step Practical User Guide */}
        <HowItWorksGuide />

        {/* 4. Core Features & Superpowers */}
        <FeaturesGrid />

        {/* 5. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <LandingFooter onOpenAuth={handleOpenAuth} />

      {/* 1-Click Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}
export default LandingPage
