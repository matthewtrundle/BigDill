'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Crown, Star, Truck, Gift, Award, Medal, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PickleballSVG, BouncingPickleball } from '@/components/ui/PickleballSVG'
import { CourtDivider, WaveDivider } from '@/components/ui/CourtDivider'
import { CourtTexture } from '@/components/ui/CourtTexture'
import { BallParticles, FloatingBalls } from '@/components/ui/BallParticles'
import { NetMesh } from '@/components/ui/NetMesh'

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Layered organic design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-100 via-cream-100 to-cream-200" />

        {/* Court texture overlay */}
        <CourtTexture variant="grid" color="#FFCC33" opacity={0.03} />

        {/* Net mesh subtle overlay */}
        <NetMesh opacity={0.02} />

        {/* Floating ball particles */}
        <BallParticles count={8} colors={['green', 'pink', 'gold']} className="z-10" />

        {/* Static floating balls at fixed positions */}
        <FloatingBalls
          className="z-5"
          positions={[
            { x: 8, y: 25, size: 32, color: 'green' },
            { x: 88, y: 30, size: 24, color: 'pink' },
            { x: 15, y: 75, size: 28, color: 'gold' },
            { x: 82, y: 70, size: 20, color: 'green' },
          ]}
        />

        {/* Main content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              {/* Headline */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal-900 mb-6">
                Crown Your
                <span className="block text-gold-600 drop-shadow-sm">Pickleball Champion</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-charcoal-600 max-w-xl mb-8">
                Custom 3D-printed pickleball crowns & medals - the ultimate wearable trophies for tournaments,
                leagues, and the king or queen of your court.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="primary" size="lg" asChild className="shadow-organic">
                  <Link href="/shop">
                    <Crown className="w-5 h-5 mr-2" />
                    Shop Crowns
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/shop#medals">
                    <Medal className="w-5 h-5 mr-2" />
                    Shop Medals
                  </Link>
                </Button>
              </div>

              {/* Price Badge - organic styling */}
              <div className="mt-8 inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-organic shadow-organic">
                <PickleballSVG size="sm" color="gold" />
                <div className="text-left">
                  <span className="text-charcoal-600 text-sm">Starting at</span>
                  <span className="block font-bold text-gold-600 text-xl">$19.99</span>
                </div>
                <span className="text-pickle-600 text-sm font-medium bg-pickle-100 px-2 py-1 rounded-full">
                  Free shipping over $35
                </span>
              </div>
            </div>

            {/* Right: Video showcase */}
            <div className="relative">
              <div className="relative rounded-organic-lg overflow-hidden shadow-organic-lg aspect-square max-w-md mx-auto">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/images/crown-video.mp4" type="video/mp4" />
                </video>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/30 to-transparent pointer-events-none" />
                {/* Play badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                  <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                  </div>
                  <span className="text-charcoal-900 text-sm font-medium">See it in action</span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4">
                <BouncingPickleball size="md" color="green" />
              </div>
              <div className="absolute -bottom-4 -left-4">
                <BouncingPickleball size="md" color="pink" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <WaveDivider color="#1A1A1A" className="h-16 md:h-24" />
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-charcoal-950 py-12 relative overflow-hidden">
        {/* Subtle court lines in background */}
        <div className="absolute inset-0 opacity-5">
          <CourtTexture variant="grid" color="#FFCC33" opacity={0.1} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-500/10 rounded-organic flex items-center justify-center">
                <Star className="w-6 h-6 text-gold-500" />
              </div>
              <span className="text-white font-semibold">5-Star Reviews</span>
              <span className="text-charcoal-400 text-sm">Loved by players</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-500/10 rounded-organic flex items-center justify-center">
                <Truck className="w-6 h-6 text-gold-500" />
              </div>
              <span className="text-white font-semibold">Fast Shipping</span>
              <span className="text-charcoal-400 text-sm">Ships from Texas</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-500/10 rounded-organic flex items-center justify-center">
                <Gift className="w-6 h-6 text-gold-500" />
              </div>
              <span className="text-white font-semibold">Custom Text</span>
              <span className="text-charcoal-400 text-sm">Personalize it</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-500/10 rounded-organic flex items-center justify-center">
                <Award className="w-6 h-6 text-gold-500" />
              </div>
              <span className="text-white font-semibold">3D Printed</span>
              <span className="text-charcoal-400 text-sm">Quality crafted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-cream-100 py-16 md:py-24 relative overflow-hidden">
        <CourtTexture variant="grid" color="#FFCC33" opacity={0.02} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
              Our Products
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              From wearable crowns to custom medals - celebrate every victory in style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Crown Product Card */}
            <div className="card-organic overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/il_1588xN.6727699661_5zg6.webp"
                  alt="Pickleball Crown - King and Queen"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-gold-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-bold mb-2">
                    Best Seller
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Pickleball Crowns
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-charcoal-600 mb-4">
                  Wearable 3D-printed crowns with customizable text. Perfect for tournaments,
                  leagues, or crowning your court's champion. Available in King & Queen styles.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gold-600">$19.99</span>
                  <Button variant="primary" asChild>
                    <Link href="/shop">
                      <Crown className="w-4 h-4 mr-2" />
                      Customize
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Medal Product Card */}
            <div className="card-organic overflow-hidden group" id="medals">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/medal1.jpg"
                  alt="Pickleball Medals - Gold, Silver, Bronze"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-pickle-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                    New
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Tournament Medals
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-charcoal-600 mb-4">
                  Custom laser-engraved wood medals in gold, silver & bronze. Perfect for
                  tournaments, leagues, and special events. Personalize with your logo & text.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gold-600">$9.99</span>
                  <Button variant="primary" asChild>
                    <Link href="/shop#medals">
                      <Medal className="w-4 h-4 mr-2" />
                      Customize
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Product Images Row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative aspect-square rounded-organic overflow-hidden shadow-organic group">
              <Image
                src="/images/il_1588xN.6679666150_a6ho.webp"
                alt="Pickleball King Crown"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-organic overflow-hidden shadow-organic group">
              <Image
                src="/images/tropy1.webp"
                alt="Pickleball Trophy Crown"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-organic overflow-hidden shadow-organic group">
              <Image
                src="/images/Medal2.jpg"
                alt="Pickleball Medal Detail"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-organic overflow-hidden shadow-organic group">
              <Image
                src="/images/il_1588xN.6686537704_76kj.webp"
                alt="Pickleball Crown Collection"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-cream-200 py-16 md:py-24 relative overflow-hidden">
        {/* Top court divider */}
        <div className="absolute top-0 left-0 right-0">
          <CourtDivider variant="baseline" color="#FFCC33" className="h-6" />
        </div>

        {/* Background texture */}
        <CourtTexture variant="composite" color="#FFCC33" opacity={0.02} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
              Why Big Dill?
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              The perfect way to celebrate wins, honor champions, or add excitement to any pickleball event.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Organic card */}
            <div className="card-organic p-6 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-organic flex items-center justify-center mx-auto mb-4">
                <PickleballSVG size="md" color="gold" />
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
            <div className="card-organic p-6 text-center">
              <div className="w-16 h-16 bg-pickle-100 rounded-organic flex items-center justify-center mx-auto mb-4">
                <PickleballSVG size="md" color="green" />
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
            <div className="card-organic p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-organic flex items-center justify-center mx-auto mb-4">
                <PickleballSVG size="md" color="pink" />
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

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <CourtDivider variant="kitchen" color="#FFCC33" className="h-10" flip />
        </div>
      </section>

      {/* Size Guide Preview */}
      <section className="bg-white py-16 md:py-24 relative overflow-hidden">
        {/* Subtle net mesh background */}
        <NetMesh opacity={0.015} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {[
                  { size: 'Small', circ: '21.5"' },
                  { size: 'Medium', circ: '22.25"' },
                  { size: 'Large', circ: '23"' },
                  { size: 'X-Large', circ: '23.75"' },
                ].map((item, i) => (
                  <div
                    key={item.size}
                    className="flex items-center justify-between p-3 bg-cream-100 rounded-organic shadow-sm hover:shadow-organic transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <PickleballSVG size="sm" color={i % 2 === 0 ? 'green' : 'pink'} />
                      <span className="font-medium text-charcoal-900">{item.size}</span>
                    </div>
                    <span className="text-charcoal-600 text-sm">{item.circ} circumference</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-organic-lg overflow-hidden shadow-organic-lg">
              <Image
                src="/images/il_1588xN.6679666150_a6ho.webp"
                alt="Pickleball Crown Close-up"
                width={600}
                height={600}
                className="w-full h-auto"
              />
              {/* Decorative balls */}
              <div className="absolute top-4 right-4">
                <BouncingPickleball size="sm" color="green" />
              </div>
              <div className="absolute bottom-4 left-4">
                <BouncingPickleball size="sm" color="pink" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600" />

        {/* Court texture overlay */}
        <CourtTexture variant="grid" color="#000000" opacity={0.03} />

        {/* Floating balls */}
        <FloatingBalls
          className="z-5"
          positions={[
            { x: 5, y: 30, size: 24, color: 'green' },
            { x: 95, y: 60, size: 20, color: 'pink' },
            { x: 10, y: 80, size: 16, color: 'gold' },
          ]}
        />

        {/* Top net divider */}
        <div className="absolute top-0 left-0 right-0">
          <CourtDivider variant="net" color="#FFFFFF" className="h-12 opacity-20" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Ready to Crown Your Champion?
          </h2>
          <p className="text-charcoal-800 mb-8 text-lg">
            Design your custom pickleball crown or medal today and make every victory unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild className="shadow-lg">
              <Link href="/shop">
                <Crown className="w-5 h-5 mr-2" />
                Shop Crowns
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-white/90 hover:bg-white">
              <Link href="/bulk-orders">
                Bulk Orders
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
