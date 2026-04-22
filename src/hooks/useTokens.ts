import { useState, useEffect, useCallback, useMemo } from 'react'

export interface ImportedToken {
  chainId: number
  address: string
}

export interface TokenData {
  chainId: number
  chainName: string
  chainSymbol: string
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  balanceRaw: string
  balance: string
  value: string
  price: number
  isNative: boolean
  isLikelySpam: boolean
}

export interface Portfolio {
  tokens: TokenData[]
  totalValue: string
  lastUpdated: string
  warnings: string[]
}

export const useTokens = (walletAddress: string | undefined, imports: ImportedToken[] = []) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const importsKey = useMemo(() => JSON.stringify(imports), [imports])

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
        body: JSON.stringify({ address: walletAddress, imports }),
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
  }, [walletAddress, imports])

  useEffect(() => {
    const initialFetch = setTimeout(() => {
      void fetchTokens()
    }, 0)

    if (walletAddress) {
      const interval = setInterval(fetchTokens, 30000)
      return () => {
        clearTimeout(initialFetch)
        clearInterval(interval)
      }
    }

    return () => clearTimeout(initialFetch)
  }, [walletAddress, fetchTokens, importsKey])

  return { portfolio, loading, error, refetch: fetchTokens }
}
