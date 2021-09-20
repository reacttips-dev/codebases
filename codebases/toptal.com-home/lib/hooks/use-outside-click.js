import {
    useCallback,
    useEffect,
    useRef
} from 'react'

/**
 * Triggers a callback when clicking outside of "ref" and inside of "parentRef"
 * @param {object} parentRef React reference to a parent node which holds main element
 * @param {function} callback callback to trigger
 */
export function useOutsideClick(callback, parentRef) {
    const ref = useRef(null)

    const handleMouseDown = useCallback(
        e => {
            if (ref.current ? .contains(e.target)) {
                return
            }
            callback && callback()
        }, [callback, ref]
    )

    useEffect(() => {
        const parentElem = parentRef ? .current || document.body
        parentElem.addEventListener('mousedown', handleMouseDown)
        return () => parentElem.removeEventListener('mousedown', handleMouseDown)
    }, [handleMouseDown, parentRef])

    return ref
}