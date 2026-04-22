import { mainnet, polygon, arbitrum, base, sepolia, polygonMumbai, arbitrumSepolia, baseSepolia } from 'wagmi/chains'

export const SUPPORTED_CHAINS = [
  mainnet,
  polygon,
  arbitrum,
  base,
  sepolia,
  polygonMumbai,
  arbitrumSepolia,
  baseSepolia,
] as const

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
