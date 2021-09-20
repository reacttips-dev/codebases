import {
    useEffect
} from 'react'
import {
    isNil
} from 'lodash'

/**
 * Creates a function for toggling a CSS class
 *
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {function(forceToggle:boolean)}
 */
export const createClassToggle = (element, className) => forceToggle => {
    let methodName = 'toggle'

    if (!isNil(forceToggle)) {
        methodName = forceToggle ? 'add' : 'remove'
    }

    // The second argument of DOMTokenList.toggle()
    // is not supported in IE11 (https://caniuse.com/#feat=classlist)
    element.classList[methodName](className)
}

/**
 * Toggles provided CSS class on document body
 * @param {boolean} toggle
 * @param {string} styleName
 */
export function useToggleBodyClass(toggle, styleName) {
    useEffect(() => {
        const toggleClass = createClassToggle(document.body, styleName)

        toggleClass(toggle)
        return () => toggleClass(false)
    }, [toggle, styleName])
}