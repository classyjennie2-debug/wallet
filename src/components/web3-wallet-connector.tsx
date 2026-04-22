'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain

        const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

        if (!mounted) {
          return (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold opacity-80"
            >
              Connect Wallet
            </button>
          )
        }

        if (!connected) {
          return (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                try {
                  openConnectModal?.()
                } catch (err) {
                  console.error('Error opening connect modal:', err)
                }
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition"
            >
              Connect Wallet
            </button>
          )
        }

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  openChainModal?.()
                } catch (err) {
                  console.error('Error opening chain modal:', err)
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/6 text-sm text-white/90 hover:bg-white/10"
            >
              {chain?.hasIcon && chain?.iconUrl ? (
                // wagmi/rainbowkit provide iconUrl for chains
                // render it if available, otherwise show a placeholder
                // eslint-disable-next-line @next/next/no-img-element
                <img src={chain.iconUrl} alt={chain.name ?? 'chain'} className="w-5 h-5 rounded-sm" />
              ) : (
                <span className="w-5 h-5 inline-block bg-white/10 rounded-sm" />
              )}
              <span className="font-medium">{chain?.name}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try {
                  openAccountModal?.()
                } catch (err) {
                  console.error('Error opening account modal:', err)
                }
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium w-full sm:w-auto"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                {account?.address ? account.address[2]?.toUpperCase() : ''}
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base">{account?.displayName ?? truncate(account?.address ?? '')}</div>
                <div className="text-xs text-white/70 hidden sm:block">{account?.displayBalance ?? ''}</div>
              </div>
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
