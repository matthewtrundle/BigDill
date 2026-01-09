import Link from 'next/link'
import { Crown, Star, Truck, Gift, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gold-50 via-cream-100 to-cream-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Animated Crown */}
            <div className="mb-8 animate-bounce-subtle">
              <Crown className="w-24 h-24 md:w-32 md:h-32 mx-auto text-gold-500" />
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-charcoal-900 mb-6">
              Crown Your
              <span className="block text-gold-600">Pickleball Champion</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-charcoal-600 max-w-2xl mx-auto mb-8">
              Custom 3D-printed pickleball crowns - the ultimate wearable trophy for tournaments,
              leagues, and the king or queen of your court.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/shop">
                  <Crown className="w-5 h-5 mr-2" />
                  Customize Your Crown
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Price Badge */}
            <div className="mt-8 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
              <span className="text-charcoal-600">Starting at</span>
              <span className="font-bold text-gold-600 text-lg">$19.99</span>
              <span className="text-pickle-500 text-sm font-medium">+ Free shipping over $35</span>
            </div>
          </div>
        </div>

        {/* Decorative pickle balls */}
        <div className="absolute bottom-10 left-10 w-8 h-8 rounded-full bg-pickle-400 opacity-30 animate-float" />
        <div className="absolute top-40 right-20 w-6 h-6 rounded-full bg-pink-400 opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 right-40 w-10 h-10 rounded-full bg-pickle-400 opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Trust Signals */}
      <section className="bg-charcoal-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Star className="w-8 h-8 text-gold-500" />
              <span className="text-white font-semibold">5-Star Reviews</span>
              <span className="text-charcoal-400 text-sm">Loved by players</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-8 h-8 text-gold-500" />
              <span className="text-white font-semibold">Fast Shipping</span>
              <span className="text-charcoal-400 text-sm">Ships from Texas</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Gift className="w-8 h-8 text-gold-500" />
              <span className="text-white font-semibold">Custom Text</span>
              <span className="text-charcoal-400 text-sm">Personalize it</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Award className="w-8 h-8 text-gold-500" />
              <span className="text-white font-semibold">3D Printed</span>
              <span className="text-charcoal-400 text-sm">Quality crafted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-cream-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
              Why Our Crowns?
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              The perfect way to celebrate wins, honor champions, or add excitement to any pickleball event.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-crown p-6 shadow-soft text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
                Fully Customizable
              </h3>
              <p className="text-charcoal-600 text-sm">
                Choose your size, ball color (green or pink), and add your own custom text -
                perfect for team names, event dates, or player names.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-crown p-6 shadow-soft text-center">
              <div className="w-16 h-16 bg-pickle-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-pickle-500" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
                Tournament Ready
              </h3>
              <p className="text-charcoal-600 text-sm">
                The ultimate traveling trophy! Pass the crown between winners at tournaments,
                leagues, or friendly matches.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-crown p-6 shadow-soft text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
                Perfect Gift
              </h3>
              <p className="text-charcoal-600 text-sm">
                A unique and fun gift for the pickleball lover in your life.
                Great for birthdays, holidays, or just because!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Preview */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
                Find Your Perfect Fit
              </h2>
              <p className="text-charcoal-600 mb-6">
                Our crowns come in 4 sizes to ensure the perfect fit for any champion.
                Lightweight and comfortable enough to wear during play or on the victory podium!
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-cream-100 rounded-crown">
                  <span className="font-medium text-charcoal-900">Small</span>
                  <span className="text-charcoal-600 text-sm">21.5" circumference</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cream-100 rounded-crown">
                  <span className="font-medium text-charcoal-900">Medium</span>
                  <span className="text-charcoal-600 text-sm">22.25" circumference</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cream-100 rounded-crown">
                  <span className="font-medium text-charcoal-900">Large</span>
                  <span className="text-charcoal-600 text-sm">23" circumference</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cream-100 rounded-crown">
                  <span className="font-medium text-charcoal-900">X-Large</span>
                  <span className="text-charcoal-600 text-sm">23.75" circumference</span>
                </div>
              </div>
            </div>

            <div className="bg-gold-50 rounded-crown p-8 text-center">
              <Crown className="w-32 h-32 mx-auto text-gold-500 mb-4" />
              <p className="text-charcoal-600">
                Each crown features 8 points topped with colorful 3D-printed pickleballs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-gold-500 to-gold-600 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Ready to Crown Your Champion?
          </h2>
          <p className="text-charcoal-700 mb-8 text-lg">
            Design your custom pickleball crown today and make every victory unforgettable.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/shop">
              <Crown className="w-5 h-5 mr-2" />
              Start Customizing
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
