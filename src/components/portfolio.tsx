'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect, useRef } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

export const Portfolio = () => {
  const { tokens, loading, totalBalance, fetchTokens } = useWallet()
  const { isConnected } = useAccount()
  const { handleError } = useErrorHandler()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!isConnected) {
      hasFetched.current = false
      return
    }

    if (hasFetched.current) {
      return
    }

    hasFetched.current = true
    fetchTokens().catch((err) => {
      handleError(err, 'NETWORK_ERROR')
    })
  }, [isConnected, fetchTokens, handleError])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
        <div className="mb-4 sm:mb-6 text-5xl sm:text-7xl opacity-80">👛</div>
        <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Wallet Not Connected</h2>
        <p className="text-gray-400 text-xs sm:text-sm text-center max-w-xs">Connect your wallet to view and manage your assets</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-24">
        <div className="space-y-4 text-center">
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin mx-auto"></div>
          <p className="text-gray-400 text-xs sm:text-sm">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Summary Card */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-2xl p-5 sm:p-8 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        <div className="relative z-10">
          <p className="text-gray-300 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Portfolio Value</p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
            <span className="text-emerald-400">✓</span> {tokens.filter((t) => !t.isDead).length} active assets
          </p>
        </div>
      </div>

      {/* Tokens List */}
      {tokens.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {tokens.map((token) => (
            <div
              key={token.address}
              className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-5 transition-all duration-300 ${
                token.isDead
                  ? 'bg-red-500/5 border border-red-500/20 hover:border-red-500/40'
                  : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10'
              } backdrop-blur-sm`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base">{token.symbol}</p>
                    <p className="text-xs text-gray-400">{token.name}</p>
                  </div>
                  {token.isDead && (
                    <span className="px-2.5 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-full">Dead</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Balance</span>
                    <span className="text-white font-medium text-xs sm:text-sm">{parseFloat(token.balance).toFixed(4)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between">
                    <span className="text-gray-400 text-xs">Value</span>
                    <span className="text-white font-bold text-sm sm:text-base">${token.usdValue?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg sm:rounded-xl p-6 sm:p-8 bg-white/5 border border-white/10 backdrop-blur-sm text-center">
          <p className="text-gray-400 text-sm">No tokens found in your wallet</p>
        </div>
      )}
    </div>
  )
}

