'use client'

import Link from 'next/link'
import { Instagram, Mail, Crown } from 'lucide-react'

const footerLinks = {
  shop: [
    { href: '/shop', label: 'Pickleball Crowns' },
    { href: '/shop#medals', label: 'Tournament Medals' },
    { href: '/bulk-orders', label: 'Tournament & League Orders' },
    { href: '/shipping', label: 'Shipping Info' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-gold-500" />
              <span className="font-display text-2xl font-semibold text-cream-100">
                Big Dill <span className="text-gold-500">Pickleball</span>
              </span>
            </div>
            <p className="text-cream-400 mb-6 max-w-sm">
              Custom 3D-printed pickleball crowns and laser-engraved medals - the ultimate
              wearable trophies for champions, tournaments, and pickleball lovers everywhere.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-cream-400 hover:text-gold-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@bigdillpickleball.com"
                className="p-2 text-cream-400 hover:text-gold-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-cream-100 mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-cream-100 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-500 text-sm">
            &copy; {new Date().getFullYear()} Big Dill Pickleball. All rights reserved.
          </p>
          <p className="text-cream-600 text-sm">
            Ships from Austin, Texas
          </p>
        </div>

        {/* Tagline */}
        <div className="mt-8 text-center">
          <p className="text-cream-600 text-sm italic font-display">
            &ldquo;Crown the Champion in Style&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}
