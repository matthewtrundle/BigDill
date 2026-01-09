'use client'

import { Percent, TrendingUp, Sparkles } from 'lucide-react'

// Bulk discount tiers
export const discountTiers = [
  { min: 1, max: 14, discount: 0, label: 'No discount', badge: null },
  { min: 15, max: 39, discount: 0.05, label: '5% off', badge: null },
  { min: 40, max: 99, discount: 0.10, label: '10% off', badge: 'Best Value' },
  { min: 100, max: Infinity, discount: 0.20, label: '20% off', badge: 'Wholesale' },
]

export function getDiscountTier(quantity: number) {
  return discountTiers.find(t => quantity >= t.min && quantity <= t.max) || discountTiers[0]
}

export function getNextTier(quantity: number) {
  const currentIndex = discountTiers.findIndex(t => quantity >= t.min && quantity <= t.max)
  if (currentIndex < discountTiers.length - 1) {
    return discountTiers[currentIndex + 1]
  }
  return null
}

interface TierProgressProps {
  quantity: number
  unitPrice: number // in cents
  className?: string
}

export function TierProgress({ quantity, unitPrice, className = '' }: TierProgressProps) {
  const currentTier = getDiscountTier(quantity)
  const nextTier = getNextTier(quantity)

  const originalTotal = quantity * unitPrice
  const discountedTotal = Math.round(originalTotal * (1 - currentTier.discount))
  const savings = originalTotal - discountedTotal

  // Calculate progress to next tier
  const progressPercent = nextTier
    ? ((quantity - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100

  const itemsToNextTier = nextTier ? nextTier.min - quantity : 0

  // Calculate potential savings at next tier
  const nextTierSavings = nextTier
    ? Math.round((nextTier.min * unitPrice) * nextTier.discount) - Math.round((nextTier.min * unitPrice) * currentTier.discount)
    : 0

  return (
    <div className={`bg-gradient-to-br from-gold-50 to-cream-100 rounded-organic-lg p-5 ${className}`}>
      {/* Current Tier Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-organic flex items-center justify-center ${
            currentTier.discount > 0 ? 'bg-pickle-100' : 'bg-cream-200'
          }`}>
            <Percent className={`w-5 h-5 ${currentTier.discount > 0 ? 'text-pickle-600' : 'text-charcoal-400'}`} />
          </div>
          <div>
            <p className="font-heading font-bold text-charcoal-900">
              {currentTier.discount > 0 ? currentTier.label : 'Standard Price'}
            </p>
            <p className="text-xs text-charcoal-500">{quantity} items in order</p>
          </div>
        </div>
        {currentTier.badge && (
          <span className="bg-gold-500 text-charcoal-900 px-3 py-1 rounded-full text-xs font-bold">
            {currentTier.badge}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-charcoal-500 mb-1">
            <span>{currentTier.min} items</span>
            <span>{nextTier.min} items</span>
          </div>
          <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pickle-400 to-pickle-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Next Tier Nudge - Loss Aversion */}
      {nextTier && (
        <div className="bg-white/70 backdrop-blur-sm rounded-organic p-3 mb-4 border border-gold-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-charcoal-900">
                Add {itemsToNextTier} more to unlock {nextTier.label}!
              </p>
              <p className="text-xs text-pickle-600 font-medium">
                You'll save an extra ${(nextTierSavings / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Savings Display - Anchoring */}
      {currentTier.discount > 0 && (
        <div className="bg-pickle-50 border border-pickle-200 rounded-organic p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pickle-500" />
              <span className="text-sm font-medium text-pickle-700">Your Savings</span>
            </div>
            <span className="font-bold text-pickle-600 text-lg">
              ${(savings / 100).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Tier Overview */}
      <div className="mt-4 pt-4 border-t border-cream-200">
        <p className="text-xs text-charcoal-500 mb-2 font-medium">All discount tiers:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {discountTiers.slice(1).map((tier, i) => {
            const isActive = quantity >= tier.min && quantity <= tier.max
            const isReached = quantity >= tier.min
            return (
              <div
                key={i}
                className={`text-center p-2 rounded-organic transition-all ${
                  isActive
                    ? 'bg-pickle-100 border border-pickle-300 ring-2 ring-pickle-400'
                    : isReached
                    ? 'bg-gold-100 border border-gold-200'
                    : 'bg-cream-100 border border-cream-200'
                }`}
              >
                <span className={`block font-bold ${
                  isActive ? 'text-pickle-700' : isReached ? 'text-gold-700' : 'text-charcoal-400'
                }`}>
                  {tier.label}
                </span>
                <span className={`text-xs ${
                  isActive ? 'text-pickle-600' : isReached ? 'text-gold-600' : 'text-charcoal-400'
                }`}>
                  {tier.max === Infinity ? `${tier.min}+` : `${tier.min}-${tier.max}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Compact version for inline use
interface TierBadgeProps {
  quantity: number
  className?: string
}

export function TierBadge({ quantity, className = '' }: TierBadgeProps) {
  const tier = getDiscountTier(quantity)
  const nextTier = getNextTier(quantity)
  const itemsToNext = nextTier ? nextTier.min - quantity : 0

  if (tier.discount === 0 && nextTier) {
    return (
      <span className={`inline-flex items-center gap-1 text-sm text-gold-700 bg-gold-100 px-3 py-1 rounded-full ${className}`}>
        <TrendingUp className="w-3 h-3" />
        Add {itemsToNext} for {nextTier.label}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-bold text-pickle-700 bg-pickle-100 px-3 py-1 rounded-full ${className}`}>
      <Percent className="w-3 h-3" />
      {tier.label}
    </span>
  )
}
