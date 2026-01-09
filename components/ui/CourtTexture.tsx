'use client'

import { cn } from '@/lib/utils'

interface CourtTextureProps {
  variant?: 'grid' | 'concrete' | 'composite'
  color?: string
  opacity?: number
  className?: string
}

export function CourtTexture({
  variant = 'grid',
  color = '#3B82F6',
  opacity = 0.05,
  className,
}: CourtTextureProps) {
  switch (variant) {
    case 'grid':
      return (
        <GridTexture color={color} opacity={opacity} className={className} />
      )
    case 'concrete':
      return (
        <ConcreteTexture color={color} opacity={opacity} className={className} />
      )
    case 'composite':
      return (
        <CompositeTexture color={color} opacity={opacity} className={className} />
      )
    default:
      return (
        <GridTexture color={color} opacity={opacity} className={className} />
      )
  }
}

// Grid pattern like sport court tiles
function GridTexture({
  color,
  opacity,
  className,
}: {
  color: string
  opacity: number
  className?: string
}) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 24px,
            ${color} 24px,
            ${color} 25px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 24px,
            ${color} 24px,
            ${color} 25px
          )
        `,
        opacity,
      }}
    />
  )
}

// Concrete/brushed texture using SVG noise
function ConcreteTexture({
  color,
  opacity,
  className,
}: {
  color: string
  opacity: number
  className?: string
}) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='concreteNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23concreteNoise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        opacity,
      }}
    />
  )
}

// Composite multi-layer texture (most realistic)
function CompositeTexture({
  color,
  opacity,
  className,
}: {
  color: string
  opacity: number
  className?: string
}) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Base noise layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='baseNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23baseNoise)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          opacity: opacity * 0.5,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 30px,
              ${color} 30px,
              ${color} 31px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 30px,
              ${color} 30px,
              ${color} 31px
            )
          `,
          opacity: opacity * 0.3,
        }}
      />
    </div>
  )
}

// Court lines overlay - actual court markings
export function CourtLines({
  color = 'white',
  opacity = 0.15,
  className,
}: {
  color?: string
  opacity?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      preserveAspectRatio="none"
      style={{ opacity }}
    >
      {/* Outer boundary */}
      <rect
        x="20"
        y="20"
        width="360"
        height="160"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />

      {/* Center line */}
      <line
        x1="200"
        y1="20"
        x2="200"
        y2="180"
        stroke={color}
        strokeWidth="2"
      />

      {/* Non-volley zone (kitchen) lines */}
      <line
        x1="20"
        y1="60"
        x2="380"
        y2="60"
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1="20"
        y1="140"
        x2="380"
        y2="140"
        stroke={color}
        strokeWidth="2"
      />

      {/* Service boxes */}
      <line
        x1="200"
        y1="60"
        x2="200"
        y2="140"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
    </svg>
  )
}
