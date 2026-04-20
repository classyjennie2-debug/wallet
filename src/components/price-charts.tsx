'use client'

import { useState, useEffect } from 'react'

export const PriceCharts = () => {
  const [selectedToken, setSelectedToken] = useState('ETH')
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([])
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D'>('7D')

  useEffect(() => {
    // Simulate chart data
    const generateChartData = () => {
      const data = []
      let price = 2500
      for (let i = 0; i < 30; i++) {
        price += (Math.random() - 0.5) * 200
        data.push({
          time: `Day ${i + 1}`,
          price: Math.max(1000, price)
        })
      }
      setChartData(data)
    }
    generateChartData()
  }, [selectedToken, timeframe])

  const tokens = ['ETH', 'BTC', 'USDT', 'USDC', 'DAI']
  const maxPrice = Math.max(...chartData.map(d => d.price), 3000)
  const minPrice = Math.min(...chartData.map(d => d.price), 1000)
  const range = maxPrice - minPrice

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Token Selector */}
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-4 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
          <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Select Token</p>
          <div className="grid grid-cols-5 gap-2">
            {tokens.map((token) => (
              <button
                key={token}
                onClick={() => setSelectedToken(token)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedToken === token
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {token}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-4 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
          <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Timeframe</p>
          <div className="flex gap-2">
            {(['1D', '7D', '30D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl p-6 bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
        <div className="flex items-end justify-between gap-1" style={{ height: '300px' }}>
          {chartData.map((data, i) => {
            const height = ((data.price - minPrice) / range) * 100 || 5
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500/80 to-blue-500/40 rounded-t-lg hover:from-cyan-400 hover:to-blue-400 transition-all group relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${data.price.toFixed(0)}
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-4 text-sm text-gray-400">
          <p>{selectedToken} Price Chart - {timeframe}</p>
          <p className="mt-1 text-xs">Range: ${minPrice.toFixed(0)} - ${maxPrice.toFixed(0)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30">
          <p className="text-xs text-cyan-300/70 uppercase font-semibold mb-1">High</p>
          <p className="text-lg font-bold text-white">${maxPrice.toFixed(0)}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/30">
          <p className="text-xs text-blue-300/70 uppercase font-semibold mb-1">Low</p>
          <p className="text-lg font-bold text-white">${minPrice.toFixed(0)}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30">
          <p className="text-xs text-purple-300/70 uppercase font-semibold mb-1">Avg</p>
          <p className="text-lg font-bold text-white">${((maxPrice + minPrice) / 2).toFixed(0)}</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30">
          <p className="text-xs text-emerald-300/70 uppercase font-semibold mb-1">Volatility</p>
          <p className="text-lg font-bold text-white">+2.34%</p>
        </div>
      </div>
    </div>
  )
}
