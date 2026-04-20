'use client'

import { useEffect } from 'react'

/**
 * Suppress non-critical third-party errors like Analytics SDK failures
 * This prevents console spam without affecting app functionality
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Suppress Analytics SDK and other non-critical fetch errors
    const originalFetch = window.fetch
    window.fetch = (...args) => {
      return originalFetch(...args).catch((err) => {
        // Log but don't throw analytics/telemetry errors
        if (
          err?.message?.includes('Failed to fetch') ||
          err?.context?.includes('AnalyticsSDK')
        ) {
          console.debug('Suppressed non-critical error:', err)
          return new Response(JSON.stringify({ success: false }), {
            status: 0,
          })
        }
        throw err
      })
    }

    // Also suppress unhandled promise rejections from third-party libraries
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes('Failed to fetch') ||
        event.reason?.context?.includes('AnalyticsSDK')
      ) {
        event.preventDefault()
        console.debug('Suppressed non-critical unhandled rejection')
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}
