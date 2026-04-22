declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-button': W3mButtonProps
      'w3m-connect-button': W3mConnectButtonProps
      'w3m-account-button': W3mAccountButtonProps
    }
  }

  interface W3mButtonProps {
    balance?: 'show' | 'hide'
    [key: string]: unknown
  }

  interface W3mConnectButtonProps {
    [key: string]: unknown
  }

  interface W3mAccountButtonProps {
    [key: string]: unknown
  }

  interface EthereumWindow {
    isMetaMask?: boolean
    isCoinbaseWallet?: boolean
    isRabby?: boolean
    isTrustWallet?: boolean
    [key: string]: unknown
  }

  interface Window {
    ethereum?: EthereumWindow
    trustwallet?: unknown
    phantom?: {
      ethereum?: unknown
    }
    okxwallet?: unknown
  }
}

export {}
