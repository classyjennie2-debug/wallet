'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Web3WalletConnector() {
  if (typeof window === 'undefined') {
    return (
      <button
        type="button"
        disabled
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg opacity-80 w-full sm:w-auto"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <ConnectButton
      accountStatus="avatar"
      chainStatus="icon"
      showBalance={{
        smallScreen: false,
        largeScreen: true,
      }}
    />
  )
}
