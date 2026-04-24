'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function AutoOpenMobileConnect({ openConnectModal, mounted, connected }: { openConnectModal?: () => void; mounted: boolean; connected: boolean }) {
  useEffect(() => {
    if (!mounted || connected || typeof window === 'undefined') return

    const isMobileBrowser = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/.test(navigator.userAgent)
    const hasInjectedWallet = Boolean((window as any).ethereum)

    if (!isMobileBrowser || hasInjectedWallet) return

    const timer = window.setTimeout(() => {
      openConnectModal?.()
    }, 700)

    return () => window.clearTimeout(timer)
  }, [connected, mounted, openConnectModal])

  return null
}

export function Web3WalletConnector() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const [showMobileHint, setShowMobileHint] = useState(false)
        const connected = mounted && account && chain
        const addressLabel = account?.address ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : 'Wallet'

        const mobileButton =
          'w-full rounded-2xl px-3 py-2 text-sm font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 transition sm:w-auto'
        const desktopButton =
          'w-full sm:w-auto rounded-2xl px-3 py-2 text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 transition'

        const isMobileBrowser = () => {
          try {
            return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/.test(navigator.userAgent)
          } catch {
            return false
          }
        }

        const handleConnectClick = () => {
          if (isMobileBrowser() && typeof window !== 'undefined' && !(window as any).ethereum) {
            setShowMobileHint(true)
            setTimeout(() => setShowMobileHint(false), 2400)
          }
          void openConnectModal()
        }

        if (!mounted) {
          return (
            <div className="relative">
              <button type="button" disabled className={desktopButton + ' opacity-60 cursor-not-allowed'}>
                Connect Wallet
              </button>
            </div>
          )
        }

        if (!connected) {
          return (
            <div className="relative">
              <AutoOpenMobileConnect mounted={mounted} connected={connected} openConnectModal={openConnectModal} />
              <button type="button" onClick={handleConnectClick} className={mobileButton}>
                Connect Wallet
              </button>
              {showMobileHint && (
                <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 max-w-xs -translate-x-1/2 rounded-lg bg-slate-900/95 px-4 py-2 text-sm text-white shadow-lg">
                  No injected mobile wallet found — choose "WalletConnect" in the modal to connect.
                </div>
              )}
            </div>
          )
        }

        return (
          <div className="flex flex-row items-center gap-3">
            <button
              type="button"
              onClick={openAccountModal}
              className="rounded-2xl px-3 py-2 bg-slate-900/95 text-left text-xs sm:text-sm text-white shadow-xl shadow-cyan-500/10 transition hover:bg-slate-800"
            >
              <div className="font-semibold truncate">{account.displayName ?? addressLabel}</div>
              <div className="text-[11px] text-slate-400 hidden sm:block">Connected</div>
            </button>
            <button
              type="button"
              onClick={openChainModal}
              className="rounded-2xl px-3 py-2 bg-white/10 text-xs sm:text-sm text-white transition hover:bg-white/15"
            >
              <span className="block font-semibold">{chain?.name ?? 'Network'}</span>
              <span className="text-[11px] text-slate-400 hidden sm:block">Switch</span>
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
