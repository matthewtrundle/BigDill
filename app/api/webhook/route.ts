import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getProductBySku } from '@/lib/products'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured() || !stripe) {
      console.warn('Stripe not configured - webhook disabled')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session

        try {
          // Retrieve full session details with line items and expanded product
          const fullSession = (await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items', 'line_items.data.price.product'],
          })) as Stripe.Checkout.Session

          // Generate order number: BDP-{6-digit-counter}
          const timestamp = Date.now().toString().slice(-6)
          const random = Math.random().toString(36).substring(2, 4).toUpperCase()
          const orderNumber = `BDP-${timestamp}${random}`

          // Extract line items with customization options
          const items =
            fullSession.line_items?.data.map((item) => {
              // Access product metadata from expanded product object
              const stripeProduct = item.price?.product as Stripe.Product | undefined
              const metadata = stripeProduct?.metadata || {}
              const sku = metadata.sku || ''
              const product = getProductBySku(sku)
              return {
                sku,
                name: item.description || '',
                quantity: item.quantity || 0,
                price: item.price?.unit_amount || 0,
                weight: product?.weight || 0,
                // Crown customization options
                size: metadata.size || null,
                ballColor: metadata.ballColor || null,
                customText: metadata.customText || null,
              }
            }) || []

          // Calculate totals (amounts in cents)
          const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const shipping = fullSession.shipping_cost?.amount_total || 0
          const tax = fullSession.total_details?.amount_tax || 0
          const total = session.amount_total || subtotal + shipping + tax

          // Extract shipping address from collected_information
          const shippingInfo = fullSession.collected_information?.shipping_details
          const shippingAddr = shippingInfo?.address
          const customerEmail = fullSession.customer_details?.email || ''
          const customerName =
            fullSession.customer_details?.name || shippingInfo?.name || 'Guest'

          // Find or create customer
          let customerId: string | null = null

          if (customerEmail) {
            let customer = await prisma.customer.findUnique({
              where: { email: customerEmail },
            })

            if (!customer) {
              const [firstName, ...lastNameParts] = customerName.split(' ')
              const lastName = lastNameParts.join(' ') || ''

              customer = await prisma.customer.create({
                data: {
                  email: customerEmail,
                  firstName: firstName || null,
                  lastName: lastName || null,
                  phone: fullSession.customer_details?.phone || null,
                },
              })
              console.log('Created customer:', customer.id)
            }

            customerId = customer.id
          }

          // Save order to database
          const order = await prisma.order.create({
            data: {
              orderNumber,
              email: customerEmail,
              status: 'PROCESSING',
              paymentStatus: 'SUCCEEDED',
              customerId,

              // Shipping address fields
              shippingName: customerName,
              shippingAddress1: shippingAddr?.line1 || '',
              shippingAddress2: shippingAddr?.line2 || null,
              shippingCity: shippingAddr?.city || '',
              shippingState: shippingAddr?.state || '',
              shippingZip: shippingAddr?.postal_code || '',
              shippingCountry: shippingAddr?.country || 'US',
              shippingPhone: fullSession.customer_details?.phone || null,
              shippingMethod: 'ground',

              // Order totals
              subtotal,
              shipping,
              tax,
              total,

              // Stripe reference
              stripePaymentId: session.payment_intent as string,
              stripeSessionId: session.id,

              // Create order items with customization options
              items: {
                create: items.map((item) => ({
                  sku: item.sku,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  weight: item.weight,
                  size: item.size,
                  ballColor: item.ballColor,
                  customText: item.customText,
                })),
              },
            },
          })

          console.log('Order saved to database:', order.id, order.orderNumber)

          // Send order confirmation email to customer
          const emailData = {
            to: order.email,
            orderNumber: order.orderNumber,
            customerName: order.shippingName || 'Guest',
            items: items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              weight: item.weight,
            })),
            subtotal: order.subtotal,
            shipping: order.shipping,
            tax: order.tax,
            total: order.total,
            shippingAddress: {
              street: order.shippingAddress1 || undefined,
              city: order.shippingCity || undefined,
              state: order.shippingState || undefined,
              zip: order.shippingZip || undefined,
              country: order.shippingCountry || undefined,
            },
          }

          try {
            await sendOrderConfirmationEmail(emailData)
            console.log('Order confirmation email sent:', order.orderNumber)
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError)
          }

          // Send admin notification email
          try {
            await sendAdminOrderNotification(emailData)
            console.log('Admin notification email sent:', order.orderNumber)
          } catch (adminEmailError) {
            console.error('Failed to send admin notification:', adminEmailError)
          }
        } catch (dbError) {
          console.error('Failed to save order to database:', dbError)
          // Still return 200 to Stripe to avoid retries
        }

        break

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// GET endpoint to look up orders
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const orderNumber = url.searchParams.get('orderNumber')
    const sessionId = url.searchParams.get('session_id')

    if (!orderNumber && !sessionId) {
      return NextResponse.json({ error: 'Order number or session ID required' }, { status: 400 })
    }

    let order

    if (sessionId) {
      order = await prisma.order.findFirst({
        where: { stripeSessionId: sessionId },
        include: { items: true },
      })
    } else if (orderNumber) {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        email: order.email,
        customerName: order.shippingName,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      },
    })
  } catch (error) {
    console.error('Order lookup error:', error)
    return NextResponse.json({ error: 'Failed to retrieve order' }, { status: 500 })
  }
}
