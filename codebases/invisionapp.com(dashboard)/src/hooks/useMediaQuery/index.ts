import { useState } from 'react'
import useEventListener from '../useEventListener'

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)
  const matcher = window.matchMedia(query)
  const handleChange = () => setMatches(matcher.matches)

  useEventListener(matcher, 'change', handleChange)

  return matches
}

export default useMediaQuery
