import {
    mapKeys
} from 'lodash'

import getVariants from '~/lib/get-variants'

export const Breakpoint = {
    Mobile: 'mobile',
    Tablet: 'tablet',
    Desktop: 'desktop',
    Large: 'large'
}

export const defaultGutter = {
    large: 4,
    desktop: 3,
    tablet: 3,
    mobile: 2
}

export const gridSize = 12

export const getBreakpointVariants = (styles, values, namespace = '') => {
    const variants = getVariants(values, getBreakpointsClasses(namespace), false)

    return mapKeys(variants, (_, key) => styles[key])
}

export const getBreakpointsClasses = (prefix = '') =>
    Object.values(Breakpoint).map(breakpoint => [prefix, breakpoint].filter(item => item).join('-'))