'use client'

import Link from 'next/link'
import { Crown, Star, Truck, Shield, Users } from 'lucide-react'
import { ProductCustomizer } from '@/components/product/ProductCustomizer'
import { products } from '@/lib/products'
import { PickleballSVG, BouncingPickleball } from '@/components/ui/PickleballSVG'
import { CourtTexture, CourtLines } from '@/components/ui/CourtTexture'
import { NetMesh } from '@/components/ui/NetMesh'
import { FloatingBalls } from '@/components/ui/BallParticles'
import { CourtDivider } from '@/components/ui/CourtDivider'
import { Button } from '@/components/ui/Button'

export default function ShopPage() {
  const product = products[0] // We only have one product for now

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
              Design Your Crown
            </h1>
            <PickleballSVG size="md" color="pink" />
          </div>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Customize every detail of your pickleball crown. Choose your size, pick your ball color,
            and add personalized text to create the ultimate champion's trophy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image/Preview - Organic styling */}
          <div className="order-1 lg:order-1">
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-organic-lg p-8 aspect-square flex items-center justify-center sticky top-28 shadow-organic relative overflow-hidden">
              {/* Background court lines */}
              <CourtLines opacity={0.08} />

              {/* Decorative balls */}
              <div className="absolute top-4 left-4">
                <BouncingPickleball size="sm" color="green" />
              </div>
              <div className="absolute top-4 right-4">
                <BouncingPickleball size="sm" color="pink" />
              </div>
              <div className="absolute bottom-4 left-4">
                <BouncingPickleball size="sm" color="gold" />
              </div>
              <div className="absolute bottom-4 right-4">
                <BouncingPickleball size="sm" color="green" />
              </div>

              {/* Main crown preview */}
              <div className="text-center relative z-10">
                <div className="relative">
                  <Crown className="w-48 h-48 md:w-64 md:h-64 mx-auto text-gold-500 animate-bounce-subtle drop-shadow-lg" />
                  {/* Pickleballs on crown points */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <PickleballSVG size="sm" color="green" animated />
                  </div>
                </div>
                <p className="mt-6 text-charcoal-600 text-sm bg-white/70 backdrop-blur-sm px-4 py-2 rounded-organic inline-block">
                  Your custom crown preview
                </p>
              </div>
            </div>
          </div>

          {/* Product Customizer */}
          <div className="order-2 lg:order-2">
            <div className="card-organic p-6">
              <ProductCustomizer product={product} />
            </div>

            {/* Trust Badges - Organic styling */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="card-organic text-center p-4">
                <div className="w-10 h-10 bg-gold-100 rounded-organic flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-gold-500" />
                </div>
                <span className="text-xs text-charcoal-600 block">5-Star Rated</span>
              </div>
              <div className="card-organic text-center p-4">
                <div className="w-10 h-10 bg-pickle-100 rounded-organic flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5 text-pickle-500" />
                </div>
                <span className="text-xs text-charcoal-600 block">Fast Shipping</span>
              </div>
              <div className="card-organic text-center p-4">
                <div className="w-10 h-10 bg-pink-100 rounded-organic flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-pink-500" />
                </div>
                <span className="text-xs text-charcoal-600 block">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Order CTA */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-r from-pickle-500 to-pickle-600 rounded-organic-lg p-8 text-center relative overflow-hidden">
            {/* Net mesh overlay */}
            <NetMesh opacity={0.05} />

            {/* Floating balls */}
            <FloatingBalls
              className="z-5"
              positions={[
                { x: 5, y: 20, size: 20, color: 'gold' },
                { x: 92, y: 70, size: 18, color: 'pink' },
              ]}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-medium">For Tournaments & Leagues</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Need Multiple Crowns?
              </h2>
              <p className="text-white/90 max-w-xl mx-auto mb-6">
                Planning a tournament, league event, or team gift? We offer special pricing
                on bulk orders of 5+ crowns. Get a custom quote today!
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/bulk-orders">
                  <Crown className="w-5 h-5 mr-2" />
                  Request Bulk Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16">
          <CourtDivider variant="centerline" color="#FFCC33" className="h-4" />
        </div>

        {/* FAQ Section - Organic styling */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-charcoal-600 text-sm">
              Everything you need to know about your crown
            </p>
          </div>

          <div className="space-y-4">
            <details className="card-organic p-4 group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="green" />
                  How do I measure for the right size?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                Measure around your head just above your eyebrows, where a hat would typically sit.
                Compare your measurement to our size chart: Small (21.5"), Medium (22.25"), Large (23"), X-Large (23.75").
                When in between sizes, we recommend sizing up for comfort.
              </p>
            </details>

            <details className="card-organic p-4 group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="pink" />
                  How long does shipping take?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                We ship from Texas and most orders arrive within 3-7 business days.
                Orders over $35 ship free! You'll receive a tracking number once your crown ships.
              </p>
            </details>

            <details className="card-organic p-4 group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="gold" />
                  Can I request custom crown colors?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                Currently we offer gold crowns with green or pink pickleball toppers.
                For custom color requests or bulk orders, please <Link href="/bulk-orders" className="text-gold-600 hover:underline">contact us for a custom quote</Link>!
              </p>
            </details>

            <details className="card-organic p-4 group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="green" />
                  Is this a good gift for pickleball players?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                Absolutely! Our crowns make fantastic gifts for birthdays, tournament prizes, league awards,
                or just to celebrate the pickleball king or queen in your life. Add custom text to personalize it!
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
