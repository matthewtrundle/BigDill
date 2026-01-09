import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getProductBySku, getSizeInfo, getColorInfo, CartItemOptions } from '@/lib/products'
import type Stripe from 'stripe'

// Shipping rates for pickleball crowns
const FREE_SHIPPING_THRESHOLD = 3500 // $35 in cents
const SHIPPING_COST = 479 // $4.79 in cents

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

    // Validate items and calculate totals
    let subtotal = 0
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

        subtotal += product.price * item.quantity
        totalWeight += product.weight * item.quantity

        // Build description with options
        const descriptionParts = [
          `Size: ${sizeInfo.name} (${sizeInfo.circumference})`,
          `Ball Color: ${colorInfo.name}`,
        ]

        if (item.options.customText) {
          descriptionParts.push(`Custom Text: "${item.options.customText}"`)
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
              },
            },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        }
      }
    )

    // Calculate shipping
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

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
        subtotal: subtotal.toString(),
        shippingCost: shippingCost.toString(),
        itemCount: items.length.toString(),
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
