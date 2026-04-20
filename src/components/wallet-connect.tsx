'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const WalletConnect = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  if (!isMounted) {
    return <div className="w-full sm:w-auto h-10 bg-white/10 rounded-lg animate-pulse" />
  }

  return (
    <div className="w-full sm:w-auto flex flex-col gap-2">
      <ConnectButton
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
        chainStatus={{
          smallScreen: 'icon',
          largeScreen: 'full',
        }}
        accountStatus="avatar"
        label="Connect Wallet"
      />
      {isMobile && (
        <p className="text-xs text-gray-400 text-center sm:text-right">
          💡 Tip: Use a mobile wallet or scan QR code
        </p>
      )}
    </div>
  )
}
