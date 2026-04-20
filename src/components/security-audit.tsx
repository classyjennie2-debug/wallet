'use client'

import { useState } from 'react'

interface SecurityAudit {
  id: string
  token: string
  address: string
  status: 'verified' | 'warning' | 'critical'
  checks: {
    name: string
    passed: boolean
  }[]
  lastAudited: string
}

export const SecurityAudit = () => {
  const [audits] = useState<SecurityAudit[]>([
    {
      id: '1',
      token: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      status: 'verified',
      checks: [
        { name: 'Contract Verified', passed: true },
        { name: 'Audited by Firm', passed: true },
        { name: 'No Mint Function', passed: true },
        { name: 'No Pause Function', passed: true },
      ],
      lastAudited: '2024-01-15'
    },
    {
      id: '2',
      token: 'DAI',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      status: 'verified',
      checks: [
        { name: 'Contract Verified', passed: true },
        { name: 'Audited by Firm', passed: true },
        { name: 'No Mint Function', passed: false },
        { name: 'No Pause Function', passed: true },
      ],
      lastAudited: '2024-01-20'
    },
    {
      id: '3',
      token: 'SHIB',
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      status: 'warning',
      checks: [
        { name: 'Contract Verified', passed: true },
        { name: 'Audited by Firm', passed: false },
        { name: 'No Mint Function', passed: false },
        { name: 'No Pause Function', passed: false },
      ],
      lastAudited: '2023-06-10'
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30'
      case 'warning': return 'from-yellow-500/20 to-orange-500/10 border-yellow-500/30'
      default: return 'from-red-500/20 to-orange-500/10 border-red-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return '✅'
      case 'warning': return '⚠️'
      default: return '❌'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/50'
      case 'warning': return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/50'
      default: return 'text-red-300 bg-red-500/20 border-red-500/50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30">
        <div className="relative z-10">
          <p className="text-sm font-semibold text-blue-300 mb-2">🛡️ Contract Security Audit</p>
          <p className="text-sm text-blue-300/70">Check if token contracts are verified, audited, and have proper safeguards to protect your assets.</p>
        </div>
      </div>

      {/* Audits List */}
      <div className="space-y-4">
        {audits.map((audit) => {
          const passedCount = audit.checks.filter(c => c.passed).length
          const passPercentage = Math.round((passedCount / audit.checks.length) * 100)

          return (
            <div
              key={audit.id}
              className={`relative overflow-hidden rounded-lg border bg-gradient-to-br ${getStatusColor(audit.status)}`}
            >
              <div className="p-4 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getStatusIcon(audit.status)}</span>
                      <p className="font-bold text-white text-lg">{audit.token}</p>
                    </div>
                    <p className="text-xs text-gray-400 font-mono break-all">{audit.address}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg font-bold text-xs border ${getStatusBadge(audit.status)} capitalize whitespace-nowrap`}>
                    {audit.status}
                  </div>
                </div>

                {/* Security Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-300">Security Score</p>
                    <p className="text-lg font-bold text-white">{passPercentage}%</p>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        passPercentage === 100 ? 'from-emerald-500 to-teal-500' :
                        passPercentage >= 75 ? 'from-yellow-500 to-orange-500' :
                        'from-red-500 to-orange-500'
                      }`}
                      style={{ width: `${passPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Checks */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Security Checks</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {audit.checks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={check.passed ? 'text-emerald-400' : 'text-red-400'}>
                          {check.passed ? '✓' : '✗'}
                        </span>
                        <span className={check.passed ? 'text-gray-300' : 'text-gray-400'}>
                          {check.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Audited */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400">Last audited: {new Date(audit.lastAudited).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Security Tips</h3>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
          ✅ Only trade verified and audited contracts
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs">
          ⚠️ Be careful with tokens that have warning status
        </div>
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          ❌ Avoid critical risk tokens entirely
        </div>
      </div>
    </div>
  )
}
