'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Truck, Shield, Minus, Plus, Trash2, Crown } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import { getSizeInfo, getColorInfo } from '@/lib/products'
import { Button } from '@/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getTotal, getItemCount } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()
  const itemCount = getItemCount()

  const handleCheckout = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Crown className="w-16 h-16 mx-auto text-gold-500 mb-4" />
          <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-charcoal-600 mb-8">
            Add a custom pickleball crown to get started!
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/shop">Shop Crowns</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-crown shadow-soft p-6">
              <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-6">
                Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h2>

              <div className="divide-y divide-cream-200">
                {items.map((item) => {
                  const sizeInfo = getSizeInfo(item.options.size)
                  const colorInfo = getColorInfo(item.options.ballColor)

                  return (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                      <div className="flex gap-4">
                        {/* Product Icon */}
                        <div className="w-20 h-20 bg-gold-100 rounded-crown flex items-center justify-center flex-shrink-0">
                          <Crown className="w-10 h-10 text-gold-500" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-display font-semibold text-charcoal-900">
                                Customizable Pickleball Crown
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {sizeInfo && (
                                  <span className="text-xs px-2 py-1 bg-cream-100 rounded-full text-charcoal-600">
                                    Size: {sizeInfo.name}
                                  </span>
                                )}
                                {colorInfo && (
                                  <span className="text-xs px-2 py-1 bg-cream-100 rounded-full text-charcoal-600 flex items-center gap-1">
                                    <span
                                      className={`w-3 h-3 rounded-full ${
                                        item.options.ballColor === 'green' ? 'bg-pickle-400' : 'bg-pink-400'
                                      }`}
                                    />
                                    {colorInfo.name}
                                  </span>
                                )}
                                {item.options.customText && (
                                  <span className="text-xs px-2 py-1 bg-cream-100 rounded-full text-charcoal-600">
                                    &quot;{item.options.customText}&quot;
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="font-semibold text-charcoal-900">
                              {formatPrice(1999 * item.quantity)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-crown border border-cream-300 text-charcoal-600 hover:bg-cream-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= 10}
                                className="w-8 h-8 flex items-center justify-center rounded-crown border border-cream-300 text-charcoal-600 hover:bg-cream-100 transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-sm text-charcoal-500 hover:text-red-600 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-crown p-4 shadow-soft text-center">
                <Truck className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-900 font-medium">Fast Shipping</p>
                <p className="text-xs text-charcoal-500">3-7 business days</p>
              </div>
              <div className="bg-white rounded-crown p-4 shadow-soft text-center">
                <Shield className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-900 font-medium">Secure Checkout</p>
                <p className="text-xs text-charcoal-500">256-bit encryption</p>
              </div>
              <div className="bg-white rounded-crown p-4 shadow-soft text-center">
                <CreditCard className="w-6 h-6 text-gold-600 mx-auto mb-2" />
                <p className="text-sm text-charcoal-900 font-medium">Made to Order</p>
                <p className="text-xs text-charcoal-500">Custom just for you</p>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-crown shadow-soft p-6 sticky top-28">
              <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-6">
                Order Total
              </h2>

              {/* Order Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-pickle-600 font-medium">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && subtotal < 3500 && (
                  <p className="text-xs text-gold-600">
                    Add {formatPrice(3500 - subtotal)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-lg font-semibold text-charcoal-900 pt-3 border-t border-cream-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-crown text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              <p className="text-xs text-charcoal-500 text-center mt-4">
                Secure checkout powered by Stripe
              </p>

              {/* Ships from */}
              <div className="mt-6 pt-4 border-t border-cream-200 text-center">
                <p className="text-xs text-charcoal-500">Ships from Austin, Texas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
