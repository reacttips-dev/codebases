import {
    Breakpoints
} from '~/lib/constants'

export const MediaQuery = {
    Tablet: queryRange(Breakpoints.TABLET),
    Desktop: queryRange(Breakpoints.DESKTOP),
    DesktopLarge: queryRange(Breakpoints.DESKTOP_LARGE),
    BelowTablet: queryRange(null, Breakpoints.TABLET),
    BelowDesktop: queryRange(null, Breakpoints.DESKTOP)
}

/**
 * @description A helper to create viewport width related media queries
 * @example queryRange(320px) // '(min-width: 320px)'
 * @example queryRange(null, 800px) // '(max-width: 799px)'
 * @example queryRange(320px, 800px) // '(min-width: 320px) and (max-width: 799px)'
 * @param {string} from minimal viewport width in pixels
 * @param {string} to maximal viewport width in pixels
 * @returns Returns a string defining a media query
 */
function queryRange(from, to) {
    const range = []

    if (from) {
        const boundary = `(min-width: ${from})`

        if (!to) {
            return boundary
        }

        range.push(boundary)
    }

    if (to) {
        const boundary = `(max-width: ${Number.parseInt(to, 10) - 1}px)`

        if (!from) {
            return boundary
        }

        range.push(boundary)
    }

    return range.join(' and ')
}

export default queryRange