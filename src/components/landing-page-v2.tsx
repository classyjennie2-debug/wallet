'use client'

import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Web3WalletConnector } from './web3-wallet-connector'

const features = [
  { label: 'Restore', title: 'Wallet Restoration Hub', desc: 'Recover access safely and validate seed phrase data without exposing private keys.' },
  { label: 'Scan', title: 'Risk & Contract Scanner', desc: 'Analyze tokens, contracts, and approvals for dead coin risk and hidden vulnerabilities.' },
  { label: 'Guard', title: 'Allowance Defense', desc: 'Review approvals and revoke unsafe token allowances to protect your funds.' },
  { label: 'Fix', title: 'Connection Diagnostics', desc: 'Detect and resolve wallet network and connection issues quickly.' },
]

const stats = [
  { number: '100K+', label: 'Active Users' },
  { number: '$2B+', label: 'Assets Tracked' },
  { number: '8', label: 'Networks Supported' },
]

export const LandingPageV2 = () => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  const handleLaunch = () => {
    if (isConnected) {
      router.push('/')
      return
    }

    if (openConnectModal) {
      openConnectModal()
    }
  }

  const handleReadDocs = () => {
    router.push('/docs')
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/20 via-indigo-500/10 to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/15 via-sky-500/10 to-transparent blur-3xl animate-[spin_26s_linear_infinite]" />
        <div className="absolute inset-x-0 top-1/3 h-1/2 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.08),_transparent_60%)]" />
      </div>

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),transparent_20%)] pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-slate-950/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500 to-slate-900 text-sm font-bold text-white shadow-lg shadow-cyan-500/10">
                MW
                <div className="absolute inset-0 -z-10 rounded-2xl bg-cyan-400/10 blur-xl" />
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-white">MyWallet.Help</div>
                <div className="text-xs font-medium text-slate-400">Recovery, audit, and wallet control</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 sm:justify-end">
                <a href="/about" className="transition hover:text-cyan-300">About</a>
                <a href="/help" className="transition hover:text-cyan-300">Guide</a>
                <a href="/privacy" className="transition hover:text-cyan-300">Privacy</a>
              </nav>
              <div className="w-full sm:w-auto">
                <Web3WalletConnector />
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-[0_40px_120px_-70px_rgba(14,165,233,0.8)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200 shadow-sm shadow-cyan-500/10">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                  Security-first wallet recovery
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                    A premium wallet recovery experience for secure, self-sovereign finance.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    Instant wallet diagnostics, token risk scoring, and approval hygiene in a polished dashboard that feels alive and trusted. Mobile-first, interactive, and built for active crypto users.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Launch Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleReadDocs}
                    className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-8 py-3 text-base font-semibold text-white transition hover:border-cyan-300 hover:bg-white/10"
                  >
                    Read Docs
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Recovery readiness', value: 'Automated wallet health signals' },
                    { label: 'Approval defense', value: 'Revoke risky permissions quickly' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30 hover:bg-white/10">
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/80 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                <div className="absolute -right-16 top-6 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute left-0 top-12 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5 shadow-[0_20px_80px_-60px_rgba(56,189,248,0.45)] transition hover:-translate-y-1">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Active signal</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">+58% recovery confidence</h3>
                    <p className="mt-2 text-sm text-slate-400">Your wallet is analyzed automatically, with risk insights delivered live.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Tokens scanned', value: '74' },
                      { label: 'Approvals reviewed', value: '18' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-cyan-400/30 hover:bg-white/10">
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/30 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Trusted by</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Forward-thinking teams and security-first wallets</h2>
              </div>
              <div className="hidden rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-400 sm:block">Secure partnerships with a premium feel</div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                { name: 'SafeGrid', accent: 'from-cyan-500 to-sky-500' },
                { name: 'ChainLens', accent: 'from-fuchsia-500 to-purple-500' },
                { name: 'VaultCore', accent: 'from-emerald-500 to-teal-500' },
                { name: 'NexusAudit', accent: 'from-sky-500 to-indigo-500' },
              ].map((brand) => (
                <div key={brand.name} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 shadow-sm shadow-slate-950/20 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-r ${brand.accent} px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950`}>{brand.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 px-4 sm:px-0">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Focused on Recovery & Safety</h2>
              <p className="mx-auto max-w-2xl text-slate-400">Tools built specifically to diagnose, recover, and secure wallets with nothing extra to distract you.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/10">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-200">{feature.label}</div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-6 text-center md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-45px_rgba(56,189,248,0.35)] transition hover:-translate-y-1 hover:border-cyan-400/20">
                  <div className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    {stat.number}
                  </div>
                  <p className="mt-2 text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm text-slate-400 md:flex-row sm:px-6">
            <div>MyWallet.Help © 2024 | Self-Sovereign Finance</div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/privacy" className="transition hover:text-cyan-300">Privacy</a>
              <a href="/terms" className="transition hover:text-cyan-300">Terms</a>
              <a href="/help" className="transition hover:text-cyan-300">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
