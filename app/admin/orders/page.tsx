import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Package, ArrowLeft, Search, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Orders | Admin | Big Dill Pickleball',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface OrdersPageProps {
  searchParams: { status?: string; search?: string; page?: string }
}

async function getOrders(status?: string, search?: string, page: number = 1) {
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {}

  if (status && status !== 'ALL') {
    where.status = status
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { shippingName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      skip,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders,
    total,
    pages: Math.ceil(total / pageSize),
  }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { status, search, page } = searchParams
  const currentPage = parseInt(page || '1')
  const { orders, total, pages } = await getOrders(status, search, currentPage)

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
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-charcoal-100 text-charcoal-700',
    PROCESSING: 'bg-gold-100 text-gold-700',
    SHIPPED: 'bg-pickle-100 text-pickle-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-pink-100 text-pink-700',
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-charcoal-900">
                Orders
              </h1>
              <p className="text-charcoal-600 mt-1">
                {total} total order{total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-crown shadow-soft p-4 mb-6">
          <form className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search by order #, email, or name..."
                  className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <select
                  name="status"
                  defaultValue={status || 'ALL'}
                  className="pl-10 pr-8 py-2 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-gold-500 text-charcoal-900 font-medium rounded-crown hover:bg-gold-600 transition-colors"
              >
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-crown shadow-soft overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-charcoal-300 mb-4" />
              <p className="text-charcoal-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-gold-600 hover:text-gold-700"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-charcoal-900">{order.shippingName || 'N/A'}</p>
                        <p className="text-sm text-charcoal-500">{order.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={item.id} className="text-charcoal-600">
                              {item.quantity}x {item.name.substring(0, 30)}
                              {item.name.length > 30 ? '...' : ''}
                              {item.size && (
                                <span className="text-charcoal-400 ml-1">({item.size})</span>
                              )}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-charcoal-400">
                              +{order.items.length - 2} more
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-charcoal-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[order.status] || statusColors.PENDING
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-500">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="px-6 py-4 border-t border-cream-200 flex justify-between items-center">
              <p className="text-sm text-charcoal-600">
                Page {currentPage} of {pages}
              </p>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/admin/orders?page=${currentPage - 1}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                    className="px-4 py-2 text-sm border border-cream-300 rounded-crown hover:bg-cream-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {currentPage < pages && (
                  <Link
                    href={`/admin/orders?page=${currentPage + 1}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                    className="px-4 py-2 text-sm border border-cream-300 rounded-crown hover:bg-cream-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
