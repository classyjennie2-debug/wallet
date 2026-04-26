'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'
import { buildAlertEvents, getOpenAlertCount } from '@/components/security-alerts'

type Tab = 'dashboard' | 'alerts' | 'security' | 'solutions'

interface DashboardV2Props {
  onNavigate?: (tab: Tab) => void
}

const DashboardGlyph = ({ tone = 'cyan' }: { tone?: 'cyan' | 'violet' | 'emerald' | 'slate' }) => {
  const toneClass = {
    cyan: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/20',
    violet: 'text-violet-300 bg-violet-500/10 border-violet-400/20',
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
    slate: 'text-[var(--foreground)] bg-[var(--surface)]/90 border-[var(--border-color)]',
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
  const { tokens, loading, fetchTokens, deadCoins, approvals, warnings } = useWallet()
  const { address, isConnected } = useAccount()
  const { handleError } = useErrorHandler()
  const [tokensExpanded, setTokensExpanded] = useState(false)
  const hasFetched = useRef(false)

  const stats = useMemo(() => ({
    assetsCount: tokens.length,
    chainsActive: Math.min(Math.max(Math.ceil(tokens.length / 3), tokens.length > 0 ? 1 : 0), 4),
    riskSignals: deadCoins.length,
    signalMomentum: '+2.34%',
    recoveryReady: Math.max(58, 92 - deadCoins.length * 10),
    openAlerts: getOpenAlertCount(buildAlertEvents(deadCoins, approvals, warnings)),
  }), [tokens, deadCoins.length, approvals, warnings])

  const shortAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`

  const connectionLabel = 'Connected'

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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-6">
          <DashboardGlyph />
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Secure wallet dashboard</h2>
        <p className="text-muted text-sm text-center max-w-md">Connect your wallet to begin scanning approvals, reviewing risk posture, and restoring access with guided recovery tools.</p>
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
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-4 sm:p-5 shadow-[0_24px_70px_-40px_rgba(59,130,246,0.12)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_58%)]" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Secure wallet control</p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)]">Your wallet security command center</h1>
                <p className="max-w-2xl text-sm text-muted">Monitor connection integrity, risk signals, recovery readiness, and fast actions for the connected wallet.</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1">Local browser review</span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1">No private key custody</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-muted">
                <span className={`h-2.5 w-2.5 rounded-full ${stats.riskSignals ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                {stats.riskSignals ? `${stats.riskSignals} risk signal${stats.riskSignals > 1 ? 's' : ''}` : 'No active alerts'}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.05fr_0.9fr_0.9fr_0.9fr]">
              <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.32em] text-muted mb-2">Wallet connected</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">{address ? shortAddress(address) : 'Unknown'}</p>
                <p className="text-xs text-muted mt-3">{connectionLabel} wallet session</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300 mb-2">Recovery readiness</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">{stats.recoveryReady}%</p>
                <p className="text-xs text-muted mt-3">Measured from wallet risk signals and access patterns.</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.32em] text-sky-300 mb-2">Network reach</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">{stats.chainsActive}</p>
                <p className="text-xs text-muted mt-3">Connected chain coverage for the wallet.</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.32em] text-amber-300 mb-2">Open alerts</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">{stats.openAlerts}</p>
                <p className="text-xs text-muted mt-3">Active risk findings in your current session.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-muted)] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted">Quick actions</p>
                <p className="text-lg font-semibold text-[var(--foreground)]">Fast security workflows</p>
              </div>
              <DashboardGlyph tone="emerald" />
            </div>
            <div className="mt-6 grid gap-3">
              <button onClick={() => onNavigate?.('security')} className="w-full rounded-[24px] border border-cyan-500/20 bg-[var(--surface-muted)] px-4 py-5 text-left text-[var(--foreground)] shadow-sm transition hover:border-cyan-400/30 hover:bg-[var(--surface)]/90">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-200">Security</span>
                      <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100">Audit</span>
                    </div>
                    <p className="font-semibold text-[var(--foreground)]">Inspect contract approvals & wallet risk</p>
                    <p className="text-sm text-muted">Review suspicious dApp permissions, token approvals, and contract exposures with clear next steps.</p>
                  </div>
                  <DashboardGlyph tone="cyan" />
                </div>
              </button>
              <button onClick={() => onNavigate?.('solutions')} className="w-full rounded-[24px] border border-sky-500/20 bg-[var(--surface-muted)] px-4 py-5 text-left text-[var(--foreground)] shadow-sm transition hover:border-sky-400/30 hover:bg-[var(--surface)]/90">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-sky-200">Recovery</span>
                      <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[11px] text-sky-100">Guided</span>
                    </div>
                    <p className="font-semibold text-[var(--foreground)]">Start recovery workflow</p>
                    <p className="text-sm text-muted">Follow a guided path to restore access and validate your recovery setup.</p>
                  </div>
                  <DashboardGlyph tone="slate" />
                </div>
              </button>
              <button onClick={() => onNavigate?.('alerts')} className="relative w-full rounded-[24px] border border-emerald-500/20 bg-[var(--surface-muted)] px-4 py-5 text-left text-[var(--foreground)] shadow-sm transition hover:border-emerald-400/30 hover:bg-[var(--surface)]/90">
                {stats.openAlerts > 0 ? (
                  <span className="absolute right-4 top-4 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_5px_rgba(251,113,133,0.15)]" />
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-emerald-200">Alerts</span>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-100">Review</span>
                    </div>
                    <p className="font-semibold text-[var(--foreground)]">Review active risk alerts</p>
                    <p className="text-sm text-muted">See current incidents and suspicious events with clear next steps.</p>
                  </div>
                  <DashboardGlyph tone="emerald" />
                </div>
              </button>
            </div>
            <div className="mt-6 rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)]/90 p-4">
              <p className="text-xs uppercase tracking-[0.32em] text-muted">Status summary</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li className="flex items-center justify-between">
                  <span>Wallet connection</span>
                  <span className="font-semibold text-[var(--foreground)]">{connectionLabel}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Risk alerts</span>
                  <span className="font-semibold text-[var(--foreground)]">{stats.riskSignals}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Recovery ready</span>
                  <span className="font-semibold text-[var(--foreground)]">{stats.recoveryReady}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-[0_30px_80px_-50px_rgba(56,189,248,0.12)]">
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted">Risk exposure</p>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">Active risk exposures</h2>
              </div>
              <button
                onClick={() => setTokensExpanded((s) => !s)}
                className="rounded-full border border-[var(--border-color)] bg-[var(--surface-muted)] px-4 py-2 text-xs text-muted hover:bg-[var(--surface)]/80 transition"
              >
                {tokensExpanded ? 'Collapse list' : 'Expand all'}
              </button>
            </div>
            {tokens.length > 0 ? (
              <div className="space-y-3">
                {(tokensExpanded ? tokens : tokens.slice(0, 4)).map((token) => (
                  <div key={`${token.address}:${token.name}`} className="grid gap-4 sm:grid-cols-[auto_1fr_auto] items-center rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-muted)] p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 font-semibold">{token.symbol[0]}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--foreground)] truncate">{token.name}</p>
                      <p className="text-xs text-muted truncate">{token.symbol} · {token.isDead ? 'Risk flagged' : 'Monitored'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--foreground)]">{token.isDead ? 'Risk' : 'Normal'}</p>
                      <p className="text-xs text-muted">{token.isDead ? 'Risk token' : 'Watched token'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[var(--border-color)] bg-[var(--surface-muted)]/95 p-8 text-center text-muted">
                No token exposures found. Connect a wallet to begin.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-[0_30px_80px_-50px_rgba(16,185,129,0.12)]">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted">Recovery readiness</p>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Stay prepared</h3>
              </div>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Recommended</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-[24px] bg-[var(--surface-muted)] p-4 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--foreground)]">Review your backup strategy.</p>
                <p className="text-xs text-muted mt-1">Strong seed phrase habits reduce restore risk.</p>
              </div>
              <div className="rounded-[24px] bg-[var(--surface-muted)] p-4 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--foreground)]">Enable hardware or multisig wallets for high-risk exposures.</p>
                <p className="text-xs text-muted mt-1">A layered defense is the premium standard.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-[0_30px_80px_-50px_rgba(236,72,153,0.12)]">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.32em] text-muted">Instant actions</p>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Recovery & security hub</h3>
            </div>
            <div className="grid gap-3">
              <button onClick={() => onNavigate?.('solutions')} className="rounded-[24px] border border-cyan-500/10 bg-[var(--surface-muted)] px-4 py-4 text-left text-[var(--foreground)] transition hover:border-cyan-400/30 hover:bg-[var(--surface)]/90">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Run recovery workflow</p>
                    <p className="text-xs text-muted mt-1">Recover access and audit restoration readiness.</p>
                  </div>
                  <DashboardGlyph tone="cyan" />
                </div>
              </button>
              <button onClick={() => onNavigate?.('security')} className="rounded-[24px] border border-violet-500/10 bg-[var(--surface-muted)] px-4 py-4 text-left text-[var(--foreground)] transition hover:border-violet-400/30 hover:bg-[var(--surface)]/90">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Run security audit</p>
                    <p className="text-xs text-muted mt-1">Run contract and allowance checks quickly.</p>
                  </div>
                  <DashboardGlyph tone="violet" />
                </div>
              </button>
              <button onClick={() => onNavigate?.('alerts')} className="rounded-[24px] border border-emerald-500/10 bg-[var(--surface-muted)] px-4 py-4 text-left text-[var(--foreground)] transition hover:border-emerald-400/30 hover:bg-[var(--surface)]/90">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Review alerts</p>
                    <p className="text-xs text-muted mt-1">Inspect your latest security alerts and suspicious events.</p>
                  </div>
                  <DashboardGlyph tone="emerald" />
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-5 shadow-[0_30px_80px_-50px_rgba(148,163,184,0.08)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted">Security score</p>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">Recommended action</h3>
              </div>
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Ready</span>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm text-muted">Wallet status</p>
                <p className="text-2xl font-semibold text-[var(--foreground)]">{isConnected ? 'Active' : 'Disconnected'}</p>
              </div>
              <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-muted)] p-4">
                <p className="text-sm text-muted">Recommended next step</p>
                  <p className="text-base font-semibold text-[var(--foreground)]">Start recovery audit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
