'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
}

export const MyWalletLogo = ({ size = 'md', variant = 'full' }: LogoProps) => {
  const sizeMap = {
    sm: { icon: 24, text: 14 },
    md: { icon: 32, text: 18 },
    lg: { icon: 48, text: 24 },
  }

  const dimensions = sizeMap[size]

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="walletTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          <rect x="6" y="20" width="52" height="28" rx="10" fill="url(#walletGrad)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          <path d="M10 20C10 15.5817 13.5817 12 18 12H44C48.4183 12 52 15.5817 52 20V28H10V20Z" fill="url(#walletTop)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          <rect x="18" y="28" width="16" height="8" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="40" y="28" width="12" height="12" rx="4" fill="url(#accentGrad)" opacity="0.95" />
          <path d="M22 30H36" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 36H38" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 36L24 28L30 34L46 18" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          <g transform="translate(42 34)">
            <circle cx="0" cy="0" r="8" fill="url(#shieldGrad)" />
            <path d="M-2 0L0 2L4-2" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span
            className="font-semibold bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent"
            style={{ fontSize: dimensions.text }}
          >
            MyWallet
          </span>
          <span className="text-[0.58em] uppercase tracking-[0.28em] text-slate-400">help</span>
        </div>
      )}
    </div>
  )
}

export const MyWalletIconOnly = ({ size = 'md' }: Omit<LogoProps, 'variant'>) => {
  return <MyWalletLogo size={size} variant="icon" />
}
