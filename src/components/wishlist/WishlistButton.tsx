'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClientComponentClient } from '@/lib/supabase'
import { Listing } from '@/types'

interface WishlistButtonProps {
  listing: Listing
  className?: string
}

export default function WishlistButton({ listing, className = '' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      checkWishlistStatus()
    } else {
      // Check localStorage for guest users
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setIsInWishlist(wishlist.includes(listing.id))
    }
  }, [user, listing.id])

  const checkWishlistStatus = async () => {
    if (!user) return

    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listing.id)
      .single()

    setIsInWishlist(!!data)
  }

  const toggleWishlist = async () => {
    setIsLoading(true)

    if (user) {
      // Logged in user - use database
      if (isInWishlist) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id)
      } else {
        await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            listing_id: listing.id
          })
      }
      setIsInWishlist(!isInWishlist)
    } else {
      // Guest user - use localStorage
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      
      if (isInWishlist) {
        const newWishlist = wishlist.filter((id: string) => id !== listing.id)
        localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      } else {
        wishlist.push(listing.id)
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
      }
      
      setIsInWishlist(!isInWishlist)
    }

    setIsLoading(false)
  }

  const syncWishlistToDatabase = async () => {
    if (!user) return

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    
    // Add all localStorage items to database
    for (const listingId of wishlist) {
      await supabase
        .from('wishlists')
        .upsert({
          user_id: user.id,
          listing_id: listingId
        })
    }

    // Clear localStorage
    localStorage.removeItem('wishlist')
  }

  // Sync localStorage to database when user logs in
  useEffect(() => {
    if (user && localStorage.getItem('wishlist')) {
      syncWishlistToDatabase()
    }
  }, [user])

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isInWishlist
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100 hover:text-red-500'
      } ${className}`}
      title={isInWishlist ? 'Uklonite iz liste želja' : 'Dodajte u listu želja'}
    >
      <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>
  )
}
