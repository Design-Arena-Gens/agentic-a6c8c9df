'use client'

import Image from 'next/image'
import { Cake } from '../types'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { FaShoppingCart } from 'react-icons/fa'

interface CakeCardProps {
  cake: Cake
}

export default function CakeCard({ cake }: CakeCardProps) {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart')
      router.push('/login')
      return
    }

    try {
      await addToCart(cake.id, 1)
      toast.success(`${cake.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative h-64 w-full">
        <Image
          src={cake.imageUrl}
          alt={cake.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{cake.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {cake.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            ${cake.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!cake.available}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              cake.available
                ? 'bg-primary text-white hover:bg-secondary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart />
            Add to Cart
          </button>
        </div>
        {!cake.available && (
          <p className="text-red-500 text-sm mt-2">Out of stock</p>
        )}
      </div>
    </div>
  )
}
