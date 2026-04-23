'use client'

import { useState } from 'react'

interface AlertEvent {
  id: string
  category: 'approvals' | 'suspicious' | 'recovery' | 'network'
  title: string
  summary: string
  source: string
  target: string
  date: string
  status: 'open' | 'reviewed' | 'resolved'
  severity: 'high' | 'medium' | 'low'
  link?: string
}

const alertEvents: AlertEvent[] = [
  {
    id: 'alert-001',
    category: 'approvals',
    title: 'Pending token approval detected',
    summary: 'An active approval exists for a third-party contract on your wallet.',
    source: '0x4fbd...9a12',
    target: 'Uniswap V3 Router',
    date: '2026-04-23T10:15:00Z',
    status: 'open',
    severity: 'high',
    link: 'https://etherscan.io/address/0x4fbd...9a12',
  },
  {
    id: 'alert-002',
    category: 'suspicious',
    title: 'Unusual funding pattern detected',
    summary: 'Multiple small incoming transfers were received from an unknown address.',
    source: '0x9d12...b7c0',
    target: 'Your wallet',
    date: '2026-04-22T18:42:00Z',
    status: 'reviewed',
    severity: 'medium',
  },
  {
    id: 'alert-003',
    category: 'network',
    title: 'Unsupported chain warning',
    summary: 'The wallet is connected to a network outside your normal usage pattern.',
    source: 'Wallet connector',
    target: 'Base Network',
    date: '2026-04-21T14:08:00Z',
    status: 'open',
    severity: 'low',
  },
  {
    id: 'alert-004',
    category: 'recovery',
    title: 'Recovery session initiated',
    summary: 'A recovery flow was started for this wallet address.',
    source: 'MyWallet.Help recovery wizard',
    target: 'Your wallet',
    date: '2026-04-20T09:30:00Z',
    status: 'resolved',
    severity: 'low',
  },
]

const AlertIcon = ({ kind }: { kind: 'approvals' | 'suspicious' | 'recovery' | 'network' | 'default' }) => {
  const iconMap = {
    approvals: (
      <>
        <path d="M8 7h8" />
        <path d="M8 12h8" />
        <path d="M8 17h8" />
      </>
    ),
    suspicious: (
      <>
        <path d="M12 4v8" />
        <path d="M12 16h.01" />
        <path d="M4 20l8-16 8 16" />
      </>
    ),
    recovery: (
      <>
        <path d="M12 4a8 8 0 0 1 8 8v4H4v-4a8 8 0 0 1 8-8z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    network: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M12 11v7" />
        <path d="M7 14h10" />
      </>
    ),
    default: <path d="M5 12h14" />,
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

export const SecurityAlerts = () => {
  const [filter, setFilter] = useState<'all' | 'approvals' | 'suspicious' | 'recovery' | 'network'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = filter === 'all' ? alertEvents : alertEvents.filter((event) => event.category === filter)

  const getStatusColor = (status: AlertEvent['status']) => {
    switch (status) {
      case 'open':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30'
      case 'reviewed':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
      case 'resolved':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
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
        {(['all', 'approvals', 'suspicious', 'recovery', 'network'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
              filter === value
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((event) => (
            <div key={event.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 to-white/3 transition-all hover:border-white/20">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                className="w-full p-4 text-left transition-all hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-1 items-center gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                      <AlertIcon kind={event.category} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{event.title}</p>
                      <p className="mt-1 text-xs text-gray-400">{event.summary}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-white">{event.severity.toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{formatTime(event.date)}</p>
                  </div>
                </div>
              </button>

              {expandedId === event.id && (
                <div className="border-t border-white/10 bg-white/5 px-4 pb-4 pt-0">
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="font-mono text-xs text-white break-all">{event.source}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-gray-400">Target:</span>
                      <span className="font-mono text-xs text-white break-all">{event.target}</span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    {event.link && (
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Reference:</span>
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-cyan-300">
                          View details
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-400">Recommended action: investigate this alert before authorizing further activity.</div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">Investigate</button>
                      <button type="button" className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20">Mark reviewed</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-white/10 bg-white/5 py-12 text-center">
            <p className="text-sm text-gray-400">No security alerts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
