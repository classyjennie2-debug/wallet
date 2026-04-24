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
      <div className="relative" aria-hidden>
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5a4" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0ea5a4" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Shield base */}
          <path d="M32 6c7.2 4.6 18 7 18 15 0 13-8.8 22-18 26-9.2-4-18-13-18-26 0-8 10.8-10.4 18-15z" fill="url(#g1)" filter="url(#softShadow)" />

          {/* Stylized wallet inside shield */}
          <g transform="translate(10,18)">
            <rect x="4" y="6" width="40" height="22" rx="6" fill="#0f172a" opacity="0.12" />
            <rect x="2" y="0" width="36" height="18" rx="5" fill="white" opacity="0.06" />
            <rect x="6" y="8" width="26" height="12" rx="4" fill="url(#g2)" />
            <circle cx="34" cy="14" r="5.2" fill="#0f172a" opacity="0.14" />
            <path d="M10 14h14" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />
          </g>

          {/* Check mark accent */}
          <path d="M22 34l6 6 14-18" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <span
            className="font-semibold bg-gradient-to-r from-cyan-400 via-violet-500 to-red-500 bg-clip-text text-transparent"
            style={{ fontSize: dimensions.text }}
          >
            MyWallet
          </span>
          <span className="text-[0.72em] uppercase tracking-[0.18em] text-slate-400">Solutions</span>
        </div>
      )}
    </div>
  )
}

export const MyWalletIconOnly = ({ size = 'md' }: Omit<LogoProps, 'variant'>) => {
  return <MyWalletLogo size={size} variant="icon" />
}
