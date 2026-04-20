'use client'

import { useEffect, useState } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

export function Web3WalletConnector() {
  const { open } = useAppKit()
  const { address: rawAddress, isConnected } = useAppKitAccount()
  const { chain } = useAccount()
  const address = rawAddress as `0x${string}` | undefined
  const { data: balance } = useBalance({ address })
  const chainId = useChainId()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const formatBalance = (bal: any) => {
    if (!bal) return '0.00'
    const num = parseFloat(bal.formatted)
    return num.toFixed(2)
  }

  if (!isMounted) {
    return <div className="h-12 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg animate-pulse" />
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* Network Info */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-purple-600/30 hover:border-purple-600/50 transition">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span className="text-sm text-gray-300">{chain?.name || 'Unknown'}</span>
        </div>

        {/* Account Info */}
        <button
          onClick={() => open()}
          className="relative group px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-600/50 hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>{formatAddress(address)}</span>
          {balance && (
            <span className="hidden sm:inline text-xs opacity-80">
              {formatBalance(balance)} {balance?.symbol}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-600/50 hover:scale-105 w-full sm:w-auto"
    >
      Connect Wallet
    </button>
  )
}
