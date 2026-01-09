'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'default' | 'lg'
  showTagline?: boolean
}

export function Logo({ className, size = 'default', showTagline = false }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    default: 'text-2xl',
    lg: 'text-3xl md:text-4xl',
  }

  return (
    <Link href="/" className={cn('flex flex-col items-start', className)}>
      <div className="flex items-center gap-2">
        {/* Texas Star Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn(
            'text-burnt-orange-700',
            size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
          )}
        >
          <path d="M12 2L14.4 8.6H21.5L15.9 12.8L18.3 19.4L12 15.2L5.7 19.4L8.1 12.8L2.5 8.6H9.6L12 2Z" />
        </svg>
        <span
          className={cn(
            'font-display font-semibold tracking-tight text-charcoal-900',
            sizes[size]
          )}
        >
          Lone Star <span className="text-burnt-orange-700">Post Oak</span>
        </span>
      </div>
      {showTagline && (
        <span className="text-sm text-smoke-500 font-body mt-0.5 ml-7">
          Real Texas BBQ Wood
        </span>
      )}
    </Link>
  )
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('text-burnt-orange-700', className)}
    >
      <path d="M12 2L14.4 8.6H21.5L15.9 12.8L18.3 19.4L12 15.2L5.7 19.4L8.1 12.8L2.5 8.6H9.6L12 2Z" />
    </svg>
  )
}
