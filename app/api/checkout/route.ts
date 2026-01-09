import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getProductBySku, getSizeInfo, getColorInfo, CartItemOptions } from '@/lib/products'
import type Stripe from 'stripe'

// Shipping rates for pickleball crowns
const FREE_SHIPPING_THRESHOLD = 3500 // $35 in cents
const SHIPPING_COST = 479 // $4.79 in cents

// Bulk discount tiers - must match cart-context.tsx and TierProgress.tsx
const bulkDiscountTiers = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 0.10 },
  { min: 10, max: 24, discount: 0.15 },
  { min: 25, max: 49, discount: 0.20 },
  { min: 50, max: 99, discount: 0.25 },
  { min: 100, max: Infinity, discount: 0.30 },
]

function getBulkDiscountRate(quantity: number): number {
  const tier = bulkDiscountTiers.find(t => quantity >= t.min && quantity <= t.max)
  return tier?.discount || 0
}

function getDiscountLabel(rate: number): string {
  if (rate === 0) return 'No discount'
  return `${Math.round(rate * 100)}% off`
}

interface CartItem {
  id: string
  sku: string
  quantity: number
  options: CartItemOptions
}

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured() || !stripe) {
      console.warn('Stripe not configured - checkout disabled')
      return NextResponse.json(
        { error: 'Checkout is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const { items } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
    }

    // Calculate total quantity for bulk discount
    const totalQuantity = items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0)
    const discountRate = getBulkDiscountRate(totalQuantity)
    const discountLabel = getDiscountLabel(discountRate)

    // Validate items and calculate totals
    let originalSubtotal = 0
    let totalWeight = 0

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: CartItem) => {
        const product = getProductBySku(item.sku)
        if (!product) {
          throw new Error(`Invalid product SKU: ${item.sku}`)
        }

        // Validate quantity
        if (!item.quantity || item.quantity < 1 || item.quantity > 10) {
          throw new Error(`Invalid quantity for ${item.sku}`)
        }

        // Get customization details
        const sizeInfo = getSizeInfo(item.options.size)
        const colorInfo = getColorInfo(item.options.ballColor)

        if (!sizeInfo || !colorInfo) {
          throw new Error(`Invalid options for ${item.sku}`)
        }

        originalSubtotal += product.price * item.quantity
        totalWeight += product.weight * item.quantity

        // Apply bulk discount to unit price
        const discountedPrice = Math.round(product.price * (1 - discountRate))

        // Build description with options
        const descriptionParts = [
          `Size: ${sizeInfo.name} (${sizeInfo.circumference})`,
          `Ball Color: ${colorInfo.name}`,
        ]

        if (item.options.customText) {
          descriptionParts.push(`Custom Text: "${item.options.customText}"`)
        }

        // Add discount info to description if applicable
        if (discountRate > 0) {
          descriptionParts.push(`Bulk Discount: ${discountLabel}`)
        }

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: descriptionParts.join(' | '),
              metadata: {
                sku: item.sku,
                size: item.options.size,
                ballColor: item.options.ballColor,
                customText: item.options.customText || '',
                originalPrice: product.price.toString(),
                discountRate: discountRate.toString(),
              },
            },
            unit_amount: discountedPrice,
          },
          quantity: item.quantity,
        }
      }
    )

    // Calculate discounted subtotal for shipping threshold
    const discountedSubtotal = Math.round(originalSubtotal * (1 - discountRate))
    const totalSavings = originalSubtotal - discountedSubtotal

    // Calculate shipping based on discounted subtotal
    const shippingCost = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

    // Build shipping display name
    const getShippingDisplayName = () => {
      if (shippingCost === 0) {
        return 'FREE Shipping'
      }
      return 'Standard Shipping (3-7 business days)'
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shop`,
      metadata: {
        totalWeight: totalWeight.toString(),
        originalSubtotal: originalSubtotal.toString(),
        discountedSubtotal: discountedSubtotal.toString(),
        discountRate: discountRate.toString(),
        discountLabel: discountLabel,
        totalSavings: totalSavings.toString(),
        shippingCost: shippingCost.toString(),
        itemCount: items.length.toString(),
        totalQuantity: totalQuantity.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingCost,
              currency: 'usd',
            },
            display_name: getShippingDisplayName(),
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Unable to create checkout session' },
      { status: 500 }
    )
  }
}
