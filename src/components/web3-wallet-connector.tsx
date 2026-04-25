'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  const [showWalletConnectError, setShowWalletConnectError] = useState(false)

  useEffect(() => {
    if (!showWalletConnectError) return

    const timer = window.setTimeout(() => setShowWalletConnectError(false), 4500)
    return () => window.clearTimeout(timer)
  }, [showWalletConnectError])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const walletReady = mounted && account && chain
        const addressLabel = account?.address ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : 'Wallet'

        const mobileButton =
          'w-full rounded-2xl px-3 py-2 text-sm font-semibold text-slate-950 bg-cyan-500 hover:bg-cyan-400 transition sm:w-auto'
        const desktopButton =
          'w-full sm:w-auto rounded-2xl px-3 py-2 text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 transition'

        const handleConnectClick = () => {
          const isMobileBrowser = () => {
            try {
              return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/.test(navigator.userAgent)
            } catch {
              return false
            }
          }

          const mobileBrowser = isMobileBrowser()
          const hasInjectedWallet = mobileBrowser && Boolean((window as any).ethereum)

          if (mobileBrowser && !hasInjectedWallet) {
            setShowWalletConnectError(true)
          }

          openConnectModal()
        }

        if (!mounted) {
          return (
            <>
              <div className="relative">
                <button type="button" disabled className={desktopButton + ' opacity-60 cursor-not-allowed'}>
                  Connect Wallet
                </button>
              </div>
              {showWalletConnectError ? (
                <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6">
                  <div className="mx-auto max-w-md rounded-3xl border border-cyan-300/20 bg-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                    <p className="font-semibold text-white">Browser wallet unavailable</p>
                    <p className="mt-1 text-xs text-slate-300">Use WalletConnect from the connect modal to open a mobile wallet app.</p>
                  </div>
                </div>
              ) : null}
            </>
          )
        }

        if (!walletReady) {
          return (
            <>
              <div className="relative">
                <button type="button" onClick={handleConnectClick} className={mobileButton}>
                  Connect Wallet
                </button>
              </div>
              {showWalletConnectError ? (
                <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6">
                  <div className="mx-auto max-w-md rounded-3xl border border-cyan-300/20 bg-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                    <p className="font-semibold text-white">Browser wallet unavailable</p>
                    <p className="mt-1 text-xs text-slate-300">Use WalletConnect from the connect modal to open a mobile wallet app.</p>
                  </div>
                </div>
              ) : null}
            </>
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
