import { RefObject, useRef, useEffect } from 'react'

const mousedownEvents = ['mousedown', 'touchstart']
const clickEvents = ['click', 'touchstart']

export const hasClickedOnScrollbar = ({
  clientX,
  clientY,
}: MouseEvent): boolean => {
  const {
    documentElement: { clientWidth, clientHeight },
  } = document
  return clientWidth <= clientX || clientHeight <= clientY
}

type ReactRef = RefObject<HTMLElement>
interface Callback<T extends Event = Event> {
  (event: T): void
}

export interface Options {
  element: ReactRef | ReactRef[]
  allowClickOnScrollbar?: boolean
  shouldDisableEventBubbling?: boolean
  isDisabled?: boolean
  eventType?: 'mousedown' | 'click'
  callback: Callback
}

function useOnClickOutside({
  element,
  allowClickOnScrollbar = true,
  shouldDisableEventBubbling = false,
  isDisabled,
  eventType = 'mousedown',
  callback,
}: Options): void {
  const cb = useRef<Callback>(callback)

  useEffect(() => {
    cb.current = callback
  }, [callback])

  useEffect(() => {
    const events = eventType === 'mousedown' ? mousedownEvents : clickEvents
    const handleEvent = (e: any): void => {
      const refs = Array.isArray(element) ? element : [element]
      const nodes: HTMLElement[] = []
      refs.forEach(r => {
        if (r.current) {
          nodes.push(r.current)
        }
      })

      if (!allowClickOnScrollbar && hasClickedOnScrollbar(e)) {
        return
      }

      if (!nodes.length || !nodes.every(el => !el.contains(e.target))) {
        return
      }

      if (shouldDisableEventBubbling) {
        e.preventDefault()
        e.stopPropagation()
      }
      cb.current(e)
    }

    const removeEventListener = (): void => {
      events.forEach(event => {
        document.removeEventListener(event, handleEvent, false)
      })
    }

    if (isDisabled) {
      removeEventListener()
      return
    }

    events.forEach(event => {
      document.addEventListener(event, handleEvent, false)
    })

    return () => removeEventListener()
  }, [
    element,
    allowClickOnScrollbar,
    isDisabled,
    shouldDisableEventBubbling,
    eventType,
  ])
}

export default useOnClickOutside
