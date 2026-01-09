'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Mail, Phone, Users, Clock, MessageSquare, Trash2 } from 'lucide-react'

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
  reviewedBy: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function WholesaleInquiryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [inquiry, setInquiry] = useState<WholesaleInquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchInquiry()
  }, [params.id])

  const fetchInquiry = async () => {
    try {
      const res = await fetch(`/api/admin/wholesale/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setInquiry(data.inquiry)
        setNotes(data.inquiry.notes || '')
      }
    } catch (error) {
      console.error('Failed to fetch inquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!inquiry) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/wholesale/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await fetchInquiry()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const saveNotes = async () => {
    if (!inquiry) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/wholesale/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        await fetchInquiry()
      }
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteInquiry = async () => {
    if (!inquiry) return
    try {
      const res = await fetch(`/api/admin/wholesale/${inquiry.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/wholesale')
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-gold-100 text-gold-700 border-gold-200',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
    APPROVED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    CONTACTED: 'bg-purple-100 text-purple-700 border-purple-200',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CONTACTED: 'Contacted',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-cream-300 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-cream-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="w-16 h-16 mx-auto text-charcoal-300 mb-4" />
          <p className="text-charcoal-500">Inquiry not found</p>
          <Link href="/admin/wholesale" className="text-gold-600 hover:text-gold-700 mt-4 inline-block">
            Back to Inquiries
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/wholesale"
            className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inquiries
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-charcoal-900">
                {inquiry.businessName}
              </h1>
              <p className="text-charcoal-600 mt-1">
                Submitted on {formatDate(inquiry.createdAt)}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full font-medium border ${
                statusColors[inquiry.status] || statusColors.PENDING
              }`}
            >
              {statusLabels[inquiry.status] || inquiry.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Details */}
            <div className="bg-white rounded-crown shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-cream-200">
                <h2 className="font-display text-lg font-semibold text-charcoal-900">
                  Business Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-charcoal-500 mb-1">Business Type</p>
                    <p className="font-medium text-charcoal-900">{inquiry.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-500 mb-1">Estimated Volume</p>
                    <p className="font-medium text-charcoal-900">{inquiry.estimatedVolume}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            {inquiry.message && (
              <div className="bg-white rounded-crown shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-cream-200">
                  <h2 className="font-display text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-charcoal-400" />
                    Message
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-charcoal-700 whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div className="bg-white rounded-crown shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-cream-200">
                <h2 className="font-display text-lg font-semibold text-charcoal-900">
                  Internal Notes
                </h2>
              </div>
              <div className="p-6">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-cream-300 rounded-crown focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                  placeholder="Add internal notes about this inquiry..."
                />
                <button
                  onClick={saveNotes}
                  disabled={updating || notes === (inquiry.notes || '')}
                  className="mt-3 px-4 py-2 bg-charcoal-900 text-white rounded-crown hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-crown shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-cream-200">
                <h2 className="font-display text-lg font-semibold text-charcoal-900">
                  Update Status
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => updateStatus(value)}
                      disabled={updating || inquiry.status === value}
                      className={`px-4 py-2 rounded-crown font-medium border transition-colors ${
                        inquiry.status === value
                          ? statusColors[value]
                          : 'bg-white border-cream-300 text-charcoal-700 hover:border-charcoal-400'
                      } disabled:cursor-not-allowed`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {inquiry.reviewedAt && (
                  <p className="mt-4 text-sm text-charcoal-500">
                    Last reviewed: {formatDate(inquiry.reviewedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-crown shadow-soft p-6">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-charcoal-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-charcoal-500">Contact Name</p>
                    <p className="font-medium text-charcoal-900">{inquiry.contactName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-charcoal-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-charcoal-500">Email</p>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="font-medium text-gold-600 hover:text-gold-700"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                </div>
                {inquiry.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-charcoal-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-charcoal-500">Phone</p>
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="font-medium text-charcoal-900"
                      >
                        {inquiry.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-crown shadow-soft p-6">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <a
                  href={`mailto:${inquiry.email}?subject=Big Dill Pickleball Wholesale Inquiry - ${inquiry.businessName}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-pickle-500 text-white font-medium rounded-crown hover:bg-pickle-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-charcoal-900 text-white font-medium rounded-crown hover:bg-charcoal-800 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Contact
                  </a>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-crown shadow-soft p-6 border border-red-200">
              <h2 className="font-display text-lg font-semibold text-red-700 mb-4">
                Danger Zone
              </h2>
              {showDeleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm text-charcoal-600">
                    Are you sure you want to delete this inquiry? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={deleteInquiry}
                      className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-crown hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-charcoal-100 text-charcoal-700 font-medium rounded-crown hover:bg-charcoal-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-red-300 text-red-600 font-medium rounded-crown hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Inquiry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
