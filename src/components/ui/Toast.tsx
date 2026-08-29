import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  description?: string
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type, message, description }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastItem = { id, type, message, description }
      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        removeToast(id)
      }, 4000)
    },
    [removeToast]
  )

  const success = useCallback(
    (message: string, description?: string) =>
      showToast({ type: 'success', message, description }),
    [showToast]
  )

  const error = useCallback(
    (message: string, description?: string) =>
      showToast({ type: 'error', message, description }),
    [showToast]
  )

  const info = useCallback(
    (message: string, description?: string) =>
      showToast({ type: 'info', message, description }),
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
            error: <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />,
            info: <Info className="h-4 w-4 text-zinc-500 shrink-0" />,
          }

          const borderColors = {
            success: 'border-emerald-200 dark:border-emerald-900',
            error: 'border-rose-200 dark:border-rose-900',
            info: 'border-zinc-200 dark:border-zinc-800',
          }

          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start justify-between rounded-lg border bg-white p-3 shadow-lg dark:bg-zinc-900 transition-all animate-in slide-in-from-bottom-2 duration-150',
                borderColors[toast.type]
              )}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{icons[toast.type]}</div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {toast.message}
                  </p>
                  {toast.description && (
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      {toast.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
