'use client'

import Image from 'next/image'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { getAddress, isAddress } from 'viem'
import { ImportedToken, TokenData, useTokens } from '@/hooks/useTokens'

const chainOptions = [
  { id: 1, label: 'Ethereum' },
  { id: 137, label: 'Polygon' },
  { id: 42161, label: 'Arbitrum' },
  { id: 8453, label: 'Base' },
  { id: 56, label: 'BSC' },
]
const pageSize = 25
const explorerByChainId: Record<number, string> = {
  1: 'https://etherscan.io',
  137: 'https://polygonscan.com',
  42161: 'https://arbiscan.io',
  8453: 'https://basescan.org',
  56: 'https://bscscan.com',
}
const manualImportsKey = 'manual-token-imports'

function readStorageItem(key: string) {
  if (typeof window === 'undefined') return null
  try {
    const storage = window.localStorage
    if (!storage || typeof storage.getItem !== 'function') return null
    return storage.getItem(key)
  } catch {
    return null
  }
}

function writeStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') return
  try {
    const storage = window.localStorage
    if (!storage || typeof storage.setItem !== 'function') return
    storage.setItem(key, value)
  } catch {
    // Ignore storage write failures.
  }
}

function loadImportedTokens() {
  try {
    const raw = readStorageItem(manualImportsKey)
    if (!raw) return [] as ImportedToken[]
    const parsed = JSON.parse(raw) as ImportedToken[]
    if (!Array.isArray(parsed)) return [] as ImportedToken[]
    return parsed.filter((item) => Number.isInteger(item.chainId) && typeof item.address === 'string' && isAddress(item.address))
  } catch {
    return [] as ImportedToken[]
  }
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function tokenFallbackLabel(token: TokenData) {
  return token.symbol?.slice(0, 2)?.toUpperCase() || 'TK'
}

function getTokenExplorerUrl(token: TokenData) {
  const explorer = explorerByChainId[token.chainId]
  if (!explorer || token.isNative) return null
  return `${explorer}/token/${token.address}`
}

function getAddressExplorerUrl(token: TokenData, walletAddress: string) {
  const explorer = explorerByChainId[token.chainId]
  if (!explorer) return null
  return `${explorer}/address/${walletAddress}`
}

export const PortfolioOverview = () => {
  const { address, isConnected } = useAccount()
  const [search, setSearch] = useState('')
  const [selectedChain, setSelectedChain] = useState<number | 'all'>('all')
  const [hideDust, setHideDust] = useState(true)
  const [hideSpam, setHideSpam] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)
  const [importedTokens, setImportedTokens] = useState<ImportedToken[]>(loadImportedTokens)
  const [importChainId, setImportChainId] = useState(1)
  const [importAddress, setImportAddress] = useState('')
  const [importError, setImportError] = useState<string | null>(null)

  useEffect(() => {
    writeStorageItem(manualImportsKey, JSON.stringify(importedTokens))
  }, [importedTokens])

  const { portfolio, loading, error, refetch } = useTokens(isConnected ? address : undefined, importedTokens)

  const chains = useMemo(() => {
    if (!portfolio) return []
    const uniqueChains = new Map<number, string>()
    for (const token of portfolio.tokens) uniqueChains.set(token.chainId, token.chainName)
    return Array.from(uniqueChains.entries()).map(([id, name]) => ({ id, name }))
  }, [portfolio])

  const filteredTokens = useMemo(() => {
    if (!portfolio) return []
    const query = search.trim().toLowerCase()

    return portfolio.tokens
      .filter((token) => (selectedChain === 'all' ? true : token.chainId === selectedChain))
      .filter((token) => {
        if (!query) return true
        return token.symbol.toLowerCase().includes(query) || token.name.toLowerCase().includes(query) || token.address.toLowerCase().includes(query)
      })
      .filter((token) => (hideDust ? Number(token.value) >= 1 : true))
      .filter((token) => (hideSpam ? !token.isLikelySpam : true))
      .sort((a, b) => Number(b.value) - Number(a.value))
  }, [portfolio, search, selectedChain, hideDust, hideSpam])

  const topToken = filteredTokens[0]
  const totalPages = Math.max(1, Math.ceil(filteredTokens.length / pageSize))
  const visiblePage = Math.min(currentPage, totalPages)

  const paginatedTokens = useMemo(() => {
    const start = (visiblePage - 1) * pageSize
    return filteredTokens.slice(start, start + pageSize)
  }, [filteredTokens, visiblePage])

  const perChainTotals = useMemo(() => {
    const totals = new Map<number, { chainName: string; value: number; tokenCount: number }>()
    for (const token of filteredTokens) {
      const existing = totals.get(token.chainId)
      if (existing) {
        existing.value += Number(token.value)
        existing.tokenCount += 1
      } else {
        totals.set(token.chainId, { chainName: token.chainName, value: Number(token.value), tokenCount: 1 })
      }
    }

    return Array.from(totals.entries())
      .map(([chainId, data]) => ({ chainId, ...data }))
      .sort((a, b) => b.value - a.value)
  }, [filteredTokens])

  const resetToFirstPage = () => setCurrentPage(1)

  const handleImportToken = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setImportError(null)

    if (!isAddress(importAddress)) {
      setImportError('Enter a valid token contract address.')
      return
    }

    const normalizedAddress = getAddress(importAddress)
    const alreadyExists = importedTokens.some((item) => item.chainId === importChainId && item.address.toLowerCase() === normalizedAddress.toLowerCase())

    if (alreadyExists) {
      setImportError('This token is already imported.')
      return
    }

    setImportedTokens((prev) => [...prev, { chainId: importChainId, address: normalizedAddress }])
    setImportAddress('')
    resetToFirstPage()
  }

  const removeImportedToken = (token: ImportedToken) => {
    setImportedTokens((prev) => prev.filter((item) => !(item.chainId === token.chainId && item.address.toLowerCase() === token.address.toLowerCase())))
    resetToFirstPage()
  }

  if (!isConnected || !address) {
    return (
      <div className="space-y-2 rounded-[24px] border border-white/10 bg-slate-900/70 p-8 text-center">
        <p className="font-medium text-slate-200">Connect your wallet to view your portfolio.</p>
        <p className="text-sm text-slate-400">We fetch balances from Ethereum, Polygon, Arbitrum, and Base.</p>
      </div>
    )
  }

  if (loading && !portfolio) {
    return (
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-[24px] bg-white/5" />
        <div className="h-56 animate-pulse rounded-[24px] bg-white/5" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-[24px] border border-red-500/40 bg-red-950/30 p-4">
        <p className="font-medium text-red-300">Unable to load tokens</p>
        <p className="text-sm text-red-200/80">{error}</p>
        <button type="button" onClick={() => refetch()} className="rounded-full bg-red-500/20 px-3 py-2 text-sm text-red-100 hover:bg-red-500/30">
          Retry
        </button>
      </div>
    )
  }

  if (!portfolio || portfolio.tokens.length === 0) {
    return (
      <div className="space-y-2 rounded-[24px] border border-white/10 bg-slate-900/70 p-8 text-center">
        <p className="font-medium text-slate-200">No token balances found.</p>
        <p className="text-sm text-slate-400">Try importing a token contract below if one is missing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Portfolio Value</p>
            <p className="text-2xl font-semibold text-white">{formatUsd(Number(portfolio.totalValue))}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Visible Tokens</p>
            <p className="text-2xl font-semibold text-white">{filteredTokens.length}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Active Chains</p>
            <p className="text-2xl font-semibold text-white">{chains.length}</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Largest Position</p>
            <p className="text-2xl font-semibold text-white">{topToken ? topToken.symbol : 'N/A'}</p>
          </div>
        </div>

        {portfolio.warnings.length > 0 && (
          <div className="mt-4 space-y-1 rounded-[20px] border border-amber-500/40 bg-amber-950/30 p-3 text-sm text-amber-100">
            {portfolio.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        )}
      </section>

      {perChainTotals.length > 0 && (
        <section className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">Per-Chain Subtotals</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {perChainTotals.map((chainTotal) => (
              <div key={chainTotal.chainId} className="rounded-[20px] border border-white/10 bg-slate-950/70 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{chainTotal.chainName}</p>
                <p className="text-lg font-semibold text-white">{formatUsd(chainTotal.value)}</p>
                <p className="text-xs text-slate-400">{chainTotal.tokenCount} token positions</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4 rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetToFirstPage()
            }}
            placeholder="Search by symbol, token name, or contract"
            className="w-full rounded-[16px] border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setHideDust((prev) => !prev)
                resetToFirstPage()
              }}
              className={`rounded-full border px-3 py-2 text-xs ${hideDust ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-200' : 'border-white/15 bg-white/5 text-slate-300'}`}
            >
              Hide dust
            </button>
            <button
              type="button"
              onClick={() => {
                setHideSpam((prev) => !prev)
                resetToFirstPage()
              }}
              className={`rounded-full border px-3 py-2 text-xs ${hideSpam ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-200' : 'border-white/15 bg-white/5 text-slate-300'}`}
            >
              Hide likely spam
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedChain('all')
              resetToFirstPage()
            }}
            className={`rounded-full border px-3 py-1 text-xs ${selectedChain === 'all' ? 'border-blue-400/50 bg-blue-500/25 text-blue-100' : 'border-white/15 bg-white/5 text-slate-300'}`}
          >
            All chains
          </button>
          {chains.map((chain) => (
            <button
              key={chain.id}
              type="button"
              onClick={() => {
                setSelectedChain(chain.id)
                resetToFirstPage()
              }}
              className={`rounded-full border px-3 py-1 text-xs ${selectedChain === chain.id ? 'border-blue-400/50 bg-blue-500/25 text-blue-100' : 'border-white/15 bg-white/5 text-slate-300'}`}
            >
              {chain.name}
            </button>
          ))}
        </div>

        {filteredTokens.length === 0 ? (
          <div className="rounded-[20px] border border-white/10 bg-slate-950/70 p-5 text-center text-sm text-slate-300">
            No tokens match your current filters.
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedTokens.map((token) => (
              <button
                key={`${token.chainId}:${token.address}`}
                type="button"
                onClick={() => setSelectedToken(token)}
                className="w-full rounded-[20px] border border-white/10 bg-slate-950/60 p-3 text-left transition hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-3">
                    {token.logoURI ? (
                      <Image src={token.logoURI} alt={token.symbol} width={36} height={36} className="rounded-full" unoptimized />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100">
                        {tokenFallbackLabel(token)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{token.symbol}</p>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">{token.chainName}</span>
                        {token.isLikelySpam && <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-200">Likely spam</span>}
                      </div>
                      <p className="truncate text-xs text-slate-400">{token.name}</p>
                      <p className="truncate text-xs text-slate-500">{shortAddress(token.address)}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-medium text-white">{formatUsd(Number(token.value))}</p>
                    <p className="text-xs text-slate-400">{Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token.symbol}</p>
                  </div>
                </div>
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-2 text-xs sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-400">
                Showing {(visiblePage - 1) * pageSize + 1}-{Math.min(visiblePage * pageSize, filteredTokens.length)} of {filteredTokens.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={visiblePage === 1}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-slate-300">Page {visiblePage} / {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={visiblePage === totalPages}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-[24px] border border-white/10 bg-slate-900/80 p-5">
        <h3 className="text-sm font-semibold text-white">Manual Token Import</h3>
        <form onSubmit={handleImportToken} className="grid gap-2 md:grid-cols-[180px_1fr_auto]">
          <select
            value={importChainId}
            onChange={(event) => setImportChainId(Number(event.target.value))}
            className="rounded-[16px] border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
          >
            {chainOptions.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.label}
              </option>
            ))}
          </select>
          <input
            value={importAddress}
            onChange={(event) => setImportAddress(event.target.value)}
            placeholder="0x... contract address"
            className="rounded-[16px] border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
          <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
            Import
          </button>
        </form>

        {importError && <p className="text-xs text-red-300">{importError}</p>}

        {importedTokens.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {importedTokens.map((token) => (
              <button
                key={`${token.chainId}:${token.address}`}
                type="button"
                onClick={() => removeImportedToken(token)}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
              >
                Remove {token.chainId} {shortAddress(token.address)}
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md space-y-4 rounded-[24px] border border-white/15 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{selectedToken.symbol}</p>
                <p className="text-sm text-slate-400">{selectedToken.name}</p>
              </div>
              <button type="button" onClick={() => setSelectedToken(null)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-slate-300 break-all"><span className="text-slate-500">Chain:</span> {selectedToken.chainName}</p>
              <p className="text-slate-300 break-all"><span className="text-slate-500">Contract:</span> {selectedToken.address}</p>
              <p className="text-slate-300"><span className="text-slate-500">Balance:</span> {selectedToken.balance} {selectedToken.symbol}</p>
              <p className="text-slate-300"><span className="text-slate-500">Price:</span> {formatUsd(selectedToken.price)}</p>
              <p className="text-slate-300"><span className="text-slate-500">Value:</span> {formatUsd(Number(selectedToken.value))}</p>
              <div className="flex flex-col gap-2 pt-1">
                {getTokenExplorerUrl(selectedToken) && (
                  <a href={getTokenExplorerUrl(selectedToken) ?? '#'} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">
                    View token on explorer
                  </a>
                )}
                {address && getAddressExplorerUrl(selectedToken, address) && (
                  <a href={getAddressExplorerUrl(selectedToken, address) ?? '#'} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">
                    View wallet on explorer
                  </a>
                )}
              </div>
              {selectedToken.isLikelySpam && (
                <p className="text-amber-200">This token is flagged as likely spam because metadata and pricing are unavailable.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
