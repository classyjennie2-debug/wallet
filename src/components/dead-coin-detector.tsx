'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'

export const DeadCoinDetector = () => {
  const { deadCoins, removeDeadCoin } = useWallet()
  const { isConnected } = useAccount()
  const [removingAddress, setRemovingAddress] = useState<string | null>(null)

  if (!isConnected) {
    return null
  }

  if (deadCoins.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl p-6 border border-green-600/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="font-semibold text-green-400">No Dead Coins Detected</h3>
            <p className="text-sm text-green-300/70">Your wallet is clean!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl border border-red-600/30 overflow-hidden">
      <div className="p-6 border-b border-red-600/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚠️</span>
          <h3 className="font-semibold text-red-400">Found {deadCoins.length} Dead Coin(s)</h3>
        </div>
        <p className="text-sm text-red-300/70">Remove them to clean up your wallet</p>
      </div>

      <div className="divide-y divide-red-600/20">
        {deadCoins.map((coin) => (
          <div key={coin.address} className="p-4 hover:bg-red-900/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-white">{coin.symbol}</p>
                <p className="text-xs text-gray-400">{coin.address.slice(0, 10)}...</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-400">${coin.usdValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{parseFloat(coin.balance).toFixed(4)} {coin.symbol}</p>
              </div>
            </div>

            {coin.deadReasons && coin.deadReasons.length > 0 && (
              <div className="mb-3 space-y-1">
                {coin.deadReasons.map((reason, idx) => (
                  <p key={idx} className="text-xs text-red-300/60 flex items-center gap-2">
                    <span>•</span> {reason}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setRemovingAddress(coin.address)
                removeDeadCoin(coin.address)
                setTimeout(() => setRemovingAddress(null), 1000)
              }}
              disabled={removingAddress === coin.address}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
            >
              {removingAddress === coin.address ? 'Removing...' : 'Remove Coin'}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-red-900/10 border-t border-red-600/20">
        <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors">
          Remove All Dead Coins
        </button>
      </div>
    </div>
  )
}
