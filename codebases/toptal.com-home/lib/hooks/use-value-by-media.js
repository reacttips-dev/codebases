import {
    useState,
    useEffect,
    useCallback,
    useRef
} from 'react'
import {
    debounce,
    pickBy,
    mapKeys,
    last
} from 'lodash'

import {
    MediaQuery
} from '~/lib/query-range'

import {
    useIsMounted
} from './use-is-mounted'

const queryMap = {
    forTablet: MediaQuery.Tablet,
    forDesktop: MediaQuery.Desktop,
    forDesktopLarge: MediaQuery.DesktopLarge
}

export const parseQueries = queries =>
    mapKeys(
        pickBy(queries, (_, query) => query !== 'default'),
        (_, key) => queryMap[key] || key
    )

/*
  For example this will return:
  const n = useValueByMedia({
    default: 0,
    forTablet: 1,
    forDesktop: 2
  })
  - 0 if nothing matches
  - 1 if forTablet matches
  - 2 if either forDesktop or both forDesktop and forTablet matches - forDesktop
     overrides forTablet and there is no need to do `(min-width: ${Breakpoints.TABLET})
     and (max-width: calc(${Breakpoints.DESKTOP} - 1px))`
  
  * RATIONALE *
  We want these queries to behave similarly to CSS, where we usually start with mobile
  and gradually specialize CSS props as the screen grows
*/

/**
 * @description Picks a value depending on the current viewport size while providing a fallback
 * @param {object} sourceValuesByQuery A hash mapping values to media queries
 * @param {*} sourceValuesByQuery.default Value to be used if none of the queries match. Overrides `fallbackValue` when DOM is ready
 * @param {*} fallbackValue Value to be used for SSR and if `default` is missing. Defaults to the value set via `default`
 * @returns the value for the last matching query or default/fallbackValue if nothing matches
 */

export function useValueByMedia(
    sourceValuesByQuery,
    fallbackValue = sourceValuesByQuery.default
) {
    const isMounted = useIsMounted()
    const valuesByQuery = parseQueries(sourceValuesByQuery)
    const queries = Object.keys(valuesByQuery)
    const defaultValue = sourceValuesByQuery.hasOwnProperty('default') ?
        sourceValuesByQuery.default :
        fallbackValue
    const firstUpdate = useRef(true)
    const matchedMedia = useRef(
        Object.fromEntries(queries.map(query => [query, false]))
    )

    const [value, setValue] = useState(fallbackValue)

    const updateValue = useCallback(
        debounce(newValue => {
            if (!isMounted.current) {
                return
            }
            setValue(newValue)
        }, 50), []
    )

    const handleMediaChange = useCallback(
        (query, mediaQueryList) => {
            matchedMedia.current[query] = mediaQueryList.matches

            const matchedValues = [defaultValue].concat(
                queries
                .filter(query => matchedMedia.current[query])
                .map(query => valuesByQuery[query])
            )

            updateValue(last(matchedValues))
        }, [defaultValue, queries, updateValue, valuesByQuery]
    )

    useEffect(() => {
        const cleanupFunctions = []

        queries.forEach(mediaQuery => {
            const mediaQueryList = window.matchMedia(mediaQuery)

            const changeListener = () => handleMediaChange(mediaQuery, mediaQueryList)
            mediaQueryList.addListener(changeListener)

            if (firstUpdate.current) {
                changeListener()
            }

            cleanupFunctions.push(() => mediaQueryList.removeListener(changeListener))
        })

        if (firstUpdate.current && !queries.length) {
            updateValue(defaultValue)
        }

        firstUpdate.current = false

        return () => {
            cleanupFunctions.forEach(fn => fn())
        }
    }, [handleMediaChange, queries, defaultValue, updateValue])

    return value
}