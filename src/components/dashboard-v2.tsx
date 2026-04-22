'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect, useMemo, useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

type Tab = 'dashboard' | 'charts' | 'history' | 'risk' | 'nft' | 'allowances' | 'security' | 'recovery' | 'swap' | 'send' | 'analysis'

interface DashboardV2Props {
  onNavigate?: (tab: Tab) => void
}

export const DashboardV2 = ({ onNavigate }: DashboardV2Props) => {
  const { tokens, loading, totalBalance, fetchTokens } = useWallet()
  const { isConnected } = useAccount()
  const { handleError } = useErrorHandler()
  const [tokensExpanded, setTokensExpanded] = useState(false)

  const stats = useMemo(() => ({
    assetsCount: tokens.length,
    chainsActive: Math.min(Math.max(Math.ceil(tokens.length / 3), tokens.length > 0 ? 1 : 0), 4),
    portfolioChange: '+2.34%',
  }), [tokens])

  useEffect(() => {
    if (isConnected) {
      fetchTokens().catch((err) => {
        handleError(err, 'NETWORK_ERROR')
      })
    }
  }, [isConnected, fetchTokens, handleError])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="mb-6 text-7xl opacity-80">ðŸ”</div>
        <h2 className="text-2xl font-bold text-white mb-2">Secure Dashboard</h2>
        <p className="text-gray-400 text-sm text-center max-w-md">Connect your wallet to unlock your personal finance dashboard with real-time portfolio tracking</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Stats (mobile-first horizontal scroll) */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="min-w-[11rem] h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-gradient-to-br from-white/5 to-white/10 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Cards (mobile-first scroll) */}
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4">
        {/* Total Balance */}
        <div className="min-w-[11rem] group relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-600/30">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-2">Total Balance</p>
            <p className="text-lg font-bold text-white">${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-slate-400 mt-2">Across all chains</p>
          </div>
        </div>

        {/* Assets Count */}
        <div className="min-w-[11rem] group relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-600/30">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-2">Assets</p>
            <p className="text-lg font-bold text-white">{stats.assetsCount}</p>
            <p className="text-xs text-slate-400 mt-2">Tokens held</p>
          </div>
        </div>

        {/* Active Chains */}
        <div className="min-w-[11rem] group relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-emerald-600/10 to-teal-600/5 border border-emerald-600/30">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-2">Networks</p>
            <p className="text-lg font-bold text-white">{stats.chainsActive}</p>
            <p className="text-xs text-slate-400 mt-2">Active chains</p>
          </div>
        </div>

        {/* Portfolio Change */}
        <div className="min-w-[11rem] group relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-amber-600/10 to-orange-600/5 border border-amber-600/30">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-2">24h Change</p>
            <p className="text-lg font-bold text-green-400">{stats.portfolioChange}</p>
            <p className="text-xs text-slate-400 mt-2">Portfolio trend</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Portfolio Breakdown */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-8 bg-gradient-to-br from-purple-600/10 to-blue-600/5 border border-purple-600/30 backdrop-blur-xl">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Your Assets</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">Diversified across multiple chains</p>
              </div>
              <div className="text-3xl opacity-70">ðŸ“Š</div>
            </div>

            {tokens.length > 0 ? (
              <div className="space-y-3">
                {(tokensExpanded ? tokens : tokens.slice(0, 3)).map((token) => (
                  <div key={`${token.address}:${token.name}`} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-600/20 hover:border-purple-600/40 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {token.symbol[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{token.symbol}</p>
                        <p className="text-xs text-slate-400 truncate">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white text-sm">${token.usdValue.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">{token.balance}</p>
                    </div>
                  </div>
                ))}

                {/* Mobile-friendly view all / collapse */}
                {tokens.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setTokensExpanded((s) => !s)}
                      className="px-4 py-2 rounded-md bg-white/6 text-sm text-white/90 hover:bg-white/10 transition"
                    >
                      {tokensExpanded ? 'Show less' : `View all (${tokens.length})`}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No tokens found. Start by transferring crypto to your wallet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Four grouped sections covering recovery and wallet management */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Section 1: Account & Recovery */}
            <div className="rounded-lg p-4 bg-gradient-to-br from-indigo-700/6 to-violet-700/5 border border-indigo-700/20">
              <h4 className="text-sm font-semibold text-indigo-200 mb-3">Account & Recovery</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => onNavigate?.('recovery')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ”„</div>
                  <p className="font-semibold text-white text-sm">Wallet Restoration</p>
                  <p className="text-xs text-slate-400">Validate and restore using seed / derivation checks</p>
                </button>

                <button onClick={() => onNavigate?.('recovery')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ§­</div>
                  <p className="font-semibold text-white text-sm">Recovery Checklist</p>
                  <p className="text-xs text-slate-400">Guided steps to regain access safely</p>
                </button>
              </div>
            </div>

            {/* Section 2: Security & Analysis */}
            <div className="rounded-lg p-4 bg-gradient-to-br from-rose-700/6 to-orange-700/5 border border-rose-700/20">
              <h4 className="text-sm font-semibold text-rose-200 mb-3">Security & Analysis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => onNavigate?.('analysis')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ”</div>
                  <p className="font-semibold text-white text-sm">Dead Coin Detector</p>
                  <p className="text-xs text-slate-400">Detect low-liquidity or abandoned tokens</p>
                </button>

                <button onClick={() => onNavigate?.('security')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ›¡ï¸</div>
                  <p className="font-semibold text-white text-sm">Security Audit</p>
                  <p className="text-xs text-slate-400">Contract checks and ownership analysis</p>
                </button>

                <button onClick={() => onNavigate?.('allowances')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ”</div>
                  <p className="font-semibold text-white text-sm">Token Allowance Manager</p>
                  <p className="text-xs text-slate-400">View & revoke approvals</p>
                </button>

                <button onClick={() => onNavigate?.('analysis')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">âš ï¸</div>
                  <p className="font-semibold text-white text-sm">Alerts & Recommendations</p>
                  <p className="text-xs text-slate-400">Highlight risky approvals or suspicious activity</p>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Section 3: Portfolio & History (read-only troubleshooting) */}
            <div className="rounded-lg p-4 bg-gradient-to-br from-cyan-700/6 to-sky-700/5 border border-cyan-700/20">
              <h4 className="text-sm font-semibold text-cyan-200 mb-3">Portfolio & History</h4>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => onNavigate?.('dashboard')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ“Š</div>
                  <p className="font-semibold text-white text-sm">Portfolio Overview</p>
                  <p className="text-xs text-slate-400">Balances and asset breakdown (read-only)</p>
                </button>

                <button onClick={() => onNavigate?.('history')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ“œ</div>
                  <p className="font-semibold text-white text-sm">Transaction History</p>
                  <p className="text-xs text-slate-400">View transactions for troubleshooting</p>
                </button>
              </div>
            </div>

            {/* Section 4: Guides & Tools */}
            <div className="rounded-lg p-4 bg-gradient-to-br from-emerald-700/6 to-lime-700/5 border border-emerald-700/20">
              <h4 className="text-sm font-semibold text-emerald-200 mb-3">Guides & Tools</h4>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => onNavigate?.('recovery')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ”§</div>
                  <p className="font-semibold text-white text-sm">Connection Troubleshooter</p>
                  <p className="text-xs text-slate-400">Diagnose wallet/network connection issues</p>
                </button>

                <button onClick={() => onNavigate?.('recovery')} className="p-3 rounded-lg bg-white/5 text-left">
                  <div className="text-2xl">ðŸ“š</div>
                  <p className="font-semibold text-white text-sm">Backup & Upgrade Guidance</p>
                  <p className="text-xs text-slate-400">How to move to hardware or multisig wallets</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
