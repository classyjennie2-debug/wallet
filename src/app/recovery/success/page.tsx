import Link from 'next/link'

interface Props {
  searchParams?: { method?: string; time?: string }
}

export default function RecoverySuccess({ searchParams }: Props) {
  const method = searchParams?.method || 'Recovery verification'
  const time = searchParams?.time ? new Date(searchParams.time) : new Date()
  const processedAt = Number.isNaN(time.getTime()) ? 'Unknown time' : time.toLocaleString()

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-[var(--border-color)] bg-[var(--surface)]/95 p-6 shadow-[0_40px_120px_-60px_rgba(14,165,233,0.6)] sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 shadow-sm shadow-emerald-500/10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-slate-950">✓</span>
              Recovery complete
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">Recovery request received</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                Your recovery request is processed securely. No private keys were stored, and the validation summary is ready for your next step.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Result</p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Validated</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">Success</div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)]">
              <div className="rounded-2xl bg-[var(--surface)]/90 p-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Method</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">{method}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)]/90 p-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Processed</p>
                <p className="mt-2 font-medium text-[var(--foreground)]">{processedAt}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/85 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.2)]">
            <h2 className="text-base font-semibold text-[var(--foreground)]">What was verified</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
              <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-3">Seed phrase or key input format.</li>
              <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-3">Backup material structure and entropy.</li>
              <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-3">No sensitive data stored after validation.</li>
            </ul>
          </div>
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)]/85 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.12)]">
            <h2 className="text-base font-semibold text-[var(--foreground)]">Ready for next steps</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
              <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-3">Go back to the dashboard and continue wallet review.</li>
              <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-3">Try a different recovery method if you need a second pass.</li>
              <li className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 p-3">Check alerts and approvals before making new changes.</li>
            </ul>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--surface)]/80 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface)]/90">
            Back to dashboard
          </Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Continue wallet review
          </Link>
        </div>
      </div>
    </main>
  )
}
