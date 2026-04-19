'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'

export const TokenSwap = () => {
  const { tokens, swapTokens } = useWallet()
  const { isConnected } = useAccount()
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSwap = async () => {
    if (!fromToken || !toToken || !amount) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      await swapTokens(fromToken, toToken, amount)
      setAmount('')
      alert('Swap initiated!')
    } catch (error) {
      console.error('Swap failed:', error)
      alert('Swap failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to swap tokens</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Swap Tokens</h2>

      {/* From Token */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-300">From</label>
        <select
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - ${token.usdValue.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-300">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* To Token */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-300">To</label>
        <select
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - ${token.usdValue.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSwap}
        disabled={loading || !fromToken || !toToken || !amount}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all"
      >
        {loading ? 'Swapping...' : 'Swap'}
      </button>
    </div>
  )
}
