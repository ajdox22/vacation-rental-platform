// Core Types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'host' | 'guest' | 'admin'
  phone?: string
  avatar_url?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  title: string
  description: string
  slug: string
  host_id: string
  city: string
  country: string
  address: string
  latitude?: number
  longitude?: number
  capacity: number
  bedrooms: number
  bathrooms: number
  photos: string[]
  amenities: string[]
  default_monthly_price: number
  is_active: boolean
  is_featured: boolean
  premium_until?: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string
  description: string
  image_url: string
  link_url?: string
  position: number
  is_active: boolean
  start_date: string
  end_date: string
  created_at: string
}

export interface Inquiry {
  id: string
  listing_id: string
  guest_id: string
  host_id: string
  message: string
  check_in: string
  check_out: string
  guests: number
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  listing_id?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

// Premium Features Types
export interface Coupon {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  value: number
  valid_from: string
  valid_to: string
  usage_limit: number
  used_count: number
  owner_host_id?: string
  is_active: boolean
  created_at: string
}

export interface CouponRedemption {
  id: string
  coupon_id: string
  user_id: string
  listing_id?: string
  discount_amount: number
  created_at: string
}

export interface Promotion {
  id: string
  listing_id: string
  promotion_type: 'instagram' | 'google' | 'facebook'
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  start_date: string
  end_date: string
  cost: number
  created_at: string
}

export interface ListingModeration {
  id: string
  listing_id: string
  moderator_id: string
  action: 'edit' | 'deactivate' | 'suspend' | 'restore'
  reason: string
  notes?: string
  created_at: string
}

export interface ConciergeTask {
  id: string
  user_id: string
  listing_id?: string
  task_type: 'listing_creation' | 'photo_upload' | 'description_writing'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  assigned_to?: string
  completed_at?: string
  created_at: string
}

export interface ServiceOrder {
  id: string
  user_id: string
  listing_id: string
  service_type: 'photography' | 'cleaning' | 'maintenance'
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  cost: number
  scheduled_date: string
  notes?: string
  created_at: string
}

export interface Partner {
  id: string
  name: string
  description: string
  logo_url: string
  website_url: string
  contact_email: string
  is_active: boolean
  created_at: string
}

export interface ListingStats {
  id: string
  listing_id: string
  views: number
  inquiries: number
  date: string
  created_at: string
}

export interface Conversation {
  id: string
  listing_id: string
  host_id: string
  guest_id: string
  status: 'active' | 'archived'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface Review {
  id: string
  listing_id: string
  reviewer_id: string
  rating: number
  title: string
  comment: string
  is_approved: boolean
  created_at: string
}

export interface Amenity {
  id: string
  name: string
  category: string
  icon?: string
  is_active: boolean
  created_at: string
}

export interface PriceCalculation {
  base_price: number
  seasonal_adjustment: number
  special_dates_adjustment: number
  coupon_discount: number
  total: number
  breakdown: {
    base: number
    seasonal: number
    special: number
    coupon: number
  }
}

export interface AdminReport {
  id: string
  report_type: 'monthly' | 'quarterly' | 'yearly'
  period_start: string
  period_end: string
  data: any
  created_at: string
}

// Phase-2 Types (Placeholders)
export interface AccountDeletionLog {
  id: string
  user_id: string
  reason: string
  data_exported: boolean
  created_at: string
}

export interface ConsentLog {
  id: string
  user_id: string
  consent_type: string
  granted: boolean
  ip_address: string
  created_at: string
}

export interface UserReport {
  id: string
  reporter_id: string
  reported_user_id: string
  listing_id?: string
  reason: string
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  created_at: string
}

export interface EventLog {
  id: string
  user_id?: string
  event_type: string
  event_data: any
  ip_address: string
  user_agent: string
  created_at: string
}

export interface NewsletterSubscription {
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
  unsubscribed_at?: string
}

export interface HealthLog {
  id: string
  service: string
  status: 'healthy' | 'warning' | 'error'
  response_time: number
  error_message?: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  author_id: string
  is_published: boolean
  published_at?: string
  created_at: string
}

export interface DestinationPage {
  id: string
  name: string
  slug: string
  description: string
  featured_image: string
  listings_count: number
  is_active: boolean
  created_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}

export interface TrustBadge {
  id: string
  name: string
  description: string
  icon_url: string
  is_active: boolean
  created_at: string
}

export interface PartnerApiKey {
  id: string
  partner_id: string
  api_key: string
  permissions: string[]
  is_active: boolean
  last_used_at?: string
  created_at: string
}
