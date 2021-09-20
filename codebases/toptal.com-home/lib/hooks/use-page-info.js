import {
    useState,
    useEffect
} from 'react'

import fetchPageInfo from '~/lib/fetch-page-info'

/**
 * Returns page view information.
 * @param {object} options Parameters for the requested data
 * @returns {Object|undefined}
 */
export function usePageInfo({
    shareUrl
} = {}) {
    const [pageInfo, setPageInfo] = useState()

    useEffect(() => {
        fetchPageInfo({
                shareUrl
            })
            .then(setPageInfo)
            .catch(() => {
                /* noop as the error is already logged by `fetchPageInfo` */
            })
    }, [shareUrl])

    return pageInfo
}

export default usePageInfo