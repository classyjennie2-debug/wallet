'use client'

import { useState, useEffect } from 'react'
import { Web3WalletConnector } from './web3-wallet-connector'

export const LandingPageV2 = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        {/* Secondary gradient - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        {/* Accent glow - center */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Premium Header */}
        <header className="sticky top-0 z-40 border-b border-purple-900/50 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg border border-purple-400/30">
                  <span className="text-lg font-bold text-white">💎</span>
                  <div className="absolute inset-0 rounded-lg bg-purple-500/20 blur-lg -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold text-white text-lg">MyWallet.Help</div>
                  <div className="text-xs text-purple-300 font-medium">Self-Sovereign Finance</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <nav className="hidden md:flex gap-6 text-sm">
                  <a href="/about" className="text-slate-300 hover:text-purple-300 transition">About</a>
                  <a href="/help" className="text-slate-300 hover:text-purple-300 transition">Guide</a>
                  <a href="/privacy" className="text-slate-300 hover:text-purple-300 transition">Privacy</a>
                </nav>
                {isClient && <Web3WalletConnector />}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center space-y-12">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-600/50 bg-purple-600/10 backdrop-blur-md shadow-lg hover:shadow-purple-600/20 transition">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-purple-200">✨ Next-Gen Wallet Dashboard</span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tight">
              Your Crypto,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">Fully Sovereign</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Manage, analyze, and secure your entire crypto portfolio with zero compromises on privacy. Connect any wallet, track everything in one elegant dashboard.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-600/50 transition transform hover:-translate-y-1">
              Launch Dashboard →
            </button>
            <button className="px-8 py-3 rounded-lg border border-purple-600/50 bg-purple-600/10 backdrop-blur-sm text-purple-200 font-semibold hover:bg-purple-600/20 transition">
              Read Docs
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Powerful Features</h2>
            <p className="text-slate-400">Everything you need for professional crypto management</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Portfolio Tracking', desc: 'Real-time balance and allocation across networks' },
              { icon: '🔐', title: 'Security Audits', desc: 'Smart contract verification and risk analysis' },
              { icon: '⚡', title: 'Token Management', desc: 'Send, swap, and approve with precision' },
              { icon: '📊', title: 'Price Analytics', desc: 'Charts, trends, and market insights' },
              { icon: '🎨', title: 'NFT Gallery', desc: 'Beautifully display your digital collectibles' },
              { icon: '🛡️', title: 'Privacy First', desc: 'Your keys, your data, your control' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-purple-600/20 hover:border-purple-600/50 backdrop-blur-sm transition"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition"></div>
                <div className="relative space-y-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Networks */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Multi-Chain Support</h2>
            <p className="text-slate-400">Works seamlessly across all major networks</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Ethereum', icon: '⟠', color: 'from-purple-600/20 to-purple-600/5' },
              { name: 'Polygon', icon: '⬡', color: 'from-indigo-600/20 to-indigo-600/5' },
              { name: 'Arbitrum', icon: '➜', color: 'from-blue-600/20 to-blue-600/5' },
              { name: 'Base', icon: '◆', color: 'from-cyan-600/20 to-cyan-600/5' },
              { name: 'Sepolia', icon: '▲', color: 'from-purple-400/20 to-purple-400/5' },
              { name: 'Mumbai', icon: '◇', color: 'from-pink-600/20 to-pink-600/5' },
              { name: 'Optimism', icon: '⊙', color: 'from-red-600/20 to-red-600/5' },
              { name: 'zkSync', icon: '◈', color: 'from-blue-500/20 to-blue-500/5' },
            ].map((chain, i) => (
              <div key={i} className={`p-4 rounded-lg bg-gradient-to-br ${chain.color} border border-white/10 text-center hover:border-white/30 transition`}>
                <div className="text-3xl mb-2">{chain.icon}</div>
                <p className="font-semibold text-white text-sm">{chain.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-12">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { number: '100K+', label: 'Active Users' },
              { number: '$2B+', label: 'Assets Tracked' },
              { number: '8', label: 'Networks Supported' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stat.number}</div>
                <p className="text-slate-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="relative rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/10 border border-purple-600/30 p-12 text-center space-y-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Take Control?</h2>
              <p className="text-slate-300 mt-3 max-w-xl mx-auto">Start managing your crypto with complete transparency and security</p>
              {isClient && (
                <div className="mt-8 flex justify-center">
                  <Web3WalletConnector />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-purple-900/50 bg-slate-950/50 backdrop-blur-xl mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-sm">
              <div>MyWallet.Help © 2024 • Self-Sovereign Finance</div>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-purple-300 transition">Privacy</a>
                <a href="/terms" className="hover:text-purple-300 transition">Terms</a>
                <a href="/help" className="hover:text-purple-300 transition">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
