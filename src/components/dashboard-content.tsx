 'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useWallet } from '@/lib/wallet-context'
import { issueOptions } from '@/components/wallet-restoration'
import { MyWalletLogo } from '@/components/logo'
import { WalletConnect } from '@/components/wallet-connect'
import { ThemeToggle } from '@/components/theme-toggle'
import { DashboardV2 } from '@/components/dashboard-v2'
import { DeadCoinDetector } from '@/components/dead-coin-detector'
import { SecurityAlerts, buildAlertEvents, getOpenAlertCount } from '@/components/security-alerts'
import { TokenAllowanceManager } from '@/components/token-allowance-manager'
import { SecurityAudit } from '@/components/security-audit'
import { WalletRestoration } from '@/components/wallet-restoration'

type Tab = 'dashboard' | 'alerts' | 'security' | 'solutions'

interface DashboardContentProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const AppIcon = ({ kind }: { kind: 'dashboard' | 'alert' | 'security' | 'recovery' }) => {
  const iconMap = {
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="8" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
        <rect x="13" y="13" width="8" height="8" rx="2" />
      </>
    ),
    alert: (
      <>
        <path d="M12 4l8 14H4L12 4Z" />
        <path d="M12 9v5" />
        <circle cx="12" cy="17" r="1" />
      </>
    ),
    security: (
      <>
        <path d="M12 3l8 4v6.5c0 3.6-2.3 6.3-8 7-5.7-.7-8-3.4-8-7V7l8-4Z" />
        <path d="M8.5 12.5l2.5 2.5 4.5-5" fill="none" />
      </>
    ),
    recovery: (
      <>
        <circle cx="12" cy="12" r="6" />
        <path d="M12 6v3l2-2" fill="none" />
        <path d="M16 12a4 4 0 1 1-8 0" fill="none" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

const tabs: { id: Tab; label: string; icon: 'dashboard' | 'alert' | 'security' | 'recovery'; description: string; mobileLabel: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', description: 'Wallet posture and connection health', mobileLabel: 'Home' },
  { id: 'alerts', label: 'Alerts', icon: 'alert', description: 'Security incidents and suspicious activity', mobileLabel: 'Alerts' },
  { id: 'security', label: 'Security', icon: 'security', description: 'Checks and approvals', mobileLabel: 'Security' },
  { id: 'solutions', label: 'Solutions', icon: 'recovery', description: 'Remediation and repair actions', mobileLabel: 'Fix' },
]

const tabHeadings: Record<Tab, { title: string; description: string; tone: string }> = {
  dashboard: {
    title: 'Wallet command center',
    description: 'Monitor connection status, wallet posture, and next actions from one secure workspace.',
    tone: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  },
  alerts: {
    title: 'Security alerts',
    description: 'Review suspicious events, risky approvals, and incident signals tied to the connected wallet.',
    tone: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  },
  security: {
    title: 'Security tools',
    description: 'Audit contracts, inspect permissions, and review wallet safety across key risk surfaces.',
    tone: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  },
  solutions: {
    title: 'Remediation & Guidance',
    description: 'Guided remediation workflows to recover access and reduce wallet exposure.',
    tone: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  },
}

export default function DashboardContent({ activeTab, setActiveTab }: DashboardContentProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { deadCoins } = useWallet()
  const activeMeta = tabHeadings[activeTab]
  const [showScanModal, setShowScanModal] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const openAlertCount = useMemo(() => getOpenAlertCount(buildAlertEvents(deadCoins)), [deadCoins])

  useEffect(() => {
    if (!showScanModal) return
    setScanProgress(0)
    setScanResult(null)
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.floor((elapsed / 10000) * 100))
      setScanProgress(pct)
      if (pct >= 100) {
        clearInterval(interval)
        // when scan completes, recommend the RPC & Service Failures remediation
        const pick = issueOptions.find((i: any) => i.id === 'integration-api') || issueOptions[0]
        setTimeout(() => setScanResult(pick), 220)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [showScanModal])

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--surface)] shadow-2xl backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-3 py-1.5 sm:px-4 sm:py-3">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <MyWalletLogo size="md" variant="full" />
                  <div className="min-w-0">
                      <p className="hidden text-[11px] text-muted md:block">Local wallet diagnostics and guided remediation tools.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                <ThemeToggle />
                <WalletConnect />
                <button
                  type="button"
                  onClick={() => {
                    setShowScanModal(true)
                    setScanResult(null)
                    setScanProgress(0)
                  }}
                  aria-label="Scan wallet"
                  className="rounded-2xl p-2 text-sm font-semibold bg-[rgba(255,255,255,0.06)] text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.1)] transition"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M3 11h4" strokeOpacity="0.6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <nav className="hidden sm:block">
            <div className="mx-auto max-w-7xl px-3 pb-3 sm:px-4">
              <div className="overflow-hidden rounded-full border border-[var(--border-color)] bg-[var(--surface)] px-2 py-1 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-xl">
                <div className="flex gap-2 overflow-x-auto px-1" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex min-h-[44px] items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-cyan-500/20 via-[rgba(15,23,42,0.8)] to-cyan-500/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                          : 'text-muted hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--foreground)]'
                      }`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                    >
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                        activeTab === tab.id ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300' : 'border-[var(--border-color)] bg-[var(--surface)]/80 text-muted'
                      }`}>
                        <AppIcon kind={tab.icon} />
                      </span>
                      <span className="text-left leading-tight">
                        <span>{tab.label}</span>
                        <span className={`mt-0.5 block text-[10px] font-medium ${activeTab === tab.id ? 'text-[var(--foreground)]' : 'text-muted'}`}>
                          {tab.description}
                        </span>
                      </span>
                      {tab.id === 'alerts' && openAlertCount > 0 ? (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_4px_rgba(251,113,133,0.15)]" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </header>

        {showScanModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 sm:items-center sm:py-12">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowScanModal(false)} />
            <div className="relative w-full max-w-lg rounded-lg bg-[var(--surface)]/95 p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Scan wallet</h3>
              <p className="mt-2 text-sm text-muted">Review your connected wallet for approvals, network issues, and potential risks.</p>
              <div className="mt-4">
                {!scanResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <svg className="h-28 w-28 animate-pulse text-cyan-400" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="32" cy="32" r="14" strokeOpacity="0.18" />
                        <circle cx="32" cy="32" r="22" strokeOpacity="0.08" />
                        <path d="M44 44L58 58" />
                      </svg>
                    </div>
                    <div className="rounded-md bg-[var(--surface-muted)]/80 p-3">
                      <div className="flex items-center justify-between text-sm text-muted">
                        <div>Scanning components</div>
                        <div>{scanProgress}%</div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-[rgba(15,23,42,0.08)]">
                        <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <ul className="mt-3 grid gap-2 text-sm text-muted">
                        <li>Checking connected dApps and approvals</li>
                        <li>Validating RPC and chain integrity</li>
                        <li>Scanning contract interactions and token approvals</li>
                        <li>Verifying local session and signature history</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-muted font-semibold">Recommended remediation</div>
                    <div className="mt-2 text-sm text-muted">{scanResult.title}</div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          router.replace(`?issue=${scanResult.id}`)
                          setShowScanModal(false)
                          setTimeout(() => setActiveTab('solutions'), 80)
                        }}
                        className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
                      >
                        Open remediation
                      </button>
                      <button onClick={() => setShowScanModal(false)} className="rounded-lg px-3 py-2 text-sm text-muted bg-[var(--surface)]/60">Close</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-3 py-4 pb-28 sm:px-4 sm:py-8 sm:pb-32">
          {activeTab !== 'dashboard' && (
            <section className="mb-5 rounded-[26px] border border-[var(--border-color)] bg-[var(--surface-muted)] p-4 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.5)] sm:mb-6 sm:p-5">
              <div className="flex items-start gap-4">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${activeMeta.tone}`}>
                  <AppIcon kind={tabs.find((tab) => tab.id === activeTab)?.icon ?? 'dashboard'} />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">{activeMeta.title}</h1>
                  <p className="mt-1 text-sm leading-6 text-muted">{activeMeta.description}</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in-50">
              <DashboardV2 onNavigate={(tab) => setActiveTab(tab as Tab)} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="animate-in fade-in-50">
              <SecurityAlerts onNavigate={(tab) => setActiveTab(tab as Tab)} />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in-50">
              <SecurityAudit />
              <DeadCoinDetector />
              <TokenAllowanceManager />
            </div>
          )}

          {activeTab === 'solutions' && (
            <div className="space-y-6 animate-in fade-in-50">
              <WalletRestoration />
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-color)] bg-[var(--surface)]/96 px-2 pt-2 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-[60px] min-w-[0] flex-1 flex-col items-center justify-center rounded-[22px] px-1.5 py-2 text-[10px] font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-[var(--surface)]/10 text-[var(--foreground)] shadow-[0_10px_28px_-20px_rgba(0,0,0,0.15)]'
                    : 'text-muted hover:bg-[var(--surface)]/70 hover:text-[var(--foreground)]'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                  activeTab === tab.id ? 'border-[var(--border-color)] bg-[var(--surface)]/60 text-[var(--foreground)]' : 'border-[var(--border-color)] bg-[var(--surface)]/90 text-muted'
                }`}>
                  <AppIcon kind={tab.icon} />
                </span>
                <span className="mt-1.5 text-[10px] uppercase tracking-[0.16em]">{tab.mobileLabel}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </main>
  )
}
