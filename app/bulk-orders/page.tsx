'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Crown, Users, Trophy, Calendar, Mail, Send, CheckCircle, ArrowLeft, Medal, ShoppingCart, Check, Package, Building2, Star, Zap, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PickleballSVG, BouncingPickleball } from '@/components/ui/PickleballSVG'
import { CourtTexture, CourtLines } from '@/components/ui/CourtTexture'
import { FloatingBalls } from '@/components/ui/BallParticles'
import { CourtDivider } from '@/components/ui/CourtDivider'
import { TeamBuilder } from '@/components/bulk/TeamBuilder'
import { TierProgress, TierBadge, discountTiers } from '@/components/bulk/TierProgress'
import { products, formatPrice } from '@/lib/products'

export default function BulkOrdersPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'packages' | 'wholesale'>('team')
  const [isTeamBuilderOpen, setIsTeamBuilderOpen] = useState(false)

  // Quote form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    quantity: '',
    eventDate: '',
    eventType: '',
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
            <h1 className="font-display text-4xl tracking-wide text-charcoal-900 mb-4">
              REQUEST RECEIVED!
            </h1>
            <p className="text-charcoal-600 mb-8">
              Thank you for your wholesale inquiry! We'll review your request and get back to you within 1-2 business days.
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
      <CourtTexture variant="grid" color="#FFCC33" opacity={0.02} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Institutional Positioning */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gold-100 px-4 py-2 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-gold-600" />
            <span className="text-gold-700 font-medium text-sm">For Tournaments, Leagues & Clubs</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-wide text-charcoal-900 mb-4">
            TOURNAMENT & LEAGUE ORDERS
          </h1>
          <p className="font-heading text-charcoal-600 max-w-2xl mx-auto text-lg">
            Custom crowns and medals for your pickleball events. Volume discounts up to 30% off.
            Individual customization for every winner.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-5 py-3 rounded-organic transition-all font-medium ${
              activeTab === 'team'
                ? 'bg-gold-500 text-charcoal-900 shadow-gold-lg'
                : 'bg-white text-charcoal-700 shadow-organic hover:shadow-organic-lg'
            }`}
          >
            <Users className="w-5 h-5" />
            Team Builder
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-5 py-3 rounded-organic transition-all font-medium ${
              activeTab === 'packages'
                ? 'bg-gold-500 text-charcoal-900 shadow-gold-lg'
                : 'bg-white text-charcoal-700 shadow-organic hover:shadow-organic-lg'
            }`}
          >
            <Package className="w-5 h-5" />
            Tournament Packages
          </button>
          <button
            onClick={() => setActiveTab('wholesale')}
            className={`flex items-center gap-2 px-5 py-3 rounded-organic transition-all font-medium ${
              activeTab === 'wholesale'
                ? 'bg-gold-500 text-charcoal-900 shadow-gold-lg'
                : 'bg-white text-charcoal-700 shadow-organic hover:shadow-organic-lg'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Wholesale Accounts
          </button>
        </div>

        {/* Team Builder Tab */}
        {activeTab === 'team' && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Team Builder CTA */}
            <div>
              <div className="card-organic p-8 text-center mb-6">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gold-600" />
                </div>
                <h2 className="font-display text-2xl tracking-wide text-charcoal-900 mb-3">
                  BUILD YOUR TEAM ORDER
                </h2>
                <p className="text-charcoal-600 mb-6">
                  Customize each crown or medal individually with different names, sizes, and colors.
                  Perfect for tournaments with unique winners.
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsTeamBuilderOpen(true)}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Open Team Builder
                </Button>

                <div className="mt-6 pt-6 border-t border-cream-200">
                  <h3 className="font-heading font-semibold text-charcoal-900 mb-3 text-sm">How It Works:</h3>
                  <div className="space-y-2 text-left">
                    {[
                      'Add items one by one (mix crowns & medals)',
                      'Customize each with name, size, and color',
                      'Automatic bulk discounts applied',
                      'Add all to cart with one click',
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-charcoal-600">
                        <span className="w-5 h-5 bg-gold-100 rounded-full flex items-center justify-center text-xs font-bold text-gold-700">
                          {i + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Add Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card-organic p-4 text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                    <Image
                      src="/images/il_1588xN.6727699661_5zg6.webp"
                      alt="Pickleball Crown"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-charcoal-900">Crowns</h3>
                  <p className="text-gold-600 font-semibold text-lg">$19.99</p>
                  <p className="text-xs text-charcoal-500">4 sizes available</p>
                </div>
                <div className="card-organic p-4 text-center">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                    <Image
                      src="/images/medal1.jpg"
                      alt="Pickleball Medal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-charcoal-900">Medals</h3>
                  <p className="text-gold-600 font-semibold text-lg">$9.99</p>
                  <p className="text-xs text-charcoal-500">Gold, Silver, Bronze</p>
                </div>
              </div>
            </div>

            {/* Right: Pricing & Benefits */}
            <div>
              {/* Tier Progress Preview */}
              <div className="card-organic p-6 mb-6">
                <h2 className="font-display text-xl tracking-wide text-charcoal-900 mb-4">
                  VOLUME DISCOUNTS
                </h2>
                <div className="space-y-2">
                  {discountTiers.slice(1).map((tier, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-organic transition-all ${
                        tier.badge === 'Most Popular'
                          ? 'bg-pickle-50 border-2 border-pickle-300'
                          : tier.badge === 'Best Value'
                          ? 'bg-gold-50 border-2 border-gold-300'
                          : 'bg-cream-100 border border-cream-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <PickleballSVG size="sm" color={i % 2 === 0 ? 'green' : 'pink'} />
                        <div>
                          <span className="font-medium text-charcoal-900">
                            {tier.max === Infinity ? `${tier.min}+` : `${tier.min}-${tier.max}`} items
                          </span>
                          {tier.badge && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              tier.badge === 'Most Popular'
                                ? 'bg-pickle-100 text-pickle-700'
                                : tier.badge === 'Best Value'
                                ? 'bg-gold-100 text-gold-700'
                                : 'bg-charcoal-100 text-charcoal-700'
                            }`}>
                              {tier.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-gold-600 font-bold text-lg">{tier.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-pickle-500 to-pickle-600 rounded-organic-lg p-6 text-white">
                <h3 className="font-display text-xl tracking-wide mb-4">BULK ORDER BENEFITS</h3>
                <div className="space-y-3">
                  {[
                    { icon: Star, text: 'Free customization on every item' },
                    { icon: Zap, text: 'Priority processing for events' },
                    { icon: Clock, text: 'Guaranteed delivery dates' },
                    { icon: Package, text: 'Free shipping on orders over $35' },
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-organic flex items-center justify-center">
                        <benefit.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tournament Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl tracking-wide text-charcoal-900 mb-2">
                PRE-BUILT TOURNAMENT PACKAGES
              </h2>
              <p className="text-charcoal-600">
                Popular combinations for tournaments and leagues. Best value guaranteed.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Starter Package */}
              <div className="card-organic p-6 relative">
                <h3 className="font-display text-xl tracking-wide text-charcoal-900 mb-2">
                  STARTER
                </h3>
                <p className="text-charcoal-600 text-sm mb-4">Perfect for small tournaments</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-gold-500" />
                    <span>5 Crowns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Medal className="w-4 h-4 text-gold-500" />
                    <span>10 Medals</span>
                  </div>
                </div>
                <div className="border-t border-cream-200 pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-charcoal-900">$179.85</span>
                    <span className="text-sm text-charcoal-400 line-through">$199.85</span>
                  </div>
                  <span className="text-pickle-600 text-sm font-medium">Save 10%</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setIsTeamBuilderOpen(true)}
                >
                  Customize Package
                </Button>
              </div>

              {/* Pro Package */}
              <div className="card-organic p-6 relative border-2 border-gold-400">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-charcoal-900 px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
                <h3 className="font-display text-xl tracking-wide text-charcoal-900 mb-2">
                  PRO
                </h3>
                <p className="text-charcoal-600 text-sm mb-4">For league seasons & larger events</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-gold-500" />
                    <span>10 Crowns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Medal className="w-4 h-4 text-gold-500" />
                    <span>30 Medals</span>
                  </div>
                </div>
                <div className="border-t border-cream-200 pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-charcoal-900">$424.15</span>
                    <span className="text-sm text-charcoal-400 line-through">$499.60</span>
                  </div>
                  <span className="text-pickle-600 text-sm font-medium">Save 15%</span>
                </div>
                <Button
                  variant="primary"
                  className="w-full mt-4"
                  onClick={() => setIsTeamBuilderOpen(true)}
                >
                  Customize Package
                </Button>
              </div>

              {/* Championship Package */}
              <div className="card-organic p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pickle-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>
                <h3 className="font-display text-xl tracking-wide text-charcoal-900 mb-2">
                  CHAMPIONSHIP
                </h3>
                <p className="text-charcoal-600 text-sm mb-4">Major tournaments & organizations</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-gold-500" />
                    <span>25 Crowns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Medal className="w-4 h-4 text-gold-500" />
                    <span>75 Medals</span>
                  </div>
                </div>
                <div className="border-t border-cream-200 pt-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-charcoal-900">$936.75</span>
                    <span className="text-sm text-charcoal-400 line-through">$1,249.00</span>
                  </div>
                  <span className="text-pickle-600 text-sm font-medium">Save 25%</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setIsTeamBuilderOpen(true)}
                >
                  Customize Package
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-charcoal-500 mb-4">
                Need a custom package? Use the Team Builder to create exactly what you need.
              </p>
              <Button variant="primary" size="lg" onClick={() => setIsTeamBuilderOpen(true)}>
                <Users className="w-5 h-5 mr-2" />
                Open Team Builder
              </Button>
            </div>
          </div>
        )}

        {/* Wholesale Tab */}
        {activeTab === 'wholesale' && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Benefits */}
            <div>
              <div className="card-organic p-6 mb-6">
                <h2 className="font-display text-2xl tracking-wide text-charcoal-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-gold-500" />
                  WHOLESALE ACCOUNTS
                </h2>
                <p className="text-charcoal-600 mb-6">
                  For recurring orders from tournament organizers, pickleball facilities, and league operators.
                  Get exclusive pricing and dedicated support.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Award, title: 'Exclusive Pricing', desc: 'Up to 35% off for wholesale accounts' },
                    { icon: Clock, title: 'Net 30 Terms', desc: 'Invoice payment options for qualified accounts' },
                    { icon: Users, title: 'Dedicated Support', desc: 'Personal account manager for large orders' },
                    { icon: Zap, title: 'Priority Production', desc: 'Jump the queue for urgent event needs' },
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

              {/* Testimonials */}
              <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-organic-lg p-6 relative overflow-hidden">
                <CourtLines opacity={0.08} />
                <div className="absolute top-4 right-4">
                  <BouncingPickleball size="sm" color="green" />
                </div>
                <div className="relative z-10">
                  <p className="text-charcoal-700 italic mb-4">
                    "Big Dill has been our go-to for tournament awards. The quality is outstanding and the bulk pricing makes it affordable for every skill level."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex text-gold-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-charcoal-600 text-sm">- Texas Pickleball Association</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Application Form */}
            <div>
              <div className="card-organic p-6">
                <h2 className="font-display text-2xl tracking-wide text-charcoal-900 mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-pickle-500" />
                  APPLY FOR WHOLESALE
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="jane@organization.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-charcoal-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
                      placeholder="Sunset Pickleball League"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-charcoal-700 mb-1">
                        Est. Annual Volume *
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
                        <option value="100-249">100-249 items</option>
                        <option value="250-499">250-499 items</option>
                        <option value="500-999">500-999 items</option>
                        <option value="1000+">1,000+ items</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="eventType" className="block text-sm font-medium text-charcoal-700 mb-1">
                        Organization Type
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="tournament">Tournament Organizer</option>
                        <option value="league">League Operator</option>
                        <option value="facility">Pickleball Facility</option>
                        <option value="club">Club/Association</option>
                        <option value="corporate">Corporate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-1">
                      Tell Us About Your Needs
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-organic border border-charcoal-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none resize-none"
                      placeholder="Tell us about your events, typical order sizes, and any special requirements..."
                    />
                  </div>

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
                        Apply for Wholesale Account
                      </>
                    )}
                  </Button>

                  <p className="text-charcoal-500 text-xs text-center mt-4">
                    We typically respond within 1-2 business days.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-16">
          <CourtDivider variant="centerline" color="#FFCC33" className="h-4" />
        </div>

        {/* Testimonials Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-charcoal-900 mb-2">
              TRUSTED BY PICKLEBALL COMMUNITIES
            </h2>
            <p className="font-heading text-charcoal-600">
              Tournaments and leagues across the country
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
                quote: "The Team Builder made it so easy to customize each winner's crown with their name. Perfect!",
                author: "Mike T.",
                org: "Texas Senior Games",
                color: 'pink' as const,
              },
              {
                quote: "Bulk pricing saved us over $200 on our championship awards. Outstanding quality!",
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
                      <Star key={j} className="w-4 h-4 fill-current" />
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

      {/* Team Builder Modal */}
      <TeamBuilder
        isOpen={isTeamBuilderOpen}
        onClose={() => setIsTeamBuilderOpen(false)}
      />
    </div>
  )
}
