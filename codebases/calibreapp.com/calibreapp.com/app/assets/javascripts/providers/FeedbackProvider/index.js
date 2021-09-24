import React, { createContext, useCallback, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// The feedback object should have the following properties:
// type: One of: success, error, warning, info
// location: One of: billing
// message: String

export const FeedbackContext = createContext({
  feedback: {},
  setFeedback: () => {} //eslint-disable-line @typescript-eslint/no-empty-function
})

const FeedbackProvder = ({ initialFeedback, children }) => {
  const location = useLocation()
  const [changes, setChanges] = useState(0)
  const [feedback, setFeedback] = useState(initialFeedback)

  useEffect(() => {
    if (feedback.type) {
      if (changes > 1) {
        setFeedback({})
      } else {
        setChanges(changes + 1)
      }
    } else {
      setChanges(0)
    }
  }, [location])

  useEffect(() => {
    setChanges(0)
  }, [feedback])

  const contextValue = {
    feedback,
    setFeedback: useCallback(feedback => setFeedback(feedback), [])
  }

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  )
}

FeedbackProvder.defaultProps = {
  initialFeedback: {}
}

export default FeedbackProvder
