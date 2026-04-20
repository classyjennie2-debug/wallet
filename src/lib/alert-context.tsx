'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type AlertType = 'error' | 'success' | 'warning' | 'info'

export interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  duration?: number
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id'>) => void
  removeAlert: (id: string) => void
  clearAlerts: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`
    const newAlert = { ...alert, id }

    setAlerts((prev) => [...prev, newAlert])

    // Auto-remove after duration
    if (alert.duration !== 0) {
      const duration = alert.duration || 5000
      setTimeout(() => {
        removeAlert(id)
      }, duration)
    }
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
      <AlertContainer />
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider')
  }
  return context
}

const AlertContainer = () => {
  const { alerts, removeAlert } = useAlert()

  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'error':
        return '❌'
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
    }
  }

  const getColors = (type: AlertType) => {
    switch (type) {
      case 'error':
        return 'bg-red-900/20 border-red-600/30 text-red-400'
      case 'success':
        return 'bg-green-900/20 border-green-600/30 text-green-400'
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-600/30 text-yellow-400'
      case 'info':
        return 'bg-blue-900/20 border-blue-600/30 text-blue-400'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border backdrop-blur-sm animate-in slide-in-from-bottom-4 ${getColors(alert.type)}`}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{getIcon(alert.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{alert.title}</p>
              <p className="text-sm opacity-90">{alert.message}</p>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
