'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Crown, Users, Trophy, Calendar, Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PickleballSVG, BouncingPickleball } from '@/components/ui/PickleballSVG'
import { CourtTexture, CourtLines } from '@/components/ui/CourtTexture'
import { NetMesh } from '@/components/ui/NetMesh'
import { FloatingBalls } from '@/components/ui/BallParticles'
import { CourtDivider } from '@/components/ui/CourtDivider'

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    quantity: '',
    eventDate: '',
    eventType: '',
    customization: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bulk-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16 relative overflow-hidden">
        <CourtTexture variant="grid" color="#FFCC33" opacity={0.02} />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-organic p-12">
            <div className="w-20 h-20 bg-pickle-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-pickle-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-4">
              Quote Request Received!
            </h1>
            <p className="text-charcoal-600 mb-8">
              Thank you for your interest in bulk ordering pickleball crowns! We'll review your request
              and get back to you within 1-2 business days with a custom quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" asChild>
                <Link href="/shop">
                  <Crown className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16 relative overflow-hidden">
      {/* Background texture */}
      <CourtTexture variant="grid" color="#FFCC33" opacity={0.02} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <PickleballSVG size="md" color="green" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900">
              Bulk Orders
            </h1>
            <PickleballSVG size="md" color="pink" />
          </div>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Planning a tournament, league event, or team celebration? Get special pricing
            on orders of 5 or more crowns. Fill out the form below for a custom quote!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Benefits Section */}
          <div className="order-2 lg:order-1">
            {/* Why Bulk Order */}
            <div className="card-organic p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold-500" />
                Perfect For
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Trophy, title: 'Tournament Prizes', desc: 'Crown your winners at every skill level' },
                  { icon: Users, title: 'League Awards', desc: 'Seasonal champions deserve the crown' },
                  { icon: Calendar, title: 'Special Events', desc: 'Fundraisers, charity matches, corporate events' },
                  { icon: Crown, title: 'Team Gifts', desc: 'Celebrate your pickleball squad' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-organic flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{item.title}</h3>
                      <p className="text-charcoal-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Pricing Preview */}
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-organic-lg p-6 relative overflow-hidden">
              <CourtLines opacity={0.08} />

              {/* Decorative balls */}
              <div className="absolute top-4 right-4">
                <BouncingPickleball size="sm" color="green" />
              </div>
              <div className="absolute bottom-4 left-4">
                <BouncingPickleball size="sm" color="pink" />
              </div>

              <div className="relative z-10">
                <h2 className="font-display text-xl font-bold text-charcoal-900 mb-4">
                  Bulk Pricing Tiers
                </h2>
                <div className="space-y-3">
                  {[
                    { qty: '5-9 crowns', discount: '10% off' },
                    { qty: '10-24 crowns', discount: '15% off' },
                    { qty: '25-49 crowns', discount: '20% off' },
                    { qty: '50+ crowns', discount: 'Custom quote' },
                  ].map((tier, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-organic"
                    >
                      <div className="flex items-center gap-2">
                        <PickleballSVG size="sm" color={i % 2 === 0 ? 'green' : 'pink'} />
                        <span className="font-medium text-charcoal-900">{tier.qty}</span>
                      </div>
                      <span className="text-gold-600 font-bold">{tier.discount}</span>
                    </div>
                  ))}
                </div>
                <p className="text-charcoal-600 text-sm mt-4">
                  * All bulk orders include free customization and priority shipping
                </p>
              </div>
            </div>
          </div>

          {/* Quote Request Form */}
          <div className="order-1 lg:order-2">
            <div className="card-organic p-6">
              <h2 className="font-display text-xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-pickle-500" />
                Request a Quote
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                    placeholder="Jane Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                    placeholder="jane@example.com"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Organization / Tournament Name
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                    placeholder="Sunset Pickleball League"
                  />
                </div>

                {/* Quantity and Event Type Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-charcoal-700 mb-1">
                      Quantity Needed *
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="5-9">5-9 crowns</option>
                      <option value="10-24">10-24 crowns</option>
                      <option value="25-49">25-49 crowns</option>
                      <option value="50-99">50-99 crowns</option>
                      <option value="100+">100+ crowns</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-charcoal-700 mb-1">
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="tournament">Tournament</option>
                      <option value="league">League</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="charity">Charity/Fundraiser</option>
                      <option value="team">Team Gift</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Event Date (if applicable)
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                  />
                </div>

                {/* Customization Needs */}
                <div>
                  <label htmlFor="customization" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Customization Needs
                  </label>
                  <input
                    type="text"
                    id="customization"
                    name="customization"
                    value={formData.customization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                    placeholder="e.g., Custom text, specific colors, logo..."
                  />
                </div>

                {/* Additional Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none resize-none"
                    placeholder="Tell us more about your event or any special requirements..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Request Quote
                    </>
                  )}
                </Button>

                <p className="text-charcoal-500 text-xs text-center mt-4">
                  We typically respond within 1-2 business days. For urgent requests,
                  email us directly at{' '}
                  <a href="mailto:orders@bigdillpickleball.com" className="text-gold-600 hover:underline">
                    orders@bigdillpickleball.com
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16">
          <CourtDivider variant="centerline" color="#FFCC33" className="h-4" />
        </div>

        {/* Testimonials / Social Proof */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">
              Trusted by Pickleball Communities
            </h2>
            <p className="text-charcoal-600 text-sm">
              Join tournaments and leagues across the country
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Our tournament winners absolutely loved their crowns. We're making it an annual tradition!",
                author: "Sarah M.",
                org: "Austin Pickleball League",
                color: 'green' as const,
              },
              {
                quote: "The bulk pricing made it affordable to award crowns at every skill level. Great quality!",
                author: "Mike T.",
                org: "Texas Senior Games",
                color: 'pink' as const,
              },
              {
                quote: "Custom text with our tournament name was a hit. Already planning our next order!",
                author: "Lisa K.",
                org: "Dinking Around Club",
                color: 'gold' as const,
              },
            ].map((testimonial, i) => (
              <div key={i} className="card-organic p-6">
                <div className="flex items-center gap-2 mb-3">
                  <PickleballSVG size="sm" color={testimonial.color} />
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, j) => (
                      <span key={j}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-charcoal-600 text-sm mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-charcoal-900 text-sm">{testimonial.author}</p>
                  <p className="text-charcoal-500 text-xs">{testimonial.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
