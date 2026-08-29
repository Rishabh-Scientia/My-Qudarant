import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { User, ShieldCheck } from 'lucide-react'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, profile, updateProfile, isSupabaseConfigured } = useAuth()
  const toast = useToast()

  const [name, setName] = useState('')
  const [ratRaceExitTarget, setRatRaceExitTarget] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setRatRaceExitTarget(
        profile.rat_race_exit_target ? String(profile.rat_race_exit_target) : ''
      )
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await updateProfile({
        name: name.trim(),
        rat_race_exit_target: ratRaceExitTarget ? Number(ratRaceExitTarget) : null,
      })
      if (error) {
        toast.error('Failed to update profile', error.message)
      } else {
        toast.success('Profile updated successfully')
        onClose()
      }
    } catch (err: any) {
      toast.error('Error', err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Freedom Target"
      description="Manage your identity, freedom exit target, and account details."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 dark:bg-zinc-900/50 dark:border-zinc-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <User className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {profile?.name || user?.email?.split('@')[0] || 'Freedom Chaser'}
            </p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email || 'User'}</p>
          </div>
        </div>

        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aditya Sharma"
          required
        />

        <Input
          label="Monthly Freedom Exit Target (₹ / month passive income)"
          type="number"
          min="0"
          step="any"
          leftPrefix="₹"
          placeholder="e.g. 1,50,000"
          helperText="Your personal monthly target to completely replace all expenses and live on cashflow."
          value={ratRaceExitTarget}
          onChange={(e) => setRatRaceExitTarget(e.target.value)}
        />

        <div className="rounded-lg border border-zinc-200/70 p-3 text-xs bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30 space-y-1.5">
          <div className="flex items-center justify-between text-zinc-500">
            <span>Primary Currency:</span>
            <strong className="font-mono text-zinc-800 dark:text-zinc-200">INR (₹ Indian Rupee)</strong>
          </div>
          <div className="flex items-center justify-between text-zinc-500">
            <span>Security Status:</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> RLS Scoped (auth.uid())
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-500">
            <span>Database Status:</span>
            <span className="font-mono text-zinc-700 dark:text-zinc-300">
              {isSupabaseConfigured ? 'Live Supabase Cloud' : 'Connected'}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Save Profile
          </Button>
        </div>
      </form>
    </Modal>
  )
}
