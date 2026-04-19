'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'

export const Portfolio = () => {
  const { tokens, loading, error, totalBalance, fetchTokens } = useWallet()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      fetchTokens()
    }
  }, [isConnected, fetchTokens])

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to view your portfolio</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Portfolio Value</p>
            <h2 className="text-4xl font-bold text-white">
              ${totalBalance.toFixed(2)}
            </h2>
          </div>
          <div className="text-5xl">💼</div>
        </div>
      </div>

      {/* Tokens Grid */}
      {tokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <div
              key={token.address}
              className={`p-4 rounded-lg border ${
                token.isDead
                  ? 'bg-red-900/20 border-red-600/30'
                  : 'bg-slate-800 border-slate-700'
              } hover:border-purple-500/50 transition-colors`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {token.image && (
                    <img
                      src={token.image}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">{token.symbol}</p>
                    <p className="text-xs text-gray-400">{token.name}</p>
                  </div>
                </div>
                {token.isDead && <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">Dead</span>}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-white font-medium">{parseFloat(token.balance).toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Value:</span>
                  <span className="text-white font-medium">${token.usdValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-gray-400">No tokens found in your wallet</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
