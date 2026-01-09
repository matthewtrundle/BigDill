'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Star, Gift, CheckCircle, Crown } from 'lucide-react'

interface FeedbackData {
  orderNumber: string
  customerName: string
  rating?: number
  comment?: string
  couponCode?: string
  alreadySubmitted: boolean
}

export default function FeedbackPage() {
  const params = useParams()
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [couponCode, setCouponCode] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedback()
  }, [params.token])

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback?token=${params.token}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to load feedback form')
        return
      }

      setFeedback(data.feedback)
      if (data.feedback.alreadySubmitted) {
        setSubmitted(true)
        setCouponCode(data.feedback.couponCode)
        setRating(data.feedback.rating || 0)
        setComment(data.feedback.comment || '')
      }
    } catch (err) {
      setError('Failed to load feedback form')
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async () => {
    if (rating === 0) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          rating,
          comment,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        setCouponCode(data.couponCode)
      } else {
        setError(data.error || 'Failed to submit feedback')
      }
    } catch (err) {
      setError('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="animate-pulse text-charcoal-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-crown shadow-soft p-8 max-w-md w-full text-center">
          <Crown className="w-16 h-16 mx-auto text-gold-400 mb-4" />
          <h1 className="font-display text-2xl font-bold text-charcoal-900 mb-2">
            Oops!
          </h1>
          <p className="text-charcoal-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!feedback) return null

  return (
    <div className="min-h-screen bg-cream-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 mx-auto text-gold-500 mb-4" />
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            Big Dill Pickleball
          </h1>
          <p className="text-charcoal-600 mt-2">Share your experience</p>
        </div>

        <div className="bg-white rounded-crown shadow-soft overflow-hidden">
          {submitted ? (
            // Thank you state
            <div className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-pickle-500 mb-4" />
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">
                Thank You!
              </h2>
              <p className="text-charcoal-600 mb-6">
                We appreciate your feedback on order #{feedback.orderNumber}
              </p>

              {couponCode && (
                <div className="bg-gold-50 rounded-crown p-6 border-2 border-gold-200">
                  <Gift className="w-10 h-10 mx-auto text-gold-500 mb-3" />
                  <p className="text-sm text-charcoal-600 mb-2">
                    Here&apos;s your 10% off coupon for your next order:
                  </p>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gold-300">
                    <span className="font-mono text-2xl font-bold text-gold-600 tracking-wider">
                      {couponCode}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-3">
                    Use this code at checkout
                  </p>
                </div>
              )}

              <div className="mt-8">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pickle-500 text-white font-medium rounded-crown hover:bg-pickle-600 transition-colors"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          ) : (
            // Feedback form
            <>
              <div className="px-6 py-4 bg-cream-50 border-b border-cream-200">
                <p className="text-sm text-charcoal-600">
                  Hi {feedback.customerName}, how was your experience with order{' '}
                  <span className="font-semibold">#{feedback.orderNumber}</span>?
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-3">
                    Rate your experience
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-gold-400 fill-gold-400'
                              : 'text-cream-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-charcoal-500 mt-2">
                    {rating === 0 && 'Click to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent!'}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-charcoal-700 mb-2"
                  >
                    Share your thoughts (optional)
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                {/* Incentive */}
                <div className="bg-gold-50 rounded-crown p-4 flex items-start gap-3">
                  <Gift className="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">
                      Get 10% off your next order!
                    </p>
                    <p className="text-xs text-charcoal-600 mt-1">
                      Submit your feedback to receive a discount code
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={submitFeedback}
                  disabled={rating === 0 || submitting}
                  className="w-full px-6 py-4 bg-pickle-500 text-white font-semibold rounded-crown hover:bg-pickle-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit & Get My Coupon'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
