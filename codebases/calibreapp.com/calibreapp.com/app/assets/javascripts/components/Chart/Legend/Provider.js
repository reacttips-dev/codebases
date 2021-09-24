import React, { useState, useEffect } from 'react'

import LegendContext from './Context'

const LegendProvider = ({ children, initialState }) => {
  const [profiles, setProfiles] = useState(initialState)
  const value = { profiles, setProfiles }

  useEffect(() => {
    setProfiles(initialState)
  }, [initialState])

  return (
    <LegendContext.Provider value={value}>{children}</LegendContext.Provider>
  )
}

export default LegendProvider
