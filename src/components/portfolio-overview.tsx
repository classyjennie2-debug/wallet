'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokens } from '@/hooks/useTokens'

export const PortfolioOverview = () => {
  const { address, isConnected } = useAccount()
  const { portfolio, loading, error, refetch } = useTokens(isConnected ? address : undefined)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-96 bg-white/5 rounded-lg animate-pulse" />
  }

  if (!isConnected || !address) {
    return (
      <div className="p-8 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 text-center space-y-3">
        <p className="text-slate-400">💼 Connect your wallet to view your portfolio</p>
        <p className="text-sm text-slate-500">Your token holdings will appear here once connected</p>
      </div>
    )
  }

  if (loading && !portfolio) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-lg animate-pulse" />
        <div className="h-40 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-3">
        <p className="text-red-300 font-semibold">❌ Failed to load tokens</p>
        <p className="text-sm text-red-300/70">{error}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!portfolio || portfolio.tokens.length === 0) {
    return (
      <div className="p-8 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 text-center space-y-3">
        <p className="text-slate-400">📭 No tokens found in this wallet</p>
        <p className="text-sm text-slate-500">Your portfolio appears to be empty</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Value Card */}
      <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-600/30">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <p className="text-slate-400 text-sm">Total Portfolio Value</p>
          <p className="text-4xl font-bold text-white">
            ${portfolio.totalValue}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>📊 {portfolio.tokens.length} tokens</span>
            <span>•</span>
            <span>Updated {new Date(portfolio.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Your Holdings</h3>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="text-xs px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded transition-colors disabled:opacity-50"
          >
            {loading ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
        </div>

        <div className="space-y-2">
          {portfolio.tokens.map((token) => (
            <div
              key={token.address}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 flex items-start gap-3">
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23666%22/%3E%3Ctext x=%2250%22 y=%2250%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22white%22%3E%3F%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-xs text-slate-400">{token.name}</p>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {parseFloat(token.balance).toFixed(6)} {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-white">${token.value}</p>
                  <p className="text-xs text-slate-400">${token.price.toFixed(6)}/each</p>
                </div>
              </div>

              {/* Progress bar showing percentage */}
              <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{
                    width: `${(parseFloat(token.value) / parseFloat(portfolio.totalValue)) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-blue-400">{portfolio.tokens.length}</p>
          <p className="text-xs text-slate-400 mt-1">Token Types</p>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-purple-400">
            {((parseFloat(portfolio.tokens[0]?.value || '0') / parseFloat(portfolio.totalValue)) * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">Top Token</p>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            ${(parseFloat(portfolio.totalValue) / portfolio.tokens.length).toFixed(0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Avg Token</p>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-cyan-400">
            {portfolio.tokens.filter(t => parseFloat(t.value) > 100).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Major Tokens</p>
        </div>
      </div>
    </div>
  )
}
