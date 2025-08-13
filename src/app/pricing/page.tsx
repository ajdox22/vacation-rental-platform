'use client'

import { useState } from 'react'
import { Check, Star, Zap, Crown } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { formatPrice } from '@/utils'

const pricingPlans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 25,
    duration: '1 month',
    description: 'Perfect for testing the platform',
    features: [
      'List 1 property',
      'Basic analytics',
      'Email support',
      'Standard listing features'
    ],
    popular: false,
    icon: Star
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 65,
    duration: '3 months',
    description: 'Great value for regular hosts',
    features: [
      'List 1 property',
      'Advanced analytics',
      'Priority support',
      'Featured listing option',
      'Social media promotion'
    ],
    popular: true,
    icon: Zap
  },
  {
    id: 'biannual',
    name: 'Biannual',
    price: 110,
    duration: '6 months',
    description: 'Best value for serious hosts',
    features: [
      'List 1 property',
      'Premium analytics',
      '24/7 support',
      'Featured listing included',
      'Social media promotion',
      'Instagram promotion (first time)'
    ],
    popular: false,
    icon: Crown
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 200,
    duration: '12 months',
    description: 'Ultimate value for professional hosts',
    features: [
      'List 1 property',
      'Premium analytics',
      '24/7 priority support',
      'Featured listing included',
      'Social media promotion',
      'Instagram promotion (first time)',
      'Custom branding options',
      'Advanced SEO optimization'
    ],
    popular: false,
    icon: Crown
  }
]

const bannerPricing = {
  name: 'Premium Banner Ads',
  price: 100,
  duration: '2 months',
  description: 'Promote your business on our homepage',
  features: [
    'Rotating banner on homepage',
    'Up to 3 active banners',
    'Click tracking',
    'Custom design support',
    'Performance analytics'
  ]
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    // Here you would typically redirect to payment or show payment modal
    console.log('Selected plan:', planId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start listing your vacation rental and connect with travelers worldwide. 
            Choose the plan that best fits your needs.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                    <span className="text-gray-600">/{plan.duration}</span>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Banner Advertising */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Banner Advertising
            </h2>
            <p className="text-xl text-gray-600">
              Promote your business on our homepage and reach thousands of potential customers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(bannerPricing.price)}</span>
                <span className="text-gray-600">/{bannerPricing.duration}</span>
              </div>
              
              <p className="text-gray-600 mb-6">{bannerPricing.description}</p>
              
              <button className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            <div className="space-y-3">
              {bannerPricing.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated based on your current billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens when my listing expires?
              </h3>
              <p className="text-gray-600">
                Your listing will be automatically deactivated when it expires. You'll receive email reminders 5 days before expiration to renew.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for new subscriptions. Contact our support team for assistance.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does Instagram promotion work?
              </h3>
              <p className="text-gray-600">
                When you publish a listing for the first time, we'll promote it on our Instagram for free. Subsequent promotions cost 20 KM.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <button className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
