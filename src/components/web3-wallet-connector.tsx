'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain
        const addressLabel = account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Wallet'

        const mobileButton =
          'w-full rounded-2xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 sm:w-auto'
        const desktopButton =
          'w-full rounded-2xl bg-slate-900/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto'

        if (!mounted) {
          return (
            <button type="button" disabled className={desktopButton + ' cursor-not-allowed opacity-60'}>
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
          <div className="flex flex-row items-center gap-3">
            <button
              type="button"
              onClick={openAccountModal}
              className="bg-slate-900/95 rounded-2xl px-3 py-2 text-left text-xs text-white shadow-xl shadow-cyan-500/10 transition hover:bg-slate-800 sm:text-sm"
            >
              <div className="truncate font-semibold">{account.displayName ?? addressLabel}</div>
              <div className="hidden text-[11px] text-slate-400 sm:block">Connected</div>
            </button>
            <button
              type="button"
              onClick={openChainModal}
              className="rounded-2xl bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/15 sm:text-sm"
            >
              <span className="block font-semibold">{chain?.name ?? 'Network'}</span>
              <span className="hidden text-[11px] text-slate-400 sm:block">Switch</span>
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
