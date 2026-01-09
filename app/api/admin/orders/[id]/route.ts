import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderShippedEmail } from '@/lib/email'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status, trackingNumber, carrier } = body

    // Get the current order to check status change
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status

      if (status === 'SHIPPED') {
        updateData.shippedAt = new Date()
        if (trackingNumber) updateData.trackingNumber = trackingNumber
        if (carrier) updateData.carrier = carrier
      }

      if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date()
      }
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: { items: true },
    })

    // Send shipped email notification when status changes to SHIPPED
    if (status === 'SHIPPED' && currentOrder.status !== 'SHIPPED') {
      try {
        await sendOrderShippedEmail({
          to: order.email,
          orderNumber: order.orderNumber,
          customerName: order.shippingName || 'Customer',
          trackingNumber: trackingNumber || order.trackingNumber || '',
          carrier: carrier || order.carrier || '',
          items: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size || undefined,
            ballColor: item.ballColor || undefined,
            customText: item.customText || undefined,
          })),
        })
        console.log(`Shipped email sent for order ${order.orderNumber}`)
      } catch (emailError) {
        console.error('Failed to send shipped email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
