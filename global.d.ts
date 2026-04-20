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
    [key: string]: any
  }

  interface W3mConnectButtonProps {
    [key: string]: any
  }

  interface W3mAccountButtonProps {
    [key: string]: any
  }
}

export {}
