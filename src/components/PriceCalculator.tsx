'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, Calculator, Info } from 'lucide-react'
import { Listing, Coupon, SpecialPricingDate, PriceCalculation } from '@/types'
import { calculatePrice, formatCurrency } from '@/utils'
import CouponInput from './CouponInput'

interface PriceCalculatorProps {
  listing: Listing
  specialPricing?: SpecialPricingDate[]
}

export default function PriceCalculator({ listing, specialPricing = [] }: PriceCalculatorProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null)

  useEffect(() => {
    if (checkIn && checkOut && guests > 0) {
      const calculation = calculatePrice(
        listing.default_monthly_price / 30, // Convert monthly to daily
        checkIn,
        checkOut,
        specialPricing,
        appliedCoupon
      )
      setPriceCalculation(calculation)
    } else {
      setPriceCalculation(null)
    }
  }, [checkIn, checkOut, guests, appliedCoupon, listing.default_monthly_price, specialPricing])

  const handleCouponApplied = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon)
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxGuests = () => {
    return Math.min(guests, listing.capacity)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        Price Calculator
      </h3>

      <div className="space-y-4">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={getMinDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || getMinDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Guests Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: listing.capacity }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Coupon Input */}
        <CouponInput
          onCouponApplied={handleCouponApplied}
          appliedCoupon={appliedCoupon}
          listingId={listing.id}
        />

        {/* Price Breakdown */}
        {priceCalculation && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Price Breakdown</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base price ({Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} days)</span>
                <span>{formatCurrency(priceCalculation.breakdown.base)}</span>
              </div>
              
              {priceCalculation.breakdown.seasonal !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Seasonal adjustment</span>
                  <span className={priceCalculation.breakdown.seasonal > 0 ? 'text-green-600' : 'text-red-600'}>
                    {priceCalculation.breakdown.seasonal > 0 ? '+' : ''}{formatCurrency(priceCalculation.breakdown.seasonal)}
                  </span>
                </div>
              )}
              
              {priceCalculation.breakdown.special !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Special dates</span>
                  <span className={priceCalculation.breakdown.special > 0 ? 'text-green-600' : 'text-red-600'}>
                    {priceCalculation.breakdown.special > 0 ? '+' : ''}{formatCurrency(priceCalculation.breakdown.special)}
                  </span>
                </div>
              )}
              
              {priceCalculation.breakdown.coupon > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon discount</span>
                  <span className="text-green-600">
                    -{formatCurrency(priceCalculation.breakdown.coupon)}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(priceCalculation.total)}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p>• Prices are calculated per night</p>
                  <p>• Special pricing may apply during holidays</p>
                  <p>• Final price includes all applicable discounts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {priceCalculation && (
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Book Now - {formatCurrency(priceCalculation.total)}
          </button>
        )}
      </div>
    </div>
  )
}
