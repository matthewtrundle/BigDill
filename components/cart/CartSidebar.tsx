'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, Loader2, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, formatCartItemOptions } from '@/lib/cart-context'
import { Button } from '@/components/ui/Button'
import { formatPrice, getSizeInfo, getColorInfo } from '@/lib/products'

export function CartSidebar() {
  const {
    isOpen,
    closeCart,
    getCartProducts,
    updateQuantity,
    removeItem,
    getSubtotal,
    getBulkDiscount,
    getDiscountedSubtotal,
    getShipping,
    getTotal,
    getItemCount,
    items,
  } = useCart()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const cartProducts = getCartProducts()
  const subtotal = getSubtotal()
  const bulkDiscount = getBulkDiscount()
  const discountedSubtotal = getDiscountedSubtotal()
  const shipping = getShipping()
  const total = getTotal()
  const itemCount = getItemCount()

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle Stripe checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Call checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Checkout failed')
      }

      const { url } = await response.json()

      // Redirect to Stripe checkout URL
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutError(
        error instanceof Error ? error.message : 'An error occurred during checkout'
      )
      setIsCheckingOut(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-cream-100 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-600" />
                <h2 className="font-display text-xl font-semibold text-charcoal-900">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="text-sm text-charcoal-500">
                    ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Contents */}
            <div className="flex-1 overflow-y-auto">
              {cartProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <Crown className="w-16 h-16 text-cream-400 mb-4" />
                  <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-charcoal-500 mb-6">
                    Add a customized pickleball crown to get started!
                  </p>
                  <Button variant="primary" onClick={closeCart} asChild>
                    <Link href="/shop">Shop Crowns</Link>
                  </Button>
                </div>
              ) : (
                <div className="px-6 py-4 space-y-4">
                  {cartProducts.map(({ id, quantity, product, options }) => {
                    const sizeInfo = getSizeInfo(options.size)
                    const colorInfo = getColorInfo(options.ballColor)

                    return (
                      <div
                        key={id}
                        className="flex gap-4 p-4 bg-white rounded-crown shadow-soft"
                      >
                        {/* Product Image Placeholder */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gold-100 rounded-lg flex items-center justify-center">
                          <Crown className="w-10 h-10 text-gold-500" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-semibold text-charcoal-900 truncate">
                            {product.name}
                          </h4>

                          {/* Options */}
                          <div className="mt-1 space-y-0.5 text-xs text-charcoal-500">
                            <p>Size: {sizeInfo?.name} ({sizeInfo?.circumference})</p>
                            <p className="flex items-center gap-1">
                              Color:
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: colorInfo?.hex }}
                              />
                              {colorInfo?.name}
                            </p>
                            {options.customText && (
                              <p className="truncate">Text: "{options.customText}"</p>
                            )}
                          </div>

                          <p className="text-gold-600 font-semibold mt-2">
                            {formatPrice(product.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(id, quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-crown border border-cream-300 text-charcoal-600 hover:bg-cream-200 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(id, quantity + 1)}
                              disabled={quantity >= 10}
                              className="w-8 h-8 flex items-center justify-center rounded-crown border border-cream-300 text-charcoal-600 hover:bg-cream-200 transition-colors disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(id)}
                              className="ml-auto text-sm text-charcoal-500 hover:text-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartProducts.length > 0 && (
              <div className="border-t border-cream-300 px-6 py-4 bg-cream-50">
                {/* Totals */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">Subtotal ({itemCount} items)</span>
                    <span className={bulkDiscount.rate > 0 ? 'text-charcoal-400 line-through' : 'text-charcoal-900'}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {bulkDiscount.rate > 0 && (
                    <div className="flex items-center justify-between text-sm bg-pickle-50 -mx-6 px-6 py-2">
                      <span className="text-pickle-700 font-medium">Bulk Discount ({bulkDiscount.label})</span>
                      <span className="text-pickle-600 font-semibold">-{formatPrice(bulkDiscount.savings)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">Shipping</span>
                    <span className={shipping === 0 ? 'text-pickle-600 font-semibold' : 'text-charcoal-900'}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-cream-200">
                    <span className="font-semibold text-charcoal-900">Total</span>
                    <span className="font-display text-xl font-semibold text-charcoal-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                  {bulkDiscount.rate > 0 && (
                    <p className="text-xs text-center text-pickle-600 font-medium">
                      You're saving {formatPrice(bulkDiscount.savings)} with bulk pricing!
                    </p>
                  )}
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <p className="text-sm text-charcoal-500 mb-4 text-center">
                    Add {formatPrice(3500 - discountedSubtotal)} more for free shipping!
                  </p>
                )}

                {/* Checkout Error */}
                {checkoutError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {checkoutError}
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full mt-3 text-center text-sm text-gold-700 hover:text-gold-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
