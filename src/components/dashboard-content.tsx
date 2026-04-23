'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MyWalletLogo } from '@/components/logo'
import { WalletConnect } from '@/components/wallet-connect'
import { DashboardV2 } from '@/components/dashboard-v2'
import { DeadCoinDetector } from '@/components/dead-coin-detector'
import { SecurityAlerts } from '@/components/security-alerts'
import { TokenAllowanceManager } from '@/components/token-allowance-manager'
import { SecurityAudit } from '@/components/security-audit'
import { WalletRestoration } from '@/components/wallet-restoration'

type Tab = 'dashboard' | 'alerts' | 'security' | 'recovery'

interface DashboardContentProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const AppIcon = ({ kind }: { kind: 'dashboard' | 'alert' | 'security' | 'recovery' | 'back' }) => {
  const iconMap = {
    dashboard: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="4.5" rx="1.5" />
        <rect x="13" y="10.5" width="7" height="9.5" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
    alert: (
      <>
        <path d="M12 4l9 16H3L12 4z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </>
    ),
    security: (
      <>
        <path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" />
        <path d="M9.5 12.5l1.7 1.7 3.3-4" />
      </>
    ),
    recovery: (
      <>
        <circle cx="8.5" cy="12" r="2.5" />
        <path d="M11 12h9M17 12v2M20 12v2" />
      </>
    ),
    back: (
      <>
        <path d="M14 6l-6 6 6 6" />
        <path d="M20 12H8" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

const tabs: { id: Tab; label: string; icon: 'dashboard' | 'alert' | 'security' | 'recovery'; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', description: 'Wallet posture and connection health' },
  { id: 'alerts', label: 'Alerts', icon: 'alert', description: 'Security incidents and suspicious activity' },
  { id: 'security', label: 'Security', icon: 'security', description: 'Checks and approvals' },
  { id: 'recovery', label: 'Recovery', icon: 'recovery', description: 'Guided restoration tools' },
]

export default function DashboardContent({ activeTab, setActiveTab }: DashboardContentProps) {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  useEffect(() => {
    if (!isConnected && openConnectModal) {
      const timer = setTimeout(() => openConnectModal(), 300)
      return () => clearTimeout(timer)
    }
  }, [isConnected, openConnectModal])

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto w-full max-w-full px-4 py-2 sm:px-4 sm:py-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="flex items-center gap-3">
                  <div className="block md:hidden">
                    <MyWalletLogo size="sm" variant="icon" />
                  </div>
                  <div className="hidden md:block">
                    <MyWalletLogo size="md" variant="full" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-[11px] text-slate-400">Premium wallet intelligence for recovery and security posture.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <div className="w-full sm:w-auto">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>

          <nav className="hidden sm:block mx-auto w-full max-w-7xl px-2 py-2 sm:px-4 sm:py-3" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="overflow-hidden rounded-full border border-white/10 bg-slate-950/90 px-2 py-1 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              <div className="flex gap-2 overflow-x-auto px-1" role="tablist">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-h-[40px] items-center gap-2 rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500/20 via-slate-900/80 to-cyan-500/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-slate-300 transition-colors ${
                      activeTab === tab.id ? 'border-white/15 bg-white/10 text-white' : 'border-white/10 bg-white/5'
                    }`}>
                      <AppIcon kind={tab.icon} />
                    </span>
                    <span className="text-left leading-tight">
                      <span>{tab.label}</span>
                      <span className={`block text-[10px] font-medium ${activeTab === tab.id ? 'text-slate-300' : 'text-slate-500'}`}>{tab.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </header>

        <div className="mx-auto max-w-7xl px-2 py-4 pb-28 sm:px-4 sm:py-8 sm:pb-32">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in-50">
              <DashboardV2 onNavigate={(tab) => setActiveTab(tab as Tab)} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="animate-in fade-in-50">
              <div className="mb-4 sm:mb-6 flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                  <AppIcon kind="alert" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">Security Alerts</h1>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">Review suspicious wallet events, approval alerts, and incident history.</p>
                </div>
              </div>
              <SecurityAlerts />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="mb-4 sm:mb-6 flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                  <AppIcon kind="security" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">Security & Tools</h1>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">Contract checks, dead-coin scanner, and allowance manager.</p>
                </div>
              </div>
              <div className="space-y-6">
                <SecurityAudit />
                <DeadCoinDetector />
                <TokenAllowanceManager />
              </div>
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="space-y-6 animate-in fade-in-50">
              <div className="mb-4 sm:mb-6 flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                  <AppIcon kind="recovery" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">Recovery & Guidance</h1>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">Wallet restoration, connection troubleshooting, and upgrade guides.</p>
                </div>
              </div>
              <WalletRestoration />
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-2 py-1 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.9)] sm:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-9 min-w-[0] flex-1 flex-col items-center justify-center rounded-2xl px-1 text-[10px] font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-[0_8px_24px_-16px_rgba(0,0,0,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
                  activeTab === tab.id ? 'border-white/20 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'
                }`}>
                  <AppIcon kind={tab.icon} />
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.18em]">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="h-4 sm:h-0" />
      </div>
    </main>
  )
}
