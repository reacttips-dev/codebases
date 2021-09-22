import { useState } from 'react'
import useEventListener from '../useEventListener'

const getSize = () => {
  const { innerHeight, innerWidth, outerHeight, outerWidth } = window

  return { innerHeight, innerWidth, outerHeight, outerWidth }
}

function useWindowSize(): {
  innerHeight: number
  innerWidth: number
  outerHeight: number
  outerWidth: number
} {
  const [windowSize, setWindowSize] = useState(getSize())

  function handleResize() {
    setWindowSize(getSize())
  }

  useEventListener(window, 'resize', handleResize, {
    isPassive: true,
    shouldUseLayoutEffect: true,
  })

  return windowSize
}

export default useWindowSize
