import React from 'react'
import { MyWalletLogo } from '@/components/logo'

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)]/80 px-3 py-2">
              <MyWalletLogo size="md" variant="full" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">Privacy Policy</h1>
            <p className="text-[var(--text-muted)]">Last updated: April 2026</p>
          </div>

          {/* Introduction */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-[var(--surface)]/90 border border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">Introduction</h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our crypto wallet dashboard. Your wallet secrets remain on your device and are never stored by us.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Information We Collect</h2>
            
            <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-300 mb-3">Wallet Information</h3>
              <p className="text-[var(--text-muted)]">
                We do not collect or store your private keys, seed phrases, or secret recovery phrases. These remain entirely under your control, and all wallet operations happen locally in your browser.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30">
              <h3 className="text-lg font-bold text-cyan-300 mb-3">Usage Data</h3>
              <p className="text-[var(--text-muted)]">
                We may collect information about how you interact with our service, such as features used and timestamps, to improve your experience.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30">
              <h3 className="text-lg font-bold text-emerald-300 mb-3">Device Information</h3>
              <p className="text-[var(--text-muted)]">
                We may collect information about your device type, browser, and operating system to optimize our service.
              </p>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">How We Use Your Information</h2>
            
            <ul className="space-y-3">
              {[
                'To provide and maintain our service',
                'To improve and optimize your experience',
                'To send technical updates and support messages',
                'To monitor usage patterns and trends',
                'To protect against fraud and security threats',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--text-muted)]">
                  <span className="text-cyan-400 font-bold mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30">
            <h2 className="text-xl font-bold text-yellow-300 mb-3">🔐 Security</h2>
            <p className="text-[var(--text-muted)] mb-4">
              We implement industry-standard security measures to protect your information. Sensitive wallet material is never transmitted to or stored by our servers.
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>• HTTPS encryption for all communications</li>
              <li>• No server-side storage of sensitive data</li>
              <li>• All wallet-sensitive operations run locally in your browser</li>
              <li>• Regular security audits and updates</li>
            </ul>
          </div>

          {/* Third-Party Services */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Third-Party Services</h2>
            <p className="text-[var(--text-muted)] mb-4">
              Our service integrates with blockchain networks and external APIs. Please review their privacy policies:
            </p>
            <ul className="space-y-2 text-[var(--text-muted)] text-sm">
              <li>• Ethereum blockchain network</li>
              <li>• Polygon network</li>
              <li>• Arbitrum network</li>
              <li>• Base network</li>
              <li>• RainbowKit wallet connection service</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30">
            <h2 className="text-xl font-bold text-emerald-300 mb-3">Your Rights</h2>
            <p className="text-[var(--text-muted)] mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 text-[var(--text-muted)] text-sm">
              <li>• Access, update, or delete your information</li>
              <li>• Opt-out of non-essential data collection</li>
              <li>• Request a copy of your data</li>
              <li>• Withdraw consent at any time</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30">
            <h2 className="text-xl font-bold text-purple-300 mb-3">Contact Us</h2>
            <p className="text-[var(--text-muted)]">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at: <span className="font-mono text-cyan-400">privacy@mywallet.help</span>
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-[var(--border-color)]">
            <p className="text-sm text-[var(--text-muted)]">
              This Privacy Policy may be updated from time to time. We will notify you of significant changes.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
