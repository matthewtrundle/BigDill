import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
