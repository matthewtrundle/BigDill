'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

interface OrderItem {
  name: string
  quantity: number
  price: number
  weight?: number
}

interface OrderData {
  orderNumber: string
  email: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart()
  }, [clearCart])

  useEffect(() => {
    async function fetchOrder() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/webhook?session_id=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
        } else {
          // Order might not be created yet, just show generic success
          console.log('Order not found yet, showing generic success')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-cream-200 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-burnt-orange-600" />
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-cream-200">
      <div className="container-narrow py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-display-sm text-charcoal-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-smoke-600 max-w-md mx-auto">
            Thank you for your order. Your premium Texas post oak is on its way!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-soft shadow-warm p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-cream-200">
            <div>
              <p className="text-sm text-smoke-500">Order Number</p>
              <p className="font-display text-xl font-semibold text-charcoal-900">
                {order?.orderNumber || 'Processing...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-smoke-500">Order Date</p>
              <p className="font-semibold text-charcoal-900">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Order Items */}
          {order?.items && order.items.length > 0 && (
            <div className="mb-6 pb-6 border-b border-cream-200">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-charcoal-900">{item.name}</span>
                      <span className="text-smoke-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-charcoal-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">
                <div className="flex justify-between text-smoke-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-smoke-600">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-smoke-600">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-charcoal-900 text-lg">
                  <span>Total</span>
                  <span className="text-burnt-orange-700">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-6">
            What Happens Next
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-burnt-orange-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-burnt-orange-700" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900">Confirmation Email</h3>
                <p className="text-smoke-600 text-sm">
                  You will receive an email confirmation with your order details shortly
                  {order?.email ? ` at ${order.email}` : ''}.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-burnt-orange-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-burnt-orange-700" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900">Order Processing</h3>
                <p className="text-smoke-600 text-sm">
                  Your order will be carefully packed and prepared for shipment within 24
                  hours (same-day if ordered before 2pm CT).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-burnt-orange-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-burnt-orange-700" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900">Shipping Update</h3>
                <p className="text-smoke-600 text-sm">
                  Once shipped, you will receive a tracking number via email. Expected delivery
                  is 3-7 business days depending on your location.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-charcoal-900 text-cream-100 rounded-soft p-8 mb-8">
          <h2 className="font-display text-lg font-semibold mb-4">
            While You Wait...
          </h2>
          <p className="text-cream-300 mb-4">
            Get ready for your first cook with our post oak! Here are some resources:
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/bbq-guide"
                className="text-burnt-orange-400 hover:text-burnt-orange-300 transition-colors"
              >
                → Read our BBQ Guide for smoking tips
              </Link>
            </li>
            <li>
              <Link
                href="/why-post-oak"
                className="text-burnt-orange-400 hover:text-burnt-orange-300 transition-colors"
              >
                → Learn why post oak is the Texas standard
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-burnt-orange-400 hover:text-burnt-orange-300 transition-colors"
              >
                → Browse our recipes and techniques
              </Link>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/track">Track Your Order</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/shop" className="group">
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 min-h-screen bg-cream-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-burnt-orange-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
