import {
    useState,
    useEffect,
    useCallback
} from 'react'
import {
    throttle
} from 'lodash'

const DEFAULT_THROTTLE_INTERVAL = 300

/**
 * @callback ProbeFunction
 * @param {object} controlNode
 * @param {object} targetNode
 * @param {number} activationOffset
 *
 * @returns {boolean}
 */
export function defaultProbeFn(controlNode, targetNode, activationOffset) {
    return (
        window.pageYOffset >
        (controlNode || targetNode) ? .offsetTop - activationOffset
    )
}

/**
 *
 * @param {Object} targetRef Reference to the element that is being assessed
 * @param {Object} options Fine-tuning the setup
 * @param {number} options.activationOffset Offset relative to target node's top edge at which the state is triggered
 * @param {number} options.throttleInterval Invoke probe function once per this interval
 * @param {Object} options.controlRef Reference to the element target node's state is assessed against
 * @param {ProbeFunction} options.probeFn Function implementing the assessment logic
 *
 * @returns {boolean} Whether or not the element should be sticky
 */
export function useSticky(targetRef, options) {
    const {
        activationOffset = 0,
            throttleInterval = DEFAULT_THROTTLE_INTERVAL,
            controlRef = null,
            probeFn = defaultProbeFn
    } = options || {}

    const [isSticky, setIsSticky] = useState(false)

    const handleScroll = useCallback(
        throttle(() => {
            const shouldStick = probeFn(
                controlRef ? .current,
                targetRef ? .current,
                activationOffset
            )
            setIsSticky(shouldStick)
        }, throttleInterval), [targetRef, controlRef, activationOffset, probeFn]
    )

    useEffect(() => {
        handleScroll()
        const controlNode = controlRef ? .current ? ? window
        controlNode.addEventListener('scroll', handleScroll)
        return () => controlNode.removeEventListener('scroll', handleScroll)
    }, [handleScroll, controlRef])

    return isSticky
}