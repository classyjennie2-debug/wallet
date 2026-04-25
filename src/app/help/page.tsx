import React from 'react'
import { MyWalletLogo } from '@/components/logo'

const faqs = [
  ['What is MyWallet Security?', 'MyWallet Security is a wallet workspace for approval reviews, recovery guidance, portfolio visibility, and day-to-day self-custody monitoring across supported EVM networks.'],
  ['Is my private key stored on your servers?', 'No. Private keys stay in your wallet. Connections are handled through wallet protocols that keep key material under your control.'],
  ['Which wallets does MyWallet Security support?', 'The app supports a broad set of wallets through RainbowKit, including MetaMask, Trust Wallet, Rainbow, Coinbase Wallet, Ledger, Trezor, and WalletConnect-compatible options.'],
  ['What networks do you support?', 'Ethereum, Polygon, Arbitrum, and Base are supported now, with room to expand as the app grows.'],
  ['How do I connect my wallet?', 'Use the Connect Wallet control in the header, select a wallet, and approve the session from your wallet app or extension.'],
  ['Is MyWallet Security safe to use?', 'The app uses HTTPS, client-side wallet connections, and security-focused workflows so wallet control stays with you.'],
  ['What is the Portfolio Risk Score?', 'It estimates concentration, volatility, contract exposure, and general balance distribution so you can spot portfolio risk faster.'],
  ['How do I revoke token approvals?', 'Open the allowance manager from the Security tab to inspect token permissions and revoke approvals you no longer want active.'],
  ['Can I recover my wallet with a seed phrase?', 'The recovery flow can validate seed phrase format and guide you through recovery-oriented checks. Never share your seed phrase with anyone.'],
  ['What does Dead Coin Detector do?', 'It helps flag inactive or weak assets in your portfolio so you can evaluate liquidity and overall exposure more clearly.'],
  ['How often are prices updated?', 'Prices are refreshed from connected data sources during wallet usage, and chart views pull from external APIs for historical context.'],
  ['Can I trade directly from MyWallet Security?', 'Yes. The token swap flow is built into the app so you can exchange supported assets from the same workspace.'],
  ['Is there a mobile app?', 'There is no separate mobile app here, but the interface is designed to work well in mobile browsers with wallet apps.'],
  ['How do I view my NFT collection?', 'Connect a wallet and navigate to the NFT portfolio area to inspect holdings, groupings, and collection details.'],
  ['What if I forget my wallet password?', 'The app does not store passwords. Recovery remains under your control and depends on your own backup method.'],
  ['Do you collect my personal data?', 'Data collection is minimal. Review the privacy page for details on what is and is not retained.'],
  ['How do I report a security issue?', 'Use the public issue tracker with clear reproduction steps, affected flows, and any screenshots that help explain the problem.'],
  ['Is MyWallet Security available globally?', 'Yes, though some features may vary depending on the third-party services and jurisdictions involved.'],
] as const

const supportCards = [
  { title: 'Documentation', subtitle: 'Reference guides and walkthroughs', href: 'https://docs.mywallet.help', tone: 'cyan' },
  { title: 'Community', subtitle: 'Discord discussions and questions', href: 'https://discord.gg/mywallet-help', tone: 'violet' },
  { title: 'Issue Tracker', subtitle: 'Report bugs and follow open work', href: 'https://github.com/mywallet-help/issues', tone: 'emerald' },
]

const safetyTips = [
  { title: 'Never Share Your Seed Phrase', text: 'Anyone with your seed phrase can access your funds. Treat it like the highest-value secret in your wallet setup.', tone: 'rose' },
  { title: 'Verify URLs', text: 'Use HTTPS, check the address bar carefully, and rely on saved bookmarks for trusted destinations.', tone: 'amber' },
  { title: 'Use Hardware Wallets', text: 'For larger balances, a hardware wallet gives you a stronger separation between signing and browsing.', tone: 'cyan' },
  { title: 'Enable 2FA', text: 'Turn on two-factor authentication anywhere your wallet workflow depends on exchange or account access.', tone: 'emerald' },
] as const

const toneStyles = {
  cyan: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300',
  violet: 'border-violet-400/20 bg-violet-500/10 text-violet-300',
  emerald: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
  rose: 'border-rose-400/20 bg-rose-500/10 text-rose-300',
  amber: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
}

export default function Help() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border-color)] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_42%)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-muted)]/80 px-3 py-2">
              <MyWalletLogo size="md" variant="full" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet-300">Help</p>
            <h1 className="text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">Answers, safety guidance, and support paths in one place.</h1>
            <p className="max-w-2xl text-base text-[var(--text-muted)]">This page collects the most common product, wallet, and recovery questions so users can move quickly without digging through the app.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] transition hover:border-cyan-400/20 open:border-cyan-400/20 open:bg-cyan-500/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-[var(--foreground)]">
                  <span className="font-semibold">{question}</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-muted)]/80 text-[var(--text-muted)] transition-transform group-open:rotate-180">+</span>
                </summary>
                <div className="border-t border-[var(--border-color)] px-5 py-5 text-sm leading-7 text-[var(--text-muted)]">
                  {answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {supportCards.map((card) => (
              <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer" className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-cyan-400/20">
                <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${toneStyles[card.tone as keyof typeof toneStyles]}`}>
                  {card.title}
                </div>
                <p className="mt-4 text-sm text-[var(--text-muted)]">{card.subtitle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {safetyTips.map((tip) => (
              <article key={tip.title} className={`rounded-[24px] border p-6 ${toneStyles[tip.tone as keyof typeof toneStyles]}`}>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{tip.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{tip.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/about', label: 'About Us' },
            ].map((link) => (
              <a key={link.href} href={link.href} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
