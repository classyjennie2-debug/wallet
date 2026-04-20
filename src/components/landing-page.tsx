'use client'

import { useState, useEffect } from 'react'

export const LandingPage = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const wallets = [
    { name: 'MetaMask', symbol: '🦊', gradient: 'from-orange-500 to-yellow-500' },
    { name: 'Trust Wallet', symbol: '🛡️', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Ledger', symbol: '🔐', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Coinbase', symbol: '₿', gradient: 'from-blue-600 to-blue-400' },
    { name: 'WalletConnect', symbol: '🔗', gradient: 'from-cyan-400 to-blue-500' },
    { name: 'Rainbow', symbol: '🌈', gradient: 'from-pink-500 to-purple-500' },
    { name: 'Phantom', symbol: '👻', gradient: 'from-purple-600 to-purple-400' },
    { name: 'OKX', symbol: '💛', gradient: 'from-yellow-500 to-yellow-400' },
    { name: 'Argent', symbol: '🟠', gradient: 'from-orange-500 to-orange-400' },
    { name: 'Trezor', symbol: '🖥️', gradient: 'from-green-600 to-green-400' },
  ]

  const networks = [
    { name: 'Ethereum', symbol: '◆', gradient: 'from-purple-600 to-blue-500' },
    { name: 'Polygon', symbol: '◇', gradient: 'from-purple-600 to-pink-500' },
    { name: 'Arbitrum', symbol: '■', gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Base', symbol: '●', gradient: 'from-blue-600 to-indigo-600' },
    { name: 'Sepolia', symbol: '▲', gradient: 'from-purple-400 to-blue-400' },
    { name: 'Mumbai', symbol: '▼', gradient: 'from-pink-400 to-purple-500' },
    { name: 'Arb Sep', symbol: '◈', gradient: 'from-cyan-400 to-blue-500' },
    { name: 'Base Sep', symbol: '○', gradient: 'from-blue-500 to-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background - More sophisticated */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Top right gradient */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        {/* Bottom left gradient */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        {/* Center accent */}
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/95 backdrop-blur-2xl shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl font-bold text-white">⚡</span>
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg">MyWallet.Help</div>
                <div className="text-xs text-cyan-400 font-medium hidden sm:block">Self-Sovereign Wallet</div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center">
          <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm shadow-lg">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-cyan-300">🚀 Web3 Wallet Management Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight">
                Manage Crypto
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Your Way
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Non-custodial portfolio management, token swaps, dead coin detection, and secure transfers—all in one powerful platform. No compromises on privacy or security.
            </p>

            {/* CTA Buttons */}
            <div className="pt-6 sm:pt-8 flex gap-3 sm:gap-4 flex-col sm:flex-row justify-center">
              {isClient && (
                <>
                  {/* @ts-expect-error w3m-connect-button is a web component */}
                  <w3m-connect-button />
                  <button type="button" className="px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-cyan-500/50 hover:border-cyan-400 text-white font-bold text-sm sm:text-base transition-all duration-300 bg-cyan-500/5 hover:bg-cyan-500/10 backdrop-blur-sm hover:shadow-lg cursor-pointer w-full sm:w-auto">
                    📖 View Docs
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto pt-12 sm:pt-20 border-t border-white/10">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">100K+</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Active Users</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$2B+</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Assets Managed</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">8</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Blockchains</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-white/10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">Powerful Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">Everything you need to manage crypto securely</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '💼', title: 'Portfolio', desc: 'Track holdings across multiple chains in real-time' },
              { icon: '⚡', title: 'Smart Swap', desc: 'Exchange tokens with best prices and lowest slippage' },
              { icon: '📤', title: 'Quick Send', desc: 'Transfer tokens securely with built-in validation' },
              { icon: '🔍', title: 'Dead Detector', desc: 'Identify and remove dead coins automatically' },
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg sm:rounded-2xl p-5 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10 space-y-3 sm:space-y-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-125 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Wallets */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-white/10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">Connect Any Wallet</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">10+ popular wallet providers supported</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {wallets.map((wallet, i) => (
              <div key={i} className={`group flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-white/10 bg-gradient-to-br ${wallet.gradient} opacity-15 hover:opacity-100 transition-all duration-300 hover:shadow-2xl hover:border-white/50 cursor-pointer`}>
                <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-150 transition-transform duration-300">{wallet.symbol}</span>
                <span className="text-xs sm:text-sm font-bold text-white text-center">{wallet.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Networks */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-white/10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">Multi-Chain Support</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">8 blockchains, unlimited possibilities</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {networks.map((network, i) => (
              <div key={i} className={`group flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-white/10 bg-gradient-to-br ${network.gradient} opacity-20 hover:opacity-100 transition-all duration-300 hover:shadow-2xl hover:border-white/50 cursor-pointer`}>
                <span className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 font-black group-hover:scale-150 transition-transform duration-300">{network.symbol}</span>
                <span className="text-xs font-bold text-white text-center">{network.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Animated Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-6 sm:p-8 md:p-10 rounded-lg sm:rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent hover:from-cyan-500/20 transition-all hover:shadow-2xl hover:border-cyan-500/50 group cursor-pointer">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform">100K+</div>
              <p className="text-gray-300 font-bold text-base sm:text-lg">Active Users</p>
              <p className="text-gray-500 text-xs mt-1 sm:mt-2">Trusted worldwide</p>
            </div>
            <div className="text-center p-6 sm:p-8 md:p-10 rounded-lg sm:rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent hover:from-purple-500/20 transition-all hover:shadow-2xl hover:border-purple-500/50 group cursor-pointer">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform">$2B+</div>
              <p className="text-gray-300 font-bold text-base sm:text-lg">Managed Assets</p>
              <p className="text-gray-500 text-xs mt-1 sm:mt-2">Secured daily</p>
            </div>
            <div className="text-center p-6 sm:p-8 md:p-10 rounded-lg sm:rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent hover:from-emerald-500/20 transition-all hover:shadow-2xl hover:border-emerald-500/50 group cursor-pointer">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform">50M+</div>
              <p className="text-gray-300 font-bold text-base sm:text-lg">Transactions</p>
              <p className="text-gray-500 text-xs mt-1 sm:mt-2">Processed securely</p>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-12 sm:mb-16">Trust & Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-6 sm:p-8 rounded-lg sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg group">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform">🔒</div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Open Source</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Fully auditable and transparent code on GitHub</p>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-lg sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg group">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform">✅</div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Security Audited</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Third-party audits from leading security firms</p>
            </div>
            <div className="text-center p-6 sm:p-8 rounded-lg sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg group">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform">🛡️</div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Non-Custodial</h3>
              <p className="text-gray-400 text-xs sm:text-sm">You maintain full control of your private keys</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-12 sm:mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: '🔐 Is MyWallet.Help safe?', a: 'Yes! We\'re fully non-custodial. Your private keys never leave your device. All code is open-source and audited by security experts.' },
              { q: '⛓️ What networks do you support?', a: 'We support 8 major blockchains: Ethereum, Polygon, Arbitrum, Base, and their testnets (Sepolia, Mumbai, Arb Sepolia, Base Sepolia).' },
              { q: '💰 Are there any fees?', a: 'No platform fees! You only pay network gas fees set by the blockchain. We never charge for wallet management.' },
              { q: '🔗 Can I connect any wallet?', a: 'Yes! We support 10+ popular wallets including MetaMask, Trust Wallet, Ledger, and all WalletConnect compatible wallets.' },
              { q: '💡 How do I recover lost funds?', a: 'Use our Dead Coin Detector to identify problematic tokens and our support team can guide you through recovery steps.' },
            ].map((item, i) => (
              <details key={i} className="group border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all cursor-pointer hover:border-cyan-500/50">
                <summary className="font-bold text-white flex items-center justify-between text-lg">
                  {item.q}
                  <span className="text-xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-300 mt-4 ml-2 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Support & Community */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
          <h2 className="text-5xl font-black text-white text-center mb-16">Connect & Support</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a href="#" className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-sm hover:shadow-lg group">
              <div className="text-6xl mb-3 group-hover:scale-125 transition-transform">💬</div>
              <p className="text-white font-bold">Discord</p>
              <p className="text-xs text-gray-400 mt-1">Community & Support</p>
            </a>
            <a href="#" className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-sm hover:shadow-lg group">
              <div className="text-6xl mb-3 group-hover:scale-125 transition-transform">𝕏</div>
              <p className="text-white font-bold">Twitter</p>
              <p className="text-xs text-gray-400 mt-1">Latest Updates</p>
            </a>
            <a href="#" className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-sm hover:shadow-lg group">
              <div className="text-6xl mb-3 group-hover:scale-125 transition-transform">📚</div>
              <p className="text-white font-bold">Docs</p>
              <p className="text-xs text-gray-400 mt-1">Documentation</p>
            </a>
            <a href="#" className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-sm hover:shadow-lg group">
              <div className="text-6xl mb-3 group-hover:scale-125 transition-transform">📧</div>
              <p className="text-white font-bold">Email</p>
              <p className="text-xs text-gray-400 mt-1">Contact Support</p>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-blue-600/20 border border-cyan-500/50 backdrop-blur-sm hover:border-cyan-400/80 transition-all hover:shadow-2xl hover:from-cyan-600/30 hover:via-purple-600/30 hover:to-blue-600/30 group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/10 to-blue-500/0 group-hover:via-purple-500/20 transition-all"></div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white">Ready to Take Control?</h2>
              <p className="text-gray-300 text-lg">Connect your wallet and start managing your crypto portfolio securely today.</p>
              <div className="pt-4">
                {isClient && (
                  <>
                    {/* @ts-expect-error w3m-connect-button is a web component */}
                    <w3m-connect-button />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-gradient-to-b from-slate-950/50 to-slate-950/80 backdrop-blur-sm py-12 sm:py-16 px-4 sm:px-6 mt-16 sm:mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div>
                <h3 className="text-white font-black mb-3 sm:mb-4 text-sm sm:text-lg">Product</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Features</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Security</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Roadmap</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-black mb-3 sm:mb-4 text-sm sm:text-lg">Company</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">About</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Blog</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-black mb-3 sm:mb-4 text-sm sm:text-lg">Legal</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Privacy</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Terms</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Security</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-black mb-3 sm:mb-4 text-sm sm:text-lg">Community</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Discord</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">Twitter</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition duration-200">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 sm:pt-8 text-center">
              <p className="text-gray-400 text-xs sm:text-sm font-medium">
                🔐 MyWallet.Help © 2026 • Non-custodial • Self-sovereign • Multi-chain
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
