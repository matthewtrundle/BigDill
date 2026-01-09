'use client'

import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle, Crown, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <Crown className="w-12 h-12 mx-auto text-gold-500 mb-4" />
          <h1 className="font-display text-4xl font-bold text-charcoal-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-charcoal-600">
            Have a question? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-crown shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900 mb-1">Email</h3>
                  <a
                    href="mailto:info@bigdillpickleball.com"
                    className="text-gold-600 hover:text-gold-700"
                  >
                    info@bigdillpickleball.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-crown shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pickle-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-pickle-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900 mb-1">Instagram</h3>
                  <a
                    href="https://instagram.com/bigdillpickleball"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-600 hover:text-gold-700"
                  >
                    @bigdillpickleball
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-crown shadow-soft p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900 mb-1">Location</h3>
                  <p className="text-charcoal-600">
                    Austin, Texas
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gold-50 border border-gold-200 rounded-crown p-4">
              <h3 className="font-semibold text-charcoal-900 mb-1">
                Response Time
              </h3>
              <p className="text-sm text-charcoal-600">
                We typically respond within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-crown shadow-soft p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-pickle-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-pickle-600" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-charcoal-600 mb-6">
                    Thanks for reaching out. We&apos;ll get back to you soon!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-semibold text-charcoal-900 mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-charcoal-900 mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full px-4 py-3 rounded-crown border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-charcoal-900 mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full px-4 py-3 rounded-crown border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-charcoal-900 mb-2"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-4 py-3 rounded-crown border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-colors"
                      >
                        <option value="">Select a topic</option>
                        <option value="order">Order Question</option>
                        <option value="sizing">Sizing Help</option>
                        <option value="custom">Custom/Bulk Order</option>
                        <option value="shipping">Shipping Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-charcoal-900 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="w-full px-4 py-3 rounded-crown border border-cream-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-colors resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Callout */}
        <div className="mt-12 bg-gradient-to-r from-gold-100 to-gold-200 rounded-crown p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-4">
            Check Our FAQ First
          </h2>
          <p className="text-charcoal-700 mb-6">
            Many common questions are answered on our FAQ page.
          </p>
          <Button variant="outline" asChild>
            <a href="/faq">View FAQ</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
