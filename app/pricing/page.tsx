'use client'

import { Pricing } from '@/components/Pricing'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <Header />
      <Pricing />
      <Footer />
    </main>
  )
}
