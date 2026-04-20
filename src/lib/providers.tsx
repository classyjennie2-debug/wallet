'use client'

import { ReactNode, useState, useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, Theme, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { createSSRConfig, createClientConfig } from './web3-config'
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
  const [config, setConfig] = useState(() => {
    // Use SSR config for initial render
    return createSSRConfig() as any
  })

  useEffect(() => {
    setIsClient(true)
    // Switch to full config with WalletConnect on client-side
    const clientConfig = createClientConfig()
    setConfig(clientConfig as any)
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

  // Mobile-first theme for RainbowKit
  const customTheme = lightTheme({
    accentColor: '#0891b2',
    accentColorForeground: 'white',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
  }) as unknown as Theme

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {isClient ? (
          <RainbowKitProvider theme={customTheme}>
            {content}
          </RainbowKitProvider>
        ) : (
          content
        )}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
