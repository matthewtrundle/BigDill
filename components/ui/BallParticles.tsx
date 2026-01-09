'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface BallParticlesProps {
  count?: number
  className?: string
  colors?: ('green' | 'pink' | 'gold')[]
}

const colorValues = {
  green: '#7AE435',
  pink: '#F472B6',
  gold: '#FFD966',
}

export function BallParticles({
  count = 6,
  className,
  colors = ['green', 'pink'],
}: BallParticlesProps) {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 20,
      duration: 8 + Math.random() * 8,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 100,
    }))
  }, [count, colors])

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            bottom: '-50px',
          }}
          initial={{ y: 0, opacity: 0, scale: 1, rotate: 0 }}
          animate={{
            y: [0, -400, -800],
            opacity: [0, 0.6, 0],
            scale: [1, 1.1, 0.9],
            rotate: [0, 180, 360],
            x: [0, particle.drift * 0.5, particle.drift],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <MiniPickleball
            size={particle.size}
            color={colorValues[particle.color]}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Simplified pickleball for particles (less detail for performance)
function MiniPickleball({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <radialGradient id={`miniGrad-${color}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Ball body */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill={`url(#miniGrad-${color})`}
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Simplified holes */}
      <circle cx="20" cy="12" r="2.5" fill="rgba(0,0,0,0.1)" />
      <circle cx="12" cy="20" r="2.5" fill="rgba(0,0,0,0.1)" />
      <circle cx="28" cy="20" r="2.5" fill="rgba(0,0,0,0.1)" />
      <circle cx="20" cy="28" r="2.5" fill="rgba(0,0,0,0.1)" />
      <circle cx="14" cy="14" r="2" fill="rgba(0,0,0,0.08)" />
      <circle cx="26" cy="14" r="2" fill="rgba(0,0,0,0.08)" />
      <circle cx="14" cy="26" r="2" fill="rgba(0,0,0,0.08)" />
      <circle cx="26" cy="26" r="2" fill="rgba(0,0,0,0.08)" />

      {/* Highlight */}
      <ellipse
        cx="14"
        cy="14"
        rx="6"
        ry="4"
        fill="rgba(255,255,255,0.2)"
        transform="rotate(-30 14 14)"
      />
    </svg>
  )
}

// Static floating balls for less intensive animation
export function FloatingBalls({
  className,
  positions,
}: {
  className?: string
  positions?: { x: number; y: number; size: number; color: 'green' | 'pink' | 'gold' }[]
}) {
  const defaultPositions = [
    { x: 10, y: 20, size: 24, color: 'green' as const },
    { x: 85, y: 35, size: 18, color: 'pink' as const },
    { x: 25, y: 70, size: 20, color: 'green' as const },
    { x: 75, y: 80, size: 16, color: 'gold' as const },
  ]

  const balls = positions || defaultPositions

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {balls.map((ball, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          <MiniPickleball size={ball.size} color={colorValues[ball.color]} />
        </motion.div>
      ))}
    </div>
  )
}
