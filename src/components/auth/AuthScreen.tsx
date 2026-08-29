import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'
import { Lock, Mail, User, ArrowRight, Shield } from 'lucide-react'

export const AuthScreen: React.FC = () => {
  const { signInWithPassword, signUpWithPassword } = useAuth()
  const toast = useToast()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password)
        if (error) {
          toast.error('Authentication Failed', error.message)
        } else {
          toast.success('Welcome back to My Quadrant')
        }
      } else if (mode === 'signup') {
        const { error } = await signUpWithPassword(email, password, name)
        if (error) {
          toast.error('Sign Up Failed', error.message)
        } else {
          toast.success(
            'Account Created!',
            'Please verify your email if confirmation is enabled, or sign in now.'
          )
          setMode('signin')
        }
      }
    } catch (err: any) {
      toast.error('Error', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          {/* CASHFLOW Quadrant icon */}
          <div className="grid grid-cols-2 grid-rows-2 h-9 w-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 p-0.5 text-[9px] font-bold text-white dark:text-zinc-900 leading-none shadow-sm">
            <span className="flex items-center justify-center border-r border-b border-zinc-700 dark:border-zinc-300">E</span>
            <span className="flex items-center justify-center border-b border-zinc-700 dark:border-zinc-300 text-emerald-400 dark:text-emerald-600 font-black">B</span>
            <span className="flex items-center justify-center border-r border-zinc-700 dark:border-zinc-300">S</span>
            <span className="flex items-center justify-center text-emerald-400 dark:text-emerald-600 font-black">I</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">MY QUADRANT</h1>
        </div>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Production-grade CASHFLOW & rat race escape tracker tailored for the Indian financial market.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Tab switchers */}
        <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800 mb-5">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signin'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="e.g. Aditya Sharma"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftPrefix={<User className="h-4 w-4" />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftPrefix={<Mail className="h-4 w-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftPrefix={<Lock className="h-4 w-4" />}
            helperText={mode === 'signup' ? 'Must be at least 6 characters' : undefined}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {mode === 'signin'
              ? 'Sign In to Dashboard'
              : 'Create My Quadrant Account'}
          </Button>
        </form>
      </div>

      {/* RLS Security Note */}
      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-zinc-400">
        <Shield className="h-3.5 w-3.5 text-emerald-500" />
        <span>End-to-end Row Level Security (RLS) enabled on all tables.</span>
      </div>
    </div>
  )
}
