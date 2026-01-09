import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Generate a random coupon code
function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DILL'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET - Fetch feedback by token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Token is required' },
      { status: 400 }
    )
  }

  try {
    const feedback = await prisma.customerFeedback.findUnique({
      where: { feedbackToken: token },
    })

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (new Date() > feedback.expiresAt) {
      return NextResponse.json(
        { error: 'This feedback link has expired' },
        { status: 410 }
      )
    }

    // Check if already submitted
    if (feedback.submittedAt) {
      return NextResponse.json({
        feedback: {
          orderNumber: feedback.orderNumber,
          customerName: feedback.customerName,
          rating: feedback.rating,
          comment: feedback.comment,
          couponCode: feedback.couponCode,
          alreadySubmitted: true,
        },
      })
    }

    return NextResponse.json({
      feedback: {
        orderNumber: feedback.orderNumber,
        customerName: feedback.customerName,
        alreadySubmitted: false,
      },
    })
  } catch (error) {
    console.error('Failed to fetch feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

// POST - Submit feedback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, rating, comment } = body

    if (!token || !rating) {
      return NextResponse.json(
        { error: 'Token and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Find the feedback record
    const feedback = await prisma.customerFeedback.findUnique({
      where: { feedbackToken: token },
    })

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (new Date() > feedback.expiresAt) {
      return NextResponse.json(
        { error: 'This feedback link has expired' },
        { status: 410 }
      )
    }

    // Check if already submitted
    if (feedback.submittedAt) {
      return NextResponse.json(
        { error: 'Feedback has already been submitted' },
        { status: 400 }
      )
    }

    // Generate a unique coupon code
    let couponCode = generateCouponCode()
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.customerFeedback.findUnique({
        where: { couponCode },
      })
      if (!existing) break
      couponCode = generateCouponCode()
      attempts++
    }

    // Update the feedback with rating and coupon
    const updatedFeedback = await prisma.customerFeedback.update({
      where: { id: feedback.id },
      data: {
        rating,
        comment: comment || null,
        submittedAt: new Date(),
        couponCode,
      },
    })

    return NextResponse.json({
      success: true,
      couponCode: updatedFeedback.couponCode,
      message: 'Thank you for your feedback! Here is your 10% off coupon.',
    })
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
