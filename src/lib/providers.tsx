'use client'

import { ReactNode, useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from './wallet-context'
import { AlertProvider } from './alert-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { WagmiProvider } from 'wagmi'
import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Create wagmi config
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

// Initialize AppKit once
let appKitInitialized = false

function initializeAppKit() {
  if (appKitInitialized || typeof window === 'undefined') return

  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

  if (!projectId) {
    console.warn('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set')
    return
  }

  try {
    const metadata = {
      name: 'MyWallet.Help',
      description: 'Professional wallet recovery and issue resolution platform',
      url: 'https://mywallet.help',
      icons: ['https://mywallet.help/logo.png'],
    }

    const wagmiAdapter = new WagmiAdapter({
      networks: [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia],
      projectId,
    })

    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia],
      metadata,
      features: {
        legalCheckbox: true,
        analytics: true,
      },
    })

    appKitInitialized = true
  } catch (err) {
    console.error('Failed to initialize AppKit:', err)
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    initializeAppKit()
  }, [])

  if (!isClient) {
    return (
      <ErrorBoundary>
        <AlertProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </AlertProvider>
      </ErrorBoundary>
    )
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AlertProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </AlertProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
