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
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto w-full max-w-full px-4 py-3 sm:px-4 sm:py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                <div className="block md:hidden">
                  <MyWalletLogo size="sm" variant="icon" />
                </div>
                <div className="hidden md:block">
                  <MyWalletLogo size="md" variant="full" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm text-slate-400">Premium wallet intelligence for recovery, security, and portfolio management.</p>
                </div>
              </div>
              <div className="flex flex-1 justify-end sm:flex-none items-center gap-3">
                {activeTab !== 'dashboard' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-slate-900"
                  >
                    ← Back to dashboard
                  </button>
                )}
                <div className="w-full sm:w-auto">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
          {activeTab !== 'dashboard' && (
            <div className="mx-auto w-full max-w-full px-4 pb-3 sm:px-4">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
              >
                ← Back to dashboard
              </button>
            </div>
          )}
        </header>

        <nav className="sticky top-[112px] z-30 mx-auto w-full max-w-7xl px-2 py-3 sm:px-4 sm:py-4">
          <div className="overflow-hidden rounded-full border border-white/10 bg-slate-950/90 px-2 py-2 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex gap-2 overflow-x-auto px-1" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500/20 via-slate-900/80 to-cyan-500/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-base text-slate-300 transition-colors ${activeTab === tab.id ? 'bg-white/10 text-white' : ''}`}>{tab.icon}</span>
                  <span>{tab.label}</span>
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
