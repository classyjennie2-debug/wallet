'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain

        const mobileButton =
          'w-full rounded-2xl px-4 py-3 text-base font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition'
        const desktopButton =
          'w-full sm:w-auto rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 transition'

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={openAccountModal}
              className="w-full rounded-2xl px-4 py-3 bg-slate-900/95 text-left text-sm text-white shadow-xl shadow-cyan-500/10 transition hover:bg-slate-800"
            >
              <div className="font-semibold">{account.displayName ?? account.address}</div>
              <div className="text-xs text-slate-400">Connected</div>
            </button>
            <button
              type="button"
              onClick={openChainModal}
              className="w-full sm:w-auto rounded-2xl px-4 py-3 bg-white/10 text-sm text-white transition hover:bg-white/15"
            >
              <span className="block text-sm font-semibold">{chain?.name ?? 'Network'}</span>
              <span className="text-xs text-slate-400">Switch network</span>
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
