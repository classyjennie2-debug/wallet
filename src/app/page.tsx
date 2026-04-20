'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { MyWalletLogo } from '@/components/logo'
import { WalletConnect } from '@/components/wallet-connect'
import { DashboardV2 } from '@/components/dashboard-v2'
import { DeadCoinDetector } from '@/components/dead-coin-detector'
import { TokenSwap } from '@/components/token-swap'
import { SendToken } from '@/components/send-token'
import { LandingPageV2 as LandingPage } from '@/components/landing-page-v2'
import { PriceCharts } from '@/components/price-charts'
import { TransactionHistory } from '@/components/transaction-history'
import { PortfolioRiskScore } from '@/components/portfolio-risk-score'
import { NFTPortfolio } from '@/components/nft-portfolio'
import { TokenAllowanceManager } from '@/components/token-allowance-manager'
import { SecurityAudit } from '@/components/security-audit'
import { WalletRecovery } from '@/components/wallet-recovery'

type Tab = 'dashboard' | 'charts' | 'history' | 'risk' | 'nft' | 'allowances' | 'security' | 'recovery' | 'swap' | 'send' | 'analysis'

export default function Home() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const tabs: { id: Tab; label: string; icon: string; color: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'from-cyan-500 to-blue-500' },
    { id: 'charts', label: 'Charts', icon: '📈', color: 'from-emerald-500 to-teal-500' },
    { id: 'history', label: 'History', icon: '📜', color: 'from-blue-500 to-cyan-500' },
    { id: 'risk', label: 'Risk', icon: '⚠️', color: 'from-orange-500 to-red-500' },
    { id: 'nft', label: 'NFTs', icon: '🖼️', color: 'from-purple-500 to-pink-500' },
    { id: 'allowances', label: 'Approvals', icon: '🔐', color: 'from-yellow-500 to-orange-500' },
    { id: 'security', label: 'Security', icon: '🛡️', color: 'from-red-500 to-pink-500' },
    { id: 'recovery', label: 'Recovery', icon: '🔑', color: 'from-indigo-500 to-purple-500' },
    { id: 'swap', label: 'Swap', icon: '⚡', color: 'from-purple-500 to-pink-500' },
    { id: 'send', label: 'Send', icon: '📤', color: 'from-teal-500 to-emerald-500' },
    { id: 'analysis', label: 'Scan', icon: '🔍', color: 'from-orange-500 to-yellow-500' },
  ]

  // Render landing page on SSR and until wallet is connected after hydration
  if (!isMounted || !isConnected) {
    return <LandingPage />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent rounded-full blur-3xl" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Subtle grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Premium Header */}
        <header className="sticky top-0 z-40 border-b border-purple-900/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="max-w-full mx-auto px-3 sm:px-4 py-2 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg border border-purple-400/30">
                  <span className="text-lg font-bold text-white">💎</span>
                </div>
                <MyWalletLogo size="sm" />
              </div>
              <div className="flex-1 sm:flex-none">
                <WalletConnect />
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
            <div className="animate-in fade-in-50">
              <DashboardV2 onNavigate={setActiveTab} />
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Price Charts</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Track token prices over time</p>
              </div>
              <PriceCharts />
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

          {activeTab === 'risk' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Risk Score</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Analyze your portfolio risk metrics</p>
              </div>
              <PortfolioRiskScore />
            </div>
          )}

          {activeTab === 'nft' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">NFT Portfolio</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">View your NFT collection</p>
              </div>
              <NFTPortfolio />
            </div>
          )}

          {activeTab === 'allowances' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Token Allowances</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage contract approvals</p>
              </div>
              <TokenAllowanceManager />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Security Audit</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Check contract security status</p>
              </div>
              <SecurityAudit />
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Wallet Recovery</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Recover your wallet securely</p>
              </div>
              <WalletRecovery />
            </div>
          )}

          {activeTab === 'swap' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Swap Tokens</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Exchange your crypto instantly</p>
              </div>
              <TokenSwap />
            </div>
          )}

          {activeTab === 'send' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Send Tokens</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Transfer to any address</p>
              </div>
              <SendToken />
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Dead Coin Scanner</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Identify and remove worthless tokens</p>
              </div>
              <DeadCoinDetector />
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

