'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useBalance } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

interface WalletOption {
  id: string
  name: string
  icon: string
  description: string
}

export function Web3WalletConnector() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const chainId = useChainId()
  const [showModal, setShowModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask browser extension',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '📱',
      description: 'Scan QR code to connect mobile wallets',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '₿',
      description: 'Connect using Coinbase Wallet',
    },
  ]

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId)
    setIsConnecting(true)

    try {
      const connector = connectors.find((c) => {
        if (walletId === 'metamask') return c.id === 'injected'
        if (walletId === 'walletconnect') return c.id === 'walletConnect'
        if (walletId === 'coinbase') return c.id === 'coinbaseWallet'
        return false
      })

      if (connector) {
        connect({ connector })
        setTimeout(() => setShowModal(false), 500)
      }
    } catch (err) {
      console.error('Failed to connect:', err)
    } finally {
      setIsConnecting(false)
      setSelectedWallet(null)
    }
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const formatBalance = (bal: any) => {
    if (!bal) return '0.00'
    const num = parseFloat(bal.formatted)
    return num.toFixed(2)
  }

  if (!isMounted) {
    return <div className="h-12 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg animate-pulse" />
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {/* Network Info */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-purple-600/30 hover:border-purple-600/50 transition">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span className="text-sm text-gray-300">{chain?.name || 'Unknown'}</span>
        </div>

        {/* Account Info */}
        <button
          onClick={() => setShowModal(true)}
          className="relative group px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-600/50 hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>{formatAddress(address)}</span>
          {balance && (
            <span className="hidden sm:inline text-xs opacity-80">
              {formatBalance(balance)} {balance?.symbol}
            </span>
          )}
        </button>

        {/* Disconnect Button */}
        <button
          onClick={() => disconnect()}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/30 hover:border-red-500/50"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Connect Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-600/50 hover:scale-105 w-full sm:w-auto"
      >
        Connect Wallet
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full sm:w-96 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 rounded-t-3xl sm:rounded-2xl border border-purple-900/50 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
              <p className="text-slate-400 text-sm">Choose your preferred wallet to connect securely</p>
            </div>

            {/* Error Message */}
            {connectError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300">{connectError.message}</p>
              </div>
            )}

            {/* Wallet Options */}
            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id)}
                  disabled={isConnecting || isPending}
                  className={`w-full p-4 rounded-lg border-2 transition-all group ${
                    selectedWallet === wallet.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-purple-900/30 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{wallet.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{wallet.name}</p>
                        {selectedWallet === wallet.id && (
                          <div className="animate-spin">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" opacity="0.25"></circle>
                              <path fill="none" strokeWidth="2" d="M12 2a10 10 0 0 1 10 10"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{wallet.description}</p>
                    </div>
                    {selectedWallet !== wallet.id && (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
              <p className="text-sm text-purple-300">
                <span className="font-semibold">💡 Tip:</span> Don't have a wallet? Install MetaMask browser extension or use your mobile wallet with WalletConnect.
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-slate-500 text-center">
              By connecting, you agree to our{' '}
              <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
