'use client'

import { useState } from 'react'

export const PortfolioRiskScore = () => {
  const [riskLevel] = useState(0)
  const [diversification] = useState(0)
  const [risks] = useState<any[]>([])

  const getRiskColor = (value: number) => {
    if (value < 30) return 'from-emerald-500 to-teal-500'
    if (value < 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-orange-500'
  }

  const getRiskLabel = (value: number) => {
    if (value < 30) return 'Low Risk'
    if (value < 60) return 'Medium Risk'
    return 'High Risk'
  }

  const getRiskBg = (value: number) => {
    if (value < 30) return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
    if (value < 60) return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30'
    return 'from-red-500/20 to-red-500/5 border-red-500/30'
  }

  if (!riskLevel) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Connect Your Wallet</h2>
        <p className="text-slate-400 text-center max-w-md">Connect your wallet to see your portfolio risk analysis and diversification score.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-6 sm:p-8 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Portfolio Risk Score</p>
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <p className="text-5xl sm:text-6xl font-black text-white mb-2">{riskLevel}</p>
              <p className={`text-lg font-bold bg-gradient-to-r ${getRiskColor(riskLevel)} bg-clip-text text-transparent`}>
                {getRiskLabel(riskLevel)}
              </p>
              <p className="text-gray-400 text-sm mt-3">Based on diversification, volatility, and smart contract audits</p>
            </div>
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${getRiskColor(riskLevel)} bg-clip-text text-transparent`}>
                  ⚠️
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Risk Breakdown</h3>
        {risks.map((risk, i) => (
          <div key={i} className={`relative overflow-hidden rounded-lg p-4 bg-gradient-to-br ${getRiskBg(risk.value)} border`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-white">{risk.name}</p>
                <p className={`text-sm font-bold capitalize ${
                  risk.value < 30 ? 'text-emerald-400' :
                  risk.value < 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {risk.value}%
                </p>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full bg-gradient-to-r ${getRiskColor(risk.value)} transition-all`}
                  style={{ width: `${risk.value}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{risk.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Diversification Score */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30">
        <div className="relative z-10">
          <p className="text-sm font-semibold text-cyan-300 mb-3 uppercase tracking-wide">Diversification</p>
          <p className="text-4xl font-bold text-white mb-2">{diversification}%</p>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{ width: `${diversification}%` }}
            ></div>
          </div>
          <p className="text-xs text-cyan-300/70">Spread across {Math.floor(diversification / 15)} different tokens</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Recommendations</h3>
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
            ✅ Add stablecoins to reduce volatility
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
            ⚠️ Rebalance portfolio - some assets are overweighted
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm">
            ℹ️ Consider diversifying to less correlated assets
          </div>
        </div>
      </div>
    </div>
  )
}
