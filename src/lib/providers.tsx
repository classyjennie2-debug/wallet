'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from './wallet-context'
import { AlertProvider } from './alert-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { metaMask, walletConnect, injected } from '@wagmi/connectors'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { baseAccount, coinbaseWallet, metaMaskWallet, rainbowWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets'
import { SUPPORTED_CHAINS } from './web3-config'
import '@rainbow-me/rainbowkit/styles.css'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  })
}

const APP_NAME = 'MyWallet.Help'
const APP_DESCRIPTION = 'Wallet recovery, diagnostics, and portfolio dashboard'
const APP_URL = 'https://mywallet.help'
const WALLETCONNECT_RELAY_URL = 'wss://relay.walletconnect.com'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set; WalletConnect will be disabled')
}

const transports: Record<number, ReturnType<typeof http>> = {
  [SUPPORTED_CHAINS[0].id]: http(),
  [SUPPORTED_CHAINS[1].id]: http(),
  [SUPPORTED_CHAINS[2].id]: http(),
  [SUPPORTED_CHAINS[3].id]: http(),
  [SUPPORTED_CHAINS[4].id]: http(),
  [SUPPORTED_CHAINS[5].id]: http(),
  [SUPPORTED_CHAINS[6].id]: http(),
  [SUPPORTED_CHAINS[7].id]: http(),
}

function isMobileBrowser() {
  if (typeof navigator === 'undefined') {
    return false
  }

  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

function createWagmiConfig() {
  const mobile = isMobileBrowser()

  if (!projectId) {
    return createConfig({
      chains: SUPPORTED_CHAINS,
      connectors: [injected(), metaMask()],
      transports,
      ssr: true,
    })
  }

  const rkConnectors = connectorsForWallets(
    [
      {
        groupName: 'Popular',
        wallets: [
          metaMaskWallet,
          rainbowWallet,
          coinbaseWallet,
          baseAccount,
          trustWallet,
        ],
      },
    ],
    {
      appName: APP_NAME,
      appDescription: APP_DESCRIPTION,
      appUrl: APP_URL,
      projectId,
      walletConnectParameters: {
        relayUrl: WALLETCONNECT_RELAY_URL,
      },
    }
  )

  const walletConnectConnector = walletConnect({
    projectId,
    showQrModal: !mobile,
    relayUrl: WALLETCONNECT_RELAY_URL,
    metadata: {
      name: APP_NAME,
      description: APP_DESCRIPTION,
      url: APP_URL,
      icons: [`${APP_URL}/favicon.ico`],
    },
  })

  return createConfig({
    chains: SUPPORTED_CHAINS,
    connectors: [...rkConnectors, walletConnectConnector],
    transports,
    ssr: true,
  })
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)
  const [wagmiConfig] = useState(createWagmiConfig)

  const appTree = (
    <ErrorBoundary>
      <AlertProvider>{children}</AlertProvider>
    </ErrorBoundary>
  )

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <WalletProvider>{appTree}</WalletProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
