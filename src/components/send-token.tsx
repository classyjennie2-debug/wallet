'use client'

import { useWallet } from '@/lib/wallet-context'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { isAddress } from 'ethers'
import { useErrorHandler } from '@/lib/error-handler'

export const SendToken = () => {
  const { tokens, sendToken } = useWallet()
  const { isConnected } = useAccount()
  const [selectedToken, setSelectedToken] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleError, showSuccess } = useErrorHandler()

  const handleSend = async () => {
    try {
      if (!selectedToken || !recipient || !amount) {
        throw new Error('Please fill all fields')
      }

      if (!isAddress(recipient)) {
        throw new Error('Please enter a valid Ethereum address (0x...)')
      }

      if (parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      const selectedTokenObj = tokens.find((t) => t.address === selectedToken)
      if (!selectedTokenObj) {
        throw new Error('Selected token not found')
      }

      if (parseFloat(amount) > parseFloat(selectedTokenObj.balance)) {
        throw new Error('Insufficient balance for this transfer')
      }

      setLoading(true)
      await sendToken(selectedToken, recipient, amount)
      setRecipient('')
      setAmount('')
      setSelectedToken('')
      showSuccess('Transfer Initiated', 'Your token transfer has been submitted to the blockchain')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-400 text-sm">Connect wallet to send tokens</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm space-y-4">
        {/* Token Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          >
            <option value="">Select token to send</option>
            {tokens
              .filter((t) => !t.isDead)
              .map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {parseFloat(token.balance).toFixed(4)}
                </option>
              ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              min="0"
              step="any"
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
            {selectedToken && (
              <button
                type="button"
                onClick={() => {
                  const token = tokens.find((t) => t.address === selectedToken)
                  if (token) setAmount(token.balance)
                }}
                className="absolute right-3 top-2.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                MAX
              </button>
            )}
          </div>
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Recipient</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          {recipient && !isAddress(recipient) && (
            <p className="text-xs text-red-400 mt-1">Invalid address format</p>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={loading || !selectedToken || !recipient || !amount || !isAddress(recipient)}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Sending...
            </>
          ) : (
            <>📤 Send</>
          )}
        </button>
      </div>
    </div>
  )
}
