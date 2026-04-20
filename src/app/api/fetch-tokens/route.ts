import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, erc20Abi, formatUnits, getAddress, http, isAddress } from 'viem'

interface ImportedToken {
  chainId: number
  address: string
}

interface TokenData {
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

interface Portfolio {
  tokens: TokenData[]
  totalValue: string
  lastUpdated: string
  warnings: string[]
}

interface ChainConfig {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  coingeckoPlatform: string
  nativePriceId: string
  nativeTokenAddress: string
}

const chainConfigs: ChainConfig[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC || 'https://cloudflare-eth.com',
    coingeckoPlatform: 'ethereum',
    nativePriceId: 'ethereum',
    nativeTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC || 'https://polygon-rpc.com',
    coingeckoPlatform: 'polygon-pos',
    nativePriceId: 'matic-network',
    nativeTokenAddress: '0x0000000000000000000000000000000000001010',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc',
    coingeckoPlatform: 'arbitrum-one',
    nativePriceId: 'ethereum',
    nativeTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org',
    coingeckoPlatform: 'base',
    nativePriceId: 'ethereum',
    nativeTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
]

async function jsonRpc<T>(rpcUrl: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`RPC request failed (${response.status})`)
  }

  const payload = await response.json()

  if (payload.error) {
    throw new Error(payload.error.message || `${method} failed`)
  }

  return payload.result as T
}

function parseImports(rawImports: unknown): ImportedToken[] {
  if (!Array.isArray(rawImports)) {
    return []
  }

  return rawImports
    .filter((item): item is ImportedToken => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const candidate = item as ImportedToken
      return Number.isInteger(candidate.chainId) && typeof candidate.address === 'string' && isAddress(candidate.address)
    })
    .map((item) => ({ chainId: item.chainId, address: getAddress(item.address) }))
}

async function fetchNativePrices(chains: ChainConfig[]) {
  const uniquePriceIds = Array.from(new Set(chains.map((chain) => chain.nativePriceId)))
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(uniquePriceIds.join(','))}&vs_currencies=usd`
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    return new Map<string, number>()
  }

  const payload = (await response.json()) as Record<string, { usd?: number }>
  const prices = new Map<string, number>()

  for (const id of uniquePriceIds) {
    prices.set(id, payload[id]?.usd ?? 0)
  }

  return prices
}

async function fetchTokenPricesByPlatform(platform: string, tokenAddresses: string[]) {
  if (tokenAddresses.length === 0) {
    return new Map<string, number>()
  }

  const prices = new Map<string, number>()

  for (let index = 0; index < tokenAddresses.length; index += 70) {
    const batch = tokenAddresses.slice(index, index + 70)
    const url = `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${encodeURIComponent(batch.join(','))}&vs_currencies=usd`

    try {
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) {
        continue
      }

      const payload = (await response.json()) as Record<string, { usd?: number }>

      for (const [address, data] of Object.entries(payload)) {
        prices.set(address.toLowerCase(), data.usd ?? 0)
      }
    } catch {
      // Ignore pricing errors and continue with other batches.
    }
  }

  return prices
}

function toDecimalString(value: bigint, decimals: number) {
  return formatUnits(value, decimals)
}

function normalizeTokenBalance(balance: string | null | undefined) {
  if (!balance) {
    return BigInt(0)
  }

  try {
    return BigInt(balance)
  } catch {
    return BigInt(0)
  }
}

async function fetchChainPortfolio(address: string, chain: ChainConfig, importedTokens: ImportedToken[], nativePriceUsd: number) {
  const warnings: string[] = []
  const publicClient = createPublicClient({ transport: http(chain.rpcUrl) })

  const nativeBalanceRaw = await publicClient.getBalance({ address: address as `0x${string}` })
  const nativeBalance = toDecimalString(nativeBalanceRaw, 18)
  const nativeValue = Number(nativeBalance) * nativePriceUsd

  const tokenBalancesByAddress = new Map<string, bigint>()

  try {
    const result = await jsonRpc<{ tokenBalances?: Array<{ contractAddress?: string; tokenBalance?: string }> }>(
      chain.rpcUrl,
      'alchemy_getTokenBalances',
      [address, 'erc20']
    )

    for (const token of result.tokenBalances ?? []) {
      if (!token.contractAddress) {
        continue
      }

      const normalizedAddress = getAddress(token.contractAddress)
      const rawBalance = normalizeTokenBalance(token.tokenBalance)
      if (rawBalance > BigInt(0)) {
        tokenBalancesByAddress.set(normalizedAddress, rawBalance)
      }
    }
  } catch {
    warnings.push(`${chain.name}: RPC does not support token indexing method alchemy_getTokenBalances.`)
  }

  const importedForChain = importedTokens
    .filter((item) => item.chainId === chain.id)
    .map((item) => getAddress(item.address))

  for (const importedAddress of importedForChain) {
    if (!tokenBalancesByAddress.has(importedAddress)) {
      tokenBalancesByAddress.set(importedAddress, BigInt(0))
    }
  }

  const tokenAddresses = Array.from(tokenBalancesByAddress.keys())

  const metadataEntries = await Promise.all(
    tokenAddresses.map(async (tokenAddress) => {
      try {
        const metadata = await jsonRpc<{ symbol?: string; name?: string; decimals?: number; logo?: string | null }>(
          chain.rpcUrl,
          'alchemy_getTokenMetadata',
          [tokenAddress]
        )

        return [tokenAddress, metadata] as const
      } catch {
        const [symbol, name, decimals] = await Promise.all([
          publicClient.readContract({ address: tokenAddress as `0x${string}`, abi: erc20Abi, functionName: 'symbol' }).catch(() => 'UNKNOWN'),
          publicClient.readContract({ address: tokenAddress as `0x${string}`, abi: erc20Abi, functionName: 'name' }).catch(() => 'Unknown token'),
          publicClient.readContract({ address: tokenAddress as `0x${string}`, abi: erc20Abi, functionName: 'decimals' }).catch(() => 18),
        ])

        return [
          tokenAddress,
          { symbol: typeof symbol === 'string' ? symbol : 'UNKNOWN', name: typeof name === 'string' ? name : 'Unknown token', decimals: typeof decimals === 'number' ? decimals : 18, logo: undefined },
        ] as const
      }
    })
  )

  const metadataMap = new Map(metadataEntries)
  const tokenPrices = await fetchTokenPricesByPlatform(chain.coingeckoPlatform, tokenAddresses)
  const importedForChainSet = new Set(importedForChain.map((item) => item.toLowerCase()))

  const tokens: TokenData[] = []

  tokens.push({
    chainId: chain.id,
    chainName: chain.name,
    chainSymbol: chain.symbol,
    address: chain.nativeTokenAddress,
    symbol: chain.symbol,
    name: `${chain.name} Native`,
    decimals: 18,
    balanceRaw: nativeBalanceRaw.toString(),
    balance: nativeBalance,
    value: nativeValue.toFixed(2),
    price: nativePriceUsd,
    isNative: true,
    isLikelySpam: false,
  })

  for (const tokenAddress of tokenAddresses) {
    const metadata = metadataMap.get(tokenAddress)
    const decimals = Number.isFinite(metadata?.decimals) ? Number(metadata?.decimals) : 18
    const rawBalance = tokenBalancesByAddress.get(tokenAddress) ?? BigInt(0)
    const isImportedToken = importedForChainSet.has(tokenAddress.toLowerCase())

    if (rawBalance === BigInt(0) && !isImportedToken) {
      continue
    }

    const balance = toDecimalString(rawBalance, decimals)
    const priceUsd = tokenPrices.get(tokenAddress.toLowerCase()) ?? 0
    const valueUsd = Number(balance) * priceUsd
    const symbol = (metadata?.symbol || 'UNKNOWN').trim()
    const name = (metadata?.name || 'Unknown token').trim()
    const isLikelySpam = !metadata?.logo && priceUsd === 0 && !isImportedToken

    tokens.push({
      chainId: chain.id,
      chainName: chain.name,
      chainSymbol: chain.symbol,
      address: tokenAddress,
      symbol,
      name,
      decimals,
      logoURI: metadata?.logo || undefined,
      balanceRaw: rawBalance.toString(),
      balance,
      value: valueUsd.toFixed(2),
      price: priceUsd,
      isNative: false,
      isLikelySpam,
    })
  }

  return { tokens, warnings }
}

async function fetchTokensFromChains(address: string, importedTokens: ImportedToken[]) {
  const nativePrices = await fetchNativePrices(chainConfigs)
  const chainResults = await Promise.all(
    chainConfigs.map(async (chain) => {
      try {
        return await fetchChainPortfolio(address, chain, importedTokens, nativePrices.get(chain.nativePriceId) ?? 0)
      } catch {
        return {
          tokens: [] as TokenData[],
          warnings: [`${chain.name}: failed to fetch chain data. Check RPC URL and network status.`],
        }
      }
    })
  )

  const mergedTokens = chainResults.flatMap((result) => result.tokens)
  const warnings = chainResults.flatMap((result) => result.warnings)

  const deduped = new Map<string, TokenData>()
  for (const token of mergedTokens) {
    const key = `${token.chainId}:${token.address.toLowerCase()}`
    const existing = deduped.get(key)

    if (!existing || Number(token.value) > Number(existing.value)) {
      deduped.set(key, token)
    }
  }

  return {
    tokens: Array.from(deduped.values()).sort((a, b) => Number(b.value) - Number(a.value)),
    warnings,
  }
}

function validateWalletAddress(address: string) {
  if (!isAddress(address)) {
    return false
  }

  return true
}

async function buildPortfolio(address: string, importedTokens: ImportedToken[]): Promise<Portfolio> {
  const { tokens, warnings } = await fetchTokensFromChains(getAddress(address), importedTokens)
  const totalValue = tokens.reduce((sum, token) => sum + Number(token.value), 0).toFixed(2)

  return {
    tokens,
    totalValue,
    lastUpdated: new Date().toISOString(),
    warnings,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const address = typeof body?.address === 'string' ? body.address : ''
    const imports = parseImports(body?.imports)

    if (!validateWalletAddress(address)) {
      return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 })
    }

    const portfolio = await buildPortfolio(address, imports)
    return NextResponse.json(portfolio, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address') || ''
  const importsRaw = request.nextUrl.searchParams.get('imports')

  if (!validateWalletAddress(address)) {
    return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 })
  }

  let imports: ImportedToken[] = []
  if (importsRaw) {
    try {
      imports = parseImports(JSON.parse(importsRaw))
    } catch {
      imports = []
    }
  }

  try {
    const portfolio = await buildPortfolio(address, imports)
    return NextResponse.json(portfolio, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
  }
}
