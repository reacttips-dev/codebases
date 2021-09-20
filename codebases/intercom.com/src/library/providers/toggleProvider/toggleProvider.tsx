import React, { createContext, useState, useContext } from 'react'
import { IContextProps, modes, IProps, IModeOptions } from './index'

const ToggleContext = createContext<IContextProps | null>(null)

const defaultMode = 'customer'

export const ToggleProvider: React.FC<IProps> = ({ children, initialMode }) => {
  const [currentMode, setCurrentMode] = useState(modes[initialMode || defaultMode])

  const setMode = (mode: IModeOptions) => {
    setCurrentMode(modes[mode])
  }

  return (
    <ToggleContext.Provider value={{ mode: currentMode, setMode }}>
      {children}
    </ToggleContext.Provider>
  )
}

export const useModeToggle = (): IContextProps => {
  const result = useContext(ToggleContext)

  if (!result) {
    throw new Error('useModeToggle should be use wihtin at ToggleProvider')
  }
  return result
}
