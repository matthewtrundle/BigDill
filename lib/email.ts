import { Resend } from 'resend'

// Admin emails for order notifications
const ADMIN_EMAILS = [
  'matthewtrundle@gmail.com',
]

// Lazy-load Resend client
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

interface OrderItem {
  name: string
  quantity: number
  price: number // in cents
  weight?: number
}

interface OrderConfirmationEmailProps {
  to: string
  orderNumber: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    street?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(props: OrderConfirmationEmailProps) {
  const {
    to,
    orderNumber,
    customerName,
    items,
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress,
  } = props

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Lone Star Post Oak</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5E6D3;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F5E6D3;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #2D2D2D; border-bottom: 4px solid #CC5500;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #F5E6D3; line-height: 1.2;">Order Confirmed</h1>
              <p style="margin: 0; font-size: 15px; color: #C4A77D; line-height: 1.5;">Thank you for your order, ${customerName}. Your premium Texas post oak is on the way.</p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF8F5;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 500; color: #6B6B6B;">Order Number</p>
                    <p style="margin: 0; font-size: 20px; font-weight: 700; color: #2D2D2D; font-family: monospace;">${orderNumber}</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="margin: 0; font-size: 13px; color: #6B6B6B;">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Summary Section -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td colspan="2" style="padding-bottom: 16px;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #2D2D2D;">Order Summary</h2>
                  </td>
                </tr>
                ${items.map((item, index) => `
                <tr style="${index < items.length - 1 ? 'border-bottom: 1px solid #f5f5f4;' : ''}">
                  <td style="padding: 12px 0; font-size: 14px; color: #4A3728;">
                    <div style="font-weight: 500; color: #2D2D2D; margin-bottom: 2px;">${item.name}</div>
                    <div style="font-size: 13px; color: #6B6B6B;">Qty: ${item.quantity}${item.weight ? ` (${item.weight * item.quantity} lbs)` : ''}</div>
                  </td>
                  <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: 500; color: #2D2D2D;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 2px solid #E5E7EB; padding-top: 16px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #2D2D2D;">$${(subtotal / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #2D2D2D;">$${(shipping / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 16px 0; font-size: 14px; color: #6B6B6B; border-bottom: 1px solid #E5E7EB;">Tax</td>
                  <td style="padding: 8px 0 16px 0; text-align: right; font-size: 14px; color: #2D2D2D; border-bottom: 1px solid #E5E7EB;">$${(tax / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">Total</td>
                  <td style="padding: 16px 0 0 0; text-align: right; font-size: 20px; font-weight: 700; color: #CC5500;">$${(total / 100).toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="padding: 20px; background-color: #FAF8F5; border-radius: 6px;">
                <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #2D2D2D;">Shipping Address</h3>
                <p style="margin: 0; font-size: 14px; color: #4A3728; line-height: 1.6;">
                  <strong style="color: #2D2D2D;">${customerName}</strong><br>
                  ${shippingAddress.street || ''}<br>
                  ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}<br>
                  ${shippingAddress.country || 'US'}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: #2D2D2D; border-top: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #F5E6D3;">Lone Star Post Oak</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #C4A77D;">Real Texas BBQ Comes from Real Texas Post Oak</p>
              <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
                Premium Texas Post Oak &bull; Hand-Split &bull; Kiln-Dried
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Order #${orderNumber} Confirmed - Lone Star Post Oak`,
      html,
    })

    if (error) {
      console.error('Failed to send order confirmation email:', error)
      return { success: false, error }
    }

    console.log('Order confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error }
  }
}

/**
 * Send admin notification when a new order is placed
 */
export async function sendAdminOrderNotification(props: OrderConfirmationEmailProps) {
  const {
    to: customerEmail,
    orderNumber,
    customerName,
    items,
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress,
  } = props

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - ${orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f4;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background-color: #22c55e; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Order Received!</h1>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #2D2D2D;">Order #${orderNumber}</h2>
                    <p style="margin: 0; font-size: 14px; color: #6B6B6B;">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  </td>
                </tr>

                <!-- Customer Info -->
                <tr>
                  <td style="padding: 16px; background-color: #FAF8F5; border-radius: 8px; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #2D2D2D; text-transform: uppercase; letter-spacing: 0.5px;">Customer</h3>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">${customerName}</p>
                    <p style="margin: 0; font-size: 14px; color: #4A3728;">${customerEmail}</p>
                  </td>
                </tr>

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 16px; background-color: #FAF8F5; border-radius: 8px; margin: 16px 0;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #2D2D2D; text-transform: uppercase; letter-spacing: 0.5px;">Ship To</h3>
                    <p style="margin: 0; font-size: 14px; color: #4A3728; line-height: 1.6;">
                      ${customerName}<br>
                      ${shippingAddress.street || ''}<br>
                      ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}<br>
                      ${shippingAddress.country || 'US'}
                    </p>
                  </td>
                </tr>

                <!-- Items -->
                <tr>
                  <td style="padding-top: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #2D2D2D; text-transform: uppercase; letter-spacing: 0.5px;">Items Ordered</h3>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      ${items.map((item, index) => `
                      <tr>
                        <td style="padding: 12px 0; ${index < items.length - 1 ? 'border-bottom: 1px solid #E5E7EB;' : ''}">
                          <span style="font-size: 14px; color: #2D2D2D; font-weight: 500;">${item.name}</span>
                          <span style="font-size: 14px; color: #6B6B6B;"> x ${item.quantity}</span>
                        </td>
                        <td style="padding: 12px 0; text-align: right; ${index < items.length - 1 ? 'border-bottom: 1px solid #E5E7EB;' : ''}">
                          <span style="font-size: 14px; font-weight: 600; color: #2D2D2D;">$${((item.price * item.quantity) / 100).toFixed(2)}</span>
                        </td>
                      </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>

                <!-- Totals -->
                <tr>
                  <td style="padding-top: 16px; border-top: 2px solid #E5E7EB; margin-top: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Subtotal</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #2D2D2D;">$${(subtotal / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Shipping</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #2D2D2D;">$${(shipping / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Tax</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #2D2D2D;">$${(tax / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 0 0; font-size: 18px; font-weight: 700; color: #2D2D2D;">Total</td>
                        <td style="padding: 16px 0 0 0; text-align: right; font-size: 24px; font-weight: 700; color: #22c55e;">$${(total / 100).toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF8F5; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
                Lone Star Post Oak Order Notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: ADMIN_EMAILS,
      subject: `New Order #${orderNumber} - $${(total / 100).toFixed(2)} from ${customerName}`,
      html,
    })

    if (error) {
      console.error('Failed to send admin notification email:', error)
      return { success: false, error }
    }

    console.log('Admin notification email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return { success: false, error }
  }
}

/**
 * Send wholesale inquiry email to admin
 */
export async function sendWholesaleInquiryEmail(props: {
  businessName: string
  contactName: string
  email: string
  phone: string
  businessType: string
  estimatedVolume: string
  message: string
}) {
  const { businessName, contactName, email, phone, businessType, estimatedVolume, message } = props

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wholesale Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5E6D3;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F5E6D3;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background-color: #CC5500; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Wholesale Inquiry</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <!-- Business Info -->
                <tr>
                  <td style="padding: 16px; background-color: #FAF8F5; border-radius: 8px; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.5px;">Business Information</h3>
                    <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #2D2D2D;">${businessName}</p>
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #4A3728;"><strong>Type:</strong> ${businessType}</p>
                    <p style="margin: 0; font-size: 14px; color: #4A3728;"><strong>Est. Volume:</strong> ${estimatedVolume}</p>
                  </td>
                </tr>

                <!-- Contact Info -->
                <tr>
                  <td style="padding: 16px 0;">
                    <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.5px;">Contact Person</h3>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 500; color: #2D2D2D;">${contactName}</p>
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #4A3728;">
                      <a href="mailto:${email}" style="color: #CC5500; text-decoration: none;">${email}</a>
                    </p>
                    ${phone ? `<p style="margin: 0; font-size: 14px; color: #4A3728;">${phone}</p>` : ''}
                  </td>
                </tr>

                <!-- Message -->
                ${message ? `
                <tr>
                  <td style="padding: 16px; background-color: #FAF8F5; border-radius: 8px; border-left: 4px solid #CC5500;">
                    <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.5px;">Additional Details</h3>
                    <p style="margin: 0; font-size: 14px; color: #2D2D2D; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                  </td>
                </tr>
                ` : ''}

              </table>
            </td>
          </tr>

          <!-- Reply Button -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <a href="mailto:${email}?subject=Lone Star Post Oak Wholesale Pricing for ${encodeURIComponent(businessName)}"
                 style="display: block; text-align: center; background-color: #2D2D2D; color: #ffffff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reply to ${contactName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF8F5; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
                Lone Star Post Oak Wholesale Inquiry
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: ADMIN_EMAILS,
      replyTo: email,
      subject: `Wholesale Inquiry: ${businessName} (${businessType}) - ${estimatedVolume}`,
      html,
    })

    if (error) {
      console.error('Failed to send wholesale inquiry email:', error)
      return { success: false, error }
    }

    console.log('Wholesale inquiry email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending wholesale inquiry email:', error)
    return { success: false, error }
  }
}

/**
 * Send order shipped email with tracking
 */
export async function sendOrderShippedEmail(props: {
  to: string
  orderNumber: string
  customerName: string
  trackingNumber: string
  carrier: string
  items: OrderItem[]
}) {
  const { to, orderNumber, customerName, trackingNumber, carrier, items } = props

  // Generate tracking URL based on carrier
  let trackingUrl = ''
  const normalizedCarrier = carrier.toLowerCase()

  if (normalizedCarrier.includes('usps')) {
    trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
  } else if (normalizedCarrier.includes('ups')) {
    trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`
  } else if (normalizedCarrier.includes('fedex')) {
    trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
  }

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped - Lone Star Post Oak</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5E6D3;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F5E6D3;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #2D2D2D; border-bottom: 4px solid #22c55e;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #F5E6D3; line-height: 1.2;">Order Shipped!</h1>
              <p style="margin: 0; font-size: 15px; color: #C4A77D; line-height: 1.5;">Your post oak is on its way, ${customerName}!</p>
            </td>
          </tr>

          <!-- Tracking Info -->
          <tr>
            <td style="padding: 32px;">
              <div style="padding: 24px; background-color: #FAF8F5; border-radius: 6px; border: 1px solid #E5E7EB;">
                <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #2D2D2D;">Tracking Information</h2>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Order Number</td>
                    <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 500; color: #2D2D2D; font-family: monospace;">${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Carrier</td>
                    <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 500; color: #2D2D2D;">${carrier}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6B6B6B;">Tracking Number</td>
                    <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 600; color: #CC5500; font-family: monospace;">${trackingNumber}</td>
                  </tr>
                </table>
                ${trackingUrl ? `
                <div style="margin-top: 20px; text-align: center;">
                  <a href="${trackingUrl}" style="display: inline-block; background-color: #2D2D2D; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Track Package</a>
                </div>
                ` : ''}
              </div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">Items Shipped</h3>
              <div style="padding: 20px; background-color: #FAF8F5; border-radius: 6px;">
                ${items.map((item, index) => `
                <div style="padding: ${index > 0 ? '12px' : '0'} 0 ${index < items.length - 1 ? '12px' : '0'} 0; ${index < items.length - 1 ? 'border-bottom: 1px solid #E5E7EB;' : ''}">
                  <span style="display: inline-block; background-color: #CC5500; color: #ffffff; font-weight: 600; font-size: 12px; padding: 4px 8px; border-radius: 4px; margin-right: 8px;">${item.quantity}x</span>
                  <span style="font-size: 14px; color: #2D2D2D; font-weight: 500;">${item.name}</span>
                </div>
                `).join('')}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: #2D2D2D; border-top: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #F5E6D3;">Lone Star Post Oak</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #C4A77D;">Real Texas BBQ Comes from Real Texas Post Oak</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Your Order #${orderNumber} Has Shipped!`,
      html,
    })

    if (error) {
      console.error('Failed to send order shipped email:', error)
      return { success: false, error }
    }

    console.log('Order shipped email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending order shipped email:', error)
    return { success: false, error }
  }
}
