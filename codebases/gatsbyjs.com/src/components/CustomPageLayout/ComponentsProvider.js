import React from "react"

export const ComponentsContext = React.createContext()

export function ComponentsProvider({ children, value }) {
  const components = React.useMemo(() => value, [value])

  return (
    <ComponentsContext.Provider value={components}>
      {children}
    </ComponentsContext.Provider>
  )
}
