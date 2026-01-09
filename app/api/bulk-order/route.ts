import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBulkOrderNotificationEmail, sendBulkOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      phone,
      organization,
      quantity,
      eventDate,
      eventType,
      customization,
      message,
    } = body

    // Validate required fields
    if (!name || !email || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Build message with all details
    const fullMessage = [
      eventDate ? `Event Date: ${eventDate}` : null,
      eventType ? `Event Type: ${eventType}` : null,
      customization ? `Customization: ${customization}` : null,
      message ? `\nAdditional Notes:\n${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    // Save to database as a wholesale inquiry with bulk order type
    const inquiry = await prisma.wholesaleInquiry.create({
      data: {
        businessName: organization || `${name}'s Event`,
        contactName: name,
        email,
        phone: phone || null,
        businessType: `Bulk Order - ${eventType || 'Event'}`,
        estimatedVolume: `${quantity} units`,
        message: fullMessage || null,
        status: 'PENDING',
      },
    })

    // Send notification email to admin
    try {
      await sendBulkOrderNotificationEmail({
        name,
        email,
        phone,
        organization,
        quantity,
        eventDate,
        eventType,
        customization,
        message,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation email to customer
    try {
      await sendBulkOrderConfirmationEmail({
        to: email,
        name,
        quantity,
        eventDate,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    console.log('Bulk order request saved:', {
      id: inquiry.id,
      name,
      email,
      organization,
      quantity,
      eventType,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Bulk order request received successfully',
      inquiryId: inquiry.id,
    })
  } catch (error) {
    console.error('Error processing bulk order request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
