import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendFeedbackRequestEmail } from '@/lib/email'

// POST - Create feedback request and send email
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if feedback already exists for this order
    const existingFeedback = await prisma.customerFeedback.findUnique({
      where: { orderId: order.id },
    })

    if (existingFeedback) {
      // If feedback already exists and email was sent, don't send again
      if (existingFeedback.emailSentAt) {
        return NextResponse.json(
          { error: 'Feedback request already sent for this order' },
          { status: 400 }
        )
      }

      // If feedback exists but email not sent, send it now
      await sendFeedbackRequestEmail({
        to: order.email,
        customerName: order.shippingName || 'Customer',
        orderNumber: order.orderNumber,
        feedbackToken: existingFeedback.feedbackToken,
      })

      // Update emailSentAt
      await prisma.customerFeedback.update({
        where: { id: existingFeedback.id },
        data: { emailSentAt: new Date() },
      })

      return NextResponse.json({
        success: true,
        message: 'Feedback request email sent',
        feedbackId: existingFeedback.id,
      })
    }

    // Create new feedback request with 30-day expiration
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const feedback = await prisma.customerFeedback.create({
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        email: order.email,
        customerName: order.shippingName || 'Customer',
        expiresAt,
        emailSentAt: new Date(),
      },
    })

    // Send the feedback request email
    await sendFeedbackRequestEmail({
      to: order.email,
      customerName: order.shippingName || 'Customer',
      orderNumber: order.orderNumber,
      feedbackToken: feedback.feedbackToken,
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback request created and email sent',
      feedbackId: feedback.id,
    })
  } catch (error) {
    console.error('Failed to create feedback request:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback request' },
      { status: 500 }
    )
  }
}

// GET - Check feedback status for an order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const feedback = await prisma.customerFeedback.findUnique({
      where: { orderId: id },
    })

    if (!feedback) {
      return NextResponse.json({ feedback: null })
    }

    return NextResponse.json({
      feedback: {
        id: feedback.id,
        rating: feedback.rating,
        comment: feedback.comment,
        emailSentAt: feedback.emailSentAt,
        submittedAt: feedback.submittedAt,
        couponCode: feedback.couponCode,
        couponUsed: feedback.couponUsed,
        expiresAt: feedback.expiresAt,
      },
    })
  } catch (error) {
    console.error('Failed to get feedback status:', error)
    return NextResponse.json(
      { error: 'Failed to get feedback status' },
      { status: 500 }
    )
  }
}
