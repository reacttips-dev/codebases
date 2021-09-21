import React from "react"

export const EditorHelperContext = React.createContext({})

export const EditorHelperProvider = ({ children }) => {
  const [isActive, setIsActive] = React.useState(false)

  return (
    <EditorHelperContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </EditorHelperContext.Provider>
  )
}

export default EditorHelperProvider
