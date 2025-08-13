export const formatPrice = (price: number, currency: string = "KM"): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

export const getPlanDuration = (planType: string): number => {
  switch (planType) {
    case 'monthly': return 1
    case 'quarterly': return 3
    case 'biannual': return 6
    case 'yearly': return 12
    default: return 1
  }
}

export const getPlanPrice = (planType: string): number => {
  switch (planType) {
    case 'monthly': return 25
    case 'quarterly': return 65
    case 'biannual': return 110
    case 'yearly': return 200
    default: return 25
  }
}

export const getPlanEndDate = (startDate: string, planType: string): string => {
  const start = new Date(startDate)
  const months = getPlanDuration(planType)
  start.setMonth(start.getMonth() + months)
  return start.toISOString()
}

// Premium Features - Enhanced Utility Functions

export const calculatePrice = (
  basePrice: number,
  checkIn: string,
  checkOut: string,
  specialPricing: Array<{ start_date: string; end_date: string; price: number }> = [],
  coupon?: { discount_type: 'percent' | 'fixed'; value: number }
): any => {
  const startDate = new Date(checkIn)
  const endDate = new Date(checkOut)
  const days = getDaysBetween(startDate, endDate)
  
  let totalPrice = basePrice * days
  let seasonalAdjustment = 0
  let specialDatesAdjustment = 0
  let couponDiscount = 0

  // Apply special pricing dates
  specialPricing.forEach(special => {
    const specialStart = new Date(special.start_date)
    const specialEnd = new Date(special.end_date)
    
    if (startDate <= specialEnd && endDate >= specialStart) {
      const overlapStart = new Date(Math.max(startDate.getTime(), specialStart.getTime()))
      const overlapEnd = new Date(Math.min(endDate.getTime(), specialEnd.getTime()))
      const overlapDays = getDaysBetween(overlapStart, overlapEnd)
      
      const originalPrice = basePrice * overlapDays
      const specialPrice = special.price * overlapDays
      specialDatesAdjustment += specialPrice - originalPrice
    }
  })

  totalPrice += specialDatesAdjustment

  // Apply coupon discount
  if (coupon) {
    if (coupon.discount_type === 'percent') {
      couponDiscount = (totalPrice * coupon.value) / 100
    } else {
      couponDiscount = Math.min(coupon.value, totalPrice)
    }
    totalPrice -= couponDiscount
  }

  return {
    base_price: basePrice * days,
    seasonal_adjustment: seasonalAdjustment,
    special_dates_adjustment: specialDatesAdjustment,
    coupon_discount: couponDiscount,
    total: Math.max(0, totalPrice),
    breakdown: {
      base: basePrice * days,
      seasonal: seasonalAdjustment,
      special: specialDatesAdjustment,
      coupon: couponDiscount
    }
  }
}

export const validateCoupon = (
  coupon: any,
  userId?: string,
  listingId?: string
): { valid: boolean; error?: string } => {
  const now = new Date()
  const validFrom = new Date(coupon.valid_from)
  const validTo = new Date(coupon.valid_to)

  if (now < validFrom) {
    return { valid: false, error: 'Coupon not yet valid' }
  }

  if (now > validTo) {
    return { valid: false, error: 'Coupon has expired' }
  }

  if (coupon.used_count >= coupon.usage_limit) {
    return { valid: false, error: 'Coupon usage limit reached' }
  }

  if (coupon.owner_host_id && coupon.owner_host_id !== userId) {
    return { valid: false, error: 'Coupon not available for this user' }
  }

  return { valid: true }
}

export const isListingExpiringSoon = (expiresAt: string, days: number = 7): boolean => {
  const now = new Date()
  const expiryDate = new Date(expiresAt)
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays > 0
}

export const isListingFeatured = (listing: any): boolean => {
  if (!listing.is_featured) return false
  if (!listing.premium_until) return false
  return new Date(listing.premium_until) > new Date()
}

export const getListingStatus = (listing: any): 'active' | 'inactive' | 'expiring_soon' | 'suspended' => {
  if (!listing.is_active) return 'inactive'
  if (isListingExpiringSoon(listing.expires_at)) return 'expiring_soon'
  if (new Date(listing.expires_at) < new Date()) return 'inactive'
  return 'active'
}

export const formatCurrency = (amount: number, currency: string = 'KM'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  return { valid: true }
}

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
