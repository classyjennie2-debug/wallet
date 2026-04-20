'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from './wallet-context'
import { AlertProvider } from './alert-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { createConfig, WagmiProvider, http } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!projectId && process.env.NODE_ENV !== 'production') {
  // WalletConnect can only work with a project id.
  console.warn('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set; WalletConnect will not work.')
}

const supportedChains = [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia] as const
const transports = {
  [mainnet.id]: http(),
  [polygon.id]: http(),
  [arbitrum.id]: http(),
  [base.id]: http(),
  [sepolia.id]: http(),
  [polygonMumbai.id]: http(),
  [arbitrumSepolia.id]: http(),
  [baseSepolia.id]: http(),
}

const serverWagmiConfig = createConfig({
  chains: supportedChains,
  transports,
  ssr: true,
})

let clientWagmiConfig: ReturnType<typeof getDefaultConfig<typeof supportedChains, Record<(typeof supportedChains)[number]['id'], ReturnType<typeof http>>>> | undefined

function getWagmiConfig() {
  if (!clientWagmiConfig) {
    clientWagmiConfig = getDefaultConfig({
      appName: 'MyWallet.Help',
      appDescription: 'Professional wallet recovery and issue resolution platform',
      appUrl: 'https://mywallet.help',
      appIcon: 'https://mywallet.help/logo.png',
      projectId: projectId ?? 'missing-project-id',
      ssr: false,
      chains: supportedChains,
      transports,
    })
  }

  return clientWagmiConfig
}

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
  const isServer = typeof window === 'undefined'

  if (isServer) {
    return (
      <WagmiProvider config={serverWagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <ErrorBoundary>
              <AlertProvider>{children}</AlertProvider>
            </ErrorBoundary>
          </WalletProvider>
        </QueryClientProvider>
      </WagmiProvider>
    )
  }

  return (
    <WagmiProvider config={getWagmiConfig()}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletProvider>
            <ErrorBoundary>
              <AlertProvider>{children}</AlertProvider>
            </ErrorBoundary>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
