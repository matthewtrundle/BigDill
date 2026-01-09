import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Poppins } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartSidebar } from '@/components/cart/CartSidebar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// Bold, sporty display font for headlines
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

// Friendly, modern font for subheadings
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: {
    default: 'Big Dill Pickleball | Customizable Pickleball Crowns',
    template: '%s | Big Dill Pickleball',
  },
  description:
    'Customizable 3D-printed pickleball crowns - the ultimate wearable trophy for champions! Personalize with your text, choose your size and ball color. Ships from Texas.',
  keywords: [
    'pickleball crown',
    'pickleball trophy',
    'pickleball gift',
    'tournament award',
    'pickleball champion',
    'customizable crown',
    '3D printed crown',
    'pickleball accessories',
  ],
  openGraph: {
    title: 'Big Dill Pickleball | Customizable Pickleball Crowns',
    description:
      'Customizable 3D-printed pickleball crowns - the ultimate wearable trophy for champions!',
    url: 'https://bigdillpickleball.com',
    siteName: 'Big Dill Pickleball',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Dill Pickleball | Customizable Pickleball Crowns',
    description:
      'Customizable 3D-printed pickleball crowns - the ultimate wearable trophy for champions!',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          {/* Grain texture overlay */}
          <div className="grain-overlay" aria-hidden="true" />

          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  )
}
