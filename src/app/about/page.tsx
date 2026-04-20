import React from 'react'

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">About CryptoDash</h1>
            <p className="text-gray-400 text-lg">The Ultimate Crypto Wallet Dashboard</p>
          </div>

          {/* Mission */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              CryptoDash is dedicated to making cryptocurrency management simple, secure, and accessible to everyone. We believe that managing digital assets should be intuitive, transparent, and empowering.
            </p>
          </div>

          {/* What We Offer */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What We Offer</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: '📊',
                  title: 'Portfolio Overview',
                  desc: 'Real-time tracking of your crypto assets across multiple chains'
                },
                {
                  icon: '📈',
                  title: 'Price Charts',
                  desc: 'Interactive charts with multiple timeframes and indicators'
                },
                {
                  icon: '💱',
                  title: 'Token Swaps',
                  desc: 'Seamless token exchange with best price routing'
                },
                {
                  icon: '🔐',
                  title: 'Security Audit',
                  desc: 'Contract verification and security analysis tools'
                },
                {
                  icon: '🛡️',
                  title: 'Wallet Recovery',
                  desc: 'Safe recovery options with seed phrase validation'
                },
                {
                  icon: '🖼️',
                  title: 'NFT Portfolio',
                  desc: 'View and manage your NFT collections'
                },
              ].map((feature, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-white/5 to-white/3 border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Key Features</h2>
            
            <ul className="space-y-3">
              {[
                'Multi-chain support (Ethereum, Polygon, Arbitrum, Base)',
                'RainbowKit wallet connection - supports 20+ wallet providers',
                'Real-time price tracking and historical data',
                'Transaction history with detailed analytics',
                'Portfolio risk assessment and diversification metrics',
                'Contract security verification and auditing',
                'NFT portfolio management with rarity analysis',
                'Token allowance management and revocation',
                'Wallet recovery with secure seed phrase validation',
                'Dead coin detector to identify inactive tokens',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <span className="text-cyan-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30">
            <h2 className="text-xl font-bold text-purple-300 mb-4">Technology Stack</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                'Next.js 16.2.4',
                'React 19.0+',
                'TypeScript',
                'Tailwind CSS',
                'wagmi v2.9.0',
                'RainbowKit 2.2.10',
                'viem',
                'ethers.js',
                'TanStack Query',
              ].map((tech, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <p className="text-purple-300 font-semibold text-xs">{tech}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Networks */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Supported Networks</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Ethereum', emoji: '⟠', color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30' },
                { name: 'Polygon', emoji: '⬡', color: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30' },
                { name: 'Arbitrum', emoji: '➜', color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30' },
                { name: 'Base', emoji: '◆', color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30' },
              ].map((network, i) => (
                <div key={i} className={`relative overflow-hidden rounded-lg p-4 bg-gradient-to-br ${network.color} border`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{network.emoji}</span>
                    <div>
                      <p className="font-bold text-white">{network.name}</p>
                      <p className="text-xs text-gray-400">EVM Compatible</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30">
            <h2 className="text-xl font-bold text-emerald-300 mb-4">🔐 Security First</h2>
            
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ Your private keys never leave your device</li>
              <li>✓ HTTPS encryption for all communications</li>
              <li>✓ No server-side storage of sensitive data</li>
              <li>✓ Regular security audits and updates</li>
              <li>✓ Compliance with industry best practices</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30">
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="font-mono text-cyan-400">support@cryptodash.io</p>
              </div>
              
              <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30">
                <p className="text-sm text-gray-400 mb-1">GitHub</p>
                <p className="font-mono text-purple-400">github.com/cryptodash</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              CryptoDash © 2024. Built with ❤️ for the crypto community.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
