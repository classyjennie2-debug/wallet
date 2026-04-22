'use client'

import { useMemo } from 'react'

function detectMobile() {
  if (typeof navigator === 'undefined') {
    return false
  }

  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

function detectWallets() {
  if (typeof window === 'undefined') {
    return []
  }

  const wallets: string[] = []
  const { ethereum } = window

  if (ethereum) {
    if (ethereum.isMetaMask) wallets.push('MetaMask')
    if (ethereum.isCoinbaseWallet) wallets.push('Coinbase Wallet')
    if (ethereum.isRabby) wallets.push('Rabby')
    if (ethereum.isTrustWallet) wallets.push('Trust Wallet')
  }

  if (window.trustwallet) wallets.push('Trust Wallet')
  if (window.phantom?.ethereum) wallets.push('Phantom')
  if (window.okxwallet) wallets.push('OKX Wallet')

  return [...new Set(wallets)]
}

export function MobileWalletHelper() {
  const isMobile = useMemo(() => detectMobile(), [])
  const detectedWallets = useMemo(() => detectWallets(), [])

  if (!isMobile) {
    return null
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-white/10 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent p-4 pointer-events-none">
      {detectedWallets.length > 0 ? (
        <div className="pointer-events-auto mb-2 rounded-lg border border-emerald-500/30 bg-emerald-500/20 p-3 text-sm text-emerald-300">
          <p className="mb-1 font-semibold">Wallet detected</p>
          <p className="text-xs opacity-90">Tap Connect Wallet to connect: {detectedWallets.join(', ')}</p>
        </div>
      ) : (
        <div className="pointer-events-auto rounded-lg border border-blue-500/30 bg-blue-500/20 p-3 text-sm text-blue-300">
          <p className="mb-1 font-semibold">No mobile wallet detected</p>
          <p className="text-xs opacity-90">Install MetaMask or Trust Wallet, or use WalletConnect with the QR flow.</p>
        </div>
      )}
    </div>
  )
}
