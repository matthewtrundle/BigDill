'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Crown, Medal, Star, Truck, Shield, Users } from 'lucide-react'
import { ProductCustomizer } from '@/components/product/ProductCustomizer'
import { products } from '@/lib/products'
import { PickleballSVG, BouncingPickleball } from '@/components/ui/PickleballSVG'
import { CourtTexture } from '@/components/ui/CourtTexture'
import { NetMesh } from '@/components/ui/NetMesh'
import { FloatingBalls } from '@/components/ui/BallParticles'
import { CourtDivider } from '@/components/ui/CourtDivider'
import { Button } from '@/components/ui/Button'

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>('CROWN-1')
  const crown = products.find(p => p.sku === 'CROWN-1')!
  const medal = products.find(p => p.sku === 'MEDAL-1')!
  const currentProduct = products.find(p => p.sku === selectedProduct)!

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16 relative overflow-hidden">
      {/* Background texture */}
      <CourtTexture variant="grid" color="#FFCC33" opacity={0.02} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-wide text-charcoal-900 mb-4">
            SHOP
          </h1>
          <p className="font-heading text-charcoal-600 max-w-2xl mx-auto text-lg">
            Customize your perfect pickleball crown or medal. The ultimate champion's trophy.
          </p>
        </div>

        {/* Product Selection Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedProduct('CROWN-1')}
            className={`flex items-center gap-3 px-6 py-4 rounded-organic transition-all ${
              selectedProduct === 'CROWN-1'
                ? 'bg-gold-500 text-charcoal-900 shadow-gold-lg'
                : 'bg-white text-charcoal-700 shadow-organic hover:shadow-organic-lg'
            }`}
          >
            <Crown className="w-6 h-6" />
            <div className="text-left">
              <span className="font-heading font-bold block">Crowns</span>
              <span className="text-sm opacity-80">From $19.99</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedProduct('MEDAL-1')}
            className={`flex items-center gap-3 px-6 py-4 rounded-organic transition-all ${
              selectedProduct === 'MEDAL-1'
                ? 'bg-gold-500 text-charcoal-900 shadow-gold-lg'
                : 'bg-white text-charcoal-700 shadow-organic hover:shadow-organic-lg'
            }`}
          >
            <Medal className="w-6 h-6" />
            <div className="text-left">
              <span className="font-heading font-bold block">Medals</span>
              <span className="text-sm opacity-80">From $9.99</span>
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image/Preview */}
          <div className="order-1 lg:order-1">
            <div className="bg-white rounded-organic-lg p-4 sticky top-28 shadow-organic relative overflow-hidden">
              {/* Product Image */}
              <div className="relative aspect-square rounded-organic overflow-hidden">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                />
                {currentProduct.isBestSeller && (
                  <div className="absolute top-4 left-4 bg-gold-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-bold">
                    Best Seller
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4 text-center">
                <h2 className="font-display text-3xl tracking-wide text-charcoal-900">
                  {currentProduct.name.toUpperCase()}
                </h2>
                <p className="text-charcoal-600 mt-2 text-sm">
                  {currentProduct.description}
                </p>
              </div>

              {/* Additional Images */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {selectedProduct === 'CROWN-1' ? (
                  <>
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src="/images/il_1588xN.6679666150_a6ho.webp" alt="Crown view 2" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src="/images/il_1588xN.6686537704_76kj.webp" alt="Crown view 3" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src="/images/tropy1.webp" alt="Crown view 4" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gold-100 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-gold-500" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src="/images/Medal2.jpg" alt="Medal view 2" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gold-100 flex items-center justify-center">
                      <span className="text-gold-600 font-bold text-xs">GOLD</span>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-xs">SILVER</span>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-700 font-bold text-xs">BRONZE</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Product Customizer */}
          <div className="order-2 lg:order-2">
            <div className="card-organic p-6">
              <ProductCustomizer product={currentProduct} />
            </div>

            {/* Trust Badges */}
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
            <NetMesh opacity={0.05} />
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
              <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white mb-4">
                NEED BULK ORDERS?
              </h2>
              <p className="font-heading text-white/90 max-w-xl mx-auto mb-6">
                Planning a tournament, league event, or team gift? We offer special pricing
                on bulk orders of 5+ crowns or medals. Get a custom quote today!
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

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto" id="faq">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-charcoal-900 mb-2">
              FAQ
            </h2>
            <p className="font-heading text-charcoal-600 text-sm">
              Everything you need to know about our products
            </p>
          </div>

          <div className="space-y-4">
            <details className="card-organic p-4 group">
              <summary className="font-heading font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="green" />
                  How do I measure for the right crown size?
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
              <summary className="font-heading font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="pink" />
                  How long does shipping take?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                We ship from Texas and most orders arrive within 3-7 business days.
                Orders over $35 ship free! You'll receive a tracking number once your order ships.
              </p>
            </details>

            <details className="card-organic p-4 group">
              <summary className="font-heading font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="gold" />
                  What medal finishes are available?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                Our medals come in gold, silver, and bronze finishes. They're made from high-quality
                laser-engraved wood with a beautiful natural finish. Perfect for 1st, 2nd, and 3rd place awards!
              </p>
            </details>

            <details className="card-organic p-4 group">
              <summary className="font-heading font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <PickleballSVG size="sm" color="green" />
                  Can I add custom text to both products?
                </div>
                <span className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm pl-11">
                Yes! Both crowns and medals can be personalized with custom text. Add tournament names,
                dates, player names, or team names to make your award truly special.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
