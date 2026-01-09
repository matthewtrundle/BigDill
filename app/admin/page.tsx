import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  Package,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Truck,
  Clock,
  ShoppingBag,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Big Dill Pickleball',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getStats() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sixtyDaysAgo = new Date(now)
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const [
    todayRevenue,
    yesterdayRevenue,
    pendingOrders,
    processingOrders,
    totalOrders30d,
    totalOrdersPrev30d,
    totalRevenue,
    totalCustomers,
    recentOrders,
    topProductData,
    pendingInquiries,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart },
        paymentStatus: 'SUCCEEDED',
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: yesterdayStart, lt: todayStart },
        paymentStatus: 'SUCCEEDED',
      },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: 'SUCCEEDED' },
      _sum: { total: true },
    }),
    prisma.customer.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.orderItem.groupBy({
      by: ['sku', 'name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1,
    }),
    prisma.wholesaleInquiry.count({ where: { status: 'PENDING' } }),
  ])

  const todayRevenueValue = todayRevenue._sum.total || 0
  const yesterdayRevenueValue = yesterdayRevenue._sum.total || 0
  const revenueTrend = yesterdayRevenueValue > 0
    ? Math.round(((todayRevenueValue - yesterdayRevenueValue) / yesterdayRevenueValue) * 100)
    : todayRevenueValue > 0 ? 100 : 0

  const ordersTrend = totalOrdersPrev30d > 0
    ? Math.round(((totalOrders30d - totalOrdersPrev30d) / totalOrdersPrev30d) * 100)
    : totalOrders30d > 0 ? 100 : 0

  const avgOrderValue = totalOrders30d > 0
    ? Math.round((totalRevenue._sum.total || 0) / totalOrders30d)
    : 0

  return {
    todayRevenue: todayRevenueValue,
    yesterdayRevenue: yesterdayRevenueValue,
    revenueTrend,
    pendingOrders,
    processingOrders,
    totalOrders30d,
    ordersTrend,
    totalRevenue: totalRevenue._sum.total || 0,
    avgOrderValue,
    totalCustomers,
    recentOrders,
    topProduct: topProductData.length > 0 ? {
      name: topProductData[0].name,
      quantity: topProductData[0]._sum.quantity || 0,
    } : null,
    pendingInquiries,
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'PROCESSING':
        return 'bg-gold-100 text-gold-700'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700'
      case 'DELIVERED':
        return 'bg-pickle-100 text-pickle-700'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-charcoal-100 text-charcoal-700'
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            Admin Dashboard
          </h1>
          <p className="text-charcoal-600 mt-1">
            Manage orders and view store performance
          </p>
        </div>

        {/* Alert Banners */}
        {(stats.pendingOrders > 0 || stats.processingOrders > 0 || stats.pendingInquiries > 0) && (
          <div className="mb-6 space-y-3">
            {stats.processingOrders > 0 && (
              <div className="flex items-center gap-3 p-4 bg-gold-50 border border-gold-200 rounded-crown">
                <Truck className="w-5 h-5 text-gold-600" />
                <span className="text-gold-800 font-medium">
                  {stats.processingOrders} order{stats.processingOrders !== 1 ? 's' : ''} ready to ship
                </span>
                <Link
                  href="/admin/orders?status=PROCESSING"
                  className="ml-auto text-gold-700 hover:text-gold-800 font-medium text-sm flex items-center gap-1"
                >
                  View Orders <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
            {stats.pendingInquiries > 0 && (
              <div className="flex items-center gap-3 p-4 bg-pickle-50 border border-pickle-200 rounded-crown">
                <AlertCircle className="w-5 h-5 text-pickle-600" />
                <span className="text-pickle-800 font-medium">
                  {stats.pendingInquiries} wholesale inquir{stats.pendingInquiries !== 1 ? 'ies' : 'y'} pending
                </span>
                <Link
                  href="/admin/wholesale"
                  className="ml-auto text-pickle-700 hover:text-pickle-800 font-medium text-sm flex items-center gap-1"
                >
                  Review <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Revenue */}
          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Today's Revenue</p>
                <p className="text-3xl font-bold text-charcoal-900">
                  {formatPrice(stats.todayRevenue)}
                </p>
                {stats.revenueTrend !== 0 && (
                  <div className={`flex items-center gap-1 mt-1 text-sm ${
                    stats.revenueTrend > 0 ? 'text-pickle-600' : 'text-red-600'
                  }`}>
                    {stats.revenueTrend > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stats.revenueTrend)}% vs yesterday</span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-pickle-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-pickle-600" />
              </div>
            </div>
          </div>

          {/* Orders to Ship */}
          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Ready to Ship</p>
                <p className="text-3xl font-bold text-charcoal-900">{stats.processingOrders}</p>
                <p className="text-xs text-charcoal-500 mt-1">
                  {stats.pendingOrders} pending payment
                </p>
              </div>
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </div>

          {/* 30-Day Orders */}
          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Orders (30 days)</p>
                <p className="text-3xl font-bold text-charcoal-900">{stats.totalOrders30d}</p>
                {stats.ordersTrend !== 0 && (
                  <div className={`flex items-center gap-1 mt-1 text-sm ${
                    stats.ordersTrend > 0 ? 'text-pickle-600' : 'text-red-600'
                  }`}>
                    {stats.ordersTrend > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stats.ordersTrend)}% vs prev 30d</span>
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Avg Order Value</p>
                <p className="text-3xl font-bold text-charcoal-900">
                  {formatPrice(stats.avgOrderValue)}
                </p>
                {stats.topProduct && (
                  <p className="text-xs text-charcoal-500 mt-1 truncate">
                    Top: {stats.topProduct.name}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-charcoal-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-charcoal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders - 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-crown shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-cream-200 flex justify-between items-center">
              <h2 className="font-display text-lg font-semibold text-charcoal-900">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-gold-600 hover:text-gold-700 text-sm font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-cream-100">
              {stats.recentOrders.length === 0 ? (
                <p className="px-6 py-8 text-center text-charcoal-500">
                  No orders yet
                </p>
              ) : (
                stats.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block px-6 py-4 hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-medium text-charcoal-900">
                            {order.orderNumber}
                          </p>
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal-600 truncate">
                          {order.shippingName || order.email}
                        </p>
                        <p className="text-xs text-charcoal-500 mt-1">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-charcoal-900">
                          {formatPrice(order.total)}
                        </p>
                        {order.status === 'PROCESSING' && (
                          <span className="text-xs text-gold-600 font-medium">
                            Ship now →
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-crown shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-cream-200">
              <h2 className="font-display text-lg font-semibold text-charcoal-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-4 bg-cream-50 rounded-crown hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gold-600" />
                  <span className="font-medium text-charcoal-900">All Orders</span>
                </div>
                <ArrowRight className="w-5 h-5 text-charcoal-400" />
              </Link>

              <Link
                href="/admin/orders?status=PROCESSING"
                className="flex items-center justify-between p-4 bg-gold-50 rounded-crown hover:bg-gold-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gold-600" />
                  <div>
                    <span className="font-medium text-charcoal-900">Ship Orders</span>
                    {stats.processingOrders > 0 && (
                      <span className="ml-2 bg-gold-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {stats.processingOrders}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-charcoal-400" />
              </Link>

              <Link
                href="/admin/wholesale"
                className="flex items-center justify-between p-4 bg-cream-50 rounded-crown hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-pickle-600" />
                  <div>
                    <span className="font-medium text-charcoal-900">Wholesale</span>
                    {stats.pendingInquiries > 0 && (
                      <span className="ml-2 bg-pickle-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {stats.pendingInquiries}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-charcoal-400" />
              </Link>

              <Link
                href="/shop"
                className="flex items-center justify-between p-4 bg-cream-50 rounded-crown hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-charcoal-600" />
                  <span className="font-medium text-charcoal-900">View Shop</span>
                </div>
                <ArrowRight className="w-5 h-5 text-charcoal-400" />
              </Link>
            </div>

            {/* Summary Stats */}
            <div className="px-6 py-4 border-t border-cream-200 bg-cream-50">
              <h3 className="text-sm font-semibold text-charcoal-900 mb-3">All Time</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-600">Total Revenue</span>
                  <span className="font-semibold text-charcoal-900">{formatPrice(stats.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-600">Customers</span>
                  <span className="font-semibold text-charcoal-900">{stats.totalCustomers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
