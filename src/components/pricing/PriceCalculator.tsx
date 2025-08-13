'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, Calculator, Info } from 'lucide-react'
import { Listing, Coupon } from '@/types'
import { calculatePrice, formatPrice } from '@/utils'

interface PriceCalculatorProps {
  listing: Listing
  onPriceChange?: (price: number) => void
}

export default function PriceCalculator({ listing, onPriceChange }: PriceCalculatorProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(listing.capacity)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null)

  useEffect(() => {
    if (checkIn && checkOut && guests) {
      calculateTotalPrice()
    }
  }, [checkIn, checkOut, guests, appliedCoupon])

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !guests) return

    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    
    if (startDate >= endDate) return

    const specialPricing = listing.special_pricing || []
    const seasonalPricing = listing.seasonal_pricing || []
    
    const calculation = calculatePrice(
      listing.default_monthly_price / 30, // Daily rate
      checkIn,
      checkOut,
      specialPricing,
      appliedCoupon
    )

    setPriceBreakdown(calculation)
    
    if (onPriceChange) {
      onPriceChange(calculation.total)
    }
  }

  const validateCoupon = async () => {
    if (!couponCode.trim()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          listingId: listing.id
        }),
      })

      const data = await response.json()

      if (data.valid) {
        setAppliedCoupon(data.coupon)
        setCouponCode('')
      } else {
        alert(data.error || 'Kupon nije validan')
      }
    } catch (error) {
      alert('Greška pri validaciji kupona')
    } finally {
      setIsLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const days = checkIn && checkOut ? getDaysBetween(checkIn, checkOut) : 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Calculator className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Kalkulator cijene</h3>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Guests Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Broj gostiju
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {Array.from({ length: listing.capacity }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'gost' : num < 5 ? 'gosta' : 'gostiju'}
            </option>
          ))}
        </select>
      </div>

      {/* Coupon Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kupon kod
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Unesite kupon kod"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={validateCoupon}
            disabled={isLoading || !couponCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '...' : 'Primijeni'}
          </button>
        </div>
      </div>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                Kupon primijenjen: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600">
                Popust: {appliedCoupon.discount_type === 'percent' ? `${appliedCoupon.value}%` : `${formatPrice(appliedCoupon.value)}`}
              </p>
            </div>
            <button
              onClick={removeCoupon}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      {priceBreakdown && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Detaljni pregled</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Osnovna cijena ({days} dana)</span>
              <span>{formatPrice(priceBreakdown.base_price)}</span>
            </div>
            
            {priceBreakdown.seasonal_adjustment !== 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Sezonska prilagodba</span>
                <span>{formatPrice(priceBreakdown.seasonal_adjustment)}</span>
              </div>
            )}
            
            {priceBreakdown.special_dates_adjustment !== 0 && (
              <div className="flex justify-between text-purple-600">
                <span>Posebne datume</span>
                <span>{formatPrice(priceBreakdown.special_dates_adjustment)}</span>
              </div>
            )}
            
            {priceBreakdown.coupon_discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Popust kupon</span>
                <span>-{formatPrice(priceBreakdown.coupon_discount)}</span>
              </div>
            )}
            
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Ukupno</span>
              <span>{formatPrice(priceBreakdown.total)}</span>
            </div>
          </div>

          {/* Last Minute Deal */}
          {listing.last_minute_active && listing.last_minute_until && new Date(listing.last_minute_until) > new Date() && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <Info className="w-4 h-4 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Last Minute ponuda!
                  </p>
                  <p className="text-xs text-red-600">
                    Popust {listing.last_minute_discount_percent}% do {new Date(listing.last_minute_until).toLocaleDateString('bs-BA')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Minimum Stay Notice */}
      {listing.minimum_stay > 1 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <Info className="w-4 h-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              Minimalno boravak: {listing.minimum_stay} {listing.minimum_stay === 1 ? 'dan' : listing.minimum_stay < 5 ? 'dana' : 'dana'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
