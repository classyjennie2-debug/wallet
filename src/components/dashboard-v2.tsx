'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

export const DashboardV2 = () => {
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
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-500/50 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/5 transition-all"></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-cyan-300/80 uppercase tracking-wide mb-2">Balance</p>
            <p className="text-xl sm:text-2xl font-bold text-white">${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-cyan-300/60 mt-2">Ready to trade</p>
          </div>
        </div>

        {/* Assets Count */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/5 transition-all"></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-purple-300/80 uppercase tracking-wide mb-2">Assets</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.assetsCount}</p>
            <p className="text-xs text-purple-300/60 mt-2">Tokens held</p>
          </div>
        </div>

        {/* Active Chains */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/5 transition-all"></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wide mb-2">Chains</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.chainsActive}</p>
            <p className="text-xs text-emerald-300/60 mt-2">Networks active</p>
          </div>
        </div>

        {/* Portfolio Change */}
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 hover:border-orange-500/50 transition-all cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/5 transition-all"></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-orange-300/80 uppercase tracking-wide mb-2">Change (24h)</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{stats.portfolioChange}</p>
            <p className="text-xs text-orange-300/60 mt-2">Positive trend</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Portfolio Breakdown */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-8 bg-gradient-to-br from-white/5 via-white/3 to-white/1 border border-white/10 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Your Assets</h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Diversified across multiple chains</p>
              </div>
              <div className="text-3xl opacity-50">📊</div>
            </div>

            {tokens.length > 0 ? (
              <div className="space-y-3">
                {tokens.slice(0, 5).map((token) => (
                  <div key={token.address} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                        {token.symbol[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{token.symbol}</p>
                        <p className="text-xs text-gray-400 truncate">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white text-sm">${token.usdValue.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{token.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No tokens found. Start by transferring crypto to your wallet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Send */}
          <button className="w-full relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/5 transition-all"></div>
            <div className="relative z-10 text-left">
              <div className="text-2xl mb-2">📤</div>
              <p className="font-bold text-white text-sm">Send Tokens</p>
              <p className="text-xs text-emerald-300/60 mt-1">Transfer to any wallet</p>
            </div>
          </button>

          {/* Swap */}
          <button className="w-full relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/5 transition-all"></div>
            <div className="relative z-10 text-left">
              <div className="text-2xl mb-2">⚡</div>
              <p className="font-bold text-white text-sm">Swap Tokens</p>
              <p className="text-xs text-purple-300/60 mt-1">Instant exchange</p>
            </div>
          </button>

          {/* Analyze */}
          <button className="w-full relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-6 bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 hover:border-orange-500/50 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/5 transition-all"></div>
            <div className="relative z-10 text-left">
              <div className="text-2xl mb-2">🔍</div>
              <p className="font-bold text-white text-sm">Scan Portfolio</p>
              <p className="text-xs text-orange-300/60 mt-1">Find dead coins</p>
            </div>
          </button>
        </div>
      </div>

      {/* Suggested Features Cards */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Coming Soon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: '📈', title: 'Price Charts', desc: 'Real-time price tracking' },
            { icon: '⏱️', title: 'History', desc: 'Transaction timeline' },
            { icon: '🎯', title: 'Price Alerts', desc: 'Custom notifications' },
            { icon: '🔄', title: 'Staking', desc: 'Earn passive income' },
            { icon: '🖼️', title: 'NFTs', desc: 'NFT portfolio' },
            { icon: '💡', title: 'DeFi', desc: 'Yield opportunities' },
          ].map((feature, i) => (
            <div key={i} className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p className="font-semibold text-white text-sm">{feature.title}</p>
              <p className="text-xs text-gray-400 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
