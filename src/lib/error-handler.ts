import { useAlert } from '@/lib/alert-context'

export interface WalletError {
  code: string
  message: string
  originalError?: Error
}

export const ERROR_CODES = {
  // Wallet Connection Errors
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_SWITCH_FAILED: 'WALLET_SWITCH_FAILED',
  WALLET_REJECTED: 'WALLET_REJECTED',

  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  INVALID_NETWORK: 'INVALID_NETWORK',

  // Transaction Errors
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_AMOUNT: 'INVALID_AMOUNT',

  // Token Errors
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  INVALID_TOKEN: 'INVALID_TOKEN',
  DEAD_TOKEN: 'DEAD_TOKEN',

  // Generic Errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const

export const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  [ERROR_CODES.WALLET_NOT_CONNECTED]: {
    title: 'Wallet Not Connected',
    message: 'Please connect your wallet to continue',
  },
  [ERROR_CODES.WALLET_SWITCH_FAILED]: {
    title: 'Network Switch Failed',
    message: 'Failed to switch network. Please try again',
  },
  [ERROR_CODES.WALLET_REJECTED]: {
    title: 'Transaction Rejected',
    message: 'You rejected the transaction in your wallet',
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    title: 'Network Error',
    message: 'Failed to connect to the blockchain network',
  },
  [ERROR_CODES.RPC_ERROR]: {
    title: 'RPC Error',
    message: 'Failed to communicate with the blockchain',
  },
  [ERROR_CODES.INVALID_NETWORK]: {
    title: 'Invalid Network',
    message: 'The requested network is not supported',
  },
  [ERROR_CODES.TRANSACTION_FAILED]: {
    title: 'Transaction Failed',
    message: 'The transaction could not be completed',
  },
  [ERROR_CODES.INSUFFICIENT_BALANCE]: {
    title: 'Insufficient Balance',
    message: 'You do not have enough tokens for this transaction',
  },
  [ERROR_CODES.INVALID_ADDRESS]: {
    title: 'Invalid Address',
    message: 'Please enter a valid Ethereum address',
  },
  [ERROR_CODES.INVALID_AMOUNT]: {
    title: 'Invalid Amount',
    message: 'Please enter a valid amount',
  },
  [ERROR_CODES.TOKEN_NOT_FOUND]: {
    title: 'Token Not Found',
    message: 'Could not find information for this token',
  },
  [ERROR_CODES.INVALID_TOKEN]: {
    title: 'Invalid Token',
    message: 'This token cannot be used in this operation',
  },
  [ERROR_CODES.DEAD_TOKEN]: {
    title: 'Dead Token',
    message: 'This token appears to be inactive or abandoned',
  },
  [ERROR_CODES.UNKNOWN_ERROR]: {
    title: 'Unknown Error',
    message: 'An unexpected error occurred. Please try again',
  },
  [ERROR_CODES.TIMEOUT]: {
    title: 'Request Timeout',
    message: 'The request took too long. Please try again',
  },
}

import { useCallback, useMemo } from 'react'

export const useErrorHandler = () => {
  const { addAlert } = useAlert()

  const handleError = useCallback(
    (error: unknown, defaultCode: string = ERROR_CODES.UNKNOWN_ERROR) => {
      let errorCode = defaultCode
      let originalError: Error | undefined

      if (error instanceof Error) {
        originalError = error
        // Parse error message for specific codes
        if (error.message.includes('user rejected')) {
          errorCode = ERROR_CODES.WALLET_REJECTED
        } else if (error.message.includes('insufficient balance')) {
          errorCode = ERROR_CODES.INSUFFICIENT_BALANCE
        } else if (error.message.includes('invalid address')) {
          errorCode = ERROR_CODES.INVALID_ADDRESS
        }
      }

      const errorInfo = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]

      addAlert({
        type: 'error',
        title: errorInfo.title,
        message: errorInfo.message,
        duration: 6000,
      })

      // Log for debugging
      console.error(`[${errorCode}]`, error)

      return {
        code: errorCode,
        message: errorInfo.message,
        originalError,
      } as WalletError
    },
    [addAlert]
  )

  const showSuccess = useCallback(
    (title: string, message: string) => {
      addAlert({
        type: 'success',
        title,
        message,
        duration: 4000,
      })
    },
    [addAlert]
  )

  const showWarning = useCallback(
    (title: string, message: string) => {
      addAlert({
        type: 'warning',
        title,
        message,
        duration: 5000,
      })
    },
    [addAlert]
  )

  const showInfo = useCallback(
    (title: string, message: string) => {
      addAlert({
        type: 'info',
        title,
        message,
        duration: 4000,
      })
    },
    [addAlert]
  )

  return useMemo(
    () => ({
      handleError,
      showSuccess,
      showWarning,
      showInfo,
    }),
    [handleError, showSuccess, showWarning, showInfo]
  )
}

// Wallet-specific error parsing
export const parseWalletError = (error: unknown): WalletError => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        code: ERROR_CODES.WALLET_REJECTED,
        message: ERROR_MESSAGES[ERROR_CODES.WALLET_REJECTED].message,
        originalError: error,
      }
    }

    if (message.includes('network') || message.includes('rpc')) {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR].message,
        originalError: error,
      }
    }

    if (message.includes('insufficient')) {
      return {
        code: ERROR_CODES.INSUFFICIENT_BALANCE,
        message: ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_BALANCE].message,
        originalError: error,
      }
    }
  }

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR].message,
    originalError: error instanceof Error ? error : undefined,
  }
}
