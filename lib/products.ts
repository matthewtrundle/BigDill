// Crown size options
export type CrownSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface CrownSizeInfo {
  id: CrownSize
  name: string
  dimensions: string
  circumference: string
}

export const crownSizes: CrownSizeInfo[] = [
  { id: 'small', name: 'Small', dimensions: '7.3 x 6.4 inch', circumference: '21.5"' },
  { id: 'medium', name: 'Medium', dimensions: '7.5 x 6.7 inch', circumference: '22.25"' },
  { id: 'large', name: 'Large', dimensions: '7.8 x 6.9 inch', circumference: '23"' },
  { id: 'xlarge', name: 'X-Large', dimensions: '8 x 7.1 inch', circumference: '23.75"' },
]

// Ball color options
export type BallColor = 'green' | 'pink'

export interface BallColorInfo {
  id: BallColor
  name: string
  hex: string
  description: string
}

export const ballColors: BallColorInfo[] = [
  { id: 'green', name: 'Green', hex: '#7AE435', description: 'Lime green pickleballs' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', description: 'Pink pickleballs' },
]

// Product interface with customization
export interface Product {
  sku: string
  name: string
  description: string
  image: string
  price: number // in cents
  weight: number // in ounces for shipping
  allowsCustomText: boolean
  maxTextLength: number
  isBestSeller?: boolean
}

// Cart item includes customization options
export interface CartItemOptions {
  size: CrownSize
  ballColor: BallColor
  customText?: string
}

export const products: Product[] = [
  {
    sku: 'CROWN-1',
    name: 'Customizable Pickleball Crown',
    description: 'Crown the pickleball champion in style! This customizable 3D-printed crown features pickleball-inspired details and can be personalized with your own text. Perfect for tournaments, leagues, or as a fun gift.',
    image: '/images/products/crown-placeholder.jpg',
    price: 1999, // $19.99
    weight: 8, // 8 oz
    allowsCustomText: true,
    maxTextLength: 30,
    isBestSeller: true,
  },
]

export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku)
}

export function getSizeInfo(size: CrownSize): CrownSizeInfo | undefined {
  return crownSizes.find((s) => s.id === size)
}

export function getColorInfo(color: BallColor): BallColorInfo | undefined {
  return ballColors.find((c) => c.id === color)
}

// Format price from cents to dollars
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

// Generate a unique cart item ID based on options
export function generateCartItemId(sku: string, options: CartItemOptions): string {
  const textPart = options.customText ? `-${options.customText.slice(0, 10)}` : ''
  return `${sku}-${options.size}-${options.ballColor}${textPart}`
}
