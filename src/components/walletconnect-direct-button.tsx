'use client'

import { useMemo, useState } from 'react'
import { useConnect } from 'wagmi'

function isMobileDevice() {
  if (typeof navigator === 'undefined') {
    return false
  }

  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export function WalletConnectDirectButton() {
  const { connectAsync, connectors, isPending } = useConnect()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isMobile = useMemo(() => isMobileDevice(), [])

  const walletConnectConnector = connectors.find(
    (connector) => connector.id === 'walletConnect' || connector.type === 'walletConnect'
  )

  const isDisabled = !walletConnectConnector || isPending

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        disabled={isDisabled}
        onClick={async () => {
          if (!walletConnectConnector) {
            setErrorMessage('WalletConnect is not available right now.')
            return
          }

          setErrorMessage(null)

          try {
            const timeoutMs = isMobile ? 45000 : 12000

            await Promise.race([
              connectAsync({ connector: walletConnectConnector }),
              new Promise((_, reject) => {
                window.setTimeout(() => {
                  reject(
                    new Error(
                      isMobile
                        ? 'WalletConnect is taking longer than expected. Please return to your wallet app to approve the connection and retry if it still does not complete.'
                        : 'WalletConnect could not reach the relay server. Disable VPN/ad blockers, then retry or switch networks.'
                    )
                  )
                }, timeoutMs)
              }),
            ])
          } catch (error) {
            const message = error instanceof Error ? error.message : 'WalletConnect failed to open.'
            setErrorMessage(message)
            console.error('WalletConnect direct connect failed:', error)
          }
        }}
        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-100 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Opening...' : isMobile ? 'WalletConnect' : 'WalletConnect QR'}
      </button>

      {errorMessage && (
        <p className="mt-2 text-xs text-rose-300 sm:max-w-[16rem]">{errorMessage}</p>
      )}
    </div>
  )
}
