import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { validateCoupon } from '@/utils'

export async function POST(request: NextRequest) {
  try {
    const { code, listingId, userId } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Kupon kod je obavezan' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (couponError || !coupon) {
      return NextResponse.json(
        { error: 'Kupon nije pronađen ili nije aktivan' },
        { status: 404 }
      )
    }

    // Validate coupon
    const validation = validateCoupon(coupon, userId, listingId)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Check if user already used this coupon
    if (userId) {
      const { data: existingRedemption } = await supabase
        .from('coupon_redemptions')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId)
        .single()

      if (existingRedemption) {
        return NextResponse.json(
          { error: 'Već ste koristili ovaj kupon' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        value: coupon.value
      }
    })

  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { error: 'Greška pri validaciji kupona' },
      { status: 500 }
    )
  }
}
