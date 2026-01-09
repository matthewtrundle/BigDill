'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-crown transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gold-500 text-charcoal-900 hover:bg-gold-600 shadow-gold hover:shadow-gold-lg active:scale-[0.98]',
        secondary:
          'bg-charcoal-900 text-cream-100 hover:bg-charcoal-950 active:scale-[0.98]',
        pickle:
          'bg-pickle-500 text-white hover:bg-pickle-600 shadow-pickle active:scale-[0.98]',
        outline:
          'border-2 border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-cream-100',
        ghost:
          'text-charcoal-900 hover:bg-charcoal-100 hover:text-charcoal-950',
        link: 'text-gold-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
