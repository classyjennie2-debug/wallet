'use client'

import { ReactNode, useState, useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { wagmiConfig } from './web3-config'
import { WalletProvider } from './wallet-context'
import { AlertProvider } from './alert-context'
import { ErrorBoundary } from '@/components/error-boundary'

// Create a stable query client instance
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  })

let clientQueryClientInstance: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }
  if (!clientQueryClientInstance) {
    clientQueryClientInstance = createQueryClient()
  }
  return clientQueryClientInstance
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const content = (
    <ErrorBoundary>
      <AlertProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </AlertProvider>
    </ErrorBoundary>
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {isClient ? (
          <RainbowKitProvider>
            {content}
          </RainbowKitProvider>
        ) : (
          content
        )}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
