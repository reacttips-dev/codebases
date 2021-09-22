import { useState, useRef, RefObject } from 'react'
import throttle from '../../helpers/throttle'
import useEventListener from '../useEventListener'

function getPosition(element: any) {
  if (!element) {
    return { x: 0, y: 0 }
  }
  const isWindow = element.scrollY != null && element.scrollX != null
  const x = isWindow ? element.scrollX : element.scrollLeft
  const y = isWindow ? element.scrollY : element.scrollTop
  return { x, y }
}

interface Options {
  element?: RefObject<HTMLElement>
  throttle?: number
}

function useScroll(options?: Options): { x: number; y: number } {
  const opts = {
    element: useRef(window),
    throttle: 100,
    ...options,
  }

  const [scroll, setScroll] = useState(getPosition(opts.element.current))

  function throttledSetScroll() {
    return setScroll(getPosition(opts.element.current))
  }
  const throttled = throttle(throttledSetScroll, opts.throttle)

  const handleScroll = useRef(throttled).current

  useEventListener(opts.element, 'scroll', handleScroll, {
    isPassive: true,
    // cleanup: handleCleanup,
    shouldUseLayoutEffect: true,
  })

  return scroll
}

export default useScroll
