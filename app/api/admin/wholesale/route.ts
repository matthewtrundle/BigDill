import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { InquiryStatus, Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: Prisma.WholesaleInquiryWhereInput =
      status && status !== 'all' ? { status: status as InquiryStatus } : {}

    const inquiries = await prisma.wholesaleInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Failed to fetch wholesale inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}
