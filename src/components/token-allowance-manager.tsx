'use client'

import { useState } from 'react'

interface Allowance {
  id: string
  token: string
  spender: string
  amount: string
  riskLevel: 'low' | 'medium' | 'high'
}

export const TokenAllowanceManager = () => {
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [revoking, setRevoking] = useState<string | null>(null)

  const handleRevoke = (id: string) => {
    setRevoking(id)
    setTimeout(() => {
      setAllowances(allowances.filter(a => a.id !== id))
      setRevoking(null)
    }, 1500)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-300'
      case 'medium': return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-300'
      default: return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30">
        <div className="relative z-10">
          <p className="text-sm font-semibold text-blue-300 mb-2">⚠️ Token Approvals</p>
          <p className="text-sm text-blue-300/70">These contracts have permission to spend your tokens. Revoke unused permissions to reduce security risks.</p>
        </div>
      </div>

      {/* Allowances List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Active Allowances</h3>
        {allowances.length > 0 ? (
          allowances.map((allowance) => (
            <div
              key={allowance.id}
              className={`relative overflow-hidden rounded-lg p-4 sm:p-6 bg-gradient-to-br ${getRiskColor(allowance.riskLevel)} border transition-all ${
                revoking === allowance.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                      {allowance.token[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{allowance.token}</p>
                      <p className="text-xs text-gray-400 truncate">{allowance.spender}</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-gray-300 bg-black/20 p-1 rounded w-fit max-w-full truncate">
                    {allowance.amount}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(allowance.id)}
                  disabled={revoking === allowance.id}
                  className="flex-shrink-0 px-3 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-300 border border-white/10 hover:border-red-500/30"
                >
                  {revoking === allowance.id ? '✓' : 'Revoke'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm">No active allowances</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30">
          <p className="text-xs text-red-300/70 uppercase font-semibold mb-1">High Risk</p>
          <p className="text-2xl font-bold text-red-300">{allowances.filter(a => a.riskLevel === 'high').length}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30">
          <p className="text-xs text-yellow-300/70 uppercase font-semibold mb-1">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-300">{allowances.filter(a => a.riskLevel === 'medium').length}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30">
          <p className="text-xs text-emerald-300/70 uppercase font-semibold mb-1">Low Risk</p>
          <p className="text-2xl font-bold text-emerald-300">{allowances.filter(a => a.riskLevel === 'low').length}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Recommendations</h3>
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          🔴 Revoke unlimited approvals immediately to reduce hacking risk
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
          ✅ Only approve tokens for amounts you intend to use
        </div>
      </div>
    </div>
  )
}
