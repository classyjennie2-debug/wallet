'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MyWalletLogo } from '@/components/logo'
import { WalletConnect } from '@/components/wallet-connect'
import { DashboardV2 } from '@/components/dashboard-v2'
import { DeadCoinDetector } from '@/components/dead-coin-detector'
import { TransactionHistory } from '@/components/transaction-history'
import { TokenAllowanceManager } from '@/components/token-allowance-manager'
import { SecurityAudit } from '@/components/security-audit'
import { WalletRestoration } from '@/components/wallet-restoration'
import { PortfolioOverview } from '@/components/portfolio-overview'

type Tab = 'dashboard' | 'history' | 'security' | 'recovery'

interface DashboardContentProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'DB' },
  { id: 'history', label: 'History', icon: 'TX' },
  { id: 'security', label: 'Security', icon: 'SC' },
  { id: 'recovery', label: 'Recovery', icon: 'RC' },
]

export default function DashboardContent({ activeTab, setActiveTab }: DashboardContentProps) {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  useEffect(() => {
    if (!isConnected && openConnectModal) {
      const timer = setTimeout(() => openConnectModal(), 300)
      return () => clearTimeout(timer)
    }
  }, [isConnected, openConnectModal])

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-purple-900/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto max-w-full px-3 py-2 sm:px-4 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="block md:hidden">
                  <MyWalletLogo size="sm" variant="icon" />
                </div>
                <div className="hidden md:block">
                  <MyWalletLogo size="md" variant="full" />
                </div>
              </div>
              <div className="flex flex-1 justify-end sm:flex-none">
                <div className="w-full sm:w-auto">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="sticky top-12 z-30 border-b border-purple-900/50 bg-slate-950/50 backdrop-blur-xl sm:top-16">
          <div className="mx-auto max-w-full px-1 sm:px-4">
            <div className="flex gap-0.5 overflow-x-auto pb-1 sm:gap-2 sm:pb-0" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-[44px] items-center justify-center gap-1 rounded-t-lg border-b-2 px-2 py-2 text-xs font-medium whitespace-nowrap transition-all touch-manipulation sm:px-4 sm:py-3 sm:text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 bg-purple-600/10 text-purple-300'
                      : 'border-transparent text-slate-400 hover:text-purple-300 active:text-purple-200'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-2 py-4 pb-20 sm:px-4 sm:py-8 sm:pb-24">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in-50">
              <DashboardV2 onNavigate={(tab) => setActiveTab(tab as Tab)} />
              <PortfolioOverview />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Transaction History</h1>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">View and analyze your transactions.</p>
              </div>
              <TransactionHistory />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Security & Tools</h1>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">Contract checks, dead-coin scanner, and allowance manager.</p>
              </div>
              <div className="space-y-6">
                <SecurityAudit />
                <DeadCoinDetector />
                <TokenAllowanceManager />
              </div>
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Recovery & Guidance</h1>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">Wallet restoration, connection troubleshooting, and upgrade guides.</p>
              </div>
              <WalletRestoration />
            </div>
          )}
        </div>

        <div className="h-4 sm:h-0" />
      </div>
    </main>
  )
}
