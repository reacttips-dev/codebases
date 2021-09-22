/* global IntersectionObserver */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef } from 'react'

interface State {
  isInView: boolean
  entry?: IntersectionObserverEntry
}

interface UseIntersectionObserverReturn extends State {
  ref: (node?: Element | null) => void
}

const initialState: State = {
  isInView: false,
  entry: undefined,
}

function useIntersectionObserver(
  options?: IntersectionObserverInit
): UseIntersectionObserverReturn {
  const r = useRef<HTMLElement>()
  const observer = useRef<IntersectionObserver>()
  const [state, setState] = useState<State>(initialState)
  const isObserving = useRef<boolean>(false)

  const observe = useCallback(() => {
    if (isObserving.current || !observer.current || !r.current) {
      return
    }
    observer.current.observe(r.current)
    isObserving.current = true
  }, [])

  const unobserve = useCallback(() => {
    if (!isObserving.current || !observer.current || !r.current) {
      return
    }
    observer.current.unobserve(r.current)
    isObserving.current = false
  }, [])

  const ref = useCallback(
    node => {
      if (r.current) {
        unobserve()
      }

      if (node) {
        observer.current = new IntersectionObserver(([entry]) => {
          setState({
            isInView: entry.isIntersecting,
            entry,
          })
        }, options)
      }

      r.current = node
      observe()

      return () => {
        unobserve()
      }
    },
    [observe, unobserve]
  )

  return {
    ref,
    ...state,
  }
}

export default useIntersectionObserver
