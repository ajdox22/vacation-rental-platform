'use client'

import { useState } from 'react'
import { Tag, Check, X, AlertCircle } from 'lucide-react'
import { Coupon } from '@/types'
import { validateCoupon } from '@/utils'
import toast from 'react-hot-toast'

interface CouponInputProps {
  onCouponApplied: (coupon: Coupon | null) => void
  appliedCoupon?: Coupon | null
  userId?: string
  listingId?: string
}

export default function CouponInput({ onCouponApplied, appliedCoupon, userId, listingId }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would fetch the coupon from your API
      // For now, we'll simulate the API call
      const response = await fetch(`/api/coupons/validate?code=${encodeURIComponent(couponCode)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate coupon')
      }

      const coupon: Coupon = data.coupon
      const validation = validateCoupon(coupon, userId, listingId)

      if (!validation.valid) {
        toast.error(validation.error || 'Invalid coupon')
        return
      }

      onCouponApplied(coupon)
      setCouponCode('')
      toast.success('Coupon applied successfully!')
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Failed to apply coupon')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponApplied(null)
    toast.success('Coupon removed')
  }

  return (
    <div className="space-y-3">
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Coupon: {appliedCoupon.code}
              </p>
              <p className="text-xs text-green-600">
                {appliedCoupon.discount_type === 'percent' 
                  ? `${appliedCoupon.value}% off`
                  : `${appliedCoupon.value} KM off`
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      )}
    </div>
  )
}
