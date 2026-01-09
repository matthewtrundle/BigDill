'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Crown, Medal, Trash2, Edit2, Check, Users, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { products, crownSizes, ballColors, formatPrice, CrownSize, BallColor, CartItemOptions } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { TierProgress, TierBadge, getDiscountTier } from './TierProgress'

// Individual team item configuration
export interface TeamItem {
  id: string
  sku: 'CROWN-1' | 'MEDAL-1'
  size: CrownSize
  color: BallColor
  customText: string
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

interface TeamBuilderProps {
  isOpen: boolean
  onClose: () => void
}

export function TeamBuilder({ isOpen, onClose }: TeamBuilderProps) {
  const [items, setItems] = useState<TeamItem[]>([])
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New item form state
  const [newItem, setNewItem] = useState<Omit<TeamItem, 'id'>>({
    sku: 'CROWN-1',
    size: 'medium',
    color: 'green',
    customText: '',
  })

  const { addItem } = useCart()

  // Calculate totals
  const totalItems = items.length
  const tier = getDiscountTier(totalItems)

  const calculateTotal = () => {
    let total = 0
    items.forEach(item => {
      const product = products.find(p => p.sku === item.sku)
      if (product) {
        total += product.price
      }
    })
    return total
  }

  const originalTotal = calculateTotal()
  const discountedTotal = Math.round(originalTotal * (1 - tier.discount))
  const savings = originalTotal - discountedTotal

  // Average unit price for tier progress
  const averagePrice = items.length > 0
    ? Math.round(originalTotal / items.length)
    : products[0].price

  const handleAddItem = () => {
    const item: TeamItem = {
      id: generateId(),
      ...newItem,
    }
    setItems(prev => [...prev, item])
    setIsAddingNew(false)
    // Reset for next add
    setNewItem({
      sku: 'CROWN-1',
      size: 'medium',
      color: 'green',
      customText: '',
    })
  }

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handleUpdateItem = (id: string, updates: Partial<TeamItem>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const handleAddAllToCart = async () => {
    if (items.length === 0) return

    setIsSubmitting(true)

    // Add each item to cart as separate line items
    items.forEach(item => {
      const options: CartItemOptions = {
        size: item.size,
        ballColor: item.color,
        customText: item.customText || undefined,
      }
      addItem(item.sku, options, 1)
    })

    // Clear the builder and close
    setTimeout(() => {
      setItems([])
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  const currentProduct = products.find(p => p.sku === newItem.sku)!

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-cream-100 rounded-organic-lg shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-100 rounded-organic flex items-center justify-center">
                  <Users className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl tracking-wide text-charcoal-900">
                    TEAM ORDER BUILDER
                  </h2>
                  <p className="text-sm text-charcoal-500">
                    Customize each item individually
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100 rounded-organic transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left: Items List */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-cream-400" />
                    </div>
                    <h3 className="font-heading font-semibold text-charcoal-700 mb-2">
                      No items yet
                    </h3>
                    <p className="text-charcoal-500 text-sm mb-4">
                      Add crowns or medals to start building your team order
                    </p>
                    <Button variant="primary" onClick={() => setIsAddingNew(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item, index) => {
                      const product = products.find(p => p.sku === item.sku)!
                      const isEditing = editingItem === item.id

                      return (
                        <div
                          key={item.id}
                          className={`bg-white rounded-organic p-4 shadow-soft transition-all ${
                            isEditing ? 'ring-2 ring-gold-400' : ''
                          }`}
                        >
                          {isEditing ? (
                            // Edit mode
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-charcoal-500">
                                  Item #{index + 1}
                                </span>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                                >
                                  Done
                                </button>
                              </div>

                              {/* Product Selection */}
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleUpdateItem(item.id, { sku: 'CROWN-1' })}
                                  className={`p-2 rounded-organic border-2 text-sm transition-all ${
                                    item.sku === 'CROWN-1'
                                      ? 'border-gold-500 bg-gold-50'
                                      : 'border-cream-300 hover:border-gold-300'
                                  }`}
                                >
                                  <Crown className="w-4 h-4 mx-auto mb-1" />
                                  Crown
                                </button>
                                <button
                                  onClick={() => handleUpdateItem(item.id, { sku: 'MEDAL-1' })}
                                  className={`p-2 rounded-organic border-2 text-sm transition-all ${
                                    item.sku === 'MEDAL-1'
                                      ? 'border-gold-500 bg-gold-50'
                                      : 'border-cream-300 hover:border-gold-300'
                                  }`}
                                >
                                  <Medal className="w-4 h-4 mx-auto mb-1" />
                                  Medal
                                </button>
                              </div>

                              {/* Size (crowns only) */}
                              {item.sku === 'CROWN-1' && (
                                <div className="grid grid-cols-4 gap-1">
                                  {crownSizes.map(size => (
                                    <button
                                      key={size.id}
                                      onClick={() => handleUpdateItem(item.id, { size: size.id })}
                                      className={`p-1.5 rounded text-xs transition-all ${
                                        item.size === size.id
                                          ? 'bg-gold-500 text-charcoal-900'
                                          : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                                      }`}
                                    >
                                      {size.name}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Color */}
                              <div className="flex gap-2">
                                {ballColors.map(color => (
                                  <button
                                    key={color.id}
                                    onClick={() => handleUpdateItem(item.id, { color: color.id })}
                                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                                      item.color === color.id
                                        ? 'bg-gold-500 text-charcoal-900'
                                        : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                                    }`}
                                  >
                                    <span
                                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    {color.name}
                                  </button>
                                ))}
                              </div>

                              {/* Custom Text */}
                              <input
                                type="text"
                                value={item.customText}
                                onChange={(e) => handleUpdateItem(item.id, { customText: e.target.value.slice(0, product.maxTextLength) })}
                                placeholder="Custom text (optional)"
                                className="w-full px-3 py-2 rounded-organic border border-cream-300 text-sm focus:border-gold-500 focus:outline-none"
                                maxLength={product.maxTextLength}
                              />
                            </div>
                          ) : (
                            // Display mode
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-charcoal-400">#{index + 1}</span>
                                  <span className="font-medium text-charcoal-900 text-sm">
                                    {product.name}
                                  </span>
                                </div>
                                <p className="text-xs text-charcoal-500 truncate">
                                  {item.sku === 'CROWN-1' && `${crownSizes.find(s => s.id === item.size)?.name} • `}
                                  {ballColors.find(c => c.id === item.color)?.name}
                                  {item.customText && ` • "${item.customText}"`}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setEditingItem(item.id)}
                                  className="p-1.5 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-sm font-semibold text-charcoal-700">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Add New Item */}
                    {isAddingNew ? (
                      <div className="bg-gold-50 rounded-organic p-4 border-2 border-gold-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gold-700">New Item</span>
                          <button
                            onClick={() => setIsAddingNew(false)}
                            className="text-sm text-charcoal-500 hover:text-charcoal-700"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Product Selection */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <button
                            onClick={() => setNewItem(prev => ({ ...prev, sku: 'CROWN-1' }))}
                            className={`p-3 rounded-organic border-2 transition-all ${
                              newItem.sku === 'CROWN-1'
                                ? 'border-gold-500 bg-white'
                                : 'border-cream-300 bg-white hover:border-gold-300'
                            }`}
                          >
                            <Crown className="w-5 h-5 mx-auto mb-1 text-gold-600" />
                            <span className="text-sm font-medium">Crown</span>
                            <span className="block text-xs text-charcoal-500">$19.99</span>
                          </button>
                          <button
                            onClick={() => setNewItem(prev => ({ ...prev, sku: 'MEDAL-1' }))}
                            className={`p-3 rounded-organic border-2 transition-all ${
                              newItem.sku === 'MEDAL-1'
                                ? 'border-gold-500 bg-white'
                                : 'border-cream-300 bg-white hover:border-gold-300'
                            }`}
                          >
                            <Medal className="w-5 h-5 mx-auto mb-1 text-gold-600" />
                            <span className="text-sm font-medium">Medal</span>
                            <span className="block text-xs text-charcoal-500">$9.99</span>
                          </button>
                        </div>

                        {/* Size (crowns only) */}
                        {newItem.sku === 'CROWN-1' && (
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-charcoal-600 mb-1">Size</label>
                            <div className="grid grid-cols-4 gap-1">
                              {crownSizes.map(size => (
                                <button
                                  key={size.id}
                                  onClick={() => setNewItem(prev => ({ ...prev, size: size.id }))}
                                  className={`p-2 rounded text-xs transition-all ${
                                    newItem.size === size.id
                                      ? 'bg-gold-500 text-charcoal-900 font-semibold'
                                      : 'bg-white text-charcoal-600 hover:bg-cream-100'
                                  }`}
                                >
                                  {size.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Color */}
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-charcoal-600 mb-1">Color</label>
                          <div className="flex gap-2">
                            {ballColors.map(color => (
                              <button
                                key={color.id}
                                onClick={() => setNewItem(prev => ({ ...prev, color: color.id }))}
                                className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                                  newItem.color === color.id
                                    ? 'bg-gold-500 text-charcoal-900'
                                    : 'bg-white text-charcoal-600 hover:bg-cream-100'
                                }`}
                              >
                                <span
                                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                                  style={{ backgroundColor: color.hex }}
                                />
                                {color.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Text */}
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-charcoal-600 mb-1">
                            Custom Text (optional)
                          </label>
                          <input
                            type="text"
                            value={newItem.customText}
                            onChange={(e) => setNewItem(prev => ({ ...prev, customText: e.target.value.slice(0, currentProduct.maxTextLength) }))}
                            placeholder="e.g., Player name, team name"
                            className="w-full px-3 py-2 rounded-organic border border-cream-300 text-sm focus:border-gold-500 focus:outline-none bg-white"
                            maxLength={currentProduct.maxTextLength}
                          />
                          <p className="text-xs text-charcoal-400 mt-1">
                            {newItem.customText.length}/{currentProduct.maxTextLength}
                          </p>
                        </div>

                        <Button variant="primary" className="w-full" onClick={handleAddItem}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Order
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingNew(true)}
                        className="w-full p-4 border-2 border-dashed border-cream-300 rounded-organic text-charcoal-500 hover:border-gold-400 hover:text-gold-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Another Item
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Summary Panel */}
              <div className="w-80 bg-white border-l border-cream-300 p-6 flex flex-col">
                <h3 className="font-display text-lg tracking-wide text-charcoal-900 mb-4">
                  ORDER SUMMARY
                </h3>

                {/* Tier Progress */}
                {items.length > 0 && (
                  <TierProgress
                    quantity={totalItems}
                    unitPrice={averagePrice}
                    className="mb-4"
                  />
                )}

                {/* Items Summary */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-2 mb-4">
                    {items.length === 0 ? (
                      <p className="text-sm text-charcoal-400 text-center py-4">
                        No items added yet
                      </p>
                    ) : (
                      items.map((item, i) => {
                        const product = products.find(p => p.sku === item.sku)!
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-charcoal-600 truncate max-w-[180px]">
                              #{i + 1} {product.name.split(' ')[1]}
                              {item.customText && ` - ${item.customText}`}
                            </span>
                            <span className="text-charcoal-900">{formatPrice(product.price)}</span>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* Totals */}
                {items.length > 0 && (
                  <div className="border-t border-cream-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-600">Subtotal ({totalItems} items)</span>
                      <span className="text-charcoal-600 line-through">{formatPrice(originalTotal)}</span>
                    </div>
                    {tier.discount > 0 && (
                      <div className="flex justify-between text-sm text-pickle-600">
                        <span>Bulk Discount ({tier.label})</span>
                        <span>-{formatPrice(savings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-cream-200">
                      <span className="font-bold text-charcoal-900">Total</span>
                      <span className="font-display text-xl font-bold text-charcoal-900">
                        {formatPrice(discountedTotal)}
                      </span>
                    </div>
                    {tier.discount > 0 && (
                      <p className="text-center text-sm text-pickle-600 font-medium">
                        You save {formatPrice(savings)}!
                      </p>
                    )}
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  onClick={handleAddAllToCart}
                  disabled={items.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add All to Cart
                    </>
                  )}
                </Button>

                {items.length < 5 && items.length > 0 && (
                  <p className="text-xs text-center text-gold-600 mt-2">
                    Add {5 - items.length} more for 10% bulk discount!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
