'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building2, Mail, Phone, Users, Clock, ChevronRight } from 'lucide-react'

interface WholesaleInquiry {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string | null
  businessType: string
  estimatedVolume: string
  message: string | null
  status: string
  reviewedAt: string | null
  notes: string | null
  createdAt: string
}

export default function WholesaleInquiriesPage() {
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchInquiries()
  }, [filter])

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/wholesale?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setInquiries(data.inquiries)
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-gold-100 text-gold-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CONTACTED: 'bg-purple-100 text-purple-700',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CONTACTED: 'Contacted',
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Wholesale Inquiries
              </h1>
              <p className="text-charcoal-600 mt-1">
                Manage wholesale and bulk order requests
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-charcoal-500">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
              >
                <option value="all">All Inquiries</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="CONTACTED">Contacted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-crown shadow-soft p-6 animate-pulse">
                <div className="h-6 bg-cream-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-cream-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-crown shadow-soft p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-charcoal-300 mb-4" />
            <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
              No Inquiries Found
            </h3>
            <p className="text-charcoal-500">
              {filter === 'all'
                ? 'No wholesale inquiries have been submitted yet.'
                : `No inquiries with status "${statusLabels[filter] || filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                href={`/admin/wholesale/${inquiry.id}`}
                className="block bg-white rounded-crown shadow-soft hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-lg font-semibold text-charcoal-900 truncate">
                          {inquiry.businessName}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[inquiry.status] || statusColors.PENDING
                          }`}
                        >
                          {statusLabels[inquiry.status] || inquiry.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-charcoal-600">
                          <Users className="w-4 h-4 text-charcoal-400" />
                          <span className="truncate">{inquiry.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-charcoal-600">
                          <Mail className="w-4 h-4 text-charcoal-400" />
                          <span className="truncate">{inquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-charcoal-600">
                          <Building2 className="w-4 h-4 text-charcoal-400" />
                          <span>{inquiry.businessType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-charcoal-600">
                          <Clock className="w-4 h-4 text-charcoal-400" />
                          <span>{formatDate(inquiry.createdAt)}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-cream-100 rounded text-charcoal-700">
                          Est. Volume: {inquiry.estimatedVolume}
                        </span>
                        {inquiry.phone && (
                          <span className="flex items-center gap-1 text-charcoal-500">
                            <Phone className="w-3.5 h-3.5" />
                            {inquiry.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-charcoal-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
