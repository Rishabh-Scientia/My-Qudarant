import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative z-10 w-full rounded-t-2xl sm:rounded-2xl border-t sm:border border-zinc-200 bg-white p-4 sm:p-6 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-950 animate-slideUp sm:animate-fadeIn max-h-[92vh] sm:max-h-[88vh] flex flex-col',
          maxWClasses[maxWidth]
        )}
        style={{
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 16px))',
        }}
      >
        {/* Mobile handle pull bar */}
        <div className="sm:hidden flex justify-center -mt-2 pb-2">
          <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <div className="pr-4">
            {title && (
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors shrink-0 active:scale-95"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="mt-3 sm:mt-4 overflow-y-auto pr-1 overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
