'use client'

import { useState, useEffect } from 'react'

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

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    // Transactions will be fetched from blockchain when wallet is connected
    // For now, show empty state
    setTransactions([])
  }, [])

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter)

  const getIcon = (type: string) => {
    switch (type) {
      case 'send': return '📤'
      case 'receive': return '📥'
      case 'swap': return '⚡'
      default: return '💱'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'pending': return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
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
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'send', 'receive', 'swap'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((tx) => (
            <div key={tx.id} className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/3 hover:border-white/20 transition-all">
              <button
                onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                className="w-full p-4 text-left hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">{getIcon(tx.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white capitalize">{tx.type} {tx.token}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatTime(tx.date)}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-white">{tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.token}</p>
                    <p className="text-xs text-gray-400">${tx.usdValue.toLocaleString()}</p>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === tx.id && (
                <div className="px-4 pb-4 pt-0 border-t border-white/10 bg-white/5">
                  <div className="space-y-3 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">From:</span>
                      <span className="text-white font-mono text-xs">{tx.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">To:</span>
                      <span className="text-white font-mono text-xs">{tx.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(tx.status)} capitalize`}>
                        {tx.status}
                      </span>
                    </div>
                    {tx.hash && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hash:</span>
                        <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-mono text-xs">
                          {tx.hash.slice(0, 8)}...
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}
