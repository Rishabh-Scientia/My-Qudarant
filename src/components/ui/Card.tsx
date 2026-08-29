import React from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'highlight'
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default:
      'border border-zinc-200/90 bg-white dark:border-zinc-800/90 dark:bg-zinc-900 shadow-subtle',
    subtle:
      'border border-zinc-100 bg-zinc-50/70 dark:border-zinc-800/50 dark:bg-zinc-900/40',
    highlight:
      'border border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/60 dark:bg-emerald-950/20',
  }

  return (
    <div
      className={cn(
        'rounded-xl transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
