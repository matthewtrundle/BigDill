'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PickleballSVGProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'green' | 'pink' | 'gold'
  animated?: boolean
  className?: string
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
}

const colorMap = {
  green: {
    fill: '#7AE435',
    stroke: '#5FD115',
    shadow: 'rgba(95, 209, 21, 0.3)',
  },
  pink: {
    fill: '#F472B6',
    stroke: '#EC4899',
    shadow: 'rgba(236, 72, 153, 0.3)',
  },
  gold: {
    fill: '#FFD966',
    stroke: '#FFCC33',
    shadow: 'rgba(255, 204, 51, 0.3)',
  },
}

// Hole positions arranged in an organic pattern (like a real pickleball)
const holePositions = [
  // Center ring
  { cx: 50, cy: 35, r: 4 },
  { cx: 65, cy: 42, r: 4 },
  { cx: 62, cy: 58, r: 4 },
  { cx: 50, cy: 65, r: 4 },
  { cx: 38, cy: 58, r: 4 },
  { cx: 35, cy: 42, r: 4 },
  // Outer ring
  { cx: 50, cy: 22, r: 3.5 },
  { cx: 68, cy: 28, r: 3.5 },
  { cx: 78, cy: 45, r: 3.5 },
  { cx: 75, cy: 62, r: 3.5 },
  { cx: 62, cy: 75, r: 3.5 },
  { cx: 50, cy: 78, r: 3.5 },
  { cx: 38, cy: 75, r: 3.5 },
  { cx: 25, cy: 62, r: 3.5 },
  { cx: 22, cy: 45, r: 3.5 },
  { cx: 32, cy: 28, r: 3.5 },
  // Inner accents
  { cx: 50, cy: 50, r: 3 },
  { cx: 42, cy: 44, r: 2.5 },
  { cx: 58, cy: 44, r: 2.5 },
  { cx: 58, cy: 56, r: 2.5 },
  { cx: 42, cy: 56, r: 2.5 },
]

export function PickleballSVG({
  size = 'md',
  color = 'green',
  animated = false,
  className,
}: PickleballSVGProps) {
  const dimension = sizeMap[size]
  const colors = colorMap[color]

  const Ball = animated ? motion.svg : 'svg'
  const animationProps = animated
    ? {
        animate: {
          rotate: [0, 360],
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        },
      }
    : {}

  return (
    <Ball
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      className={cn('drop-shadow-lg', className)}
      style={{
        filter: `drop-shadow(0 4px 8px ${colors.shadow})`,
      }}
      {...animationProps}
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id={`ballGradient-${color}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor={colors.fill} stopOpacity="1" />
          <stop offset="70%" stopColor={colors.stroke} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.9" />
        </radialGradient>
        <filter id={`innerShadow-${color}`}>
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feComposite
            operator="out"
            in="SourceGraphic"
            in2="offset-blur"
            result="inverse"
          />
          <feFlood floodColor="#000" floodOpacity="0.2" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* Main ball */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={`url(#ballGradient-${color})`}
        stroke={colors.stroke}
        strokeWidth="2"
      />

      {/* Holes with inner shadow effect */}
      {holePositions.map((hole, index) => (
        <g key={index}>
          {/* Hole shadow (offset slightly) */}
          <circle
            cx={hole.cx + 0.5}
            cy={hole.cy + 0.5}
            r={hole.r}
            fill="rgba(0,0,0,0.15)"
          />
          {/* Main hole */}
          <circle
            cx={hole.cx}
            cy={hole.cy}
            r={hole.r}
            fill="rgba(0,0,0,0.08)"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.5"
          />
          {/* Inner highlight */}
          <circle
            cx={hole.cx - 0.3}
            cy={hole.cy - 0.3}
            r={hole.r * 0.6}
            fill="rgba(255,255,255,0.05)"
          />
        </g>
      ))}

      {/* Highlight arc for 3D effect */}
      <ellipse
        cx="38"
        cy="38"
        rx="15"
        ry="12"
        fill="rgba(255,255,255,0.2)"
        transform="rotate(-30 38 38)"
      />
    </Ball>
  )
}

// Decorative version with bounce animation
export function BouncingPickleball({
  size = 'md',
  color = 'green',
  className,
}: Omit<PickleballSVGProps, 'animated'>) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <PickleballSVG size={size} color={color} />
    </motion.div>
  )
}
