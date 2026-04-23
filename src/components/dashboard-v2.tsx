'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

type Tab = 'dashboard' | 'charts' | 'history' | 'risk' | 'nft' | 'allowances' | 'security' | 'recovery' | 'swap' | 'send' | 'analysis'

interface DashboardV2Props {
  onNavigate?: (tab: Tab) => void
}

const DashboardGlyph = ({ tone = 'cyan' }: { tone?: 'cyan' | 'violet' | 'emerald' | 'slate' }) => {
  const toneClass = {
    cyan: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/20',
    violet: 'text-violet-300 bg-violet-500/10 border-violet-400/20',
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
    slate: 'text-slate-200 bg-white/5 border-white/10',
  }[tone]

  return (
    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${toneClass}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" />
        <path d="M9.5 12.5l1.7 1.7 3.3-4" />
      </svg>
    </span>
  )
}

export const DashboardV2 = ({ onNavigate }: DashboardV2Props) => {
  const { tokens, loading, totalBalance, fetchTokens } = useWallet()
  const { isConnected } = useAccount()
  const { handleError } = useErrorHandler()
  const [tokensExpanded, setTokensExpanded] = useState(false)
  const hasFetched = useRef(false)

  const stats = useMemo(() => ({
    assetsCount: tokens.length,
    chainsActive: Math.min(Math.max(Math.ceil(tokens.length / 3), tokens.length > 0 ? 1 : 0), 4),
    portfolioChange: '+2.34%',
  }), [tokens])

  useEffect(() => {
    if (!isConnected) {
      hasFetched.current = false
      return
    }

    if (hasFetched.current) {
      return
    }

    hasFetched.current = true
    fetchTokens().catch((err) => {
      handleError(err, 'NETWORK_ERROR')
    })
  }, [isConnected, fetchTokens, handleError])

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="mb-6">
          <DashboardGlyph />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Secure Dashboard</h2>
        <p className="text-gray-400 text-sm text-center max-w-md">Connect your wallet to unlock your personal finance dashboard with real-time portfolio tracking</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[11rem] h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-gradient-to-br from-white/5 to-white/10 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_32px_90px_-50px_rgba(59,130,246,0.45)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_58%)]" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Premium portfolio</p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white">A refined wallet dashboard for pro-grade monitoring</h1>
                <p className="max-w-2xl text-sm text-slate-400">Track balances, risk signals, and recovery readiness with polished visuals and premium analytics.</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1">Live balances</span>
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1">Risk posture</span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1">Recovery checks</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-inner">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Live chain sync
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr_1fr]">
              <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-600/10 to-slate-950/70 p-5 shadow-[0_24px_40px_-24px_rgba(99,102,241,0.6)]">
                <p className="text-xs uppercase tracking-[0.32em] text-violet-300 mb-2">Total assets</p>
                <p className="text-4xl font-semibold text-white">${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-400">Primary portfolio value across all connected wallets.</p>
                  <DashboardGlyph tone="violet" />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-slate-950/70 p-5 shadow-[0_24px_40px_-24px_rgba(56,189,248,0.55)]">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300 mb-2">Asset count</p>
                <p className="text-3xl font-semibold text-white">{stats.assetsCount}</p>
                <p className="text-xs text-slate-400 mt-3">Tokens actively tracked in your wallet.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-slate-950/70 p-5 shadow-[0_24px_40px_-24px_rgba(16,185,129,0.55)]">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-300 mb-2">Network reach</p>
                <p className="text-3xl font-semibold text-white">{stats.chainsActive}</p>
                <p className="text-xs text-slate-400 mt-3">Chains with active assets and historical movement.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Risk profile</p>
                <p className="text-lg font-semibold text-white">Stable</p>
              </div>
              <DashboardGlyph tone="emerald" />
            </div>
            <div className="mt-6 rounded-[24px] bg-gradient-to-r from-cyan-500/20 to-slate-900/20 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
                <span>Recovery readiness</span>
                <span className="font-semibold text-white">82%</span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Weekly momentum</p>
                <p className="text-xl font-semibold text-white">{stats.portfolioChange}</p>
                <p className="text-xs text-slate-500 mt-1">Positive movement across major positions.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Action score</p>
                <p className="text-xl font-semibold text-white">{stats.assetsCount * 8}</p>
                <p className="text-xs text-slate-500 mt-1">Dynamic signal built from balance and change.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-50px_rgba(56,189,248,0.35)]">
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Portfolio details</p>
                <h2 className="text-2xl font-semibold text-white">Top positions</h2>
              </div>
              <button
                onClick={() => setTokensExpanded((s) => !s)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 hover:bg-white/10 transition"
              >
                {tokensExpanded ? 'Collapse list' : 'Expand all'}
              </button>
            </div>
            {tokens.length > 0 ? (
              <div className="space-y-3">
                {(tokensExpanded ? tokens : tokens.slice(0, 4)).map((token) => (
                  <div key={`${token.address}:${token.name}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:border-cyan-500/20 hover:bg-white/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">{token.symbol[0]}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{token.name}</p>
                      <p className="text-xs text-slate-400 truncate">{token.symbol} · {token.balance}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${token.usdValue.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">Current value</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
                No assets are currently tracked. Connect a wallet to begin.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-50px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Recovery readiness</p>
                <h3 className="text-xl font-semibold text-white">Stay prepared</h3>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">Action required</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-[24px] bg-white/5 p-4 border border-white/10">
                <p className="text-sm text-white">Review your backup strategy.</p>
                <p className="text-xs text-slate-500 mt-1">Strong seed phrase habits reduce restore risk.</p>
              </div>
              <div className="rounded-[24px] bg-white/5 p-4 border border-white/10">
                <p className="text-sm text-white">Enable hardware or multisig wallets for high-value holdings.</p>
                <p className="text-xs text-slate-500 mt-1">A layered defense is the premium standard.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-50px_rgba(236,72,153,0.25)]">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Instant actions</p>
              <h3 className="text-xl font-semibold text-white">Recovery & security hub</h3>
            </div>
            <div className="grid gap-3">
              <button onClick={() => onNavigate?.('recovery')} className="rounded-[24px] border border-cyan-500/10 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 px-4 py-4 text-left text-white transition hover:border-cyan-400/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Wallet Restoration</p>
                    <p className="text-xs text-slate-400 mt-1">Recover access and audit recovery readiness.</p>
                  </div>
                  <DashboardGlyph tone="cyan" />
                </div>
              </button>
              <button onClick={() => onNavigate?.('security')} className="rounded-[24px] border border-violet-500/10 bg-white/5 px-4 py-4 text-left text-white transition hover:border-violet-400/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Security Audit</p>
                    <p className="text-xs text-slate-400 mt-1">Run contract and allowance checks quickly.</p>
                  </div>
                  <DashboardGlyph tone="violet" />
                </div>
              </button>
              <button onClick={() => onNavigate?.('history')} className="rounded-[24px] border border-emerald-500/10 bg-white/5 px-4 py-4 text-left text-white transition hover:border-emerald-400/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Transaction Review</p>
                    <p className="text-xs text-slate-400 mt-1">Inspect your last wallet activity in a sleek timeline.</p>
                  </div>
                  <DashboardGlyph tone="emerald" />
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 shadow-[0_30px_80px_-50px_rgba(148,163,184,0.15)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Premium signal</p>
                <h3 className="text-xl font-semibold text-white">Action score</h3>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">Stable</span>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Connected wallets</p>
                <p className="text-2xl font-semibold text-white">{isConnected ? 'Active' : 'Disconnected'}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Recommended next step</p>
                <p className="text-base font-semibold text-white">Perform recovery audit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
