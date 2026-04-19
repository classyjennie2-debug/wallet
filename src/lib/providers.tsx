'use client'

import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3Modal } from '@web3modal/wagmi/react'
import { wagmiConfig } from './web3-config'
import { WalletProvider } from './wallet-context'

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          {children}
          <Web3Modal projectId={projectId} />
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
