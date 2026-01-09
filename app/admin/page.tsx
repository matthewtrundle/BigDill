import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Package, DollarSign, Users, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Big Dill Pickleball',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getStats() {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    totalRevenue,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.customer.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ])

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalCustomers,
    recentOrders,
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-charcoal-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-charcoal-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-pickle-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-pickle-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Total Customers</p>
                <p className="text-3xl font-bold text-charcoal-900">{stats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-crown p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-600 text-sm">Needs Action</p>
                <p className="text-3xl font-bold text-charcoal-900">
                  {stats.pendingOrders + stats.processingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold-600" />
              </div>
            </div>
            <p className="text-xs text-charcoal-500 mt-2">
              {stats.pendingOrders} pending, {stats.processingOrders} processing
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-crown shadow-soft overflow-hidden">
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
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-charcoal-600">
                          {order.shippingName || order.email}
                        </p>
                        <p className="text-xs text-charcoal-500 mt-1">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-charcoal-900">
                          {formatPrice(order.total)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                            order.status === 'PROCESSING'
                              ? 'bg-gold-100 text-gold-700'
                              : order.status === 'SHIPPED'
                              ? 'bg-pickle-100 text-pickle-700'
                              : order.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-charcoal-100 text-charcoal-700'
                          }`}
                        >
                          {order.status}
                        </span>
                        <p className="text-xs text-charcoal-500 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
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
                Quick Links
              </h2>
            </div>
            <div className="p-6 space-y-4">
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
                className="flex items-center justify-between p-4 bg-cream-50 rounded-crown hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gold-600" />
                  <span className="font-medium text-charcoal-900">
                    Orders to Ship ({stats.processingOrders})
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-charcoal-400" />
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-between p-4 bg-cream-50 rounded-crown hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-pickle-600" />
                  <span className="font-medium text-charcoal-900">View Shop</span>
                </div>
                <ArrowRight className="w-5 h-5 text-charcoal-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
