import {
    useCallback,
    useState
} from 'react'
import {
    identity
} from 'lodash'

import {
    FetchStatus
} from '~/lib/fetch-status'
import fetchJSON from '~/lib/fetch-json'

const initialState = {
    status: FetchStatus.INITIAL,
    error: false,
    data: {}
}

/**
 *
 * @param url {string} - request URL
 * @param options {{transformData: ((function(object): object))}} - response data transform function
 * @returns {{reset: ((function(): void)), state: {data: Object, error: string, status: string}, fetchJSON: ((function(object): Promise<Object>)|*)}}
 */
export const useFetchJSON = (url, options = {}) => {
    const [state, setState] = useState(initialState)

    const updateState = useCallback(newState => {
        setState(state => ({
            ...state,
            ...newState
        }))
    }, [])

    const reset = useCallback(() => {
        updateState(initialState)
    }, [updateState])

    const perform = useCallback(
        async settings => {
            const {
                params,
                transformData = identity,
                ...config
            } = options

            updateState({
                error: false,
                status: FetchStatus.LOADING
            })

            try {
                const response = await fetchJSON(url, params, {
                    ...config,
                    ...settings
                })

                const data = transformData(response)

                updateState({
                    status: FetchStatus.SUCCESS,
                    data
                })

                return data
            } catch (error) {
                if (error ? .name !== 'AbortError') {
                    updateState({
                        error,
                        status: FetchStatus.ERROR
                    })
                }
            }
        }, [url, options, updateState]
    )

    return {
        state,
        fetchJSON: perform,
        reset
    }
}