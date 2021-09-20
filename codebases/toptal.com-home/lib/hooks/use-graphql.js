import {
    useMemo
} from 'react'

import {
    useFetchJSON
} from './use-fetch-json'

/**
 * GraphQL query function
 *
 * @callback Query
 * @param {Object} - Query variables

 * @returns {string} - Stringified query
 */

/**
 * Hook state
 *
 * @typedef {Object} HookState
 * @property {Function} request - A method for manually fetching data
 * @property {Function} reset - A method for resetting state
 * @property {string} status - Request status
 * @property {string|boolean} error - Error message
 * @property {Object} data - Response data
 */

/**
 * Misc. request options
 *
 * @typedef {Object} RequestOptions
 * @property {function(Object): Object} transformData - Response transformation function
 */

/**
 * A hook for performing GraphQL requests
 *
 * @function
 * @param {string} graphqlUrl - GraphQL endpoint URL
 * @param {Query} query - GraphQL query function
 * @param {Object} variables - Query variables
 * @param {RequestOptions} options - Misc. request options
 * @returns {HookState} - Hook state
 */
export const useGraphQL = (graphqlUrl, query, variables, options = {}) => {
    const {
        transformData
    } = options

    const config = useMemo(
        () => ({
            method: 'POST',
            body: query(variables),
            transformData
        }), [query, variables, transformData]
    )

    const {
        state,
        fetchJSON,
        reset
    } = useFetchJSON(graphqlUrl, config)
    const {
        data,
        status,
        error
    } = state

    return {
        request: fetchJSON,
        reset,
        data,
        status,
        error
    }
}