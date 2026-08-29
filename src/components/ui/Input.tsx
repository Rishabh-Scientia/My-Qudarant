import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftPrefix?: React.ReactNode
  rightSuffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftPrefix,
      rightSuffix,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 dark:focus-within:border-zinc-400 dark:focus-within:ring-zinc-400 transition-all shadow-subtle">
          {leftPrefix && (
            <div className="pl-3 pr-1 text-zinc-400 text-sm font-medium select-none">
              {leftPrefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              leftPrefix && 'pl-1.5',
              rightSuffix && 'pr-1.5',
              error && 'text-rose-600',
              className
            )}
            {...props}
          />
          {rightSuffix && (
            <div className="pr-3 pl-1 text-zinc-400 text-xs select-none">
              {rightSuffix}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-zinc-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
