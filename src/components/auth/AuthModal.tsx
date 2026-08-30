import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { Lock, Mail, User, ArrowRight, Shield } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { signInWithPassword, signUpWithPassword } = useAuth()
  const toast = useToast()

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Keep state in sync if initialMode prop changes
  React.useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

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
          onClose()
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 grid-rows-2 h-7 w-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 p-0.5 text-[8px] font-bold text-white dark:text-zinc-900 leading-none shadow-xs">
            <span className="flex items-center justify-center border-r border-b border-zinc-700 dark:border-zinc-300">E</span>
            <span className="flex items-center justify-center border-b border-zinc-700 dark:border-zinc-300 text-emerald-400 dark:text-emerald-600 font-black">B</span>
            <span className="flex items-center justify-center border-r border-zinc-700 dark:border-zinc-300">S</span>
            <span className="flex items-center justify-center text-emerald-400 dark:text-emerald-600 font-black">I</span>
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {mode === 'signin' ? 'Sign In to My Quadrant' : 'Create Free Account'}
          </span>
        </div>
      }
      description="Track cashflow, eliminate bad debt, and escape the rat race."
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Tab switchers */}
        <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signin'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
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
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Sign Up Free
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
              leftPrefix={<User className="h-4 w-4 text-zinc-400" />}
              autoFocus
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftPrefix={<Mail className="h-4 w-4 text-zinc-400" />}
            autoFocus={mode === 'signin'}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftPrefix={<Lock className="h-4 w-4 text-zinc-400" />}
            helperText={mode === 'signup' ? 'Must be at least 6 characters' : undefined}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 font-semibold"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {mode === 'signin' ? 'Sign In to Dashboard' : 'Get Started for Free'}
          </Button>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
          <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Private & isolated with Supabase Row-Level Security</span>
        </div>
      </div>
    </Modal>
  )
}
