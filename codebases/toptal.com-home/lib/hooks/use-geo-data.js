import {
    useState,
    useEffect
} from 'react'

import FetchJSONWithCache from '~/lib/fetch-json-cache'

import {
    FetchStatus
} from '../fetch-status'

let cachedGeoData

/**
 * GeoData
 * @typedef {Object} GeoData
 * @property {boolean} white_listed - is user in white listed country
 * @property {boolean} black_listed - is user in black listed country
 * @property {string} country - user's country
 */

/**
 * Fetches info about user location and white_listed, black_listed
 * Does so only once per client-side session, via the FetchJSONWithCache.
 *
 * @param {string} url geo target url to check users location
 * @return {[GeoData, string]}
 */
export function useGeoData(url) {
    const [geoData, setGeoData] = useState(null)
    const [fetchStatus, setFetchStatus] = useState(FetchStatus.INITIAL)

    useEffect(() => {
        if (!cachedGeoData) {
            cachedGeoData = new FetchJSONWithCache()
            cachedGeoData.fetch(url)
        }

        cachedGeoData.subscribe((geoData, fetchStatus) => {
            if (fetchStatus === FetchStatus.SUCCESS) {
                setGeoData(geoData)
            }
            setFetchStatus(fetchStatus)
        })
    }, [url])

    return [geoData, fetchStatus]
}