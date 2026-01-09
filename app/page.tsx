'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Crown, Star, Truck, Gift, Award, Medal, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PickleballSVG, BouncingPickleball } from '@/components/ui/PickleballSVG'
import { WaveDivider } from '@/components/ui/CourtDivider'
import { CourtTexture } from '@/components/ui/CourtTexture'
import { BallParticles, FloatingBalls } from '@/components/ui/BallParticles'

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Subtle background with layered design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background image - sunny outdoor court */}
        <div className="absolute inset-0">
          <Image
            src="/images/generated/hero-court.png"
            alt=""
            fill
            className="object-cover opacity-50"
            priority
          />
          {/* Light gradient overlay for overall brightness */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream-100/40 via-cream-100/20 to-cream-200/60" />
          {/* Darker overlay on left side for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/50 via-charcoal-900/30 to-transparent lg:via-30% lg:to-60%" />
        </div>

        {/* Court texture overlay */}
        <CourtTexture variant="grid" color="#FFCC33" opacity={0.03} />

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
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Text content with backdrop box */}
            <div className="text-center lg:text-left">
              {/* Backdrop box for text */}
              <div className="bg-charcoal-900/60 backdrop-blur-md rounded-organic-lg p-6 md:p-8 shadow-organic-lg">
                {/* Headline - Bold Bebas Neue with shadow for readability */}
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-wide text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  CROWN YOUR
                  <span className="block text-gold-400 drop-shadow-[0_2px_8px_rgba(255,204,51,0.4)]">CHAMPION</span>
                </h1>

                {/* Subheadline */}
                <p className="font-heading text-lg md:text-xl text-white/90 max-w-xl mb-8">
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
                  <Button variant="outline" size="lg" asChild className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    <Link href="/shop#medals">
                      <Medal className="w-5 h-5 mr-2" />
                      Shop Medals
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Price Badge - organic styling */}
              <div className="mt-6 inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-organic shadow-organic-lg">
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

            {/* Right: Video showcase - cleaner treatment */}
            <div className="relative flex items-center">
              {/* Subtle glow behind video */}
              <div className="absolute inset-0 bg-gold-400/15 rounded-organic-lg blur-2xl scale-110" />
              <div className="relative w-full">
                <div className="relative rounded-organic-lg overflow-hidden shadow-organic-lg aspect-[4/3]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/images/crown-video.mp4" type="video/mp4" />
                  </video>
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-charcoal-900/10 pointer-events-none" />
                  {/* Play badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                    <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-charcoal-900 text-sm font-medium">See it in action</span>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 z-10">
                  <BouncingPickleball size="md" color="green" />
                </div>
                <div className="absolute -bottom-3 -left-3 z-10">
                  <BouncingPickleball size="md" color="pink" />
                </div>
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
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-charcoal-900 mb-4">
              OUR PRODUCTS
            </h2>
            <p className="font-heading text-charcoal-600 max-w-2xl mx-auto text-lg">
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
                  <h3 className="font-display text-3xl tracking-wide text-white">
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
                  <h3 className="font-display text-3xl tracking-wide text-white">
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

      {/* Features Section - Bento Box / Pickleball Court Inspired Layout */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Parallax background image - increased visibility */}
        <div
          className="absolute inset-0 -z-20 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/generated/hero-court.png)',
            opacity: 0.55,
          }}
        />
        {/* Softer overlay with gradient for depth */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-100/70 via-cream-200/75 to-cream-100/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-charcoal-900 mb-4">
              WHY BIG DILL?
            </h2>
            <p className="font-heading text-charcoal-600 max-w-2xl mx-auto text-lg">
              The perfect way to celebrate wins, honor champions, or add excitement to any pickleball event.
            </p>
          </div>

          {/* Bento Box Grid - Court Inspired Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Large Feature Card - Spans 2 columns, 2 rows on desktop (like center court) */}
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-gold-400 to-gold-500 rounded-organic-lg p-6 md:p-8 shadow-organic-lg relative overflow-hidden group">
              {/* Decorative court line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/30 transform -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/30 transform -translate-x-1/2" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-organic flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl tracking-wide text-white mb-2">
                    CROWN YOUR CHAMPION
                  </h3>
                  <p className="text-white/90 text-sm md:text-base max-w-xs">
                    The ultimate pickleball trophy - a wearable crown that celebrates every victory in style.
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/shop" className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                    Shop Now <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>

              {/* Floating ball decoration */}
              <div className="absolute -bottom-4 -right-4 opacity-30">
                <PickleballSVG size="xl" color="gold" />
              </div>
            </div>

            {/* Feature Card - Customizable */}
            <div className="bg-white/90 backdrop-blur-sm rounded-organic-lg p-5 shadow-organic hover:shadow-organic-lg transition-shadow group">
              <div className="w-12 h-12 bg-pickle-100 rounded-organic flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PickleballSVG size="sm" color="green" />
              </div>
              <h3 className="font-heading text-lg font-bold text-charcoal-900 mb-1">
                Fully Customizable
              </h3>
              <p className="text-charcoal-600 text-sm">
                Choose size, color & add custom text for your event.
              </p>
            </div>

            {/* Feature Card - Tournament Ready */}
            <div className="bg-white/90 backdrop-blur-sm rounded-organic-lg p-5 shadow-organic hover:shadow-organic-lg transition-shadow group">
              <div className="w-12 h-12 bg-gold-100 rounded-organic flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-heading text-lg font-bold text-charcoal-900 mb-1">
                Tournament Ready
              </h3>
              <p className="text-charcoal-600 text-sm">
                Perfect traveling trophy for leagues & events.
              </p>
            </div>

            {/* Feature Card - Gift */}
            <div className="bg-white/90 backdrop-blur-sm rounded-organic-lg p-5 shadow-organic hover:shadow-organic-lg transition-shadow group">
              <div className="w-12 h-12 bg-pink-100 rounded-organic flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-heading text-lg font-bold text-charcoal-900 mb-1">
                Perfect Gift
              </h3>
              <p className="text-charcoal-600 text-sm">
                Unique gift for any pickleball enthusiast.
              </p>
            </div>

            {/* Stats/Social Proof Card */}
            <div className="bg-charcoal-900/90 backdrop-blur-sm rounded-organic-lg p-5 shadow-organic text-white">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1">
                5-Star Rated
              </h3>
              <p className="text-charcoal-300 text-sm">
                Loved by pickleball players everywhere
              </p>
            </div>

            {/* Bulk Orders Promo - Spans 2 columns */}
            <div className="col-span-2 bg-gradient-to-r from-pickle-500 to-pickle-600 rounded-organic-lg p-5 md:p-6 shadow-organic relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-1">
                    Bulk Orders Available!
                  </h3>
                  <p className="text-white/90 text-sm">
                    Up to 30% off for tournaments & leagues
                  </p>
                </div>
                <Link
                  href="/bulk-orders"
                  className="bg-white text-pickle-700 px-4 py-2 rounded-organic font-semibold text-sm hover:bg-cream-100 transition-colors whitespace-nowrap"
                >
                  Learn More
                </Link>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-8 -bottom-8 opacity-20">
                <PickleballSVG size="xl" color="green" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Preview with Background */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Increased background visibility */}
        <div
          className="absolute inset-0 -z-20 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/generated/crown-court-glory.png)',
            opacity: 0.45,
          }}
        />
        {/* Softer gradient overlay for readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/85 via-cream-100/80 to-white/85" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl tracking-wide text-charcoal-900 mb-4">
                FIND YOUR PERFECT FIT
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

      {/* Final CTA with Parallax Background */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Parallax background image - increased visibility */}
        <div
          className="absolute inset-0 -z-20 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/generated/tournament-celebration.png)',
            opacity: 0.6,
          }}
        />
        {/* Gold gradient overlay - slightly more transparent for background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/80 to-gold-600/85" />

        {/* Floating balls */}
        <FloatingBalls
          className="z-5"
          positions={[
            { x: 5, y: 30, size: 24, color: 'green' },
            { x: 95, y: 60, size: 20, color: 'pink' },
            { x: 10, y: 80, size: 16, color: 'gold' },
          ]}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-charcoal-900 mb-4">
            READY TO CROWN YOUR CHAMPION?
          </h2>
          <p className="font-heading text-charcoal-800 mb-8 text-lg">
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
