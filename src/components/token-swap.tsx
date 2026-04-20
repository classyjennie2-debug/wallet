'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useErrorHandler } from '@/lib/error-handler'

export const TokenSwap = () => {
  const { tokens, swapTokens } = useWallet()
  const { isConnected } = useAccount()
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleError, showSuccess } = useErrorHandler()

  const handleSwap = async () => {
    try {
      if (!fromToken || !toToken || !amount) {
        throw new Error('Please fill all fields')
      }

      if (parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      if (fromToken === toToken) {
        throw new Error('Please select different tokens')
      }

      setLoading(true)
      await swapTokens(fromToken, toToken, amount)
      setAmount('')
      showSuccess('Swap Initiated', 'Your token swap has been submitted')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-400 text-sm">Connect wallet to swap tokens</p>
      </div>
    )
  }

  const availableTokens = tokens.filter((t) => !t.isDead)

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">You send</label>
          <div className="relative">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
            >
              <option value="">Select token</option>
              {availableTokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            min="0"
            step="any"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          />
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">You receive</label>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          >
            <option value="">Select token</option>
            {availableTokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={loading || !fromToken || !toToken || !amount}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all mt-4 text-sm"
        >
          {loading ? 'Swapping...' : 'Swap Tokens'}
        </button>
      </div>
    </div>
  )
}
