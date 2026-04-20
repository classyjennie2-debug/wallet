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
    <div className="flex items-center gap-2">
      {/* Wallet Icon with Shield */}
      <div className="relative">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wallet */}
          <rect
            x="6"
            y="12"
            width="36"
            height="24"
            rx="4"
            fill="url(#gradient)"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Wallet flap */}
          <path
            d="M6 12C6 9.79086 7.79086 8 10 8H36C38.2091 8 40 9.79086 40 12V16H6V12Z"
            fill="url(#gradientLight)"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Card slot */}
          <rect x="28" y="20" width="8" height="12" rx="1" fill="currentColor" opacity="0.3" />
          {/* Shield checkmark */}
          <g transform="translate(8, 20)">
            <path
              d="M4 0C1.79086 0 0 1.79086 0 4V8C0 10 1 12 4 13C7 12 8 10 8 8V4C8 1.79086 6.20914 0 4 0Z"
              fill="url(#gradientAccent)"
            />
            <path
              d="M2 6L4 8L6 5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="gradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Logo */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontSize: dimensions.text }}
          >
            MyWallet
          </span>
          <span className="text-[0.6em] text-gray-500 font-medium">help</span>
        </div>
      )}
    </div>
  )
}

export const MyWalletIconOnly = ({ size = 'md' }: Omit<LogoProps, 'variant'>) => {
  return <MyWalletLogo size={size} variant="icon" />
}
