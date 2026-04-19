'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'

export const WalletConnect = () => {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const [displayAddress, setDisplayAddress] = useState('')

  useEffect(() => {
    if (address) {
      setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [address])

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{displayAddress}</p>
            <p className="text-xs text-gray-400">
              {balance?.formatted
                ? `${parseFloat(balance.formatted).toFixed(4)} ${balance?.symbol}`
                : 'Loading...'}
            </p>
          </div>
          <button
            onClick={() => open()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
          >
            Profile
          </button>
        </div>
      ) : (
        <button
          onClick={() => open()}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/50"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
