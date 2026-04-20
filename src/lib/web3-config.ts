import { http, createConfig } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id'

// Create config without walletConnect for SSR compatibility
export function createSSRConfig() {
  return createConfig({
    chains: [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia],
    connectors: [
      injected({
        shimDisconnect: false,
        target: 'metaMask',
      }),
      coinbaseWallet({
        appName: 'MyWallet.Help',
        appLogoUrl: 'https://mywallet.help/logo.png',
        darkMode: true,
      }),
    ],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [base.id]: http(),
      [sepolia.id]: http(),
      [polygonMumbai.id]: http(),
      [arbitrumSepolia.id]: http(),
      [baseSepolia.id]: http(),
    },
  })
}

// Create full config with WalletConnect for client-side
export function createClientConfig() {
  return createConfig({
    chains: [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia],
    connectors: [
      injected({
        shimDisconnect: false,
        target: 'metaMask',
      }),
      walletConnect({
        projectId,
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark',
        },
      }),
      coinbaseWallet({
        appName: 'MyWallet.Help',
        appLogoUrl: 'https://mywallet.help/logo.png',
        darkMode: true,
      }),
    ],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [base.id]: http(),
      [sepolia.id]: http(),
      [polygonMumbai.id]: http(),
      [arbitrumSepolia.id]: http(),
      [baseSepolia.id]: http(),
    },
  })
}

export const NETWORKS = [
  { name: 'Ethereum', id: mainnet.id, icon: '🔷', color: '#627EEA' },
  { name: 'Polygon', id: polygon.id, icon: '🟣', color: '#8247E5' },
  { name: 'Arbitrum', id: arbitrum.id, icon: '🔵', color: '#28A0F0' },
  { name: 'Base', id: base.id, icon: '⚪', color: '#0052FF' },
]

export const DEAD_COIN_INDICATORS = {
  zeroLiquidity: 'Zero liquidity',
  contractRenounced: 'Contract renounced',
  noVolumeLastDay: 'No trading activity',
  honeypot: 'Honeypot detected',
  unverifiedContract: 'Unverified contract',
}
