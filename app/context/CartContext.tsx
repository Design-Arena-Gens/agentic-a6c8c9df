'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { CartItem } from '../types'
import { useAuth } from './AuthContext'

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (cakeId: number, quantity: number) => Promise<void>
  updateCartItem: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [isAuthenticated])

  const refreshCart = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cart')
      setCartItems(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (cakeId: number, quantity: number) => {
    try {
      await axios.post('http://localhost:8080/api/cart', { cakeId, quantity })
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      await axios.put(`http://localhost:8080/api/cart/${itemId}`, { quantity })
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${itemId}`)
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8080/api/cart')
      setCartItems([])
    } catch (error) {
      throw error
    }
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
