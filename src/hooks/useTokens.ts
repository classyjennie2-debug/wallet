import { useState, useEffect, useCallback } from 'react'

export interface TokenData {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  balance: string
  value: string
  price: number
}

export interface Portfolio {
  tokens: TokenData[]
  totalValue: string
  lastUpdated: string
}

export const useTokens = (walletAddress: string | undefined) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    if (!walletAddress) {
      setPortfolio(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/fetch-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tokens')
      }

      const data: Portfolio = await response.json()
      setPortfolio(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setPortfolio(null)
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    fetchTokens()

    // Refetch every 30 seconds if wallet is connected
    if (walletAddress) {
      const interval = setInterval(fetchTokens, 30000)
      return () => clearInterval(interval)
    }
  }, [walletAddress, fetchTokens])

  return { portfolio, loading, error, refetch: fetchTokens }
}
