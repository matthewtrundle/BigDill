'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Product,
  CrownSize,
  BallColor,
  crownSizes,
  ballColors,
  formatPrice,
  CartItemOptions
} from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { Crown, Check, ShoppingCart, ChevronDown, ChevronUp, Trash2, Users } from 'lucide-react'

interface ProductCustomizerProps {
  product: Product
}

interface ItemConfig {
  id: string
  size: CrownSize
  color: BallColor
  customText: string
}

export function ProductCustomizer({ product }: ProductCustomizerProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // For quantity = 1, use simple state
  const [singleSize, setSingleSize] = useState<CrownSize>('medium')
  const [singleColor, setSingleColor] = useState<BallColor>('green')
  const [singleText, setSingleText] = useState('')

  // For quantity > 1, use array of configurations
  const [items, setItems] = useState<ItemConfig[]>([])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const { addItem } = useCart()

  // Initialize items when quantity changes
  const handleQuantityChange = (newQty: number) => {
    const clampedQty = Math.max(1, Math.min(10, newQty))
    setQuantity(clampedQty)

    if (clampedQty > 1) {
      // Initialize or adjust items array
      const newItems: ItemConfig[] = []
      for (let i = 0; i < clampedQty; i++) {
        if (items[i]) {
          newItems.push(items[i])
        } else {
          newItems.push({
            id: `item-${Date.now()}-${i}`,
            size: 'medium',
            color: 'green',
            customText: ''
          })
        }
      }
      setItems(newItems)
      // Auto-expand first item if none expanded
      if (!expandedItem && newItems.length > 0) {
        setExpandedItem(newItems[0].id)
      }
    }
  }

  const updateItem = (id: string, updates: Partial<ItemConfig>) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const handleAddToCart = () => {
    setIsAdding(true)

    if (quantity === 1) {
      // Simple single item add
      const options: CartItemOptions = {
        size: singleSize,
        ballColor: singleColor,
        customText: singleText.trim() || undefined,
      }
      addItem(product.sku, options, 1)
    } else {
      // Add each item separately with quantity 1
      items.forEach(item => {
        const options: CartItemOptions = {
          size: item.size,
          ballColor: item.color,
          customText: item.customText.trim() || undefined,
        }
        addItem(product.sku, options, 1)
      })
    }

    // Reset after adding
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const selectedSizeInfo = crownSizes.find(s => s.id === singleSize)
  const selectedColorInfo = ballColors.find(c => c.id === singleColor)

  return (
    <div className="bg-white rounded-crown shadow-soft p-6 md:p-8">
      {/* Product Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-6 h-6 text-gold-500" />
          {product.isBestSeller && (
            <span className="bg-gold-500 text-charcoal-900 text-xs font-semibold px-2 py-1 rounded">
              Best Seller
            </span>
          )}
        </div>
        <h1 className="font-display text-2xl md:text-3xl text-charcoal-900 mb-2">
          {product.name}
        </h1>
        <p className="text-charcoal-600 text-sm md:text-base">
          {product.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <span className="text-3xl font-bold text-charcoal-900">
          {formatPrice(product.price)}
        </span>
        <span className="text-charcoal-500 text-sm ml-2">+ shipping</span>
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-charcoal-900 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-10 h-10 rounded-crown border-2 border-cream-300 hover:border-gold-500 flex items-center justify-center text-charcoal-700 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-lg font-semibold text-charcoal-900">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-10 h-10 rounded-crown border-2 border-cream-300 hover:border-gold-500 flex items-center justify-center text-charcoal-700 transition-colors"
          >
            +
          </button>
        </div>

        {/* Multi-item hint */}
        {quantity > 1 && (
          <p className="text-xs text-pickle-600 mt-2 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Customize each item individually below
          </p>
        )}
      </div>

      {/* Single Item Customization (quantity = 1) */}
      {quantity === 1 && (
        <>
          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-charcoal-900 mb-3">
              Select Size
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {crownSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSingleSize(size.id)}
                  className={`relative p-3 rounded-crown border-2 transition-all ${
                    singleSize === size.id
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-cream-300 hover:border-gold-300'
                  }`}
                >
                  {singleSize === size.id && (
                    <div className="absolute top-1 right-1">
                      <Check className="w-4 h-4 text-gold-600" />
                    </div>
                  )}
                  <div className="text-sm font-semibold text-charcoal-900">
                    {size.name}
                  </div>
                  <div className="text-xs text-charcoal-500 mt-1">
                    {size.circumference}
                  </div>
                </button>
              ))}
            </div>
            {selectedSizeInfo && (
              <p className="text-xs text-charcoal-500 mt-2">
                Dimensions: {selectedSizeInfo.dimensions}
              </p>
            )}
          </div>

          {/* Ball Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-charcoal-900 mb-3">
              Ball Color
            </label>
            <div className="flex gap-4">
              {ballColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSingleColor(color.id)}
                  className={`relative flex items-center gap-3 p-3 rounded-crown border-2 transition-all ${
                    singleColor === color.id
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-cream-300 hover:border-gold-300'
                  }`}
                >
                  {singleColor === color.id && (
                    <div className="absolute top-1 right-1">
                      <Check className="w-4 h-4 text-gold-600" />
                    </div>
                  )}
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-charcoal-900">
                      {color.name}
                    </div>
                    <div className="text-xs text-charcoal-500">
                      {color.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text Input */}
          {product.allowsCustomText && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-charcoal-900 mb-3">
                Custom Text <span className="font-normal text-charcoal-500">(optional)</span>
              </label>
              <input
                type="text"
                value={singleText}
                onChange={(e) => setSingleText(e.target.value.slice(0, product.maxTextLength))}
                placeholder="e.g., BIG DILL, KING, QUEEN, or event name"
                className="w-full px-4 py-3 rounded-crown border-2 border-cream-300 focus:border-gold-500 focus:outline-none transition-colors text-charcoal-900"
                maxLength={product.maxTextLength}
              />
              <p className="text-xs text-charcoal-500 mt-2">
                {singleText.length}/{product.maxTextLength} characters
              </p>
            </div>
          )}
        </>
      )}

      {/* Multi-Item Customization (quantity > 1) */}
      {quantity > 1 && (
        <div className="mb-6 space-y-3">
          <label className="block text-sm font-semibold text-charcoal-900 mb-3">
            Customize Each Item ({items.length} items)
          </label>

          <AnimatePresence>
            {items.map((item, index) => {
              const isExpanded = expandedItem === item.id
              const itemSizeInfo = crownSizes.find(s => s.id === item.size)
              const itemColorInfo = ballColors.find(c => c.id === item.color)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-2 border-cream-200 rounded-crown overflow-hidden"
                >
                  {/* Item Header */}
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                      isExpanded ? 'bg-gold-50' : 'bg-cream-50 hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-charcoal-900">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-medium text-charcoal-900">Item {index + 1}</span>
                        {!isExpanded && (
                          <span className="text-xs text-charcoal-500 ml-2">
                            {itemSizeInfo?.name} • {itemColorInfo?.name}
                            {item.customText && ` • "${item.customText}"`}
                          </span>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-charcoal-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-charcoal-500" />
                    )}
                  </button>

                  {/* Item Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        {/* Size Selection */}
                        <div className="mt-4">
                          <label className="block text-xs font-semibold text-charcoal-700 mb-2">
                            Size
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {crownSizes.map((size) => (
                              <button
                                key={size.id}
                                onClick={() => updateItem(item.id, { size: size.id })}
                                className={`p-2 rounded-lg border text-center transition-all text-xs ${
                                  item.size === size.id
                                    ? 'border-gold-500 bg-gold-50 font-semibold'
                                    : 'border-cream-200 hover:border-gold-300'
                                }`}
                              >
                                {size.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mt-4">
                          <label className="block text-xs font-semibold text-charcoal-700 mb-2">
                            Ball Color
                          </label>
                          <div className="flex gap-2">
                            {ballColors.map((color) => (
                              <button
                                key={color.id}
                                onClick={() => updateItem(item.id, { color: color.id })}
                                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                  item.color === color.id
                                    ? 'border-gold-500 bg-gold-50'
                                    : 'border-cream-200 hover:border-gold-300'
                                }`}
                              >
                                <div
                                  className="w-5 h-5 rounded-full border border-white shadow-sm"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-xs font-medium">{color.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Text */}
                        {product.allowsCustomText && (
                          <div className="mt-4">
                            <label className="block text-xs font-semibold text-charcoal-700 mb-2">
                              Custom Text (optional)
                            </label>
                            <input
                              type="text"
                              value={item.customText}
                              onChange={(e) => updateItem(item.id, {
                                customText: e.target.value.slice(0, product.maxTextLength)
                              })}
                              placeholder="e.g., Player name, team name"
                              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-200 focus:border-gold-500 focus:outline-none"
                              maxLength={product.maxTextLength}
                            />
                            <p className="text-xs text-charcoal-400 mt-1">
                              {item.customText.length}/{product.maxTextLength}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        disabled={isAdding}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 rounded-crown font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
          isAdding
            ? 'bg-pickle-500 text-white'
            : 'bg-gold-500 hover:bg-gold-600 text-charcoal-900'
        }`}
      >
        {isAdding ? (
          <>
            <Check className="w-5 h-5" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - {formatPrice(product.price * quantity)}
          </>
        )}
      </motion.button>

      {/* Free Shipping Note */}
      <p className="text-center text-sm text-charcoal-500 mt-4">
        Free shipping on orders over $35
      </p>

      {/* Summary */}
      <div className="mt-6 p-4 bg-cream-100 rounded-crown">
        <h3 className="text-sm font-semibold text-charcoal-900 mb-2">Your Selection:</h3>
        {quantity === 1 ? (
          <ul className="text-sm text-charcoal-600 space-y-1">
            <li>Size: {selectedSizeInfo?.name} ({selectedSizeInfo?.circumference})</li>
            <li>Ball Color: {selectedColorInfo?.name}</li>
            {singleText && <li>Custom Text: "{singleText}"</li>}
            <li>Quantity: {quantity}</li>
          </ul>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => {
              const sizeInfo = crownSizes.find(s => s.id === item.size)
              const colorInfo = ballColors.find(c => c.id === item.color)
              return (
                <div key={item.id} className="text-sm text-charcoal-600 flex items-start gap-2">
                  <span className="w-5 h-5 bg-gold-200 rounded-full flex items-center justify-center text-xs font-bold text-charcoal-700 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>
                    {sizeInfo?.name} • {colorInfo?.name}
                    {item.customText && ` • "${item.customText}"`}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
