'use client'

import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'

export const WalletConnect = () => {
  const { address, isConnected, status } = useAccount()
  const { data: balance } = useBalance({ address })
  const [displayAddress, setDisplayAddress] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (address) {
      setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [address])

  useEffect(() => {
    if (status === 'disconnected') {
      setDisplayAddress('')
    }
  }, [status])

  if (!isMounted) {
    return null
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-gray-300">Connecting...</span>
      </div>
    )
  }

  return (
    <div>
      {isConnected ? (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all group">
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{displayAddress}</p>
            <p className="text-xs text-gray-400">
              {balance?.formatted
                ? `${parseFloat(balance.formatted).toFixed(3)} ${balance?.symbol}`
                : 'Loading...'}
            </p>
          </div>
          <w3m-account-button />
        </div>
      ) : (
        <w3m-connect-button />
      )}
    </div>
  )
}
