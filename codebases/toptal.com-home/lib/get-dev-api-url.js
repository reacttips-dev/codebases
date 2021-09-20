/**
 * Since this module is used by API mocking middleware, we cannot import directly from '@toptal/frontier'
 * because other utilities exported from there include JSX syntax which needs to be transpiled.
 * We need to later build the frontier entry point so that there's no need in transpiling down.
 */
import {
    isDevelopment
} from '@toptal/frontier/lib/env'

import isStorybook from '~/lib/is-storybook'

/**
 * @param apiPath
 * @param originalUrl
 * @returns {string}
 */
export const getDevApiUrl = (apiPath, originalUrl) => {
    if (!isDevelopment && originalUrl) {
        return originalUrl
    }

    const pathname = `/api/${apiPath}`

    if (isStorybook()) {
        return pathname
    }

    return `http://localhost:3333${pathname}`
}

export default getDevApiUrl