'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

export const DeadCoinDetector = () => {
  const { deadCoins, removeDeadCoin } = useWallet()
  const { isConnected } = useAccount()
  const [removingAddress, setRemovingAddress] = useState<string | null>(null)
  const { showSuccess } = useErrorHandler()

  const handleRemove = (address: string) => {
    try {
      setRemovingAddress(address)
      removeDeadCoin(address)
      showSuccess('Coin Removed', 'Dead coin has been removed from your portfolio tracking')
      setTimeout(() => setRemovingAddress(null), 1500)
    } catch {
      setRemovingAddress(null)
    }
  }

  const handleRemoveAll = () => {
    if (deadCoins.length === 0) return
    
    try {
      deadCoins.forEach((coin) => {
        removeDeadCoin(coin.address)
      })
      showSuccess('All Dead Coins Removed', `${deadCoins.length} dead coin(s) have been cleaned up`)
    } catch (error) {
      console.error('Error removing dead coins:', error)
    }
  }

  if (!isConnected) {
    return null
  }

  if (deadCoins.length === 0) {
    return (
      <div className="rounded-2xl p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm text-center">
        <div className="text-5xl mb-3">✓</div>
        <h3 className="font-semibold text-emerald-400 text-lg mb-1">Portfolio is Healthy</h3>
        <p className="text-sm text-gray-400">No dead or inactive coins detected</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/10 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-red-500/10 bg-red-500/5">
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-400 text-lg">Found {deadCoins.length} Dead Coin{deadCoins.length !== 1 ? 's' : ''}</h3>
            <p className="text-sm text-gray-400 mt-1">These tokens appear inactive or have no liquidity</p>
          </div>
        </div>
      </div>

      {/* Dead Coins List */}
      <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
        {deadCoins.map((coin) => (
          <div key={coin.address} className="p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{coin.symbol}</p>
                <p className="text-xs text-gray-500 font-mono mt-1 break-all">{coin.address.slice(0, 10)}...{coin.address.slice(-8)}</p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-medium text-red-400 text-sm">${coin.usdValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{parseFloat(coin.balance).toFixed(4)}</p>
              </div>
            </div>

            {coin.deadReasons && coin.deadReasons.length > 0 && (
              <div className="mb-3 text-xs space-y-1">
                {coin.deadReasons.map((reason, idx) => (
                  <p key={idx} className="text-gray-400 flex items-center gap-2">
                    <span>•</span> <span>{reason}</span>
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => handleRemove(coin.address)}
              disabled={removingAddress === coin.address}
              className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/30 disabled:bg-gray-700/20 text-red-400 hover:text-red-300 text-xs font-medium rounded transition-colors disabled:cursor-not-allowed border border-red-600/20 hover:border-red-600/40"
            >
              {removingAddress === coin.address ? '✓ Removing...' : '🗑️ Remove'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-red-500/5 border-t border-red-500/10 flex gap-3">
        <button
          onClick={handleRemoveAll}
          className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>🧹</span> Remove All {deadCoins.length}
        </button>
      </div>
    </div>
  )
}
