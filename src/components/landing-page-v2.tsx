'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MyWalletLogo } from './logo'
import { Web3WalletConnector } from './web3-wallet-connector'

const stats = [
  { number: 'Client-side', label: 'Runs in your browser' },
  { number: '0', label: 'Private keys stored' },
  { number: '8', label: 'Networks supported' },
]

const principles = [
  { name: 'No key custody', detail: 'Designed so users keep control of sensitive credentials.' },
  { name: 'Wallet-focused UX', detail: 'Recovery, approvals, and diagnostics stay front and center.' },
  { name: 'Explainable flows', detail: 'Each step communicates what is happening and why it matters.' },
  { name: 'Documentation path', detail: 'Visitors can inspect the docs before connecting anything.' },
]

export const LandingPageV2 = () => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const currentYear = new Date().getFullYear()

  const handleLaunch = () => {
    if (isConnected) {
      router.replace('/')
      return
    }

    openConnectModal?.()
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/20 via-sky-500/10 to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-400/10 via-sky-500/10 to-transparent blur-3xl animate-[spin_26s_linear_infinite]" />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.06),transparent_24%)]" />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 shadow-xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-[22px] border border-cyan-400/20 bg-slate-950/70 px-3 py-2 shadow-lg shadow-cyan-500/10">
                <MyWalletLogo size="md" variant="full" />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 sm:justify-end">
                <Link href="/about" className="transition hover:text-cyan-300">About</Link>
                <Link href="/help" className="transition hover:text-cyan-300">Guide</Link>
                <Link href="/privacy" className="transition hover:text-cyan-300">Privacy</Link>
              </nav>
              <div className="w-full sm:w-auto">
                <Web3WalletConnector />
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 sm:px-6 sm:py-24">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-[0_40px_120px_-70px_rgba(14,165,233,0.8)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200 shadow-sm shadow-cyan-500/10">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                  Security-first wallet recovery
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                    Clear wallet safety, without custody.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    Inspect approvals, recover access, and protect your self-custody wallet with browser-only security tools.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    'Non-custodial by design',
                    'Private keys stay under your control',
                    'Recovery and wallet hygiene in one place',
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-[28px] border border-white/10 bg-slate-900/90 p-5 text-sm text-slate-300 sm:grid-cols-2">
                  {[
                    'Local browser-only review',
                    'No wallet custody',
                    'Read-only risk checks',
                    'Private data stays on device',
                  ].map((item) => (
                    <div key={item} className="rounded-3xl bg-slate-950/80 px-4 py-3 text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Start wallet review
                  </button>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-8 py-3 text-base font-semibold text-white transition hover:border-cyan-300 hover:bg-white/10"
                  >
                    Read privacy guide
                  </Link>
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
                <div className="absolute left-0 top-12 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
                <div className="relative z-10 space-y-6">
                  <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5 shadow-[0_20px_80px_-60px_rgba(56,189,248,0.45)] transition hover:-translate-y-1">
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Product principle</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Guidance that stays clear under pressure</h3>
                    <p className="mt-2 text-sm text-slate-400">Built to help users understand what is being reviewed, what action is safe to take next, and where risk is still present.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Wallet data', value: 'Read-only review' },
                      { label: 'Recovery flow', value: 'Guided and explicit' },
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
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Built on clear principles</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Trust signals that are easier to verify than marketing claims</h2>
              </div>
              <div className="hidden rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-400 sm:block">Built to communicate risk, not just style</div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {principles.map((principle) => (
                <div key={principle.name} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-5 shadow-sm shadow-slate-950/20 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950">
                    {principle.name}
                  </div>
                  <p className="mt-4 text-sm text-slate-300">{principle.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-6 text-center md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-45px_rgba(56,189,248,0.35)] transition hover:-translate-y-1 hover:border-cyan-400/20">
                  <div className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
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
            <div className="flex items-center gap-3">
              <MyWalletLogo size="sm" variant="full" />
              <div>{`Copyright ${currentYear} | Self-sovereign wallet security`}</div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="transition hover:text-cyan-300">Privacy</Link>
              <Link href="/terms" className="transition hover:text-cyan-300">Terms</Link>
              <Link href="/help" className="transition hover:text-cyan-300">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
