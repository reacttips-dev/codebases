import { useState } from 'react'
import * as conditioner from 'conditioner-core/conditioner-core.min'

import { breakpoints } from '../theme'

const useBreakpoint = index => {
  const [matches, setMatches] = useState(false)
  const monitor = conditioner.monitor(
    `@media (min-width: ${breakpoints[index]})`
  )
  monitor.onchange = change => {
    if (change !== matches) setMatches(change)
  }

  monitor.start()

  return matches
}

export default useBreakpoint
