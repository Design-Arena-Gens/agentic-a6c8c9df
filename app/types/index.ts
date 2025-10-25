export interface Cake {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  available: boolean
}

export interface User {
  userId: number
  name: string
  email: string
  token: string
}

export interface CartItem {
  id: number
  cakeId: number
  cakeName: string
  cakePrice: number
  cakeImageUrl: string
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  totalAmount: number
  status: string
  createdAt: string
  shippingAddress: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  cake: Cake
  quantity: number
  price: number
}
