'use client'

import { useEffect, useState } from 'react'

export function MobileWalletHelper() {
  const [detectedWallets, setDetectedWallets] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setIsMobile(mobile)

    // Detect installed wallets
    const wallets: string[] = []

    // Check for common injected wallets
    if ((window as any).ethereum) {
      if ((window as any).ethereum.isMetaMask) wallets.push('MetaMask')
      if ((window as any).ethereum.isCoinbaseWallet) wallets.push('Coinbase Wallet')
      if ((window as any).ethereum.isRabby) wallets.push('Rabby')
      if ((window as any).ethereum.isTrustWallet) wallets.push('Trust Wallet')
    }

    if ((window as any).trustwallet) wallets.push('Trust Wallet')
    if ((window as any).phantom?.ethereum) wallets.push('Phantom')
    if ((window as any).okxwallet) wallets.push('OKX Wallet')

    setDetectedWallets([...new Set(wallets)])
  }, [])

  if (!isMobile) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent p-4 border-t border-white/10 pointer-events-none">
      {detectedWallets.length > 0 && (
        <div className="pointer-events-auto mb-2 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-sm text-emerald-300">
          <p className="font-semibold mb-1">✓ Wallet Detected</p>
          <p className="text-xs opacity-90">Tap "Connect Wallet" to connect: {detectedWallets.join(', ')}</p>
        </div>
      )}
      {detectedWallets.length === 0 && (
        <div className="pointer-events-auto p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-sm text-blue-300">
          <p className="font-semibold mb-1">ℹ️ No Mobile Wallet Detected</p>
          <p className="text-xs opacity-90">Install MetaMask, Trust Wallet, or scan the QR code to use WalletConnect</p>
        </div>
      )}
    </div>
  )
}
