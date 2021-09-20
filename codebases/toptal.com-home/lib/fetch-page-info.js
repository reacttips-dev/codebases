import {
    pageInfoUri
} from '~/lib/config'
import getPublicPath from '~/lib/get-public-path'
import getDevApiUrl from '~/lib/get-dev-api-url'
import {
    Api
} from '~/lib/dev/api'

const OPTIONS = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
}

const FULLSTORY_SETTINGS_PATH_PARAM = 'fullstory_settings_path'
const SHARE_PATH_PARAM = 'share_path'

let cache = {}

/**
 * Returns page url with corresponding query params.
 * @param {string} url API endpoint providing the data
 * @param {object} params Explicit parameters to send along the request
 * @returns {string}
 */
const buildUrlWithParams = (url, params = {}) => {
    const querySearchParams = new URLSearchParams(params)

    return `${url}?${querySearchParams}`
}

function addSharePathParam(params, sharePathOrUrl) {
    let path = sharePathOrUrl

    if (path.startsWith('http')) {
        path = getPublicPath(sharePathOrUrl)
    }

    path = path.split('#')[0]

    return {
        ...params,
        [SHARE_PATH_PARAM]: path
    }
}

function addFullstorySettingsPathParam(params, fullstorySettingsPath) {
    return {
        ...params,
        [FULLSTORY_SETTINGS_PATH_PARAM]: fullstorySettingsPath
    }
}

/**
 * Returns page view information.
 * @param {object} options Parameters for the requested data
 * @returns {Promise<Object>}
 */
export function fetchPageInfo(options = {}) {
    const url = getDevApiUrl(Api.Info, pageInfoUri)

    let params = addFullstorySettingsPathParam({}, window.location.pathname)

    params = addSharePathParam(
        params,
        options.shareUrl || window.location.pathname
    )

    const urlWithParams = buildUrlWithParams(url, params)

    if (!cache[urlWithParams]) {
        cache[urlWithParams] = window
            .fetch(urlWithParams, OPTIONS)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch page info')
                }
                return response.json()
            })
    }

    return cache[urlWithParams]
}

export function resetPageInfo() {
    cache = {}
}

export default fetchPageInfo