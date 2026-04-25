'use client'

import { useState } from 'react'
import dynamicImport from 'next/dynamic'
import { useAccount } from 'wagmi'

export const dynamic = 'force-dynamic'

// Dynamically import landing page to prevent evaluation during build
const LandingPage = dynamicImport(
  () => import('../components/landing-page-v2').then((mod) => ({ default: mod.LandingPageV2 })),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" />,
  }
)

// Dynamically import the dashboard to prevent wagmi hooks from running during SSR
const DashboardContent = dynamicImport(() => import('../components/dashboard-content'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" />,
})

type Tab = 'dashboard' | 'alerts' | 'security' | 'solutions'

export default function Home() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  if (!isConnected) {
    return <LandingPage />
  }

  return <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
}
