'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Package, Truck, MapPin, Mail, Phone, Crown, ExternalLink, Star, Gift, MessageSquare } from 'lucide-react'

interface OrderItem {
  id: string
  sku: string | null
  name: string
  price: number
  quantity: number
  weight: number | null
  size: string | null
  ballColor: string | null
  customText: string | null
}

interface Order {
  id: string
  orderNumber: string
  email: string
  status: string
  paymentStatus: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingName: string | null
  shippingAddress1: string | null
  shippingAddress2: string | null
  shippingCity: string | null
  shippingState: string | null
  shippingZip: string | null
  shippingCountry: string | null
  shippingPhone: string | null
  trackingNumber: string | null
  carrier: string | null
  createdAt: string
  shippedAt: string | null
  deliveredAt: string | null
  items: OrderItem[]
}

interface FeedbackStatus {
  id: string
  rating: number | null
  comment: string | null
  emailSentAt: string | null
  submittedAt: string | null
  couponCode: string | null
  couponUsed: boolean
  expiresAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [feedback, setFeedback] = useState<FeedbackStatus | null>(null)
  const [sendingFeedback, setSendingFeedback] = useState(false)

  useEffect(() => {
    fetchOrder()
    fetchFeedback()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
        setTrackingNumber(data.order.trackingNumber || '')
        setCarrier(data.order.carrier || '')
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/feedback`)
      if (res.ok) {
        const data = await res.json()
        setFeedback(data.feedback)
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }

  const sendFeedbackRequest = async () => {
    setSendingFeedback(true)
    try {
      const res = await fetch(`/api/admin/orders/${params.id}/feedback`, {
        method: 'POST',
      })
      if (res.ok) {
        await fetchFeedback()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to send feedback request')
      }
    } catch (error) {
      console.error('Failed to send feedback request:', error)
      alert('Failed to send feedback request')
    } finally {
      setSendingFeedback(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: newStatus === 'SHIPPED' ? trackingNumber : undefined,
          carrier: newStatus === 'SHIPPED' ? carrier : undefined,
        }),
      })
      if (res.ok) {
        await fetchOrder()
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-charcoal-100 text-charcoal-700',
    PROCESSING: 'bg-gold-100 text-gold-700',
    SHIPPED: 'bg-pickle-100 text-pickle-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-pink-100 text-pink-700',
  }

  const ballColorStyles: Record<string, string> = {
    green: 'bg-pickle-400',
    pink: 'bg-pink-400',
  }

  const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
    const normalizedCarrier = carrier.toLowerCase()
    if (normalizedCarrier.includes('usps')) {
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
    } else if (normalizedCarrier.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${trackingNumber}`
    } else if (normalizedCarrier.includes('fedex')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
    }
    return ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-cream-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-cream-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 mx-auto text-charcoal-300 mb-4" />
          <p className="text-charcoal-500">Order not found</p>
          <Link href="/admin/orders" className="text-gold-600 hover:text-gold-700 mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-charcoal-900">
                {order.orderNumber}
              </h1>
              <p className="text-charcoal-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full font-medium ${
                statusColors[order.status] || statusColors.PENDING
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-crown shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-cream-200">
                <h2 className="font-display text-lg font-semibold text-charcoal-900">
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-cream-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gold-100 rounded-crown flex items-center justify-center flex-shrink-0">
                        <Crown className="w-8 h-8 text-gold-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal-900">{item.name}</h3>
                        <p className="text-sm text-charcoal-500">SKU: {item.sku || 'N/A'}</p>

                        {/* Customization Options */}
                        {(item.size || item.ballColor || item.customText) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.size && (
                              <span className="inline-flex items-center px-2 py-1 text-xs bg-cream-100 rounded-full text-charcoal-700">
                                Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                              </span>
                            )}
                            {item.ballColor && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-cream-100 rounded-full text-charcoal-700">
                                <span className={`w-3 h-3 rounded-full ${ballColorStyles[item.ballColor] || 'bg-charcoal-300'}`}></span>
                                {item.ballColor.charAt(0).toUpperCase() + item.ballColor.slice(1)} Ball
                              </span>
                            )}
                            {item.customText && (
                              <span className="inline-flex items-center px-2 py-1 text-xs bg-cream-100 rounded-full text-charcoal-700">
                                Text: &quot;{item.customText}&quot;
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-2 flex justify-between">
                          <span className="text-sm text-charcoal-600">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium text-charcoal-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-cream-50 border-t border-cream-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-600">Subtotal</span>
                    <span className="text-charcoal-900">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-600">Shipping</span>
                    <span className="text-charcoal-900">
                      {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-600">Tax</span>
                      <span className="text-charcoal-900">{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-cream-200">
                    <span className="font-semibold text-charcoal-900">Total</span>
                    <span className="font-semibold text-charcoal-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Status */}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <div className="bg-white rounded-crown shadow-soft p-6">
                <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                  Update Order Status
                </h2>

                {order.status === 'PROCESSING' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="9400123456..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">
                          Carrier
                        </label>
                        <select
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          className="w-full px-3 py-2 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="">Select carrier...</option>
                          <option value="USPS">USPS</option>
                          <option value="UPS">UPS</option>
                          <option value="FedEx">FedEx</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => updateOrderStatus('SHIPPED')}
                      disabled={updating || !trackingNumber || !carrier}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pickle-500 text-white font-medium rounded-crown hover:bg-pickle-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Truck className="w-5 h-5" />
                      {updating ? 'Updating...' : 'Mark as Shipped'}
                    </button>
                    <p className="text-xs text-charcoal-500 text-center mt-2">
                      Customer will receive a shipping confirmation email with tracking info
                    </p>
                  </div>
                )}

                {order.status === 'SHIPPED' && (
                  <button
                    onClick={() => updateOrderStatus('DELIVERED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-medium rounded-crown hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Package className="w-5 h-5" />
                    {updating ? 'Updating...' : 'Mark as Delivered'}
                  </button>
                )}

                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus('PROCESSING')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold-500 text-charcoal-900 font-medium rounded-crown hover:bg-gold-600 transition-colors disabled:opacity-50"
                  >
                    <Package className="w-5 h-5" />
                    {updating ? 'Updating...' : 'Start Processing'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-crown shadow-soft p-6">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                Customer
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-charcoal-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-charcoal-500">Email</p>
                    <a href={`mailto:${order.email}`} className="text-gold-600 hover:text-gold-700">
                      {order.email}
                    </a>
                  </div>
                </div>
                {order.shippingPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-charcoal-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal-500">Phone</p>
                      <a href={`tel:${order.shippingPhone}`} className="text-charcoal-900">
                        {order.shippingPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-crown shadow-soft p-6">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                Shipping Address
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-charcoal-400 mt-0.5" />
                <div className="text-charcoal-700">
                  <p className="font-medium">{order.shippingName}</p>
                  <p>{order.shippingAddress1}</p>
                  {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="bg-white rounded-crown shadow-soft p-6">
                <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                  Tracking
                </h2>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-charcoal-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-charcoal-500">{order.carrier || 'Carrier'}</p>
                    <p className="font-mono text-charcoal-900">{order.trackingNumber}</p>
                    {order.shippedAt && (
                      <p className="text-sm text-charcoal-500 mt-1">
                        Shipped {formatDate(order.shippedAt)}
                      </p>
                    )}
                    {order.carrier && getTrackingUrl(order.carrier, order.trackingNumber) && (
                      <a
                        href={getTrackingUrl(order.carrier, order.trackingNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-gold-600 hover:text-gold-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Track Package
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Feedback */}
            <div className="bg-white rounded-crown shadow-soft p-6">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                Customer Feedback
              </h2>

              {feedback ? (
                <div className="space-y-4">
                  {/* Feedback Status */}
                  {feedback.submittedAt ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= (feedback.rating || 0)
                                  ? 'text-gold-400 fill-gold-400'
                                  : 'text-cream-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-charcoal-600">
                          ({feedback.rating}/5)
                        </span>
                      </div>

                      {feedback.comment && (
                        <div className="flex items-start gap-2 bg-cream-50 rounded-lg p-3">
                          <MessageSquare className="w-4 h-4 text-charcoal-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-charcoal-700">{feedback.comment}</p>
                        </div>
                      )}

                      {feedback.couponCode && (
                        <div className="flex items-center gap-2 bg-gold-50 rounded-lg p-3">
                          <Gift className="w-4 h-4 text-gold-500" />
                          <div>
                            <span className="text-xs text-charcoal-500">Coupon issued: </span>
                            <span className="font-mono font-medium text-gold-600">
                              {feedback.couponCode}
                            </span>
                            {feedback.couponUsed && (
                              <span className="ml-2 text-xs text-green-600">(Used)</span>
                            )}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-charcoal-500">
                        Submitted {formatDate(feedback.submittedAt)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-charcoal-600">
                        <Mail className="w-4 h-4" />
                        <span>
                          {feedback.emailSentAt
                            ? `Request sent ${formatDate(feedback.emailSentAt)}`
                            : 'Request created but not sent'}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-500">
                        Expires {formatDate(feedback.expiresAt)}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-charcoal-600">
                    No feedback request sent yet.
                  </p>

                  {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                    <button
                      onClick={sendFeedbackRequest}
                      disabled={sendingFeedback}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold-500 text-charcoal-900 text-sm font-medium rounded-crown hover:bg-gold-600 transition-colors disabled:opacity-50"
                    >
                      <Star className="w-4 h-4" />
                      {sendingFeedback ? 'Sending...' : 'Request Feedback'}
                    </button>
                  )}

                  {order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && (
                    <p className="text-xs text-charcoal-400 text-center">
                      Available once order is shipped
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
