import React from 'react'

export default function Terms() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last updated: January 2024</p>
          </div>

          {/* Introduction */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-3">Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using CryptoDash, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          {/* Use License */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Use License</h2>
            
            <p className="text-gray-300">
              Permission is granted to temporarily download one copy of the materials (information or software) on CryptoDash for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>

            <ul className="space-y-2 text-gray-300 text-sm ml-4">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or any public display</li>
              <li>• Attempting to decompile or reverse engineer any software contained on the site</li>
              <li>• Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
              <li>• Transmitting the materials over a network</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-300 mb-3">2. Disclaimer</h2>
            <p className="text-gray-300">
              The materials on CryptoDash are provided on an 'as is' basis. CryptoDash makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          {/* Limitations of Liability */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Limitations of Liability</h2>
            
            <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30">
              <p className="text-gray-300 mb-3">
                In no event shall CryptoDash or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CryptoDash.
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Financial losses from trading decisions</li>
                <li>• Incorrect price data or calculations</li>
                <li>• Service interruptions or outages</li>
                <li>• Lost or corrupted wallet information</li>
              </ul>
            </div>
          </div>

          {/* Accuracy of Materials */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Accuracy of Materials</h2>
            
            <p className="text-gray-300">
              The materials appearing on CryptoDash could include technical, typographical, or photographic errors. CryptoDash does not warrant that any of the materials on its website are accurate, complete, or current. CryptoDash may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>

          {/* Materials and Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Materials and Content</h2>
            
            <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-300 mb-3">Your Responsibility</h3>
              <p className="text-gray-300">
                You are responsible for protecting your wallet private keys, seed phrases, and authentication credentials. CryptoDash will not be liable for any unauthorized access to your wallet or accounts.
              </p>
            </div>
          </div>

          {/* Not Financial Advice */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30">
            <h2 className="text-xl font-bold text-orange-300 mb-3">6. Not Financial Advice</h2>
            <p className="text-gray-300 mb-3">
              CryptoDash provides information and tools for cryptocurrency management. We do not provide financial, investment, or legal advice. All information is for educational purposes only.
            </p>
            <p className="text-gray-300 text-sm">
              Always conduct your own research and consult with qualified financial advisors before making investment decisions. Cryptocurrency trading involves substantial risk and is not suitable for all investors.
            </p>
          </div>

          {/* Modifications to Terms */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Modifications to Terms</h2>
            
            <p className="text-gray-300">
              CryptoDash may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
            </p>
          </div>

          {/* Governing Law */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30">
            <h2 className="text-xl font-bold text-emerald-300 mb-3">8. Governing Law</h2>
            <p className="text-gray-300">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which CryptoDash operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>

          {/* Contact */}
          <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30">
            <h2 className="text-xl font-bold text-purple-300 mb-3">Questions or Concerns?</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms of Service, please contact us at: <span className="font-mono text-cyan-400">support@cryptodash.io</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
