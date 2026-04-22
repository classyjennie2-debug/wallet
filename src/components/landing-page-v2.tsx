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
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent blur-3xl"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-purple-900/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-purple-400/30 bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold text-white shadow-lg">
                MW
                <div className="absolute inset-0 -z-10 rounded-lg bg-purple-500/20 blur-lg" />
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-white">MyWallet.Help</div>
                <div className="text-xs font-medium text-purple-300">Self-Sovereign Finance</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden gap-6 text-sm md:flex">
                <a href="/about" className="text-slate-300 transition hover:text-purple-300">About</a>
                <a href="/help" className="text-slate-300 transition hover:text-purple-300">Guide</a>
                <a href="/privacy" className="text-slate-300 transition hover:text-purple-300">Privacy</a>
              </nav>
              <Web3WalletConnector />
            </div>
          </div>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col items-center space-y-12 px-4 py-20 text-center sm:px-6 sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-600/50 bg-purple-600/10 px-4 py-2 text-sm font-semibold text-purple-200 shadow-lg backdrop-blur-md transition hover:shadow-purple-600/20">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            Next-Gen Wallet Dashboard
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
              Recover Wallets,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                Secure Your Crypto
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Find wallet health issues, remove risky approvals, and recover lost access with a security-first dashboard built for real crypto users.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={handleLaunch}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-600/50"
            >
              Launch Dashboard
            </button>
            <button
              type="button"
              onClick={handleReadDocs}
              className="rounded-lg border border-purple-600/50 bg-purple-600/10 px-8 py-3 font-semibold text-purple-200 transition hover:bg-purple-600/20"
            >
              Read Docs
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Focused on Recovery & Safety</h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Tools built specifically to diagnose, recover, and secure wallets with nothing extra to distract you.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-purple-600/20 bg-white/5 p-6">
                <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-200">{feature.label}</div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6">
          <h3 className="mb-2 text-lg font-semibold text-white">Multi-Chain Support</h3>
          <p className="text-sm text-slate-400">Ethereum, Polygon, Arbitrum, Base, and supported testnets.</p>
        </section>

        <section className="mx-auto max-w-6xl space-y-6 px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-purple-600/20 bg-slate-950/70 p-8 text-center">
            <h2 className="text-3xl font-bold text-white">A Recovery-First Wallet Experience</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-300">
              MyWallet.Help is built for people who want more than a portfolio overview. It is a security-first recovery and audit dashboard that helps you find risk, fix wallet issues, and keep your assets under your control.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Risk detection',
                description: 'Spot dead coins, unverified contracts, and suspicious approvals before they hurt your wallet.',
              },
              {
                title: 'Recovery tools',
                description: 'Validate seed data, troubleshoot wallet connections, and restore safe access on-chain.',
              },
              {
                title: 'Approval hygiene',
                description: 'Review and revoke token allowances to minimize exposure to malicious contracts.',
              },
              {
                title: 'Non-custodial',
                description: 'Everything runs in your browser and your keys never leave your device.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-purple-600/20 bg-white/5 p-6 text-left">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6">
          <div className="grid gap-6 text-center md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                  {stat.number}
                </div>
                <p className="mt-2 text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-purple-600/30 bg-gradient-to-br from-purple-600/20 to-blue-600/10 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Take Control?</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-300">
                Start managing your crypto with complete transparency and security.
              </p>
              <div className="mt-8 flex justify-center">
                <Web3WalletConnector />
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-purple-900/50 bg-slate-950/50 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 py-12 text-sm text-slate-400 md:flex-row sm:px-6">
            <div>MyWallet.Help (c) 2024 | Self-Sovereign Finance</div>
            <div className="flex gap-6">
              <a href="/privacy" className="transition hover:text-purple-300">Privacy</a>
              <a href="/terms" className="transition hover:text-purple-300">Terms</a>
              <a href="/help" className="transition hover:text-purple-300">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
