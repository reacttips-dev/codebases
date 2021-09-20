import {
    useEffect,
    useRef
} from 'react'

/**
 * React hook for adding a particular event listener to an element
 * @param {string} eventName The event name.
 * @param {Function} handler A function that will be called whenever "eventName" fires on "element".
 * @param {Object} element An optional element to listen on.
 *
 * @return nothing
 *
 * @ref: https://github.com/donavon/use-event-listener/blob/develop/src/index.js
 */

export function useEventListener(eventName, handler, element = global) {
    // Create a ref that stores handler
    const savedHandler = useRef()

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(
        () => {
            // Make sure element supports addEventListener
            const isSupported = element && element.addEventListener
            if (!isSupported) {
                return
            }

            // Create event listener that calls handler function stored in ref
            const eventListener = event => savedHandler.current(event)

            element.addEventListener(eventName, eventListener)

            return () => {
                element.removeEventListener(eventName, eventListener)
            }
        }, [eventName, element] // Re-run if eventName or element changes
    )
}