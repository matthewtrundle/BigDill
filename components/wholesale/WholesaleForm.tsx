'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'

interface FormData {
  businessName: string
  contactName: string
  email: string
  phone: string
  businessType: string
  estimatedVolume: string
  message: string
}

const initialFormData: FormData = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  businessType: '',
  estimatedVolume: '',
  message: '',
}

const businessTypes = [
  'Restaurant',
  'BBQ Restaurant',
  'Caterer',
  'Food Truck',
  'Competition Team',
  'Retailer',
  'Meat Market',
  'Hotel / Hospitality',
  'Event Planner',
  'Other',
]

const volumeOptions = [
  '200-500 lbs/month',
  '500-1,000 lbs/month',
  '1,000-2,500 lbs/month',
  '2,500-5,000 lbs/month',
  '5,000+ lbs/month',
  'Not sure yet',
]

export function WholesaleForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/wholesale-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit inquiry')
      }

      setIsSubmitted(true)
      setFormData(initialFormData)
    } catch (err) {
      console.error('Wholesale form error:', err)
      setError('There was an error submitting your inquiry. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-charcoal-900 mb-2">Thank You!</h3>
        <p className="text-smoke-600 mb-6">
          We&apos;ve received your wholesale inquiry. Our team will review your information and get back to you
          within 1-2 business days with pricing details.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-burnt-orange-600 font-medium hover:text-burnt-orange-700 transition-colors"
        >
          Submit another inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-charcoal-900 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent"
            placeholder="Your restaurant or business name"
          />
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-charcoal-900 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal-900 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-charcoal-900 mb-2">
            Business Type *
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent bg-white"
          >
            <option value="">Select your business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Volume */}
        <div>
          <label htmlFor="estimatedVolume" className="block text-sm font-medium text-charcoal-900 mb-2">
            Estimated Monthly Volume *
          </label>
          <select
            id="estimatedVolume"
            name="estimatedVolume"
            value={formData.estimatedVolume}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent bg-white"
          >
            <option value="">Select estimated volume</option>
            {volumeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="mt-6">
        <label htmlFor="message" className="block text-sm font-medium text-charcoal-900 mb-2">
          Additional Details
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange-500 focus:border-transparent resize-none"
          placeholder="Tell us more about your needs - delivery frequency, special requirements, or any questions you have."
        />
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-burnt-orange-600 hover:bg-burnt-orange-700 text-white px-8 py-4 rounded-lg font-bold transition-colors disabled:bg-smoke-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Inquiry
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-sm text-smoke-600">
        * Required fields. We typically respond within 1-2 business days.
      </p>
    </form>
  )
}
