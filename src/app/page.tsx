'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { MyWalletLogo } from '@/components/logo'
import { WalletConnect } from '@/components/wallet-connect'
import { Portfolio } from '@/components/portfolio'
import { DeadCoinDetector } from '@/components/dead-coin-detector'
import { TokenSwap } from '@/components/token-swap'
import { SendToken } from '@/components/send-token'
import { LandingPage } from '@/components/landing-page'

type Tab = 'portfolio' | 'swap' | 'send' | 'analysis'

export default function Home() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<Tab>('portfolio')

  const tabs: { id: Tab; label: string; icon: string; color: string }[] = [
    { id: 'portfolio', label: 'Assets', icon: '💰', color: 'from-cyan-500 to-blue-500' },
    { id: 'swap', label: 'Swap', icon: '⚡', color: 'from-purple-500 to-pink-500' },
    { id: 'send', label: 'Send', icon: '📤', color: 'from-emerald-500 to-teal-500' },
    { id: 'analysis', label: 'Scan', icon: '🔍', color: 'from-orange-500 to-red-500' },
  ]

  // Show landing page if not connected
  if (!isConnected) {
    return <LandingPage />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <MyWalletLogo size="sm" variant="icon" />
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="sticky top-14 sm:top-16 z-30 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-2 sm:px-4">
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? `border-transparent bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`
                      : 'border-transparent text-gray-400 hover:text-gray-300'
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

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-20 sm:pb-24">
          {activeTab === 'portfolio' && (
            <div className="animate-in fade-in-50">
              <Portfolio />
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
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Dead Coin Scanner</h1>
                <p className="text-gray-400 text-sm mt-1">Identify and remove worthless tokens</p>
              </div>
              <DeadCoinDetector />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-sm py-6 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs text-gray-500">
              🔐 MyWallet.Help © 2026 • Non-custodial • Self-sovereign
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

