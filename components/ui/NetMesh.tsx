'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NetMeshProps {
  color?: string
  opacity?: number
  animated?: boolean
  className?: string
}

export function NetMesh({
  color = '#666666',
  opacity = 0.03,
  animated = false,
  className,
}: NetMeshProps) {
  const Wrapper = animated ? motion.div : 'div'
  const animationProps = animated
    ? {
        animate: {
          x: [0, 5, 0],
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {}

  return (
    <Wrapper
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      {...animationProps}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="netMeshPattern"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            {/* Diamond mesh pattern */}
            <path
              d="M0 12 L12 0 L24 12 L12 24 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
            />
            {/* Slight imperfection for organic feel */}
            <circle cx="12" cy="12" r="0.5" fill={color} opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#netMeshPattern)" />
      </svg>
    </Wrapper>
  )
}

// Vertical net stripe for side decoration
export function NetStripe({
  color = '#FFCC33',
  width = 60,
  className,
}: {
  color?: string
  width?: number
  className?: string
}) {
  return (
    <div
      className={cn('absolute top-0 bottom-0 pointer-events-none', className)}
      style={{ width }}
    >
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="netStripePattern"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 6 L6 0 L12 6 L6 12 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              opacity="0.4"
            />
          </pattern>
          <linearGradient id="netStripeFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopOpacity="0" />
            <stop offset="30%" stopOpacity="1" />
            <stop offset="70%" stopOpacity="1" />
            <stop offset="100%" stopOpacity="0" />
          </linearGradient>
          <mask id="netStripeMask">
            <rect width="100%" height="100%" fill="url(#netStripeFade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#netStripePattern)"
          mask="url(#netStripeMask)"
        />
      </svg>
    </div>
  )
}

// Horizontal net band (like the top of a net)
export function NetBand({
  color = '#FFCC33',
  height = 40,
  className,
}: {
  color?: string
  height?: number
  className?: string
}) {
  return (
    <motion.div
      className={cn('absolute left-0 right-0 pointer-events-none', className)}
      style={{ height }}
      animate={{
        skewX: [0, 0.5, 0, -0.5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <pattern
            id="netBandPattern"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 8 L8 0 L16 8 L8 16 Z"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
              opacity="0.5"
            />
          </pattern>
          <linearGradient id="netBandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background gradient */}
        <rect width="100%" height="100%" fill="url(#netBandGradient)" />

        {/* Mesh pattern */}
        <rect width="100%" height="100%" fill="url(#netBandPattern)" />

        {/* Top rope/cable */}
        <path
          d={`M0,3 Q${window?.innerWidth / 4 || 360},6 ${window?.innerWidth / 2 || 720},3 T${window?.innerWidth || 1440},5`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  )
}
