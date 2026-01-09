import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWholesaleInquiryEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessName, contactName, email, phone, businessType, estimatedVolume, message } = body

    // Validate required fields
    if (!businessName || !contactName || !email || !businessType || !estimatedVolume) {
      return NextResponse.json(
        { error: 'Business name, contact name, email, business type, and estimated volume are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Save inquiry to database
    const inquiry = await prisma.wholesaleInquiry.create({
      data: {
        businessName,
        contactName,
        email,
        phone: phone || null,
        businessType,
        estimatedVolume,
        message: message || null,
        status: 'PENDING',
      },
    })

    // Send the wholesale inquiry email to admins
    const result = await sendWholesaleInquiryEmail({
      businessName,
      contactName,
      email,
      phone: phone || '',
      businessType,
      estimatedVolume,
      message: message || '',
    })

    if (!result.success) {
      console.error('Failed to send wholesale inquiry email:', result.error)
      // Don't fail the request - inquiry is saved, just email failed
    }

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: 'Your wholesale inquiry has been submitted. We\'ll get back to you within 1-2 business days.',
    })
  } catch (error) {
    console.error('Wholesale inquiry error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve inquiries (admin use)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const email = searchParams.get('email')

    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }
    if (email) {
      where.email = email
    }

    const inquiries = await prisma.wholesaleInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Error fetching wholesale inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
