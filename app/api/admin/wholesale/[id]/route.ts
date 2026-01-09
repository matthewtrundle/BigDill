import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await prisma.wholesaleInquiry.findUnique({
      where: { id: params.id },
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Failed to fetch inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { status, notes } = body

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status
      // Track review timestamp when status changes from PENDING
      if (status !== 'PENDING') {
        updateData.reviewedAt = new Date()
        updateData.reviewedBy = 'admin' // Could be expanded with proper auth
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const inquiry = await prisma.wholesaleInquiry.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ inquiry })
  } catch (error) {
    console.error('Failed to update inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.wholesaleInquiry.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    )
  }
}
