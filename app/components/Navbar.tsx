'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            🍰 Sweet Dreams
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/cart"
                  className="relative flex items-center gap-2 text-gray-700 hover:text-primary transition"
                >
                  <FaShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-primary transition"
                >
                  Orders
                </Link>

                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-700" />
                  <span className="text-gray-700">{user?.name}</span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
