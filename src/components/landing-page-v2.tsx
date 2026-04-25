'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { MyWalletLogo } from './logo'
import { Web3WalletConnector } from './web3-wallet-connector'
import { ThemeToggle } from './theme-toggle'

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
  const [showWalletConnectNote, setShowWalletConnectNote] = useState(false)

  useEffect(() => {
    const isMobileBrowser = () => {
      try {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
      } catch {
        return false
      }
    }

    const mobileBrowser = isMobileBrowser()
    const hasInjectedWallet = mobileBrowser && Boolean((window as any).ethereum)
    setShowWalletConnectNote(mobileBrowser && !hasInjectedWallet)
  }, [])

  const handleLaunch = () => {
    if (isConnected) {
      router.replace('/')
      return
    }

    openConnectModal?.()
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/40 via-sky-200/30 to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-200/30 via-cyan-200/20 to-transparent blur-3xl animate-[spin_26s_linear_infinite]" />
        <div className="absolute inset-x-0 top-1/4 h-52 bg-gradient-to-b from-white/90 to-transparent blur-3xl" />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.06),transparent_24%)]" />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-[22px] border border-cyan-200/70 bg-white px-3 py-2 shadow-sm shadow-slate-200/60">
                  <MyWalletLogo size="md" variant="full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="min-w-0 w-full sm:w-auto">
                  <Web3WalletConnector />
                </div>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 sm:justify-end sm:text-sm">
              <Link href="/about" className="transition hover:text-cyan-600">About</Link>
              <Link href="/help" className="transition hover:text-cyan-600">Guide</Link>
              <Link href="/privacy" className="transition hover:text-cyan-600">Privacy</Link>
            </nav>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-16 sm:px-6 sm:py-24">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_120px_-70px_rgba(15,23,42,0.08)] p-8 sm:p-12">
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-8 min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700 shadow-sm shadow-cyan-200/60">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                  Security-first wallet recovery
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                    Clear wallet safety, without custody.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    Inspect approvals, recover access, and protect your self-custody wallet with browser-first security tools built for modern wallets.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    'Non-custodial by design',
                    'Private keys stay under your control',
                    'Recovery and wallet hygiene in one place',
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 sm:grid-cols-2">
                  {[
                    'Local browser-only review',
                    'No wallet custody',
                    'Read-only risk checks',
                    'Private data stays on device',
                  ].map((item) => (
                    <div key={item} className="rounded-3xl bg-white px-4 py-3 text-slate-700 min-w-0 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleLaunch}
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                  >
                    Start wallet review
                  </button>
                  <Link
                    href="/privacy"
                    className="inline-flex w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-8 py-3 text-base font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-cyan-50 sm:w-auto"
                  >
                    Read privacy guide
                  </Link>
                </div>
                {showWalletConnectNote ? (
                  <p className="mt-3 text-sm text-slate-400">
                    In browser mode, choose WalletConnect from the connector modal so the app can connect without an injected wallet.
                  </p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Recovery readiness', value: 'Automated wallet health signals' },
                    { label: 'Approval defense', value: 'Revoke risky permissions quickly' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-300 hover:bg-cyan-50">
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.08)]">
                <div className="absolute -right-10 top-6 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute left-0 top-14 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl" />
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3 text-xs uppercase tracking-[0.25em] text-slate-500 ring-1 ring-slate-200">
                    <span>Wallet security dashboard</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="mb-5 flex flex-col gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Connected wallet</p>
                        <p className="mt-2 truncate text-lg font-semibold text-slate-950">0xA3...F1D2</p>
                      </div>
                      <div className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-sm">High trust</div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-emerald-100 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">Risk</p>
                        <p className="mt-3 text-xl font-semibold text-emerald-900">Low</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Approvals</p>
                        <p className="mt-3 text-xl font-semibold text-slate-950">4 active</p>
                      </div>
                      <div className="rounded-3xl bg-sky-100 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-sky-700">Recovery</p>
                        <p className="mt-3 text-xl font-semibold text-sky-900">Ready</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>Approval review</span>
                        <span className="text-slate-400">3 flagged</span>
                      </div>
                      <div className="mt-4 grid gap-3">
                        {[
                          { title: 'Unusual permit', subtitle: '0x8F…B2 approved', tone: 'bg-orange-100 text-orange-700', label: 'Review' },
                          { title: 'Cross-chain spend', subtitle: 'Stable token access', tone: 'bg-emerald-100 text-emerald-700', label: 'Safe' },
                          { title: 'Recovery path', subtitle: '2-step readiness', tone: 'bg-sky-100 text-sky-700', label: 'Verified' },
                        ].map((item) => (
                          <div key={item.title} className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.subtitle}</p>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${item.tone}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/40 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Built on clear principles</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Trust signals that are easier to verify than marketing claims</h2>
              </div>
              <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 sm:block">Built to communicate risk, not just style</div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {principles.map((principle) => (
                <div key={principle.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950">
                    {principle.name}
                  </div>
                  <p className="mt-4 text-sm text-slate-600">{principle.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-6 text-center md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-45px_rgba(56,189,248,0.15)] transition hover:-translate-y-1 hover:border-cyan-300">
                  <div className="bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    {stat.number}
                  </div>
                  <p className="mt-2 text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm text-slate-500 md:flex-row sm:px-6">
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
