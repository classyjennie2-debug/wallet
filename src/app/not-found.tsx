import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--foreground)] mb-4">404</h1>
        <p className="text-xl text-[var(--text-muted)] mb-8">Page not found</p>
        <Link 
          href="/" 
          className="px-6 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--surface)] text-[var(--foreground)] font-semibold transition-all hover:bg-[var(--surface-muted)]"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
