import React from 'react'

export default function Help() {
  const faqs = [
    {
      question: 'What is MyWallet.Help?',
      answer: 'MyWallet.Help is a comprehensive cryptocurrency wallet dashboard that helps you manage, track, and analyze your crypto assets across multiple blockchain networks. It provides portfolio tracking, price charts, security audits, NFT management, and more.'
    },
    {
      question: 'Is my private key stored on your servers?',
      answer: 'No. MyWallet.Help never stores or accesses your private keys. We use wallet connection protocols (RainbowKit) that keep your keys securely in your wallet. You maintain complete control of your assets.'
    },
    {
      question: 'Which wallets does MyWallet.Help support?',
      answer: 'We support 20+ wallet providers including MetaMask, Trust Wallet, Rainbow, Coinbase Wallet, Ledger, Trezor, WalletConnect, and many more through RainbowKit integration.'
    },
    {
      question: 'What networks do you support?',
      answer: 'We support Ethereum, Polygon, Arbitrum, and Base networks, with additional networks coming soon. All are EVM-compatible blockchain networks.'
    },
    {
      question: 'How do I connect my wallet?',
      answer: 'Click the "Connect Wallet" button in the header. Select your wallet from the list, approve the connection in your wallet app, and you\'ll be connected to MyWallet.Help.'
    },
    {
      question: 'Is MyWallet.Help safe to use?',
      answer: 'Yes. We implement industry-standard security practices including HTTPS encryption, no server-side storage of sensitive data, and regular security audits. Your assets remain under your control at all times.'
    },
    {
      question: 'What is the Portfolio Risk Score?',
      answer: 'The Portfolio Risk Score analyzes your holdings for concentration risk, volatility, contract risk, and market conditions. It provides a 0-100 score with recommendations to improve diversification.'
    },
    {
      question: 'How do I revoke token approvals?',
      answer: 'Use the Token Allowance Manager in the dashboard. It shows all contracts with permission to spend your tokens. Click "Revoke" to remove approval, reducing security risk.'
    },
    {
      question: 'Can I recover my wallet with a seed phrase?',
      answer: 'Yes, use the Wallet Recovery feature. Enter your 12 or 24-word seed phrase, and we\'ll validate it securely. Never share your seed phrase with anyone.'
    },
    {
      question: 'What does Dead Coin Detector do?',
      answer: 'The Dead Coin Detector identifies tokens in your portfolio that may be inactive, have low liquidity, or been abandoned. It helps you identify potential losses and diversify away from risky holdings.'
    },
    {
      question: 'How often are prices updated?',
      answer: 'Price data is updated in real-time when connected to the blockchain. Historical data is fetched from reliable API sources. Charts show data from the last 7 days to 1 year.'
    },
    {
      question: 'Can I trade directly from MyWallet.Help?',
      answer: 'Yes, use the Token Swap feature to exchange tokens directly from the dashboard. Swaps are routed through the best liquidity sources to get optimal prices.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'MyWallet.Help is fully responsive and works great on mobile browsers. We recommend using it with a mobile wallet app like MetaMask Mobile or Trust Wallet.'
    },
    {
      question: 'How do I view my NFT collection?',
      answer: 'Connect your wallet and navigate to the NFT Portfolio. Your NFTs will display with rarity information, floor prices, and collection grouping.'
    },
    {
      question: 'What if I forget my wallet password?',
      answer: 'MyWallet.Help doesn\'t store passwords. Use the Wallet Recovery feature with your seed phrase. Never give your seed phrase to anyone - recovery is always under your control.'
    },
    {
      question: 'Do you collect my personal data?',
      answer: 'We collect minimal data. See our Privacy Policy for details. We never store your wallet address permanently without consent, and we never sell or share your data.'
    },
    {
      question: 'How do I report a security issue?',
      answer: 'Please email support@mywallet.help with details. We take security seriously and respond promptly to all reports.'
    },
    {
      question: 'Is MyWallet.Help available globally?',
      answer: 'Yes, MyWallet.Help is available globally. However, some features may be restricted in certain jurisdictions due to local regulations.'
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Help & FAQ</h1>
            <p className="text-gray-400">Find answers to common questions</p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/3 hover:border-white/20 transition-all group open:border-cyan-500/30 open:from-cyan-500/10 open:to-cyan-500/5"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 sm:p-6 font-semibold text-white hover:text-cyan-300 transition-colors select-none">
                  <span className="text-left">{faq.question}</span>
                  <span className="text-lg ml-2 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-white/10 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Support Sections */}
          <div className="space-y-6 pt-8">
            <h2 className="text-2xl font-bold text-white">Need More Help?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Documentation */}
              <a href="https://docs.mywallet.help" target="_blank" rel="noopener noreferrer"
                className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 hover:border-blue-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">📚</div>
                <h3 className="font-bold text-white mb-2">Documentation</h3>
                <p className="text-sm text-gray-400">Read detailed guides and tutorials</p>
              </a>

              {/* Community Discord */}
              <a href="https://discord.gg/mywallet-help" target="_blank" rel="noopener noreferrer"
                className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 hover:border-purple-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-bold text-white mb-2">Community</h3>
                <p className="text-sm text-gray-400">Join our Discord community</p>
              </a>

              {/* GitHub Issues */}
              <a href="https://github.com/mywallet-help/issues" target="_blank" rel="noopener noreferrer"
                className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/30 hover:border-gray-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">🐛</div>
                <h3 className="font-bold text-white mb-2">Report Issues</h3>
                <p className="text-sm text-gray-400">Report bugs on GitHub</p>
              </a>

              {/* Email Support */}
              <a href="mailto:support@mywallet.help"
                className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">📧</div>
                <h3 className="font-bold text-white mb-2">Email Support</h3>
                <p className="text-sm text-gray-400">support@mywallet.help</p>
              </a>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="space-y-4 pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white">🔐 Safety Tips</h2>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-300 font-semibold text-sm mb-1">🔴 Never Share Your Seed Phrase</p>
                <p className="text-gray-300 text-sm">Anyone with your seed phrase can access your funds. MyWallet.Help will never ask for it.</p>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Verify URLs</p>
                <p className="text-gray-300 text-sm">Always use HTTPS and verify the URL is correct. Bookmark the official site.</p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-blue-300 font-semibold text-sm mb-1">ℹ️ Use Hardware Wallets</p>
                <p className="text-gray-300 text-sm">Consider using a hardware wallet like Ledger or Trezor for maximum security.</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-300 font-semibold text-sm mb-1">✅ Enable 2FA</p>
                <p className="text-gray-300 text-sm">Always enable two-factor authentication on wallets and exchange accounts.</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 pt-8">
            <h2 className="text-lg font-bold text-white">Quick Links</h2>
            
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/about', label: 'About Us' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
