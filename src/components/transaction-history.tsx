'use client'

import { useState } from 'react'

interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap'
  token: string
  amount: string
  from: string
  to: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  hash?: string
  usdValue: number
}

const emptyTransactions: Transaction[] = []

export const TransactionHistory = () => {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered =
    filter === 'all' ? emptyTransactions : emptyTransactions.filter((transaction) => transaction.type === filter)

  const getIcon = (type: string) => {
    switch (type) {
      case 'send':
        return 'OUT'
      case 'receive':
        return 'IN'
      case 'swap':
        return 'SWP'
      default:
        return 'TX'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'pending':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'send', 'receive', 'swap'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
              filter === value
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((transaction) => (
            <div key={transaction.id} className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/3 transition-all hover:border-white/20">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
                className="w-full p-4 text-left transition-all hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="text-sm font-semibold text-cyan-300">{getIcon(transaction.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white capitalize">{transaction.type} {transaction.token}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatTime(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-white">{transaction.type === 'receive' ? '+' : '-'}{transaction.amount} {transaction.token}</p>
                    <p className="text-xs text-gray-400">${transaction.usdValue.toLocaleString()}</p>
                  </div>
                </div>
              </button>

              {expandedId === transaction.id && (
                <div className="border-t border-white/10 bg-white/5 px-4 pt-0 pb-4">
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">From:</span>
                      <span className="font-mono text-xs text-white">{transaction.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">To:</span>
                      <span className="font-mono text-xs text-white">{transaction.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`rounded border px-2 py-1 text-xs font-semibold capitalize ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    {transaction.hash && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hash:</span>
                        <a href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-cyan-300">
                          {transaction.hash.slice(0, 8)}...
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}
