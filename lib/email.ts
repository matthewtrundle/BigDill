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
  size?: string
  ballColor?: string
  customText?: string
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
  <title>Order Confirmation - Big Dill Pickleball</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFDF7;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #4A7C59; border-bottom: 4px solid #D4AF37;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">Order Confirmed! 👑</h1>
              <p style="margin: 0; font-size: 15px; color: #E8F5E9; line-height: 1.5;">Thank you for your order, ${customerName}. Your Big Dill gear is on the way!</p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FFF9E6;">
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
                  <td colspan="2" style="padding: 24px 0 16px 0;">
                    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #2D2D2D;">Order Summary</h2>
                  </td>
                </tr>
                ${items.map((item, index) => `
                <tr style="${index < items.length - 1 ? 'border-bottom: 1px solid #E5E7EB;' : ''}">
                  <td style="padding: 12px 0; font-size: 14px; color: #4A3728;">
                    <div style="font-weight: 500; color: #2D2D2D; margin-bottom: 2px;">${item.name}</div>
                    <div style="font-size: 13px; color: #6B6B6B;">Qty: ${item.quantity}${item.size ? ` | Size: ${item.size}` : ''}${item.ballColor ? ` | Ball: ${item.ballColor}` : ''}${item.customText ? ` | Text: "${item.customText}"` : ''}</div>
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
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #2D2D2D;">${shipping === 0 ? 'FREE' : '$' + (shipping / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 16px 0; font-size: 14px; color: #6B6B6B; border-bottom: 1px solid #E5E7EB;">Tax</td>
                  <td style="padding: 8px 0 16px 0; text-align: right; font-size: 14px; color: #2D2D2D; border-bottom: 1px solid #E5E7EB;">$${(tax / 100).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">Total</td>
                  <td style="padding: 16px 0 0 0; text-align: right; font-size: 20px; font-weight: 700; color: #4A7C59;">$${(total / 100).toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="padding: 20px; background-color: #FFF9E6; border-radius: 12px;">
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
            <td style="padding: 32px; text-align: center; background-color: #4A7C59; border-top: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Big Dill Pickleball</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #E8F5E9;">Kind of a Big Dill</p>
              <p style="margin: 0; font-size: 12px; color: #C8E6C9;">
                Premium Pickleball Crowns &bull; Stand Out on the Court
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
      subject: `Order #${orderNumber} Confirmed - Big Dill Pickleball 👑`,
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
            <td style="padding: 24px 32px; background-color: #4A7C59; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Order Received! 👑</h1>
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
                  <td style="padding: 16px; background-color: #FFF9E6; border-radius: 8px; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #2D2D2D; text-transform: uppercase; letter-spacing: 0.5px;">Customer</h3>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">${customerName}</p>
                    <p style="margin: 0; font-size: 14px; color: #4A3728;">${customerEmail}</p>
                  </td>
                </tr>

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 16px; background-color: #FFF9E6; border-radius: 8px; margin: 16px 0;">
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
                          ${item.size || item.ballColor || item.customText ? `<br><span style="font-size: 12px; color: #888;">${item.size ? `Size: ${item.size}` : ''}${item.ballColor ? ` | Ball: ${item.ballColor}` : ''}${item.customText ? ` | Text: "${item.customText}"` : ''}</span>` : ''}
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
                        <td style="padding: 16px 0 0 0; text-align: right; font-size: 24px; font-weight: 700; color: #4A7C59;">$${(total / 100).toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FFF9E6; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
                Big Dill Pickleball Order Notification
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFDF7;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background-color: #D4AF37; text-align: center;">
              <h1 style="margin: 0; color: #2D2D2D; font-size: 24px; font-weight: 700;">New Wholesale Inquiry 👑</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <!-- Business Info -->
                <tr>
                  <td style="padding: 16px; background-color: #FFF9E6; border-radius: 8px; margin-bottom: 16px;">
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
                      <a href="mailto:${email}" style="color: #4A7C59; text-decoration: none;">${email}</a>
                    </p>
                    ${phone ? `<p style="margin: 0; font-size: 14px; color: #4A3728;">${phone}</p>` : ''}
                  </td>
                </tr>

                <!-- Message -->
                ${message ? `
                <tr>
                  <td style="padding: 16px; background-color: #FFF9E6; border-radius: 8px; border-left: 4px solid #D4AF37;">
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
              <a href="mailto:${email}?subject=Big Dill Pickleball Wholesale Pricing for ${encodeURIComponent(businessName)}"
                 style="display: block; text-align: center; background-color: #4A7C59; color: #ffffff; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reply to ${contactName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FFF9E6; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
                Big Dill Pickleball Wholesale Inquiry
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
  trackingUrl?: string
  items: OrderItem[]
}) {
  const { to, orderNumber, customerName, trackingNumber, carrier, trackingUrl: providedTrackingUrl, items } = props

  // Generate tracking URL based on carrier if not provided
  let trackingUrl = providedTrackingUrl || ''
  if (!trackingUrl && trackingNumber) {
    const normalizedCarrier = carrier.toLowerCase()
    if (normalizedCarrier.includes('usps')) {
      trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
    } else if (normalizedCarrier.includes('ups')) {
      trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`
    } else if (normalizedCarrier.includes('fedex')) {
      trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
    }
  }

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped - Big Dill Pickleball</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFDF7;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #4A7C59; border-bottom: 4px solid #D4AF37;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">Your Order Has Shipped! 📦</h1>
              <p style="margin: 0; font-size: 15px; color: #E8F5E9; line-height: 1.5;">Get ready to rule the court, ${customerName}!</p>
            </td>
          </tr>

          <!-- Tracking Info -->
          <tr>
            <td style="padding: 32px;">
              <div style="padding: 24px; background-color: #FFF9E6; border-radius: 12px; border: 2px solid #D4AF37;">
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
                    <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 600; color: #4A7C59; font-family: monospace;">${trackingNumber}</td>
                  </tr>
                </table>
                ${trackingUrl ? `
                <div style="margin-top: 20px; text-align: center;">
                  <a href="${trackingUrl}" style="display: inline-block; background-color: #4A7C59; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Track Your Package</a>
                </div>
                ` : ''}
              </div>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">Items Shipped</h3>
              <div style="padding: 20px; background-color: #FFF9E6; border-radius: 12px;">
                ${items.map((item, index) => `
                <div style="padding: ${index > 0 ? '12px' : '0'} 0 ${index < items.length - 1 ? '12px' : '0'} 0; ${index < items.length - 1 ? 'border-bottom: 1px solid #E5E7EB;' : ''}">
                  <span style="display: inline-block; background-color: #4A7C59; color: #ffffff; font-weight: 600; font-size: 12px; padding: 4px 10px; border-radius: 6px; margin-right: 8px;">${item.quantity}x</span>
                  <span style="font-size: 14px; color: #2D2D2D; font-weight: 500;">${item.name}</span>
                  ${item.size || item.ballColor || item.customText ? `<br><span style="font-size: 12px; color: #888; margin-left: 50px;">${item.size ? `Size: ${item.size}` : ''}${item.ballColor ? ` | Ball: ${item.ballColor}` : ''}${item.customText ? ` | "${item.customText}"` : ''}</span>` : ''}
                </div>
                `).join('')}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: #4A7C59; border-top: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Big Dill Pickleball 👑</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #E8F5E9;">Kind of a Big Dill</p>
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
      subject: `Your Order #${orderNumber} Has Shipped! 📦`,
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

/**
 * Send bulk order notification to admin
 */
export async function sendBulkOrderNotificationEmail(props: {
  name: string
  email: string
  phone?: string
  organization?: string
  quantity: number
  eventDate?: string
  eventType?: string
  customization?: string
  message?: string
}) {
  const { name, email, phone, organization, quantity, eventDate, eventType, customization, message } = props

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Bulk Order Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFDF7;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; background-color: #4A7C59; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Bulk Order Request! 📦</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

                <!-- Order Details -->
                <tr>
                  <td style="padding: 16px; background-color: #FFF9E6; border-radius: 12px; border: 2px solid #D4AF37; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.5px;">Order Details</h3>
                    <p style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #4A7C59;">${quantity} Crowns</p>
                    ${eventDate ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #4A3728;"><strong>Event Date:</strong> ${eventDate}</p>` : ''}
                    ${eventType ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #4A3728;"><strong>Event Type:</strong> ${eventType}</p>` : ''}
                    ${customization ? `<p style="margin: 0; font-size: 14px; color: #4A3728;"><strong>Customization:</strong> ${customization}</p>` : ''}
                  </td>
                </tr>

                <!-- Contact Info -->
                <tr>
                  <td style="padding: 16px 0;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.5px;">Contact Information</h3>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">${name}</p>
                    ${organization ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #4A3728;">${organization}</p>` : ''}
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #4A3728;">
                      <a href="mailto:${email}" style="color: #4A7C59; text-decoration: none;">${email}</a>
                    </p>
                    ${phone ? `<p style="margin: 0; font-size: 14px; color: #4A3728;">${phone}</p>` : ''}
                  </td>
                </tr>

                <!-- Message -->
                ${message ? `
                <tr>
                  <td style="padding: 16px; background-color: #FFF9E6; border-radius: 12px; border-left: 4px solid #4A7C59;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.5px;">Additional Notes</h3>
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
              <a href="mailto:${email}?subject=Big Dill Pickleball - Your Bulk Order Request"
                 style="display: block; text-align: center; background-color: #4A7C59; color: #ffffff; padding: 16px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FFF9E6; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
                Big Dill Pickleball - Bulk Order Request
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
      subject: `Bulk Order: ${quantity} Crowns from ${name}${organization ? ` (${organization})` : ''}`,
      html,
    })

    if (error) {
      console.error('Failed to send bulk order notification:', error)
      return { success: false, error }
    }

    console.log('Bulk order notification sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending bulk order notification:', error)
    return { success: false, error }
  }
}

/**
 * Send bulk order confirmation to customer
 */
export async function sendBulkOrderConfirmationEmail(props: {
  to: string
  name: string
  quantity: number
  eventDate?: string
}) {
  const { to, name, quantity, eventDate } = props

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bulk Order Request Received - Big Dill Pickleball</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFDF7;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #4A7C59; border-bottom: 4px solid #D4AF37;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">Request Received! 👑</h1>
              <p style="margin: 0; font-size: 15px; color: #E8F5E9; line-height: 1.5;">Thanks for your interest in Big Dill Pickleball!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2D2D2D; line-height: 1.6;">
                Hi ${name},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2D2D2D; line-height: 1.6;">
                We've received your bulk order request for <strong>${quantity} pickleball crowns</strong>${eventDate ? ` for your event on ${eventDate}` : ''}.
              </p>

              <div style="padding: 20px; background-color: #FFF9E6; border-radius: 12px; border-left: 4px solid #D4AF37; margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #2D2D2D;">What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4A3728; line-height: 1.8;">
                  <li>Our team will review your request</li>
                  <li>We'll contact you within 24-48 hours</li>
                  <li>We'll discuss customization options and pricing</li>
                  <li>You'll receive a custom quote based on your needs</li>
                </ul>
              </div>

              <p style="margin: 0; font-size: 16px; color: #2D2D2D; line-height: 1.6;">
                If you have any questions in the meantime, feel free to reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: #4A7C59; border-top: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Big Dill Pickleball 👑</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #E8F5E9;">Kind of a Big Dill</p>
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
      subject: `We've Received Your Bulk Order Request! 👑`,
      html,
    })

    if (error) {
      console.error('Failed to send bulk order confirmation:', error)
      return { success: false, error }
    }

    console.log('Bulk order confirmation sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending bulk order confirmation:', error)
    return { success: false, error }
  }
}

/**
 * Send feedback request email to customer
 */
export async function sendFeedbackRequestEmail(props: {
  to: string
  customerName: string
  orderNumber: string
  feedbackToken: string
}) {
  const { to, customerName, orderNumber, feedbackToken } = props

  // Build the feedback URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const feedbackUrl = `${baseUrl}/feedback/${feedbackToken}`

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How was your order? - Big Dill Pickleball</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFFDF7;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFDF7;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 32px; text-align: center; background-color: #4A7C59; border-bottom: 4px solid #D4AF37;">
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">How Was Your Order? ⭐</h1>
              <p style="margin: 0; font-size: 15px; color: #E8F5E9; line-height: 1.5;">We'd love to hear about your experience!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2D2D2D; line-height: 1.6;">
                Hi ${customerName},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2D2D2D; line-height: 1.6;">
                Thanks for your recent order <strong>#${orderNumber}</strong> from Big Dill Pickleball! We hope you're loving your new gear.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2D2D2D; line-height: 1.6;">
                We'd really appreciate it if you could take a minute to share your feedback. It helps us improve and helps other customers make decisions.
              </p>

              <!-- Incentive -->
              <div style="padding: 20px; background-color: #FFF9E6; border-radius: 12px; border: 2px solid #D4AF37; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B6B6B;">As a thank you, you'll receive</p>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #D4AF37;">10% OFF</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #4A3728;">your next order!</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${feedbackUrl}" style="display: inline-block; background-color: #4A7C59; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">Share Your Feedback</a>
              </div>

              <p style="margin: 0; font-size: 14px; color: #6B6B6B; text-align: center;">
                This link expires in 30 days.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: #4A7C59; border-top: 1px solid #E5E7EB;">
              <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #ffffff;">Big Dill Pickleball 👑</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #E8F5E9;">Kind of a Big Dill</p>
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
      subject: `How was your order #${orderNumber}? Share feedback & get 10% off! ⭐`,
      html,
    })

    if (error) {
      console.error('Failed to send feedback request email:', error)
      return { success: false, error }
    }

    console.log('Feedback request email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending feedback request email:', error)
    return { success: false, error }
  }
}
