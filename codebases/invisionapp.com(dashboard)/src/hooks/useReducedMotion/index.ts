import { useState } from 'react'
import useEventListener from '../useEventListener'

const useReducedMotion = () => {
  const [matches, setMatches] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const matcher = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handleChange = () => setMatches(matcher.matches)

  useEventListener(matcher, 'change', handleChange)

  return matches
}

export default useReducedMotion
