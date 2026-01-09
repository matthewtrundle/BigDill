import { Metadata } from 'next'
import Link from 'next/link'
import { Truck, Clock, Package, MapPin, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Shipping Info | Big Dill Pickleball',
  description:
    'Learn about shipping for Big Dill Pickleball crowns. Free shipping on orders over $35, ships from Austin, Texas.',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <Truck className="w-12 h-12 mx-auto text-gold-500 mb-4" />
          <h1 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-charcoal-600">
            Everything you need to know about getting your crown delivered.
          </p>
        </div>

        {/* Key Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-crown p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-display font-semibold text-charcoal-900 mb-2">
              Free Shipping
            </h3>
            <p className="text-sm text-charcoal-600">On orders over $35</p>
          </div>
          <div className="bg-white rounded-crown p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-pickle-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-pickle-600" />
            </div>
            <h3 className="font-display font-semibold text-charcoal-900 mb-2">
              3-7 Business Days
            </h3>
            <p className="text-sm text-charcoal-600">Typical delivery time</p>
          </div>
          <div className="bg-white rounded-crown p-6 shadow-soft text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-display font-semibold text-charcoal-900 mb-2">
              Ships from Texas
            </h3>
            <p className="text-sm text-charcoal-600">Austin, TX warehouse</p>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white rounded-crown shadow-soft p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
            Shipping Rates & Times
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-200">
                  <th className="text-left py-3 text-charcoal-600 font-medium">Order Total</th>
                  <th className="text-left py-3 text-charcoal-600 font-medium">Shipping Cost</th>
                  <th className="text-left py-3 text-charcoal-600 font-medium">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-cream-100">
                  <td className="py-4 text-charcoal-900">Under $35</td>
                  <td className="py-4 text-charcoal-900">$4.79</td>
                  <td className="py-4 text-charcoal-600">3-7 business days</td>
                </tr>
                <tr>
                  <td className="py-4 text-charcoal-900">$35 and over</td>
                  <td className="py-4 text-pickle-600 font-semibold">FREE</td>
                  <td className="py-4 text-charcoal-600">3-7 business days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-charcoal-500 mt-4">
            * Delivery times are estimates after your order ships. Production typically takes 1-3 business days.
          </p>
        </div>

        {/* Process */}
        <div className="bg-white rounded-crown shadow-soft p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
            Order Process
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-charcoal-900">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">Order Placed</h3>
                <p className="text-charcoal-600">
                  Your order is received and we begin preparing your custom crown.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-charcoal-900">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">Production (1-3 days)</h3>
                <p className="text-charcoal-600">
                  Your crown is 3D-printed with your chosen options and customizations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-charcoal-900">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">Shipped</h3>
                <p className="text-charcoal-600">
                  Your order ships from Austin, TX via USPS. You&apos;ll receive a tracking number via email.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-pickle-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-white">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-1">Delivered!</h3>
                <p className="text-charcoal-600">
                  Your crown arrives ready to wear. Time to celebrate!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-crown shadow-soft p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
            Common Questions
          </h2>

          <div className="space-y-4">
            <details className="group border-b border-cream-100 pb-4">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-charcoal-900">
                  Where do you ship?
                </span>
                <span className="text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600">
                We currently ship to all 50 US states. International shipping is not available at this time.
              </p>
            </details>

            <details className="group border-b border-cream-100 pb-4">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-charcoal-900">
                  How do I track my order?
                </span>
                <span className="text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600">
                Once your order ships, you&apos;ll receive an email with your tracking number and a link to track your package.
              </p>
            </details>

            <details className="group border-b border-cream-100 pb-4">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-charcoal-900">
                  What if my order arrives damaged?
                </span>
                <span className="text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600">
                If your crown arrives damaged, please contact us within 7 days with photos of the damage. We&apos;ll send a replacement at no charge.
              </p>
            </details>

            <details className="group pb-4">
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-medium text-charcoal-900">
                  Can I change my shipping address after ordering?
                </span>
                <span className="text-gold-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-charcoal-600">
                Please contact us as soon as possible. We can update your address if your order hasn&apos;t shipped yet.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gold-100 to-gold-200 rounded-crown p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-4">
            Ready to Order?
          </h2>
          <p className="text-charcoal-700 mb-6">
            Design your custom pickleball crown and get free shipping on orders over $35!
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/shop">
              <Crown className="w-5 h-5 mr-2" />
              Shop Crowns
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
