'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ParallaxBackgroundProps {
  src: string
  alt?: string
  speed?: number // -1 to 1, negative = moves opposite to scroll
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  className?: string
  children: React.ReactNode
}

export function ParallaxBackground({
  src,
  alt = '',
  speed = 0.3, // Default: background moves 30% slower than scroll
  opacity = 0.3,
  overlayColor = 'cream-200',
  overlayOpacity = 85,
  className = '',
  children,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Transform scroll progress to Y translation
  // speed of 0.3 means background moves 30% as fast as scroll (parallax effect)
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  // If user prefers reduced motion, disable parallax
  const parallaxY = shouldReduceMotion ? '0%' : y

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Parallax background layer */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: parallaxY }}
      >
        {/* Scale up slightly to prevent edges from showing during parallax */}
        <div className="absolute inset-0 scale-110">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            style={{ opacity }}
          />
        </div>
      </motion.div>

      {/* Overlay for text readability */}
      <div
        className={`absolute inset-0 -z-10 bg-${overlayColor}/${overlayOpacity}`}
      />

      {/* Content */}
      {children}
    </section>
  )
}

// Simpler fixed background variant (no parallax, just background-attachment: fixed effect)
interface FixedBackgroundProps {
  src: string
  alt?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  className?: string
  children: React.ReactNode
}

export function FixedBackground({
  src,
  alt = '',
  opacity = 0.2,
  overlayColor = 'white',
  overlayOpacity = 90,
  className = '',
  children,
}: FixedBackgroundProps) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Fixed background layer */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            opacity,
          }}
        />
      </div>

      {/* Overlay for text readability */}
      <div
        className={`absolute inset-0 -z-10 bg-${overlayColor}/${overlayOpacity}`}
      />

      {/* Content */}
      {children}
    </section>
  )
}

// Slow zoom effect for hero backgrounds
interface ZoomBackgroundProps {
  src: string
  alt?: string
  opacity?: number
  zoomScale?: number // How much to zoom (1.1 = 10% zoom)
  duration?: number // Duration in seconds
  className?: string
  children: React.ReactNode
}

export function ZoomBackground({
  src,
  alt = '',
  opacity = 0.5,
  zoomScale = 1.05,
  duration = 20,
  className = '',
  children,
}: ZoomBackgroundProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Slowly zooming background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1 }}
        animate={shouldReduceMotion ? {} : { scale: zoomScale }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ opacity }}
        />
      </motion.div>

      {/* Content */}
      {children}
    </section>
  )
}
