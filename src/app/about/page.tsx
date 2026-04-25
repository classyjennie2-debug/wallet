import React from 'react'
import { MyWalletLogo } from '@/components/logo'

const featureCards = [
  { title: 'Portfolio Overview', desc: 'Real-time tracking of your crypto assets across multiple chains.', tone: 'cyan' },
  { title: 'Price Charts', desc: 'Interactive charts with multiple timeframes and indicators.', tone: 'violet' },
  { title: 'Token Swaps', desc: 'Seamless token exchange with best price routing.', tone: 'emerald' },
  { title: 'Security Audit', desc: 'Contract verification and security analysis tools.', tone: 'cyan' },
  { title: 'Wallet Recovery', desc: 'Structured recovery options with guided validation.', tone: 'emerald' },
  { title: 'NFT Portfolio', desc: 'View and manage NFT collections in the same workspace.', tone: 'violet' },
]

const stack = ['Next.js 16.2.4', 'React 19', 'TypeScript', 'Tailwind CSS', 'wagmi', 'RainbowKit', 'viem', 'ethers.js', 'TanStack Query']

const principles = [
  'Your private keys never leave your device.',
  'HTTPS encryption for all communications.',
  'No server-side storage of sensitive data.',
  'Regular security audits and updates.',
  'Compliance with industry best practices.',
]

const toneClasses = {
  cyan: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  violet: 'border-violet-400/20 bg-violet-500/10 text-violet-300',
  emerald: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
}

export default function About() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border-color)] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_45%)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-muted)]/80 px-3 py-2">
              <MyWalletLogo size="md" variant="full" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">About</p>
            <h1 className="text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">A wallet workspace built for clarity, control, and recovery readiness.</h1>
            <p className="max-w-2xl text-base text-[var(--text-muted)]">
              MyWallet Security brings recovery guidance, approval reviews, and wallet monitoring into one interface designed to make high-stakes decisions feel more manageable.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <article key={feature.title} className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.08)]">
                <div className={`inline-flex h-11 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.24em] ${toneClasses[feature.tone as keyof typeof toneClasses]}`}>
                  {feature.title}
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet-300">Platform Stack</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Built on a modern wallet and frontend toolchain.</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {stack.map((item) => (
                  <span key={item} className="rounded-full border border-[var(--border-color)] bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--text-muted)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">Security First</p>
              <ul className="mt-5 space-y-3 text-sm text-[var(--foreground)]">
                {principles.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-violet-400/20 bg-violet-500/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet-300">GitHub</p>
              <p className="mt-3 font-mono text-lg text-[var(--foreground)]">github.com/mywallet-help</p>
            </div>
            <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-500/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Docs</p>
              <p className="mt-3 font-mono text-lg text-[var(--foreground)]">docs.mywallet.help</p>
            </div>
          </div>
          <div className="mt-10 border-t border-[var(--border-color)] pt-6 text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <MyWalletLogo size="sm" variant="full" />
              <span>Built for people who want more confidence in wallet recovery and day-to-day security.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
