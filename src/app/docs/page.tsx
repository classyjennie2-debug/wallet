import React from 'react'
import { MyWalletLogo } from '@/components/logo'

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-black/20">
            <div className="space-y-4">
              <div className="inline-flex rounded-[22px] border border-white/10 bg-slate-950/60 px-3 py-2">
                <MyWalletLogo size="md" variant="full" />
              </div>
              <p className="text-sm uppercase tracking-[0.32em] text-purple-300">Documentation</p>
              <h1 className="text-4xl font-black text-white sm:text-5xl">MyWallet Security - Product Overview</h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                An overview of the platform, its core workflows, and the decisions behind a security-first wallet experience centered on recovery, approvals, and self-custody clarity.
              </p>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <article className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8">
              <h2 className="text-3xl font-bold text-white">About the Website</h2>
              <p className="text-slate-300 leading-7">
                MyWallet Security is a non-custodial Web3 workspace designed to make recovery, risk review, and wallet hygiene easier to navigate for active crypto users. It combines portfolio visibility with tools that help users inspect approvals, investigate risky token behavior, and work through access issues without giving up custody.
              </p>
              <p className="text-slate-300 leading-7">
                The site emphasizes safety-first wallet workflows, multi-chain asset tracking, and transparent guidance for users who want to regain confidence in their crypto holdings without introducing central custody or unnecessary complexity.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'Target audience',
                    value: 'Crypto users who need wallet recovery, portfolio audit, and security assurance.',
                  },
                  {
                    title: 'Primary value',
                    value: 'A unified dashboard for wallet recovery diagnostics, approval management, and dead coin detection.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold text-purple-300">{item.title}</h3>
                    <p className="mt-2 text-slate-300">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8">
              <h2 className="text-3xl font-bold text-white">Website Purpose</h2>
              <ul className="space-y-4 text-slate-300">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <strong className="text-white">Recovery assurance:</strong> Provide clear diagnostics and recovery workflows for users who have wallet access issues or suspect compromised approvals.
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <strong className="text-white">Security clarity:</strong> Help users spot dead coins, unsafe approvals, and suspicious contracts before they take action.
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <strong className="text-white">Portfolio control:</strong> Offer a simple dashboard that surfaces balances, token health, and on-chain approvals in one place.
                </li>
              </ul>
            </article>
          </section>

          <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/90 p-10 shadow-xl shadow-black/20">
            <h2 className="text-3xl font-bold text-white">Audit Summary</h2>
            <div className="space-y-4 text-slate-300 leading-7">
              <p>
                The platform is intentionally centered on calm, high-trust guidance. The design language supports that by pairing strong visual hierarchy with copy that explains risk clearly and keeps the most important actions within reach.
              </p>
              <p>
                The homepage leads with the practical user value: understand wallet state, reduce approval risk, and move through recovery steps without adding central custody or unnecessary complexity.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: 'Strengths',
                  items: ['Clean modern UI', 'Multi-chain support', 'Security-focused tooling'],
                },
                {
                  title: 'Opportunities',
                  items: ['Stronger recovery messaging', 'More distinctive product identity', 'Clearer user journeys'],
                },
                {
                  title: 'Recommendations',
                  items: ['Keep recovery central in copy', 'Add deeper user guides', 'Speak to real wallet problems'],
                },
              ].map((group) => (
                <div key={group.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                  <ul className="mt-3 space-y-2 text-slate-300 list-disc list-inside">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-10">
            <h2 className="text-3xl font-bold text-white">Feature Review</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Wallet Restoration',
                  desc: 'Seed phrase validation, derivation path checks, and recovery workflows for compromised wallets.',
                },
                {
                  title: 'Dead Coin Detector',
                  desc: 'Token health scoring for liquidity, ownership renouncement, and trading activity.',
                },
                {
                  title: 'Allowance Management',
                  desc: 'Review and revoke token approvals to reduce exposure to malicious contracts.',
                },
                {
                  title: 'Chain Diagnostics',
                  desc: 'Detect and resolve network configuration issues that block wallet connections.',
                },
              ].map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: 'Usability',
                text: 'Ensure onboarding clearly states that this is a wallet recovery and security dashboard, not a custodial exchange.',
              },
              {
                title: 'Trust Signals',
                text: 'Add clear disclaimers about no private key storage and smart contract risk assessment to build user trust.',
              },
              {
                title: 'Next steps',
                text: 'Expand docs and add a guided walkthrough for first-time users to reduce friction.',
              },
            ].map((card) => (
              <div key={card.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-slate-300 leading-7">{card.text}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
