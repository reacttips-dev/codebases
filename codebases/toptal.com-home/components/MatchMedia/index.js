import {
    memo,
    useEffect,
    useState,
    useCallback
} from 'react'
import PropTypes from 'prop-types'
import {
    isNil,
    isEmpty
} from 'lodash'

/**
 * Component to use window.matchMedia in a React way
 * See examples in stories of this component
 */
const MatchMedia = ({
    query,
    callback,
    children,
    defaultMatch,
    queries
}) => {
    const [mediaQueryList, setMediaQueryList] = useState(
        isNil(defaultMatch) ? null : {
            matches: defaultMatch
        }
    )

    const customCallback = useCallback(
        mediaQL => {
            setMediaQueryList(mediaQL)
            callback && callback(mediaQL)
        }, [callback]
    )

    const updateMultipleQueries = queriesObj => {
        if (!isEmpty(queriesObj)) {
            const result = {
                matches: {}
            }
            for (const key in queriesObj) {
                result.matches[key] = queriesObj[key].matches
            }
            customCallback(result)
        }
    }

    useEffect(() => {
        if (!query && !queries) {
            return
        }
        if (query) {
            if (queries) {
                // eslint-disable-next-line no-console, max-len
                console.warn(
                    'MatchMedia is being called with single and multiple queries at the same time. You should use either one or the other.'
                )
            }
            const mediaQL = window.matchMedia(query)
            customCallback(mediaQL)
            mediaQL.addListener(customCallback)
            return () => mediaQL.removeListener(customCallback)
        } else {
            const obj = {}
            const cleanupFunctions = []

            for (const key in queries) {
                const mediaQL = window.matchMedia(queries[key])
                obj[key] = mediaQL
            }

            // We need the whole object to be passed to the update method
            updateMultipleQueries(obj)
            for (const key in obj) {
                const mediaQL = obj[key]
                const fn = () => updateMultipleQueries(obj)
                mediaQL.addListener(fn)
                cleanupFunctions.push(() => mediaQL.removeListener(fn))
            }

            return () => {
                cleanupFunctions.forEach(fn => fn())
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customCallback, queries, query])

    if (!mediaQueryList) {
        return null
    }

    if (queries && !(children instanceof Function)) {
        // eslint-disable-next-line no-console, max-len
        console.error(
            'MatchMedia is being called with multiple queries but children is not a function. Consider using single query or setting children as a function to render components conditionally.'
        )
        return null
    }

    if (children instanceof Function) {
        return children(mediaQueryList)
    }

    return mediaQueryList.matches && children ? children : null
}

MatchMedia.propTypes = {
    query: PropTypes.string,
    queries: PropTypes.object,
    callback: PropTypes.func,
    defaultMatch: PropTypes.bool
}

export default memo(MatchMedia)