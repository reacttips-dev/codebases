import {
    useState,
    useEffect,
    useCallback,
    useRef
} from 'react'
import {
    debounce
} from 'lodash'

const DEFAULT_EVENTS = [
    'click',
    'keypress',
    'keydown',
    'load',
    'mousemove',
    'scroll',
    'touchmove',
    'touchstart'
]

const DEBOUNCE_PROLONG = 300

export function useIdle(ms, events = DEFAULT_EVENTS) {
    const [idle, setIdle] = useState(false)
    const timeout = useRef(null)

    useEffect(() => {
        timeout.current = setTimeout(() => setIdle(true), ms)
        return () => clearTimeout(timeout.current)
    }, [ms, timeout])

    const handleProlong = useCallback(
        debounce(() => {
            setIdle(false)
            clearTimeout(timeout.current)
            timeout.current = setTimeout(() => setIdle(true), ms)
        }, DEBOUNCE_PROLONG), [setIdle, timeout]
    )

    useEffect(() => {
        events.forEach(eventName => {
            document.addEventListener(eventName, handleProlong)
        })

        return () =>
            events.forEach(eventName => {
                document.removeEventListener(eventName, handleProlong)
            })
    }, [events, handleProlong])

    return [idle]
}