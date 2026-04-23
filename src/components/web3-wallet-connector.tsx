'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain
        const addressLabel = account?.address ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : 'Wallet'

        const mobileButton =
          'w-full rounded-2xl px-3 py-2 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition sm:w-auto'
        const desktopButton =
          'w-full sm:w-auto rounded-2xl px-3 py-2 text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 transition'

        if (!mounted) {
          return (
            <button type="button" disabled className={desktopButton + ' opacity-60 cursor-not-allowed'}>
              Connect Wallet
            </button>
          )
        }

        if (!connected) {
          return (
            <button type="button" onClick={openConnectModal} className={mobileButton}>
              Connect Wallet
            </button>
          )
        }

        return (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={openAccountModal}
              className="w-full sm:w-auto rounded-2xl px-3 py-2 bg-slate-900/95 text-left text-xs sm:text-sm text-white shadow-xl shadow-cyan-500/10 transition hover:bg-slate-800"
            >
              <div className="font-semibold truncate">{account.displayName ?? addressLabel}</div>
              <div className="text-[11px] text-slate-400 hidden sm:block">Connected</div>
            </button>
            <button
              type="button"
              onClick={openChainModal}
              className="w-full sm:w-auto rounded-2xl px-3 py-2 bg-white/10 text-xs sm:text-sm text-white transition hover:bg-white/15"
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
