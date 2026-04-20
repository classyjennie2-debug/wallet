import { NextRequest, NextResponse } from 'next/server'

interface TokenData {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  balance: string
  value: string
  price: number
}

interface Portfolio {
  tokens: TokenData[]
  totalValue: string
  lastUpdated: string
}

/**
 * Fetches token data for a wallet address
 * This would typically call a blockchain API or token service
 * For now, we use Etherscan/BlockScout APIs
 */
async function fetchTokensFromChain(address: string): Promise<TokenData[]> {
  try {
    // This is a mock implementation - in production, you'd call:
    // - Etherscan API for Ethereum
    // - Moralis API for multi-chain support
    // - 1inch API for token metadata
    // - CoinGecko API for pricing
    
    const tokens: TokenData[] = [
      {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
        balance: '5000.00',
        price: 1.0,
        value: '5000.00'
      },
      {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
        balance: '3500.50',
        price: 1.0,
        value: '3500.50'
      },
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/large/weth.png',
        balance: '2.5',
        price: 2340.50,
        value: '5851.25'
      },
      {
        address: '0xd9fcd98c322942075a5c3860693e9f4f03cee07b',
        symbol: 'PEPE',
        name: 'Pepe',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.png',
        balance: '10000000',
        price: 0.000008,
        value: '80.00'
      },
      {
        address: '0x7c19220efd15f492e6ba7e2806a565e17e57eb1f',
        symbol: 'SHIB',
        name: 'Shiba Inu',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png',
        balance: '500000000',
        price: 0.0000089,
        value: '4450.00'
      }
    ]

    return tokens
  } catch (error) {
    console.error('Error fetching tokens from chain:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = body

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing wallet address' },
        { status: 400 }
      )
    }

    // Validate address format (Ethereum-like)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800))

    // Fetch tokens from blockchain
    const tokens = await fetchTokensFromChain(address)

    // Calculate total value
    const totalValue = tokens
      .reduce((sum, token) => sum + parseFloat(token.value), 0)
      .toFixed(2)

    const portfolio: Portfolio = {
      tokens,
      totalValue,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(portfolio, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address')

  if (!address || typeof address !== 'string') {
    return NextResponse.json(
      { error: 'Missing address parameter' },
      { status: 400 }
    )
  }

  // Validate address format (Ethereum-like)
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: 'Invalid wallet address format' },
      { status: 400 }
    )
  }

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    // Fetch tokens from blockchain
    const tokens = await fetchTokensFromChain(address)

    // Calculate total value
    const totalValue = tokens
      .reduce((sum, token) => sum + parseFloat(token.value), 0)
      .toFixed(2)

    const portfolio: Portfolio = {
      tokens,
      totalValue,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(portfolio, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}
