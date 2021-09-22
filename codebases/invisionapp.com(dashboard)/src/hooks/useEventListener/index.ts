import { useEffect, useLayoutEffect } from 'react'
import supportsPassive from '../../helpers/supportsPassive'

interface Handler<T extends Event = Event> {
  (event: T): void
}

interface Options {
  isPassive?: boolean
  cleanup?: () => any
  shouldUseLayoutEffect?: boolean
}

function useEventListener(
  target: any,
  type: string,
  handler: Handler,
  options: Options = {
    isPassive: false,
    shouldUseLayoutEffect: false,
  }
) {
  const { isPassive, cleanup, shouldUseLayoutEffect } = options
  const effect = shouldUseLayoutEffect ? useLayoutEffect : useEffect
  effect(() => {
    const isRef = target.current
    const currentTarget = isRef ? target.current : target
    currentTarget.addEventListener(
      type,
      handler,
      supportsPassive() && isPassive ? { passive: true } : false
    )
    return () => {
      if (cleanup) {
        cleanup()
      }
      currentTarget.removeEventListener(type, handler)
    }
  }, [target, type, handler, isPassive, cleanup])
}

export default useEventListener
