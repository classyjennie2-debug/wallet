'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

const DeadCoinIcon = ({ kind }: { kind: 'healthy' | 'warning' | 'remove' | 'sweep' }) => {
  const iconMap = {
    healthy: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M9.5 12.5l1.7 1.7 3.3-4" />
      </>
    ),
    warning: (
      <>
        <path d="M12 4l8 14H4L12 4z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </>
    ),
    remove: (
      <>
        <path d="M5 7h14" />
        <path d="M9 7V5h6v2" />
        <path d="M8 7l1 11h6l1-11" />
      </>
    ),
    sweep: (
      <>
        <path d="M4 17h10" />
        <path d="M12 7l5 10" />
        <path d="M14.5 7h4" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

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
      <div className="rounded-[24px] border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
          <DeadCoinIcon kind="healthy" />
        </div>
        <h3 className="font-semibold text-emerald-300 text-lg mb-1">Portfolio is Healthy</h3>
        <p className="text-sm text-gray-400">No dead or inactive coins detected.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/10">
      <div className="border-b border-red-500/10 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
            <DeadCoinIcon kind="warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-400 text-lg">Found {deadCoins.length} Dead Coin{deadCoins.length !== 1 ? 's' : ''}</h3>
            <p className="text-sm text-gray-400 mt-1">These tokens appear inactive or have no liquidity.</p>
          </div>
        </div>
      </div>

      <div className="max-h-96 divide-y divide-white/5 overflow-y-auto">
        {deadCoins.map((coin) => (
          <div key={coin.address} className="p-4 transition-colors hover:bg-white/5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white text-sm">{coin.symbol}</p>
                <p className="mt-1 break-all font-mono text-xs text-gray-500">{coin.address.slice(0, 10)}...{coin.address.slice(-8)}</p>
              </div>
              <div className="ml-4 shrink-0 text-right">
                <p className="font-medium text-red-400 text-sm">${coin.usdValue.toFixed(2)}</p>
                <p className="mt-0.5 text-xs text-gray-500">{parseFloat(coin.balance).toFixed(4)}</p>
              </div>
            </div>

            {coin.deadReasons && coin.deadReasons.length > 0 && (
              <div className="mb-3 space-y-1 text-xs">
                {coin.deadReasons.map((reason, idx) => (
                  <p key={idx} className="flex items-start gap-2 text-gray-400">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-red-300" />
                    <span>{reason}</span>
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => handleRemove(coin.address)}
              disabled={removingAddress === coin.address}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-600/20 bg-red-600/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-600/40 hover:bg-red-600/30 hover:text-red-300 disabled:cursor-not-allowed"
            >
              <DeadCoinIcon kind="remove" />
              <span>{removingAddress === coin.address ? 'Removing...' : 'Remove'}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 border-t border-red-500/10 bg-red-500/5 p-4">
        <button
          onClick={handleRemoveAll}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
        >
          <DeadCoinIcon kind="sweep" />
          <span>Remove All {deadCoins.length}</span>
        </button>
      </div>
    </div>
  )
}
