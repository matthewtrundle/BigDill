import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: '2025-12-15.clover',
    })
  : null

export function isStripeConfigured(): boolean {
  return stripe !== null
}
