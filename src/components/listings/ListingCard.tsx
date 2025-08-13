import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, Heart, Star, Clock, AlertCircle } from 'lucide-react'
import { Listing } from '@/types'
import { formatPrice, isListingFeatured, getListingStatus, isListingExpiringSoon } from '@/utils'

interface ListingCardProps {
  listing: Listing
  showStatus?: boolean
  showExpiryWarning?: boolean
}

export default function ListingCard({ listing, showStatus = false, showExpiryWarning = true }: ListingCardProps) {
  const isFeatured = isListingFeatured(listing)
  const status = getListingStatus(listing)
  const isExpiringSoon = isListingExpiringSoon(listing.expires_at)

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={`group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
        isFeatured ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={listing.photos[0] || '/placeholder.jpg'}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </div>
        )}

        {/* Status Badge */}
        {showStatus && (
          <div className="absolute top-4 left-4">
            {status === 'active' && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Active
              </span>
            )}
            {status === 'inactive' && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Inactive
              </span>
            )}
            {status === 'expiring_soon' && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Expiring Soon
              </span>
            )}
          </div>
        )}

        {/* Expiry Warning */}
        {showExpiryWarning && isExpiringSoon && (
          <div className="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expires in {Math.ceil((new Date(listing.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 left-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{listing.city}, {listing.country}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{listing.capacity} guests</span>
          </div>
          <div>
            <span>{listing.bedrooms} bedrooms</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(listing.default_monthly_price)}
          </span>
          <span className="text-sm text-gray-600">/month</span>
        </div>

        {/* Premium Features Indicator */}
        {isFeatured && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-yellow-600">
              <Star className="w-3 h-3 mr-1" />
              <span>Premium Listing</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
