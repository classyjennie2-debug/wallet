'use client'

import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from './wallet-context'
import { AlertProvider } from './alert-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { metaMask, injected } from '@wagmi/connectors'
import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
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

const APP_NAME = 'MyWallet Security'
const APP_DESCRIPTION = 'Wallet recovery, approval reviews, and security diagnostics for self-custody users'
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

async function createWagmiConfig() {
  if (projectId) {
    const { baseAccount, coinbaseWallet, metaMaskWallet, rainbowWallet, trustWallet, walletConnectWallet } = await import('@rainbow-me/rainbowkit/wallets')

    const rkConnectors = connectorsForWallets(
      [
        {
          groupName: 'Popular',
          wallets: [
            metaMaskWallet,
            rainbowWallet,
            coinbaseWallet,
            walletConnectWallet,
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

    return createConfig({
      chains: SUPPORTED_CHAINS,
      connectors: rkConnectors,
      transports,
      ssr: true,
    })
  }

  return createConfig({
    chains: SUPPORTED_CHAINS,
    connectors: [injected(), metaMask()],
    transports,
    ssr: true,
  })
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)
  const [wagmiConfig, setWagmiConfig] = useState<ReturnType<typeof createConfig> | null>(null)

  useEffect(() => {
    let active = true

    createWagmiConfig().then((config) => {
      if (active) {
        setWagmiConfig(config)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const appTree = (
    <ErrorBoundary>
      <AlertProvider>{children}</AlertProvider>
    </ErrorBoundary>
  )

  if (!wagmiConfig) {
    return <div className="min-h-screen bg-slate-950" />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider
          modalSize="compact"
          coolMode
          showRecentTransactions
          theme={darkTheme({
            accentColor: '#22d3ee',
            accentColorForeground: '#0f172a',
            borderRadius: 'medium',
            overlayBlur: 'small',
          })}
          appInfo={{
            appName: APP_NAME,
            learnMoreUrl: APP_URL,
          }}
        >
          <WalletProvider>{appTree}</WalletProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
