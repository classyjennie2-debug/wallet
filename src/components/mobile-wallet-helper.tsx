'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const isMobile = useMemo(() => detectMobile(), [])
  const detectedWallets = useMemo(() => detectWallets(), [])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!isMobile || !visible) return

    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [isMobile, visible])

  if (!isMobile || !visible || pathname === '/' || pathname === '/dashboard') {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent p-4">
      <div className="mx-auto flex max-w-xl items-start justify-between gap-3 rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl text-sm text-slate-200">
        <div className="flex-1">
          {detectedWallets.length > 0 ? (
            <>
              <p className="mb-1 font-semibold text-emerald-300">Wallet detected</p>
              <p className="text-xs opacity-90">Tap Connect Wallet to connect: {detectedWallets.join(', ')}</p>
            </>
          ) : (
            <>
              <p className="mb-1 font-semibold text-sky-300">No in-browser wallet detected</p>
              <p className="text-xs opacity-90">That is normal in Safari or Chrome. Pick MetaMask, Rainbow, Trust Wallet, Coinbase Wallet, or Base Account in the connect modal.</p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800"
          aria-label="Dismiss wallet helper"
        >
          Close
        </button>
      </div>
    </div>
  )
}
