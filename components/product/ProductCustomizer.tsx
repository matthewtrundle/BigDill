'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
import { Crown, Check, ShoppingCart } from 'lucide-react'

interface ProductCustomizerProps {
  product: Product
}

export function ProductCustomizer({ product }: ProductCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState<CrownSize>('medium')
  const [selectedColor, setSelectedColor] = useState<BallColor>('green')
  const [customText, setCustomText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)
    const options: CartItemOptions = {
      size: selectedSize,
      ballColor: selectedColor,
      customText: customText.trim() || undefined,
    }
    addItem(product.sku, options, quantity)

    // Reset after adding
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const selectedSizeInfo = crownSizes.find(s => s.id === selectedSize)
  const selectedColorInfo = ballColors.find(c => c.id === selectedColor)

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

      {/* Size Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-charcoal-900 mb-3">
          Select Size
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {crownSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              className={`relative p-3 rounded-crown border-2 transition-all ${
                selectedSize === size.id
                  ? 'border-gold-500 bg-gold-50'
                  : 'border-cream-300 hover:border-gold-300'
              }`}
            >
              {selectedSize === size.id && (
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
              onClick={() => setSelectedColor(color.id)}
              className={`relative flex items-center gap-3 p-3 rounded-crown border-2 transition-all ${
                selectedColor === color.id
                  ? 'border-gold-500 bg-gold-50'
                  : 'border-cream-300 hover:border-gold-300'
              }`}
            >
              {selectedColor === color.id && (
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
            value={customText}
            onChange={(e) => setCustomText(e.target.value.slice(0, product.maxTextLength))}
            placeholder="e.g., BIG DILL, KING, QUEEN, or event name"
            className="w-full px-4 py-3 rounded-crown border-2 border-cream-300 focus:border-gold-500 focus:outline-none transition-colors text-charcoal-900"
            maxLength={product.maxTextLength}
          />
          <p className="text-xs text-charcoal-500 mt-2">
            {customText.length}/{product.maxTextLength} characters
          </p>
        </div>
      )}

      {/* Quantity */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-charcoal-900 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-crown border-2 border-cream-300 hover:border-gold-500 flex items-center justify-center text-charcoal-700 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center text-lg font-semibold text-charcoal-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-10 h-10 rounded-crown border-2 border-cream-300 hover:border-gold-500 flex items-center justify-center text-charcoal-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

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
        <ul className="text-sm text-charcoal-600 space-y-1">
          <li>Size: {selectedSizeInfo?.name} ({selectedSizeInfo?.circumference})</li>
          <li>Ball Color: {selectedColorInfo?.name}</li>
          {customText && <li>Custom Text: "{customText}"</li>}
          <li>Quantity: {quantity}</li>
        </ul>
      </div>
    </div>
  )
}
