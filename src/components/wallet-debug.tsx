'use client'

import { useMemo } from 'react'
import { useConnect } from 'wagmi'

export default function WalletDebug() {
  const { connectors } = useConnect()
  const hasEthereum = useMemo(() => typeof window !== 'undefined' && typeof window.ethereum !== 'undefined', [])

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-lg border border-white/10 bg-black/60 p-3 text-xs text-white">
      <div className="mb-1 font-semibold">Wallet Debug</div>
      <div>WC Project ID: {process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '---'}</div>
      <div>UA: {typeof navigator !== 'undefined' ? navigator.userAgent : 'server'}</div>
      <div>window.ethereum: {hasEthereum ? 'present' : 'missing'}</div>
      <div className="mt-2">Connectors:</div>
      <ul className="ml-3 list-disc">
        {connectors.map((connector) => (
          <li key={connector.id}>
            {connector.name} - {connector.ready ? 'ready' : 'not ready'}
          </li>
        ))}
      </ul>
    </div>
  )
}
