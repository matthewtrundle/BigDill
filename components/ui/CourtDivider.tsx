'use client'

import { cn } from '@/lib/utils'

interface CourtDividerProps {
  variant?: 'net' | 'baseline' | 'centerline' | 'kitchen'
  color?: string
  className?: string
  flip?: boolean
}

export function CourtDivider({
  variant = 'net',
  color = '#FFCC33',
  className,
  flip = false,
}: CourtDividerProps) {
  const transform = flip ? 'scaleY(-1)' : undefined

  switch (variant) {
    case 'net':
      return <NetDivider color={color} className={className} transform={transform} />
    case 'baseline':
      return <BaselineDivider color={color} className={className} transform={transform} />
    case 'centerline':
      return <CenterlineDivider color={color} className={className} transform={transform} />
    case 'kitchen':
      return <KitchenDivider color={color} className={className} transform={transform} />
    default:
      return <NetDivider color={color} className={className} transform={transform} />
  }
}

// Net - wavy mesh pattern like a pickleball net
function NetDivider({
  color,
  className,
  transform,
}: {
  color: string
  className?: string
  transform?: string
}) {
  return (
    <svg
      viewBox="0 0 1440 80"
      fill="none"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ transform }}
    >
      <defs>
        <pattern
          id="netPattern"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 10 L10 0 L20 10 L10 20 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>

      {/* Net body with mesh */}
      <rect x="0" y="10" width="1440" height="50" fill="url(#netPattern)" />

      {/* Top cable/rope */}
      <path
        d="M0,10 Q360,5 720,12 T1440,8"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.8"
      />

      {/* Bottom edge with slight sag */}
      <path
        d="M0,60 Q360,65 720,62 T1440,64 L1440,80 L0,80 Z"
        fill={color}
        opacity="0.15"
      />

      {/* Vertical support lines */}
      <line x1="720" y1="0" x2="720" y2="80" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="360" y1="8" x2="360" y2="70" stroke={color} strokeWidth="1" opacity="0.2" />
      <line x1="1080" y1="8" x2="1080" y2="70" stroke={color} strokeWidth="1" opacity="0.2" />
    </svg>
  )
}

// Baseline - solid court line with worn texture
function BaselineDivider({
  color,
  className,
  transform,
}: {
  color: string
  className?: string
  transform?: string
}) {
  return (
    <svg
      viewBox="0 0 1440 24"
      fill="none"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ transform }}
    >
      {/* Main line */}
      <rect x="0" y="8" width="1440" height="8" fill={color} opacity="0.9" />

      {/* Worn/textured effect */}
      <path
        d="M0,8 Q200,9 400,8 T800,9 T1200,8 T1440,9"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0,16 Q300,15 600,16 T1100,15 T1440,16"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        fill="none"
      />

      {/* Subtle highlight on top */}
      <rect x="0" y="8" width="1440" height="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  )
}

// Centerline - dashed court center line
function CenterlineDivider({
  color,
  className,
  transform,
}: {
  color: string
  className?: string
  transform?: string
}) {
  return (
    <svg
      viewBox="0 0 1440 16"
      fill="none"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ transform }}
    >
      {/* Dashed center line */}
      <line
        x1="0"
        y1="8"
        x2="1440"
        y2="8"
        stroke={color}
        strokeWidth="4"
        strokeDasharray="40 20"
        opacity="0.7"
      />

      {/* Subtle worn effect between dashes */}
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={30 + i * 60}
          cy="8"
          r="1.5"
          fill={color}
          opacity="0.15"
        />
      ))}
    </svg>
  )
}

// Kitchen - thick non-volley zone line
function KitchenDivider({
  color,
  className,
  transform,
}: {
  color: string
  className?: string
  transform?: string
}) {
  return (
    <svg
      viewBox="0 0 1440 40"
      fill="none"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ transform }}
    >
      {/* Kitchen zone gradient */}
      <defs>
        <linearGradient id="kitchenGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="50%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Zone fill */}
      <rect x="0" y="0" width="1440" height="40" fill="url(#kitchenGradient)" />

      {/* Main thick line */}
      <rect x="0" y="0" width="1440" height="6" fill={color} opacity="0.8" />

      {/* Texture lines */}
      <path
        d="M0,3 Q400,4 800,3 T1440,4"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}

// Wave variant for more organic feel
export function WaveDivider({
  color = '#FFCC33',
  className,
  flip = false,
}: {
  color?: string
  className?: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path
        d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
        fill={color}
      />
    </svg>
  )
}
