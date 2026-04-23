import Link from 'next/link'

interface Props {
  searchParams?: { method?: string; time?: string }
}

export default function RecoverySuccess({ searchParams }: Props) {
  const method = searchParams?.method || 'unknown'
  const time = searchParams?.time || new Date().toISOString()

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gradient-to-b from-slate-900/60 to-slate-900/80 border border-purple-800/40 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 p-3 shadow-lg">
            <span className="text-white text-2xl">OK</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Recovery Processed</h1>
            <p className="text-sm text-slate-300 mt-1">Your restoration request was processed and the review summary is ready.</p>
          </div>
        </div>

        <section className="mt-6 bg-slate-900/40 border border-white/5 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white">Audit Summary</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><strong>Method:</strong> {method}</li>
            <li><strong>Processed at:</strong> {new Date(time).toLocaleString()}</li>
            <li><strong>Status:</strong> complete</li>
          </ul>
        </section>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-white/2 to-white/1 border border-white/5 rounded-lg">
            <h3 className="text-sm font-semibold text-white">What we checked</h3>
            <ul className="mt-2 text-xs text-slate-300 space-y-1">
              <li>- Format validation (seed / keystore)</li>
              <li>- Entropy and word-count checks</li>
              <li>- Keystore JSON structure</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-br from-white/2 to-white/1 border border-white/5 rounded-lg">
            <h3 className="text-sm font-semibold text-white">Next steps</h3>
            <ul className="mt-2 text-xs text-slate-300 space-y-1">
              <li>- Review the validated summary</li>
              <li>- Retry with a different method if needed</li>
              <li>- Return to the dashboard to continue</li>
            </ul>
          </div>
        </section>

        <div className="mt-6 flex justify-between items-center">
          <Link href="/" className="text-xs text-slate-300 hover:text-white">Back to Dashboard</Link>
          <Link href="/" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">Done</Link>
        </div>
      </div>
    </main>
  )
}
