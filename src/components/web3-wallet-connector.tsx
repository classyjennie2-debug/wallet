'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useConnect } from 'wagmi'

export function Web3WalletConnector() {
  const { connectors, connect } = useConnect()
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const [showMobileHint, setShowMobileHint] = useState(false)
        const walletReady = mounted && account && chain
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
          const mobileBrowser = isMobileBrowser() && typeof window !== 'undefined'
          const hasInjectedWallet = mobileBrowser && Boolean((window as any).ethereum)

          if (mobileBrowser && !hasInjectedWallet) {
            const walletConnectConnector = connectors.find(
              (connector) =>
                connector.id === 'walletConnect' || connector.id === 'walletConnectLegacy' || connector.name?.toLowerCase().includes('walletconnect')
            )

            if (walletConnectConnector?.ready) {
              void connect({ connector: walletConnectConnector })
              return
            }

            setShowMobileHint(true)
            setTimeout(() => setShowMobileHint(false), 2400)
            return
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

        if (!walletReady) {
          return (
            <div className="relative">
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
