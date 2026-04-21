'use client'

import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from './wallet-context'
import { AlertProvider } from './alert-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { metaMask, walletConnect, injected } from '@wagmi/connectors'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css'

const supportedChains = [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia]

// Create a lightweight wagmi config safe for SSR (no connectors)
const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [arbitrumSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})

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

  // client-side only initialization is handled synchronously below in render

  const appTree = (
    <WalletProvider>
      <ErrorBoundary>
        <AlertProvider>{children}</AlertProvider>
      </ErrorBoundary>
    </WalletProvider>
  )

  // During SSR, don't mount RainbowKit (it relies on window)
  if (!isClient) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {appTree}
        </WagmiProvider>
      </QueryClientProvider>
    )
  }

  // Create client config synchronously during the client render so connectors
  // are available immediately to RainbowKit's UI. This avoids creating
  // connectors during SSR which can trigger localStorage errors.
  const activeWagmiConfig = (() => {
    if (typeof window === 'undefined') return wagmiConfig
    try {
      const projectId = String(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '')
      return createConfig({
        chains: [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia],
        connectors: [injected(), metaMask(), walletConnect({ projectId, showQrModal: true })],
        transports: {
          [mainnet.id]: http(),
          [polygon.id]: http(),
          [arbitrum.id]: http(),
          [base.id]: http(),
          [sepolia.id]: http(),
          [polygonMumbai.id]: http(),
          [arbitrumSepolia.id]: http(),
          [baseSepolia.id]: http(),
        },
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed creating client wagmi config, falling back to SSR config', err)
      return wagmiConfig
    }
  })()

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={activeWagmiConfig}>
        <RainbowKitProvider>
          {appTree}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
