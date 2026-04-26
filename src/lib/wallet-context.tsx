'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import type { Portfolio } from '@/hooks/useTokens'

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

export interface Approval {
  id: string
  token: string
  spender: string
  amount: string
  riskLevel: 'low' | 'medium' | 'high'
  isUnlimited?: boolean
  source?: string
}

export interface WalletContextType {
  tokens: Token[]
  loading: boolean
  error: string | null
  totalBalance: number
  deadCoins: Token[]
  approvals: Approval[]
  warnings: string[]
  fetchTokens: () => Promise<void>
  removeDeadCoin: (address: string) => void
  revokeApproval: (id: string) => void
  swapTokens: (fromToken: string, toToken: string, amount: string) => Promise<void>
  sendToken: (tokenAddress: string, toAddress: string, amount: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  const mapPortfolioTokens = useCallback((portfolio: Portfolio): Token[] => {
    return portfolio.tokens.map((token) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      balance: token.balance,
      usdValue: Number(token.value),
      image: token.logoURI,
      isDead: token.isLikelySpam,
      deadReasons: token.isLikelySpam ? ['Token metadata and market pricing could not be verified'] : undefined,
    }))
  }, [])

  const fetchTokens = useCallback(async () => {
    if (!isConnected || !address) {
      setError('Wallet not connected')
      setTokens([])
      setWarnings([])
      return
    }

    setLoading(true)
    setError(null)
    setWarnings([])

    try {
      const response = await fetch('/api/fetch-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, imports: [] }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tokens')
      }

      const portfolio: Portfolio = await response.json()
      setTokens(mapPortfolioTokens(portfolio))
      setWarnings(portfolio.warnings ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tokens')
      setTokens([])
      setWarnings([])
    } finally {
      setLoading(false)
    }
  }, [address, isConnected, mapPortfolioTokens])

  const removeDeadCoin = useCallback((address: string) => {
    setTokens((prev) => prev.filter((token) => token.address !== address))
  }, [])

  const revokeApproval = useCallback((id: string) => {
    setApprovals((prev) => prev.filter((approval) => approval.id !== id))
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
        approvals,
        warnings,
        fetchTokens,
        removeDeadCoin,
        revokeApproval,
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
