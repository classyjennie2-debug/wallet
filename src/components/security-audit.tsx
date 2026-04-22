'use client'

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
  const audits: SecurityAudit[] = []

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
        {audits.length > 0 ? (
          audits.map((audit) => {
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
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">No Audits Found</h2>
            <p className="text-slate-400 text-center max-w-md">Connect your wallet to see security audits for your tokens.</p>
          </div>
        )}
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
