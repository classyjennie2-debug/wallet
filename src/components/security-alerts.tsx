'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWallet, type Token, type Approval } from '@/lib/wallet-context'
import { useErrorHandler } from '@/lib/error-handler'

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

const buildRpcFailureEvent = (): AlertEvent => ({
  id: 'alert-rpc-failure',
  category: 'network',
  title: 'RPC & Service Failures',
  summary: 'A network provider or RPC endpoint is experiencing instability and may affect wallet actions.',
  source: 'RPC monitor',
  target: 'Connected RPC',
  date: new Date().toISOString(),
  status: 'open',
  severity: 'medium',
})

const buildApprovalAlert = (approvals: Approval[]): AlertEvent => {
  const count = approvals.length
  const highestSeverity = approvals.some((approval) => approval.riskLevel === 'high')
    ? 'high'
    : approvals.some((approval) => approval.riskLevel === 'medium')
    ? 'medium'
    : 'low'

  return {
    id: 'alert-approval-risk',
    category: 'approvals',
    title: `Pending token approval${count !== 1 ? 's' : ''} detected`,
    summary: `${count} active permission${count !== 1 ? 's are' : ' is'} currently granted to external contracts. Review and revoke unsafe approvals.`,
    source: 'Allowance scanner',
    target: 'Your wallet',
    date: new Date().toISOString(),
    status: 'open',
    severity: highestSeverity,
  }
}

const buildWarningAlert = (warnings: string[]): AlertEvent | null => {
  if (warnings.length === 0) {
    return null
  }

  return {
    id: 'alert-wallet-warnings',
    category: 'suspicious',
    title: 'Wallet scan warnings detected',
    summary: `${warnings.length} warning${warnings.length !== 1 ? 's were' : ' was'} generated while scanning your wallet state.`,
    source: 'Wallet scan',
    target: 'Connected wallet',
    date: new Date().toISOString(),
    status: 'open',
    severity: 'medium',
  }
}

const buildDeadCoinAlert = (deadCoins: Token[]): AlertEvent | null => {
  if (deadCoins.length === 0) {
    return null
  }

  return {
    id: 'alert-deadcoin',
    category: 'suspicious',
    title: `Dead Coin${deadCoins.length !== 1 ? 's' : ''} Detected`,
    summary: `${deadCoins.length} token${deadCoins.length !== 1 ? 's are' : ' is'} flagged as inactive or low-liquidity.`,
    source: 'Token risk scanner',
    target: 'Your wallet',
    date: new Date().toISOString(),
    status: 'open',
    severity: 'high',
  }
}

export const buildAlertEvents = (deadCoins: Token[], approvals: Approval[] = [], warnings: string[] = []) => {
  const events: AlertEvent[] = [buildRpcFailureEvent()]

  const warningEvent = buildWarningAlert(warnings)
  if (warningEvent) {
    events.push(warningEvent)
  }

  const approvalEvent = approvals.length > 0 ? buildApprovalAlert(approvals) : null
  if (approvalEvent) {
    events.push(approvalEvent)
  }

  const deadCoinEvent = buildDeadCoinAlert(deadCoins)
  if (deadCoinEvent) {
    events.push(deadCoinEvent)
  }

  return events
}

export const getOpenAlertCount = (events: AlertEvent[]) => events.filter((event) => event.status === 'open').length

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

export const SecurityAlerts = ({ onNavigate }: { onNavigate?: (tab: 'dashboard' | 'alerts' | 'security' | 'solutions') => void }) => {
  const { deadCoins, removeDeadCoin, approvals, revokeApproval, warnings } = useWallet()
  const { showSuccess } = useErrorHandler()
  const [filter, setFilter] = useState<'all' | 'approvals' | 'suspicious' | 'recovery' | 'network'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [events, setEvents] = useState<AlertEvent[]>(() => buildAlertEvents(deadCoins, approvals, warnings))

  useEffect(() => {
    setEvents((prev) => {
      const next = buildAlertEvents(deadCoins, approvals, warnings)
      return next.map((event) => {
        const previous = prev.find((prevEvent) => prevEvent.id === event.id)
        return previous ? { ...event, status: previous.status } : event
      })
    })
  }, [deadCoins, approvals, warnings])

  const filtered = filter === 'all' ? events : events.filter((event) => event.category === filter)

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

  const getSeverityColor = (severity: AlertEvent['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-600 text-white'
      case 'medium':
        return 'bg-amber-500 text-slate-900'
      case 'low':
        return 'bg-slate-600 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const getSeverityTextClass = (severity: AlertEvent['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-rose-300'
      case 'medium':
        return 'text-amber-300'
      case 'low':
        return 'text-slate-400'
      default:
        return 'text-slate-400'
    }
  }

  const getCategoryTitleClass = (category: AlertEvent['category']) => {
    switch (category) {
      case 'approvals':
        return 'text-cyan-200'
      case 'suspicious':
        return 'text-rose-200'
      case 'network':
        return 'text-violet-200'
      case 'recovery':
        return 'text-emerald-200'
      default:
        return 'text-slate-200'
    }
  }

  const markReviewed = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'reviewed' } : e)))
  }

  const markResolved = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'resolved' } : e)))
  }

  const snoozeAlert = (id: string) => {
    // simple snooze: mark reviewed and collapse
    markReviewed(id)
    setExpandedId(null)
  }

  const fixDeadCoinAlert = (id: string) => {
    if (deadCoins.length === 0) return

    const confirmed = window.confirm(
      `Remove ${deadCoins.length} dead coin${deadCoins.length !== 1 ? 's' : ''} from wallet tracking?`
    )
    if (!confirmed) return

    deadCoins.forEach((coin) => {
      removeDeadCoin(coin.address)
    })
    markResolved(id)
    showSuccess('Dead Coin Fixed', 'Dead coin alerts have been cleared from your portfolio.')
  }

  const reviewApprovals = (id: string) => {
    markReviewed(id)
    setExpandedId(null)
    onNavigate?.('security')
    showSuccess('Review approvals', 'Open Security to inspect and revoke any risky token permissions.')
  }

  const openRpcFix = (id: string) => {
    markResolved(id)
    onNavigate?.('solutions')
  }

  const reviewWarnings = (id: string) => {
    markReviewed(id)
    setExpandedId(null)
    onNavigate?.('alerts')
    showSuccess('Warning reviewed', 'Review the wallet warnings and investigate any suspicious activity.')
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
      <div className="flex flex-wrap gap-2 pb-2">
        {(['all', 'approvals', 'suspicious', 'recovery', 'network'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              filter === value
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span>{value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((event) => (
            <div key={event.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/90 transition-all hover:border-white/20">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                className="w-full p-4 text-left transition-all hover:bg-white/5"
              >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] items-start">
                  <div className="min-w-0 flex items-start gap-4">
                    <span className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${getSeverityColor(event.severity)}`}>
                      <AlertIcon kind={event.category} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusColor(event.status)}`}>{event.status}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getCategoryTitleClass(event.category)}`}>{event.category}</span>
                      </div>
                      <p className={`mt-3 text-sm font-semibold ${getCategoryTitleClass(event.category)} min-w-0 truncate`}>{event.title}</p>
                      <p className={`mt-2 text-xs ${getSeverityTextClass(event.severity)} min-w-0 text-slate-300`}>{event.summary}</p>
                    </div>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="font-semibold text-slate-200">{event.severity.toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{formatTime(event.date)}</p>
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
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-cyan-400 hover:text-cyan-300 break-words">
                          View details
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_auto] sm:items-center">
                    <div className="text-sm text-slate-400">
                      {event.category === 'approvals' && 'Recommended action: revoke suspicious approvals or reduce allowance immediately.'}
                      {event.category === 'suspicious' && 'Recommended action: inspect incoming transfers and consider freezing activity if unfamiliar.'}
                      {event.category === 'network' && 'Recommended action: confirm RPC provider and switch to a trusted endpoint if needed.'}
                      {event.category === 'recovery' && 'Recommended action: open the remediation wizard to finish recovery steps.'}
                    </div>
                    <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                      <button type="button" onClick={() => setExpandedId(null)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">Close</button>
                      {event.category === 'approvals' && (
                        <>
                          <button type="button" onClick={() => reviewApprovals(event.id)} className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10">Review approvals</button>
                          <button type="button" onClick={() => markReviewed(event.id)} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20">Mark reviewed</button>
                        </>
                      )}
                      {event.category === 'suspicious' && (
                        <>
                          <button type="button" onClick={() => reviewWarnings(event.id)} className="rounded-full border border-gray-500/20 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">Review warnings</button>
                          <button type="button" onClick={() => markReviewed(event.id)} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20">Mark reviewed</button>
                        </>
                      )}
                      {event.id === 'alert-deadcoin' && deadCoins.length > 0 && (
                        <button
                          type="button"
                          onClick={() => fixDeadCoinAlert(event.id)}
                          className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10"
                        >
                          Fix dead coin
                        </button>
                      )}
                      {event.id === 'alert-rpc-failure' && (
                        <button
                          type="button"
                          onClick={() => openRpcFix(event.id)}
                          className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
                        >
                          Open remediation
                        </button>
                      )}
                      {event.category === 'recovery' && (
                        <button type="button" className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/20">Open remediation</button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-slate-700/60 bg-slate-900/75 py-12 text-center">
            <p className="text-sm text-gray-400">No security alerts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
