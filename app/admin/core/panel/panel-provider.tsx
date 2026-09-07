import type React from 'react'
import { createContext, useContext, useState } from 'react'
import { type PanelConfig, defaultPanel } from './panel'

interface PanelContextValue {
  panel: PanelConfig
  setPanel: (panel: PanelConfig) => void
  isFeatureEnabled: (feature: keyof PanelConfig['features']) => boolean
}

const PanelContext = createContext<PanelContextValue | null>(null)

export function PanelProvider({
  panel: initialPanel = defaultPanel,
  children,
}: {
  panel?: PanelConfig
  children: React.ReactNode
}) {
  const [panel, setPanel] = useState<PanelConfig>(initialPanel)

  const isFeatureEnabled = (
    feature: keyof PanelConfig['features'],
  ): boolean => {
    return !!panel.features[feature]
  }

  return (
    <PanelContext.Provider value={{ panel, setPanel, isFeatureEnabled }}>
      {children}
    </PanelContext.Provider>
  )
}

export function usePanel(): PanelContextValue {
  const context = useContext(PanelContext)
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider')
  }
  return context
}
