import { Metadata } from 'next'
import Link from 'next/link'
import { Crown, Heart, Printer, Users, Award, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Us | Big Dill Pickleball',
  description: 'Learn about Big Dill Pickleball - crafting custom 3D-printed pickleball crowns from Austin, Texas. The ultimate wearable trophy for champions.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Crown className="w-16 h-16 mx-auto text-gold-500 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900 mb-4">
            Our Story
          </h1>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            We believe every pickleball champion deserves to be crowned - literally.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-crown p-8 shadow-soft mb-8">
            <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-4">
              Born from a Love of the Game
            </h2>
            <p className="text-charcoal-600 mb-4">
              Big Dill Pickleball started with a simple idea: what if winning at pickleball felt as special as it should?
              Whether you&apos;re the reigning champion of your local court, a tournament winner, or just the undisputed
              king or queen of your friend group, you deserve more than bragging rights.
            </p>
            <p className="text-charcoal-600">
              Our custom 3D-printed pickleball crowns are designed to celebrate your victories in style.
              Each crown features eight points topped with colorful 3D-printed pickleballs, creating a
              one-of-a-kind trophy that&apos;s both playful and prize-worthy.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-crown p-6 shadow-soft">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mb-4">
                <Printer className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2">
                Crafted with Care
              </h3>
              <p className="text-charcoal-600 text-sm">
                Each crown is 3D-printed on demand using high-quality materials, ensuring durability
                and a perfect finish every time.
              </p>
            </div>

            <div className="bg-white rounded-crown p-6 shadow-soft">
              <div className="w-12 h-12 bg-pickle-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-pickle-600" />
              </div>
              <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2">
                Made with Love
              </h3>
              <p className="text-charcoal-600 text-sm">
                We&apos;re pickleball enthusiasts ourselves, and we put the same passion into every crown
                that you put into your game.
              </p>
            </div>

            <div className="bg-white rounded-crown p-6 shadow-soft">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2">
                For the Community
              </h3>
              <p className="text-charcoal-600 text-sm">
                Our crowns are perfect for leagues, tournaments, clubs, and casual games alike.
                Bring extra fun to any pickleball gathering!
              </p>
            </div>

            <div className="bg-white rounded-crown p-6 shadow-soft">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-display text-lg font-semibold text-charcoal-900 mb-2">
                Fully Customizable
              </h3>
              <p className="text-charcoal-600 text-sm">
                Choose your size, pick your ball color, and add personalized text to make your
                crown truly one of a kind.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-r from-gold-100 to-gold-200 rounded-crown p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-gold-600" />
              <h3 className="font-display text-xl font-semibold text-charcoal-900">
                Proudly Made in Austin, Texas
              </h3>
            </div>
            <p className="text-charcoal-700">
              Every crown is designed, printed, and shipped from our workshop in Austin, Texas -
              a city that knows a thing or two about having fun and celebrating wins.
              We ship across the United States and can&apos;t wait to crown your next champion!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-4">
            Ready to Crown a Champion?
          </h2>
          <p className="text-charcoal-600 mb-6">
            Design your custom pickleball crown today.
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
