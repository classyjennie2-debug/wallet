import React from 'react'
import { MyWalletLogo } from '@/components/logo'

const sections = [
  {
    title: 'Agreement to Terms',
    body: 'By accessing and using MyWallet Security, you accept and agree to be bound by these terms. If you do not agree, please do not use the service.',
  },
  {
    title: 'Use License',
    body: 'Permission is granted to temporarily view one copy of the materials on MyWallet Security for personal, non-commercial use only.',
    items: [
      'Do not modify or copy the materials for redistribution.',
      'Do not use the materials for commercial or public display.',
      'Do not attempt to decompile or reverse engineer site software.',
      'Do not mirror the materials on another server.',
      'Do not remove copyright or proprietary notices.',
    ],
  },
  {
    title: 'Disclaimer',
    body: 'The materials on MyWallet Security are provided on an as-is basis without warranties of any kind, express or implied.',
  },
  {
    title: 'Limitations of Liability',
    body: 'MyWallet Security and its suppliers are not liable for losses arising from the use or inability to use the service, including trading losses, incorrect price data, outages, or corrupted wallet information.',
  },
  {
    title: 'Materials and Content',
    body: 'You are responsible for protecting your wallet private keys, seed phrases, and authentication credentials. MyWallet Security is not liable for unauthorized access to your wallet or accounts.',
  },
  {
    title: 'Not Financial Advice',
    body: 'MyWallet Security provides tools and information for cryptocurrency management. It does not provide financial, investment, or legal advice.',
  },
  {
    title: 'Questions',
    body: 'For questions about these Terms of Service, review the project documentation and public support resources.',
  },
]

export default function Terms() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border-color)] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_44%)]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-muted)]/80 px-3 py-2">
              <MyWalletLogo size="md" variant="full" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-300">Terms</p>
            <h1 className="text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">Straightforward terms for using the workspace.</h1>
            <p className="text-base text-[var(--text-muted)]">Last updated: January 2024</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="space-y-5">
            {sections.map((section, index) => (
              <article key={section.title} className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-muted)]/80 text-sm font-semibold text-[var(--text-muted)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-[var(--foreground)]">{section.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{section.body}</p>
                    {section.items && (
                      <ul className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2 inline-block h-2 w-2 rounded-full bg-emerald-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
