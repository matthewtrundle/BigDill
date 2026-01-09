import { Metadata } from 'next'
import { Crown, Star, Truck, Shield } from 'lucide-react'
import { ProductCustomizer } from '@/components/product/ProductCustomizer'
import { products } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Shop Pickleball Crowns',
  description: 'Customize your pickleball crown - choose size, ball color, and add your own text. The ultimate wearable trophy for pickleball champions.',
}

export default function ShopPage() {
  const product = products[0] // We only have one product for now

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Design Your Crown
          </h1>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Customize every detail of your pickleball crown. Choose your size, pick your ball color,
            and add personalized text to create the ultimate champion's trophy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image/Preview */}
          <div className="order-1 lg:order-1">
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-crown p-8 aspect-square flex items-center justify-center sticky top-28">
              <div className="text-center">
                <Crown className="w-48 h-48 md:w-64 md:h-64 mx-auto text-gold-500 animate-bounce-subtle" />
                <p className="mt-6 text-charcoal-600 text-sm">
                  Preview placeholder - actual product images coming soon!
                </p>
              </div>
            </div>
          </div>

          {/* Product Customizer */}
          <div className="order-2 lg:order-2">
            <ProductCustomizer product={product} />

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-crown shadow-soft">
                <Star className="w-6 h-6 mx-auto text-gold-500 mb-2" />
                <span className="text-xs text-charcoal-600 block">5-Star Rated</span>
              </div>
              <div className="text-center p-4 bg-white rounded-crown shadow-soft">
                <Truck className="w-6 h-6 mx-auto text-gold-500 mb-2" />
                <span className="text-xs text-charcoal-600 block">Fast Shipping</span>
              </div>
              <div className="text-center p-4 bg-white rounded-crown shadow-soft">
                <Shield className="w-6 h-6 mx-auto text-gold-500 mb-2" />
                <span className="text-xs text-charcoal-600 block">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="bg-white rounded-crown p-4 shadow-soft group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                How do I measure for the right size?
                <span className="text-gold-500 group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm">
                Measure around your head just above your eyebrows, where a hat would typically sit.
                Compare your measurement to our size chart: Small (21.5"), Medium (22.25"), Large (23"), X-Large (23.75").
                When in between sizes, we recommend sizing up for comfort.
              </p>
            </details>

            <details className="bg-white rounded-crown p-4 shadow-soft group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                How long does shipping take?
                <span className="text-gold-500 group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm">
                We ship from Texas and most orders arrive within 3-7 business days.
                Orders over $35 ship free! You'll receive a tracking number once your crown ships.
              </p>
            </details>

            <details className="bg-white rounded-crown p-4 shadow-soft group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                Can I request custom crown colors?
                <span className="text-gold-500 group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm">
                Currently we offer gold crowns with green or pink pickleball toppers.
                For custom color requests or bulk orders, please contact us!
              </p>
            </details>

            <details className="bg-white rounded-crown p-4 shadow-soft group">
              <summary className="font-semibold text-charcoal-900 cursor-pointer list-none flex justify-between items-center">
                Is this a good gift for pickleball players?
                <span className="text-gold-500 group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600 text-sm">
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
