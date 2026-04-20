'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Contract } from 'ethers'
import { useAccount } from 'wagmi'

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  balance: string
  usdValue: number
  image?: string
  isDead?: boolean
  deadReasons?: string[]
}

export interface WalletContextType {
  tokens: Token[]
  loading: boolean
  error: string | null
  totalBalance: number
  deadCoins: Token[]
  fetchTokens: () => Promise<void>
  removeDeadCoin: (address: string) => void
  swapTokens: (fromToken: string, toToken: string, amount: string) => Promise<void>
  sendToken: (tokenAddress: string, toAddress: string, amount: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  const fetchTokens = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // This would be replaced with actual token fetching logic
      // For now, we'll set up the structure
      setTokens([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens')
    } finally {
      setLoading(false)
    }
  }, [address])

  const removeDeadCoin = useCallback((address: string) => {
    setTokens((prev) => prev.filter((token) => token.address !== address))
  }, [])

  const swapTokens = useCallback(
    async (fromToken: string, toToken: string, amount: string) => {
      if (!address) throw new Error('Wallet not connected')
      // Swap logic would go here
      console.log('Swapping', amount, 'of', fromToken, 'for', toToken)
    },
    [address]
  )

  const sendToken = useCallback(
    async (tokenAddress: string, toAddress: string, amount: string) => {
      if (!address) throw new Error('Wallet not connected')
      // Send logic would go here
      console.log('Sending', amount, 'tokens to', toAddress)
    },
    [address]
  )

  const deadCoins = tokens.filter((token) => token.isDead)
  const totalBalance = tokens.reduce((sum, token) => sum + token.usdValue, 0)

  return (
    <WalletContext.Provider
      value={{
        tokens,
        loading,
        error,
        totalBalance,
        deadCoins,
        fetchTokens,
        removeDeadCoin,
        swapTokens,
        sendToken,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}
