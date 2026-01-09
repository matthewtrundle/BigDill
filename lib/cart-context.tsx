'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  Product,
  getProductBySku,
  CartItemOptions,
  generateCartItemId,
  CrownSize,
  BallColor,
  getSizeInfo,
  getColorInfo
} from './products'

export interface CartItem {
  id: string // Unique ID based on sku + options
  sku: string
  quantity: number
  options: CartItemOptions
}

// Bulk discount tiers - must match TierProgress.tsx
const bulkDiscountTiers = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 0.10 },
  { min: 10, max: 24, discount: 0.15 },
  { min: 25, max: 49, discount: 0.20 },
  { min: 50, max: 99, discount: 0.25 },
  { min: 100, max: Infinity, discount: 0.30 },
]

function getBulkDiscountRate(quantity: number): number {
  const tier = bulkDiscountTiers.find(t => quantity >= t.min && quantity <= t.max)
  return tier?.discount || 0
}

interface BulkDiscountInfo {
  rate: number
  label: string
  savings: number
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (sku: string, options: CartItemOptions, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getBulkDiscount: () => BulkDiscountInfo
  getDiscountedSubtotal: () => number
  getShipping: () => number
  getTotal: () => number
  getCartProducts: () => (CartItem & { product: Product })[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'big-dill-pickleball-cart'
const FREE_SHIPPING_THRESHOLD = 3500 // $35 in cents
const SHIPPING_COST = 479 // $4.79 in cents

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isHydrated])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  const addItem = (sku: string, options: CartItemOptions, quantity = 1) => {
    const id = generateCartItemId(sku, options)

    setItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
            : item
        )
      }
      return [...prev, { id, sku, quantity: Math.min(quantity, 10), options }]
    })
    openCart()
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, 10) } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const product = getProductBySku(item.sku)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  const getBulkDiscount = (): BulkDiscountInfo => {
    const itemCount = getItemCount()
    const subtotal = getSubtotal()
    const rate = getBulkDiscountRate(itemCount)
    const savings = Math.round(subtotal * rate)

    let label = 'No discount'
    if (rate === 0.10) label = '10% off'
    else if (rate === 0.15) label = '15% off'
    else if (rate === 0.20) label = '20% off'
    else if (rate === 0.25) label = '25% off'
    else if (rate === 0.30) label = '30% off'

    return { rate, label, savings }
  }

  const getDiscountedSubtotal = () => {
    const subtotal = getSubtotal()
    const { rate } = getBulkDiscount()
    return Math.round(subtotal * (1 - rate))
  }

  const getShipping = () => {
    const subtotal = getDiscountedSubtotal()
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0
    }
    return SHIPPING_COST
  }

  const getTotal = () => {
    return getDiscountedSubtotal() + getShipping()
  }

  const getCartProducts = () => {
    return items
      .map((item) => {
        const product = getProductBySku(item.sku)
        if (!product) return null
        return { ...item, product }
      })
      .filter((item): item is CartItem & { product: Product } => item !== null)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getBulkDiscount,
        getDiscountedSubtotal,
        getShipping,
        getTotal,
        getCartProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Helper to format cart item options for display
export function formatCartItemOptions(options: CartItemOptions): string {
  const sizeInfo = getSizeInfo(options.size)
  const colorInfo = getColorInfo(options.ballColor)

  const parts = [
    sizeInfo ? sizeInfo.name : options.size,
    colorInfo ? `${colorInfo.name} balls` : options.ballColor,
  ]

  if (options.customText) {
    parts.push(`"${options.customText}"`)
  }

  return parts.join(' | ')
}
