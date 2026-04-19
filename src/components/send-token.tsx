'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { isAddress } from 'ethers'

export const SendToken = () => {
  const { tokens, sendToken } = useWallet()
  const { isConnected } = useAccount()
  const [selectedToken, setSelectedToken] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!selectedToken || !recipient || !amount) {
      alert('Please fill all fields')
      return
    }

    if (!isAddress(recipient)) {
      alert('Invalid recipient address')
      return
    }

    try {
      setLoading(true)
      await sendToken(selectedToken, recipient, amount)
      setRecipient('')
      setAmount('')
      alert('Token transfer initiated!')
    } catch (error) {
      console.error('Send failed:', error)
      alert('Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to send tokens</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Send Tokens</h2>

      {/* Token Selection */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-300">Token</label>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {parseFloat(token.balance).toFixed(4)}
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

      {/* Recipient Address */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-300">Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={loading || !selectedToken || !recipient || !amount}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
