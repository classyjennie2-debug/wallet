'use client'

import React, { useEffect, useState } from 'react'
import { MyWalletLogo } from '@/components/logo'

export default function MobileOptimized() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex rounded-[22px] border border-white/10 bg-slate-950/60 px-3 py-2">
              <MyWalletLogo size="md" variant="full" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Mobile Optimization</h1>
            <p className="text-gray-400">This app is now optimized for mobile-first experience with WalletConnect</p>
          </div>

          {/* Features Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Mobile Enhancements</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: '📱',
                  title: 'Mobile-First Design',
                  desc: 'App is designed and tested for mobile devices first'
                },
                {
                  icon: '🔗',
                  title: 'WalletConnect Integration',
                  desc: 'Full WalletConnect support with QR code modal for mobile wallets'
                },
                {
                  icon: '👆',
                  title: 'Touch Optimized',
                  desc: 'Large touch targets (44px minimum) for easier mobile interaction'
                },
                {
                  icon: '⚡',
                  title: 'Performance',
                  desc: 'Fast loading and smooth scrolling optimized for mobile networks'
                },
                {
                  icon: '🛡️',
                  title: 'Safe Area Support',
                  desc: 'Proper handling of notches and safe areas on iOS devices'
                },
                {
                  icon: '🔄',
                  title: 'Responsive Tabs',
                  desc: 'Navigation tabs adapt to screen size for better mobile UX'
                },
              ].map((feature, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Wallet Support */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Supported Mobile Wallets</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'MetaMask Mobile',
                'Trust Wallet',
                'Rainbow',
                'Coinbase Wallet',
                'Phantom',
                'Ledger Live',
                'Trezor Suite',
                'OKX Wallet',
                'Argent',
              ].map((wallet, i) => (
                <div key={i} className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 text-center">
                  <p className="text-sm font-semibold text-cyan-300">{wallet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Mobile Best Practices</h2>
            
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Use mobile wallet apps (MetaMask Mobile, Trust Wallet, etc.) for best experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>WalletConnect QR code modal appears automatically - scan with your mobile wallet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Use Safari or Chrome browser on iOS for best web3 support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Tap targets are optimized to 44px minimum for easy mobile interaction</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>App handles notches and safe areas on modern mobile devices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>All features are responsive and work smoothly on mobile networks</span>
              </li>
            </ul>
          </div>

          {/* Device Info */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30">
            <h2 className="text-xl font-bold text-blue-300 mb-3">Your Device</h2>
            <p className="text-gray-300 text-sm">
              <strong>Device Type:</strong> {isMobile ? '📱 Mobile' : '💻 Desktop'}<br/>
              <strong>Resolution:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}px` : 'N/A'}<br/>
              <strong>User Agent:</strong> <span className="font-mono text-xs break-all text-gray-400">{typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
