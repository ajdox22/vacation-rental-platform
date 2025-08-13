'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Map, List, X } from 'lucide-react'
import { Listing } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, isListingExpiringSoon } from '@/utils'

interface MapViewProps {
  listings: Listing[]
  className?: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function MapView({ listings, className = '' }: MapViewProps) {
  const [isMapView, setIsMapView] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMapView && mapRef.current && !map) {
      loadGoogleMaps()
    }
  }, [isMapView])

  useEffect(() => {
    if (map && listings.length > 0) {
      addMarkers()
    }
  }, [map, listings])

  const loadGoogleMaps = () => {
    if (window.google) {
      initializeMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    }
  }

  const initializeMap = () => {
    if (!mapRef.current) return

    const bounds = new window.google.maps.LatLngBounds()
    const validListings = listings.filter(l => l.geo_lat && l.geo_lng)

    if (validListings.length === 0) {
      // Default to Bosnia center if no coordinates
      const defaultCenter = { lat: 43.8564, lng: 18.4131 }
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 8,
        styles: getMapStyles(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      })
      setMap(newMap)
      return
    }

    validListings.forEach(listing => {
      bounds.extend({ lat: listing.geo_lat!, lng: listing.geo_lng! })
    })

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: bounds.getCenter(),
      zoom: 10,
      styles: getMapStyles(),
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    newMap.fitBounds(bounds)
    setMap(newMap)
  }

  const addMarkers = () => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: any[] = []

    listings.forEach(listing => {
      if (!listing.geo_lat || !listing.geo_lng) return

      const marker = new window.google.maps.Marker({
        position: { lat: listing.geo_lat, lng: listing.geo_lng },
        map: map,
        title: listing.title,
        icon: {
          url: '/marker-icon.png',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(listing)
      })

      marker.addListener('click', () => {
        setSelectedListing(listing)
        infoWindow.open(map, marker)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)
  }

  const createInfoWindowContent = (listing: Listing) => {
    return `
      <div class="info-window" style="width: 250px; padding: 10px;">
        <div style="margin-bottom: 8px;">
          <img src="${listing.photos[0] || '/placeholder.jpg'}" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;" />
        </div>
        <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${listing.title}</h3>
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${listing.city}, ${listing.country}</p>
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #2563eb;">
          ${formatPrice(listing.default_monthly_price)}/mjesec
        </p>
        <a href="/listings/${listing.slug}" 
           style="display: inline-block; background: #2563eb; color: white; padding: 6px 12px; 
                  text-decoration: none; border-radius: 4px; font-size: 12px;">
          Pogledaj detalje
        </a>
      </div>
    `
  }

  const getMapStyles = () => {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }

  const toggleView = () => {
    setIsMapView(!isMapView)
    if (selectedListing) {
      setSelectedListing(null)
    }
  }

  return (
    <div className={className}>
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Smještaji ({listings.length})
        </h2>
        <button
          onClick={toggleView}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isMapView ? (
            <>
              <List className="w-4 h-4" />
              <span>Lista</span>
            </>
          ) : (
            <>
              <Map className="w-4 h-4" />
              <span>Mapa</span>
            </>
          )}
        </button>
      </div>

      {isMapView ? (
        /* Map View */
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg shadow-lg"
          />
          
          {/* Selected Listing Card */}
          {selectedListing && (
            <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="relative">
                <Image
                  src={selectedListing.photos[0] || '/placeholder.jpg'}
                  alt={selectedListing.title}
                  width={320}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedListing.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Preporučeno
                  </div>
                )}
                {isListingExpiringSoon(selectedListing.expires_at) && (
                  <div className="absolute top-2 left-20 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Ističe uskoro
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedListing.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{selectedListing.city}, {selectedListing.country}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{selectedListing.capacity} gostiju</span>
                  <span>{selectedListing.bedrooms} spavaće sobe</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(selectedListing.default_monthly_price)}
                  </span>
                  <span className="text-sm text-gray-600">/mjesec</span>
                </div>
                <Link
                  href={`/listings/${selectedListing.slug}`}
                  className="mt-3 w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors block"
                >
                  Pogledaj detalje
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.slug}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={listing.photos[0] || '/placeholder.jpg'}
                  alt={listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {listing.is_featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    Preporučeno
                  </div>
                )}
                {isListingExpiringSoon(listing.expires_at) && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Ističe uskoro
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {listing.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{listing.city}, {listing.country}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{listing.capacity} gostiju</span>
                  <span>{listing.bedrooms} spavaće sobe</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(listing.default_monthly_price)}
                  </span>
                  <span className="text-sm text-gray-600">/mjesec</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
