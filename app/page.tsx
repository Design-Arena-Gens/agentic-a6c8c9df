'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import CakeCard from './components/CakeCard'
import { Cake } from './types'

export default function Home() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchCakes()
  }, [])

  const fetchCakes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cakes')
      setCakes(response.data)
    } catch (error) {
      console.error('Error fetching cakes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCakes = filter === 'all'
    ? cakes
    : cakes.filter(cake => cake.category === filter)

  const categories = ['all', 'Chocolate', 'Vanilla', 'Fruit', 'Specialty']

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Sweet Dreams Cake Shop
        </h1>
        <p className="text-xl text-gray-600">
          Handcrafted cakes made with love for every special occasion
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              filter === category
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCakes.map(cake => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      )}
    </div>
  )
}
