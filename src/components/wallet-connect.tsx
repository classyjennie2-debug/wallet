'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const WalletConnect = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="w-full sm:w-auto">
      {isMounted ? (
        <ConnectButton
          showBalance={{ smallScreen: false, largeScreen: true }}
          chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
          accountStatus="avatar"
          label="Connect Wallet"
        />
      ) : (
        <div className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg text-center text-sm">
          Loading...
        </div>
      )}
    </div>
  )
}
