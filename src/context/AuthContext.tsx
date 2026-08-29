import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Profile } from '../types/finance'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isSupabaseConfigured: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithPassword: (email: string, password: string, name?: string) => Promise<{ error: Error | null; data?: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Clean up any old demo local storage keys
  useEffect(() => {
    try {
      localStorage.removeItem('my_quadrant_demo_mode')
      localStorage.removeItem('my_quadrant_demo_assets')
      localStorage.removeItem('my_quadrant_demo_liabilities')
      localStorage.removeItem('my_quadrant_demo_income')
      localStorage.removeItem('my_quadrant_demo_expenses')
      localStorage.removeItem('my_quadrant_demo_cash')
    } catch (e) {
      // Ignore
    }
  }, [])

  // Stable profile fetching function
  const fetchProfile = useCallback(async (userId: string, userMeta?: any) => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching user profile:', error.message)
      }
      if (data) {
        setProfile(data)
      } else {
        // Fallback default profile if not yet created by trigger
        setProfile({
          id: userId,
          name: userMeta?.full_name || userMeta?.email?.split('@')[0] || 'User',
          currency: 'INR',
          rat_race_exit_target: null,
        })
      }
    } catch (err) {
      console.error('Error querying profiles table:', err)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        fetchProfile(newSession.user.id, newSession.user.user_metadata)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please add your credentials in .env file.') }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? new Error(error.message) : null }
  }, [])

  const signUpWithPassword = useCallback(async (email: string, password: string, name?: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please add your credentials in .env file.') }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
        },
      },
    })
    return { error: error ? new Error(error.message) : null, data }
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No authenticated user') }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() })

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null))
    }
    return { error: error ? new Error(error.message) : null }
  }, [user])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user.user_metadata)
    }
  }, [user, fetchProfile])

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isSupabaseConfigured,
      signInWithPassword,
      signUpWithPassword,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      signInWithPassword,
      signUpWithPassword,
      signOut,
      refreshProfile,
      updateProfile,
    ]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
