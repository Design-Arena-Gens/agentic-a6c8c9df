'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { toast } from 'react-toastify'

const stripePromise = loadStripe('pk_test_51234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

function CheckoutForm() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const { cartTotal, clearCart } = useCart()
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !address) {
      return
    }

    setLoading(true)

    try {
      const { data } = await axios.post('http://localhost:8080/api/payment/create-intent', {
        shippingAddress: address,
      })

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (result.error) {
        toast.error(result.error.message)
      } else {
        await axios.post('http://localhost:8080/api/payment/confirm', {
          paymentIntentId: data.paymentIntentId,
        })

        await clearCart()
        toast.success('Payment successful!')
        router.push('/orders')
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2 font-semibold">
          Shipping Address
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="123 Main St, City, State, ZIP"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2 font-semibold">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Test card: 4242 4242 4242 4242, any future date, any CVC
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-xl font-bold">
          <span>Total Amount:</span>
          <span className="text-primary">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary text-white py-3 rounded-full hover:bg-secondary transition disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth()
  const { cartItems } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (cartItems.length === 0) {
      router.push('/cart')
    }
  }, [isAuthenticated, cartItems, router])

  if (!isAuthenticated || cartItems.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  )
}
