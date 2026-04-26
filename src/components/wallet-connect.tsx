'use client'

import { Web3WalletConnector } from './web3-wallet-connector'

export const WalletConnect = ({ compact }: { compact?: boolean }) => {
  return (
    <div className={compact ? 'w-auto' : 'w-full sm:w-auto'}>
      <Web3WalletConnector compact={compact} />
    </div>
  )
}
