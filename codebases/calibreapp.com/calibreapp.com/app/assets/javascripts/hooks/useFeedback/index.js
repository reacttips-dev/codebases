import { useContext, useCallback } from 'react'
import { FeedbackContext } from '../../providers/FeedbackProvider'

const useFeedback = () => {
  const { feedback, setFeedback } = useContext(FeedbackContext)

  return {
    feedback,
    setFeedback,
    clearFeedback: useCallback(() => setFeedback({}), [])
  }
}

export default useFeedback
