'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  const [showWalletConnectError, setShowWalletConnectError] = useState(false)
  const [awaitingWalletChoice, setAwaitingWalletChoice] = useState(false)

  useEffect(() => {
    if (!showWalletConnectError) return

    const timer = window.setTimeout(() => setShowWalletConnectError(false), 4500)
    return () => window.clearTimeout(timer)
  }, [showWalletConnectError])

  useEffect(() => {
    if (!awaitingWalletChoice) return

    const clickListener = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const dialog = target.closest('[role="dialog"]') as HTMLElement | null
      if (!dialog) return

      const walletTarget = target.closest('button, [role="button"]') as HTMLElement | null
      if (!walletTarget) return

      const label = walletTarget.textContent?.trim() ?? ''
      const unsupported = /MetaMask|Coinbase|Trust Wallet|Rabby|Phantom|OKX|Injected/i.test(label)
      const walletConnect = /WalletConnect/i.test(label)

      if (unsupported && !walletConnect) {
        setShowWalletConnectError(true)
        setAwaitingWalletChoice(false)
      }

      if (walletConnect) {
        setAwaitingWalletChoice(false)
      }
    }

    document.addEventListener('click', clickListener, true)
    return () => document.removeEventListener('click', clickListener, true)
  }, [awaitingWalletChoice])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const walletReady = mounted && account && chain
        const addressLabel = account?.address ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : 'Wallet'

        const mobileButton =
          'w-full rounded-2xl px-3 py-2 text-sm font-semibold text-[var(--foreground)] bg-[var(--accent)] hover:bg-[rgba(34,211,238,0.82)] transition sm:w-auto'
        const desktopButton =
          'w-full sm:w-auto rounded-2xl px-3 py-2 text-sm font-semibold text-[var(--foreground)] bg-[var(--surface)]/90 hover:bg-[var(--surface-muted)] transition'

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
            setAwaitingWalletChoice(true)
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
                <div className="fixed inset-x-0 bottom-4 z-[9999] px-4 sm:bottom-6">
                  <div className="mx-auto max-w-md rounded-3xl border border-[var(--accent)]/20 bg-[var(--surface)]/95 px-4 py-3 text-sm text-[var(--foreground)] shadow-2xl shadow-[rgba(34,211,238,0.15)] backdrop-blur-xl">
                    <p className="font-semibold text-[var(--foreground)]">Browser wallet unavailable</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Use WalletConnect from the connect modal to open a mobile wallet app.</p>
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
                <div className="fixed inset-x-0 bottom-4 z-[9999] px-4 sm:bottom-6">
                  <div className="mx-auto max-w-md rounded-3xl border border-[var(--accent)]/20 bg-[var(--surface)]/95 px-4 py-3 text-sm text-[var(--foreground)] shadow-2xl shadow-[rgba(34,211,238,0.15)] backdrop-blur-xl">
                    <p className="font-semibold text-[var(--foreground)]">Browser wallet unavailable</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Use WalletConnect from the connect modal to open a mobile wallet app.</p>
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
              className="rounded-2xl px-3 py-2 bg-[var(--surface)]/95 text-left text-xs sm:text-sm text-[var(--foreground)] shadow-xl shadow-[rgba(34,211,238,0.15)] transition hover:bg-[var(--surface-muted)]"
            >
              <div className="font-semibold truncate">{account.displayName ?? addressLabel}</div>
              <div className="text-[11px] text-slate-400 hidden sm:block">Connected</div>
            </button>
            <button
              type="button"
              onClick={openChainModal}
              className="rounded-2xl px-3 py-2 bg-[var(--surface-muted)]/90 text-xs sm:text-sm text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
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
