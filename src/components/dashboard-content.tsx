'use client'

import { useAccount } from 'wagmi'
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

const AppIcon = ({ kind }: { kind: 'dashboard' | 'alert' | 'security' | 'recovery' }) => {
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
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

const tabs: { id: Tab; label: string; icon: 'dashboard' | 'alert' | 'security' | 'recovery'; description: string; mobileLabel: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', description: 'Wallet posture and connection health', mobileLabel: 'Home' },
  { id: 'alerts', label: 'Alerts', icon: 'alert', description: 'Security incidents and suspicious activity', mobileLabel: 'Alerts' },
  { id: 'security', label: 'Security', icon: 'security', description: 'Checks and approvals', mobileLabel: 'Security' },
  { id: 'recovery', label: 'Recovery', icon: 'recovery', description: 'Guided restoration tools', mobileLabel: 'Recover' },
]

const tabHeadings: Record<Tab, { title: string; description: string; tone: string }> = {
  dashboard: {
    title: 'Wallet command center',
    description: 'Monitor connection status, wallet posture, and next actions from one secure workspace.',
    tone: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  },
  alerts: {
    title: 'Security alerts',
    description: 'Review suspicious events, risky approvals, and recent incident signals tied to the connected wallet.',
    tone: 'border-violet-400/20 bg-violet-500/10 text-violet-300',
  },
  security: {
    title: 'Security tools',
    description: 'Audit contracts, inspect permissions, and review wallet safety across the most common risk surfaces.',
    tone: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  },
  recovery: {
    title: 'Recovery workflows',
    description: 'Use guided recovery paths to restore access, repair blocked flows, and organize the next recovery step.',
    tone: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
  },
}

export default function DashboardContent({ activeTab, setActiveTab }: DashboardContentProps) {
  const { isConnected } = useAccount()
  const activeMeta = tabHeadings[activeTab]

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-3">
            <div className="flex items-start justify-between gap-3 sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <MyWalletLogo size="md" variant="full" />
                  <div className="min-w-0">
                    <p className="hidden text-[11px] text-slate-400 md:block">Premium wallet intelligence for recovery and wallet diagnostics.</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 md:hidden">
                      {isConnected ? activeMeta.description : 'Connect a wallet to review recovery and live wallet diagnostics.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <WalletConnect />
              </div>
            </div>
          </div>

          <nav className="hidden sm:block">
            <div className="mx-auto max-w-7xl px-3 pb-3 sm:px-4">
              <div className="overflow-hidden rounded-full border border-white/10 bg-slate-950/90 px-2 py-1 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-xl">
                <div className="flex gap-2 overflow-x-auto px-1" role="tablist">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex min-h-[44px] items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500/20 via-slate-900/80 to-cyan-500/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                    >
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                        activeTab === tab.id ? 'border-white/15 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'
                      }`}>
                        <AppIcon kind={tab.icon} />
                      </span>
                      <span className="text-left leading-tight">
                        <span>{tab.label}</span>
                        <span className={`mt-0.5 block text-[10px] font-medium ${activeTab === tab.id ? 'text-slate-300' : 'text-slate-500'}`}>
                          {tab.description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="mx-auto max-w-7xl px-3 py-4 pb-28 sm:px-4 sm:py-8 sm:pb-32">
          {activeTab !== 'dashboard' && (
            <section className="mb-5 rounded-[26px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.5)] sm:mb-6 sm:p-5">
              <div className="flex items-start gap-4">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${activeMeta.tone}`}>
                  <AppIcon kind={tabs.find((tab) => tab.id === activeTab)?.icon ?? 'dashboard'} />
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">{activeMeta.title}</h1>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{activeMeta.description}</p>
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
              <SecurityAlerts />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in-50">
              <SecurityAudit />
              <DeadCoinDetector />
              <TokenAllowanceManager />
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="space-y-6 animate-in fade-in-50">
              <WalletRestoration />
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/96 px-2 pt-2 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-[60px] min-w-[0] flex-1 flex-col items-center justify-center rounded-[22px] px-1.5 py-2 text-[10px] font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-[0_10px_28px_-20px_rgba(255,255,255,0.35)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                  activeTab === tab.id ? 'border-white/20 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-slate-300'
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
