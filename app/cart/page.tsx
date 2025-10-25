'use client'

import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa'

export default function CartPage() {
  const { isAuthenticated } = useAuth()
  const { cartItems, cartTotal, updateCartItem, removeFromCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleUpdateQuantity = async (itemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change
    if (newQty < 1) return

    try {
      await updateCartItem(itemId, newQty)
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-white px-6 py-3 rounded-full hover:bg-secondary transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.cakeImageUrl}
                    alt={item.cakeName}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.cakeName}
                  </h3>
                  <p className="text-gray-600">${item.cakePrice.toFixed(2)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between">
                  <p className="text-lg font-bold text-primary">
                    ${item.subtotal.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-full hover:bg-secondary transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
