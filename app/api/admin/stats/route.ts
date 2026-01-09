import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date(now)
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Run all queries in parallel for performance
    const [
      // Today's revenue (paid orders only)
      todayRevenue,
      // Yesterday's revenue for comparison
      yesterdayRevenue,
      // Pending orders count
      pendingOrders,
      // Processing orders (ready to ship)
      processingOrders,
      // Total orders last 30 days
      totalOrders30d,
      // Total orders previous 30 days (for trend)
      totalOrdersPrev30d,
      // All-time revenue
      totalRevenue,
      // Total customers
      totalCustomers,
      // Recent orders for dashboard
      recentOrders,
      // Top product by quantity
      topProductData,
      // Pending wholesale inquiries
      pendingInquiries,
    ] = await Promise.all([
      // Today's revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: todayStart },
          paymentStatus: 'SUCCEEDED',
        },
        _sum: { total: true },
      }),
      // Yesterday's revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: yesterdayStart, lt: todayStart },
          paymentStatus: 'SUCCEEDED',
        },
        _sum: { total: true },
      }),
      // Pending orders
      prisma.order.count({ where: { status: 'PENDING' } }),
      // Processing orders
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      // 30-day orders
      prisma.order.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      // Previous 30-day orders
      prisma.order.count({
        where: {
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
      // Total revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'SUCCEEDED' },
        _sum: { total: true },
      }),
      // Total customers
      prisma.customer.count(),
      // Recent orders
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      // Top product - aggregate by SKU
      prisma.orderItem.groupBy({
        by: ['sku', 'name'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 1,
      }),
      // Pending inquiries
      prisma.wholesaleInquiry.count({ where: { status: 'PENDING' } }),
    ])

    // Calculate trends
    const todayRevenueValue = todayRevenue._sum.total || 0
    const yesterdayRevenueValue = yesterdayRevenue._sum.total || 0
    const revenueTrend = yesterdayRevenueValue > 0
      ? ((todayRevenueValue - yesterdayRevenueValue) / yesterdayRevenueValue) * 100
      : todayRevenueValue > 0 ? 100 : 0

    const ordersTrend = totalOrdersPrev30d > 0
      ? ((totalOrders30d - totalOrdersPrev30d) / totalOrdersPrev30d) * 100
      : totalOrders30d > 0 ? 100 : 0

    // Calculate average order value
    const avgOrderValue = totalOrders30d > 0
      ? Math.round((totalRevenue._sum.total || 0) / totalOrders30d)
      : 0

    // Get top product
    const topProduct = topProductData.length > 0
      ? {
          name: topProductData[0].name,
          sku: topProductData[0].sku,
          quantity: topProductData[0]._sum.quantity || 0,
        }
      : null

    return NextResponse.json({
      todayRevenue: todayRevenueValue,
      yesterdayRevenue: yesterdayRevenueValue,
      revenueTrend: Math.round(revenueTrend),
      pendingOrders,
      processingOrders,
      totalOrders30d,
      ordersTrend: Math.round(ordersTrend),
      totalRevenue: totalRevenue._sum.total || 0,
      avgOrderValue,
      totalCustomers,
      topProduct,
      recentOrders,
      pendingInquiries,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
