import { Metadata } from 'next'
import Link from 'next/link'
import { Crown, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'FAQ | Big Dill Pickleball',
  description:
    'Get answers to common questions about Big Dill Pickleball crowns, sizing, customization, and shipping.',
}

const faqs = [
  {
    category: 'Sizing & Fit',
    questions: [
      {
        q: 'How do I measure for the right crown size?',
        a: "Measure around your head just above your eyebrows, where a hat or headband would typically sit. Use a flexible tape measure for the most accurate result. If you're between sizes, we recommend sizing up for comfort.",
      },
      {
        q: 'What are the available sizes?',
        a: 'We offer four sizes: Small (21.5" circumference), Medium (22.25"), Large (23"), and X-Large (23.75"). Each crown is designed to fit comfortably and securely.',
      },
      {
        q: 'Will the crown stay on during play?',
        a: "While the crown is lightweight and comfortable, it's primarily designed for victory celebrations and photos rather than active gameplay. For wearing during play, we recommend choosing a snug fit.",
      },
      {
        q: 'Can I exchange if the size doesn\'t fit?',
        a: 'Yes! If your crown doesn\'t fit as expected, contact us within 14 days of delivery and we\'ll help you exchange it for the correct size.',
      },
    ],
  },
  {
    category: 'Customization',
    questions: [
      {
        q: 'What ball colors are available?',
        a: 'We offer two pickleball colors: Classic Green (lime green) and Pink. Both colors are vibrant and eye-catching, sitting atop each of the eight crown points.',
      },
      {
        q: 'Can I add custom text to my crown?',
        a: 'Absolutely! You can add personalized text up to 30 characters. Popular options include names, tournament names, dates, team names, or fun phrases like "KING," "QUEEN," or "BIG DILL."',
      },
      {
        q: 'Can I get different ball colors on the same crown?',
        a: 'Currently, each crown features one ball color throughout. If you\'d like a mixed color crown or custom color options for bulk orders, please contact us to discuss possibilities.',
      },
      {
        q: 'What does the crown look like?',
        a: 'Each crown is gold-colored with 8 points, and each point is topped with a 3D-printed pickleball in your chosen color. It\'s lightweight, comfortable, and undeniably regal!',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Most orders ship within 2-3 business days and arrive within 3-7 business days via USPS. You\'ll receive a tracking number once your order ships.',
      },
      {
        q: 'Is shipping free?',
        a: 'Orders over $35 ship free! For orders under $35, standard shipping is $4.79.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we only ship within the United States. We hope to expand internationally in the future!',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order ships, you\'ll receive an email with your tracking number. You can also check your order status on our website.',
      },
    ],
  },
  {
    category: 'Orders & Returns',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as Apple Pay and Google Pay through our secure Stripe checkout.',
      },
      {
        q: 'Can I cancel or modify my order?',
        a: 'Since each crown is made to order, please contact us as soon as possible if you need to make changes. We\'ll do our best to accommodate requests before production begins.',
      },
      {
        q: 'What is your return policy?',
        a: 'We want you to love your crown! If there\'s a defect or quality issue, contact us within 14 days of delivery and we\'ll make it right. Custom items with personalized text cannot be returned unless defective.',
      },
      {
        q: 'Do you offer bulk or wholesale pricing?',
        a: 'Yes! For tournaments, leagues, or large events, we offer special pricing on bulk orders. Contact us with your needs and we\'ll provide a custom quote.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 mx-auto text-gold-500 mb-4" />
          <h1 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-charcoal-600">
            Everything you need to know about our pickleball crowns.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-4 pb-2 border-b border-cream-300">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((item, index) => (
                  <details
                    key={index}
                    className="group bg-white rounded-crown shadow-soft overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-cream-50 transition-colors">
                      <span className="font-medium text-charcoal-900 pr-4">
                        {item.q}
                      </span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-charcoal-600">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-r from-gold-100 to-gold-200 rounded-crown p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-charcoal-700 mb-6">
            We&apos;re here to help! Reach out and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">
                <Crown className="w-5 h-5 mr-2" />
                Shop Crowns
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
