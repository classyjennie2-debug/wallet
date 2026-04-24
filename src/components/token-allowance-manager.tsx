'use client'

import { useState } from 'react'

interface Allowance {
  id: string
  token: string
  spender: string
  amount: string
  riskLevel: 'low' | 'medium' | 'high'
}

const AllowanceIcon = ({ kind }: { kind: 'info' | 'revoke' }) => {
  const iconMap = {
    info: (
      <>
        <path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" />
        <path d="M12 9v3" />
        <path d="M12 15h.01" />
      </>
    ),
    revoke: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M9 9l6 6" />
        <path d="M15 9l-6 6" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

export const TokenAllowanceManager = () => {
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [revoking, setRevoking] = useState<string | null>(null)

  const handleRevoke = (id: string) => {
    setRevoking(id)
    setTimeout(() => {
      setAllowances((current) => current.filter((allowance) => allowance.id !== id))
      setRevoking(null)
    }, 1500)
  }

  const getRiskColor = (level: Allowance['riskLevel']) => {
    switch (level) {
      case 'high':
        return 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-300'
      case 'medium':
        return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-300'
      default:
        return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
            <AllowanceIcon kind="info" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-300">Token Approvals</p>
            <p className="mt-2 text-sm text-blue-300/70">These contracts can spend your tokens. Revoke unused permissions to reduce security risk.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Active Allowances</h3>
        {allowances.length > 0 ? (
          allowances.map((allowance) => (
            <div
              key={allowance.id}
              className={`rounded-[24px] border bg-gradient-to-br p-4 sm:p-6 transition-all ${getRiskColor(allowance.riskLevel)} ${revoking === allowance.id ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
                      {allowance.token[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-white text-sm">{allowance.token}</p>
                      <p className="truncate text-xs text-gray-400">{allowance.spender}</p>
                    </div>
                  </div>
                  <p className="w-fit max-w-full truncate rounded-full bg-black/20 px-3 py-1 font-mono text-xs text-gray-300">
                    {allowance.amount}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(allowance.id)}
                  disabled={revoking === allowance.id}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-gray-300 transition-all hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
                >
                  <AllowanceIcon kind="revoke" />
                  <span>{revoking === allowance.id ? 'Revoking...' : 'Revoke'}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-slate-700/60 bg-slate-900/75 py-12 text-center">
            <p className="text-gray-400 text-sm">No active allowances</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-[24px] border border-red-500/30 bg-gradient-to-br from-red-500/20 to-red-500/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase text-red-300/70">High Risk</p>
          <p className="text-2xl font-bold text-red-300">{allowances.filter((allowance) => allowance.riskLevel === 'high').length}</p>
        </div>
        <div className="rounded-[24px] border border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase text-yellow-300/70">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-300">{allowances.filter((allowance) => allowance.riskLevel === 'medium').length}</p>
        </div>
        <div className="rounded-[24px] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase text-emerald-300/70">Low Risk</p>
          <p className="text-2xl font-bold text-emerald-300">{allowances.filter((allowance) => allowance.riskLevel === 'low').length}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">Recommendations</h3>
        <div className="rounded-[20px] border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          Revoke unlimited approvals promptly to reduce exposure.
        </div>
        <div className="rounded-[20px] border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          Only approve token amounts you actually intend to use.
        </div>
      </div>
    </div>
  )
}
