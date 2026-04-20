'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

type Tab = 'dashboard' | 'charts' | 'history' | 'risk' | 'nft' | 'allowances' | 'security' | 'recovery' | 'swap' | 'send' | 'analysis'

interface DashboardV2Props {
  onNavigate?: (tab: Tab) => void
}

export const DashboardV2 = ({ onNavigate }: DashboardV2Props) => {
  const { tokens, loading, totalBalance, fetchTokens } = useWallet()
  const { isConnected, address } = useAccount()
  const { handleError } = useErrorHandler()
  const [stats, setStats] = useState({
    assetsCount: 0,
    chainsActive: 0,
    portfolioChange: '+2.34%'
  })

  useEffect(() => {
    if (isConnected) {
      fetchTokens().catch((err) => {
        handleError(err, 'NETWORK_ERROR')
      })
    }
  }, [isConnected, fetchTokens, handleError])

  useEffect(() => {
    setStats({
      assetsCount: tokens.length,
      chainsActive: Math.min(Math.max(Math.ceil(tokens.length / 3), 1), 4),
      portfolioChange: '+2.34%'
    })
  }, [tokens])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="mb-6 text-7xl opacity-80">🔐</div>
        <h2 className="text-2xl font-bold text-white mb-2">Secure Dashboard</h2>
        <p className="text-gray-400 text-sm text-center max-w-md">Connect your wallet to unlock your personal finance dashboard with real-time portfolio tracking</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-lg sm:rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-80 bg-gradient-to-br from-white/5 to-white/10 rounded-lg sm:rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Balance */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-600/30 hover:border-purple-600/60 hover:bg-purple-600/15 transition-all cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2">Total Balance</p>
            <p className="text-xl sm:text-2xl font-bold text-white">${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-slate-400 mt-2">Across all chains</p>
          </div>
        </div>

        {/* Assets Count */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-600/30 hover:border-blue-600/60 hover:bg-blue-600/15 transition-all cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-2">Assets</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.assetsCount}</p>
            <p className="text-xs text-slate-400 mt-2">Tokens held</p>
          </div>
        </div>

        {/* Active Chains */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-emerald-600/10 to-teal-600/5 border border-emerald-600/30 hover:border-emerald-600/60 hover:bg-emerald-600/15 transition-all cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-2">Networks</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.chainsActive}</p>
            <p className="text-xs text-slate-400 mt-2">Active chains</p>
          </div>
        </div>

        {/* Portfolio Change */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-amber-600/10 to-orange-600/5 border border-amber-600/30 hover:border-amber-600/60 hover:bg-amber-600/15 transition-all cursor-pointer">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">24h Change</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.portfolioChange}</p>
            <p className="text-xs text-slate-400 mt-2">Portfolio trend</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Portfolio Breakdown */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-8 bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-600/30 backdrop-blur-xl">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Your Assets</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">Diversified across multiple chains</p>
              </div>
              <div className="text-3xl opacity-70">📊</div>
            </div>

            {tokens.length > 0 ? (
              <div className="space-y-3">
                {tokens.slice(0, 5).map((token) => (
                  <div key={token.address} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-600/20 hover:border-purple-600/40 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {token.symbol[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{token.symbol}</p>
                        <p className="text-xs text-slate-400 truncate">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white text-sm">${token.usdValue.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">{token.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No tokens found. Start by transferring crypto to your wallet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {/* Send */}
          <button
            onClick={() => onNavigate?.('send')}
            className="w-full relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-emerald-600/10 to-teal-600/5 border border-emerald-600/30 hover:border-emerald-600/60 hover:bg-emerald-600/15 transition-all group"
          >
            <div className="relative z-10 text-left">
              <div className="text-2xl mb-2">📤</div>
              <p className="font-semibold text-white text-sm">Send Tokens</p>
              <p className="text-xs text-slate-400 mt-1">Transfer funds</p>
            </div>
          </button>

          {/* Swap */}
          <button
            onClick={() => onNavigate?.('swap')}
            className="w-full relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-600/30 hover:border-purple-600/60 hover:bg-purple-600/15 transition-all group"
          >
            <div className="relative z-10 text-left">
              <div className="text-2xl mb-2">⚡</div>
              <p className="font-semibold text-white text-sm">Swap Tokens</p>
              <p className="text-xs text-slate-400 mt-1">Exchange tokens</p>
            </div>
          </button>

          {/* Analyze */}
          <button
            onClick={() => onNavigate?.('analysis')}
            className="w-full relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-amber-600/10 to-orange-600/5 border border-amber-600/30 hover:border-amber-600/60 hover:bg-amber-600/15 transition-all group"
          >
            <div className="relative z-10 text-left">
              <div className="text-2xl mb-2">🔍</div>
              <p className="font-semibold text-white text-sm">Scan Portfolio</p>
              <p className="text-xs text-slate-400 mt-1">Analyze holdings</p>
            </div>
          </button>
        </div>
      </div>

      {/* Suggested Features Cards */}
      <div className="border-t border-purple-900/50 pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Explore Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: '📈', title: 'Price Charts', desc: 'Real-time tracking' },
            { icon: '⏱️', title: 'History', desc: 'Transaction logs' },
            { icon: '🎯', title: 'Price Alerts', desc: 'Notifications' },
            { icon: '🔄', title: 'Staking', desc: 'Earn rewards' },
            { icon: '🖼️', title: 'NFTs', desc: 'NFT portfolio' },
            { icon: '💡', title: 'DeFi', desc: 'Yield farming' },
          ].map((feature, i) => (
            <div key={i} className="p-3 sm:p-4 rounded-lg bg-white/5 border border-purple-600/20 hover:border-purple-600/40 transition-all">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="font-semibold text-white text-sm">{feature.title}</p>
              <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
