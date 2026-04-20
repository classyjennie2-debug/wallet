'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { MyWalletLogo } from '@/components/logo'
import { WalletConnect } from '@/components/wallet-connect'
import { DashboardV2 } from '@/components/dashboard-v2'
import { DeadCoinDetector } from '@/components/dead-coin-detector'
import { LandingPageV2 as LandingPage } from '@/components/landing-page-v2'
import { TransactionHistory } from '@/components/transaction-history'
import { TokenAllowanceManager } from '@/components/token-allowance-manager'
import { SecurityAudit } from '@/components/security-audit'
import { WalletRestoration } from '@/components/wallet-restoration'
import { PortfolioOverview } from '@/components/portfolio-overview'

export const dynamic = 'force-dynamic'

type Tab = 'dashboard' | 'history' | 'security' | 'recovery'

export default function Home() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tabs: { id: Tab; label: string; icon: string; color?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'recovery', label: 'Recovery', icon: '🔄' },
  ]

  // Render landing page on SSR and until wallet is connected after hydration
  if (!isMounted || !isConnected) {
    return <LandingPage />
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="relative z-10">
        {/* Premium Header */}
        <header className="sticky top-0 z-40 border-b border-purple-900/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="max-w-full mx-auto px-3 sm:px-4 py-2 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="block md:hidden">
                      <MyWalletLogo size="sm" variant="icon" />
                    </div>
                    <div className="hidden md:block">
                      <MyWalletLogo size="md" variant="full" />
                    </div>
                  </div>
                  <div className="flex-1 sm:flex-none flex justify-end">
                    <div className="w-full sm:w-auto">
                      <WalletConnect />
                    </div>
                  </div>
            </div>
          </div>
        </header>

        {/* Navigation - Premium Styling */}
        <nav className="sticky top-12 sm:top-16 z-30 border-b border-purple-900/50 bg-slate-950/50 backdrop-blur-xl">
          <div className="max-w-full mx-auto px-1 sm:px-4">
            <div className="flex gap-0.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 rounded-t-lg touch-target ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-300 bg-purple-600/10'
                      : 'border-transparent text-slate-400 hover:text-purple-300 active:text-purple-200'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  style={{ minHeight: '44px', touchAction: 'manipulation' }}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-20 sm:pb-24 safe-area-bottom">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in-50 space-y-6">
              <DashboardV2 onNavigate={(t) => setActiveTab(t)} />
              <PortfolioOverview />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Transaction History</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">View and analyze your transactions</p>
              </div>
              <TransactionHistory />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in-50 space-y-6">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Security & Tools</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Contract checks, dead-coin scanner, and allowance manager</p>
              </div>
              <div className="space-y-6">
                <SecurityAudit />
                <DeadCoinDetector />
                <TokenAllowanceManager />
              </div>
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="animate-in fade-in-50 space-y-6">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Recovery & Guidance</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Wallet restoration, connection troubleshooting, and upgrade guides</p>
              </div>
              <div className="space-y-6">
                <WalletRestoration />
                {/* connection troubleshooter / guides could be added here */}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Safe Area */}
        <div className="h-4 sm:h-0" />

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-sm py-4 sm:py-6 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              🔐 MyWallet.Help © 2026 • Non-custodial • Self-sovereign
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
