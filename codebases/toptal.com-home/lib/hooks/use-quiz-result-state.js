import {
    useState,
    useEffect
} from 'react'

import {
    FetchStatus
} from '../fetch-status'
import {
    memoizedFetch
} from '../fetch-json-cache'

/**
 * Fetches quiz results from quiz endpoint.
 * Does so only once per client-side session and per url, via the FetchJSONWithCache.
 *
 * @param {string} host quiz auth endpoint
 * @param {boolean} fetchData whether or not to perform a request
 * @return {[boolean, string]}
 */
export function useQuizResultState(host, fetchData) {
    const [url, setUrl] = useState('')
    const [result, setResult] = useState(false)
    const [fetchStatus, setFetchStatus] = useState(FetchStatus.INITIAL)

    // used to get the query string & construct the correct remote server url endpoint
    useEffect(() => {
        if (!fetchData) {
            return
        }

        const urlParams = new URLSearchParams(window.location.search)
        const answerKey = urlParams.get('qid')
        setUrl(
            `https://${host}/export/quiz-report-json?answers_list_key=${answerKey}`
        )
    }, [host, fetchData])

    // used to fetch from the remote quiz server
    useEffect(() => {
        if (!url) {
            return
        }
        const cachedQuizResultState = memoizedFetch(url)
        setFetchStatus(FetchStatus.LOADING)

        cachedQuizResultState.subscribe((result, fetchStatus) => {
            setFetchStatus(fetchStatus)
            if (fetchStatus === FetchStatus.SUCCESS) {
                setResult(result)
            }
        })
    }, [url])

    return [result, fetchStatus]
}