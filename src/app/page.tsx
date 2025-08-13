'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Users, Calendar, Star, ArrowRight, Play, Pause, Heart, Map } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Banner, Listing } from '@/types'
import { createClientComponentClient } from '@/lib/supabase'
import { formatPrice, isListingExpiringSoon } from '@/utils'

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [lastMinuteListings, setLastMinuteListings] = useState<Listing[]>([])
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [isBannerPlaying, setIsBannerPlaying] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchGuests, setSearchGuests] = useState(1)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBanners()
    fetchFeaturedListings()
    fetchLastMinuteListings()
  }, [])

  useEffect(() => {
    if (banners.length > 1 && isBannerPlaying) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length, isBannerPlaying])

  const fetchBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('position')
      .limit(3)

    if (data) {
      setBanners(data)
    }
  }

  const fetchFeaturedListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(6)

    if (data) {
      setFeaturedListings(data)
    }
  }

  const fetchLastMinuteListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .eq('last_minute_active', true)
      .gte('last_minute_until', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(4)

    if (data) {
      setLastMinuteListings(data)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.append('search', searchQuery.trim())
    if (searchLocation.trim()) params.append('location', searchLocation.trim())
    if (searchGuests > 1) params.append('guests', searchGuests.toString())
    
    const queryString = params.toString()
    window.location.href = `/listings${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Banner Ads */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        {banners.length > 0 ? (
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {/* Banner Images */}
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      {banner.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                      {banner.description}
                    </p>
                    {banner.link_url && (
                      <Link
                        href={banner.link_url}
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Banner Controls */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button
                  onClick={() => setIsBannerPlaying(!isBannerPlaying)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                >
                  {isBannerPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <div className="flex space-x-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-96 md:h-[500px] flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Pronađite Savršen Smještaj
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Otkrijte prekrasne apartmane i kuće za odmor u BiH, Srbiji, Hrvatskoj i Crnoj Gori
              </p>
            </div>
          </div>
        )}

        {/* Advanced Search Bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Gdje želite ići? (grad, planina, more...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Sve lokacije</option>
                    <option value="ba">Bosna i Hercegovina</option>
                    <option value="rs">Srbija</option>
                    <option value="hr">Hrvatska</option>
                    <option value="me">Crna Gora</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value={1}>1 gost</option>
                    <option value={2}>2 gosta</option>
                    <option value={3}>3 gosta</option>
                    <option value={4}>4 gosta</option>
                    <option value={5}>5+ gostiju</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Pretraži</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Last Minute Deals */}
      {lastMinuteListings.length > 0 && (
        <section className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Last Minute Ponude
              </h2>
              <p className="text-xl text-gray-600">
                Uštedite do 50% na odmor u narednih 7 dana
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lastMinuteListings.map((listing) => (
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
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      -{listing.last_minute_discount_percent}%
                    </div>
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      Last Minute
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{listing.city}, {listing.country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{listing.capacity} gostiju</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(listing.default_monthly_price)}
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(listing.default_monthly_price * (1 - listing.last_minute_discount_percent / 100))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Preporučeni Smještaji
            </h2>
            <p className="text-xl text-gray-600">
              Rukom odabrani apartmani i kuće za vašu iduću avanturu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={listing.photos[0] || '/placeholder.jpg'}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold">
                    Preporučeno
                  </div>
                  {isListingExpiringSoon(listing.expires_at) && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Ističe uskoro
                    </div>
                  )}
                  <button className="absolute top-4 right-12 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.city}, {listing.country}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{listing.capacity} gostiju</span>
                    </div>
                    <div className="flex items-center">
                      <span>{listing.bedrooms} spavaće sobe</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(listing.default_monthly_price)}
                    </span>
                    <span className="text-sm text-gray-600">/mjesec</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/listings"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Pogledaj sve smještaje</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popularne Destinacije
            </h2>
            <p className="text-xl text-gray-600">
              Istražite najbolje lokacije za odmor
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Jahorina', country: 'BiH', image: '/destinations/jahorina.jpg', slug: 'ba/jahorina' },
              { name: 'Kopaonik', country: 'Srbija', image: '/destinations/kopaonik.jpg', slug: 'rs/kopaonik' },
              { name: 'Tara', country: 'Srbija', image: '/destinations/tara.jpg', slug: 'rs/tara' },
              { name: 'Neum', country: 'BiH', image: '/destinations/neum.jpg', slug: 'ba/neum' },
            ].map((destination) => (
              <Link
                key={destination.slug}
                href={`/${destination.slug}`}
                className="group relative h-48 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-semibold mb-1">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kako Funkcioniše
            </h2>
            <p className="text-xl text-gray-600">
              Jednostavni koraci do savršenog odmora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pretražite</h3>
              <p className="text-gray-600">
                Pronađite idealan smještaj u željenoj lokaciji
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rezervišite</h3>
              <p className="text-gray-600">
                Kontaktirajte direktno vlasnika i dogovorite boravak
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Uživajte</h3>
              <p className="text-gray-600">
                Doživite autentično iskustvo sa lokalnim domaćinima
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Imate Smještaj za Iznajmljivanje?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Povežite se sa hiljadama putnika i zaradite dodatni prihod
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/listings/new"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Objavite Smještaj
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Pogledajte Cijene
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
