import {
    useState,
    useEffect
} from 'react'

/**
 * Returns parsed query parameter value
 * @param {string} key
 * @param {T} defaultValue
 * @returns {T}
 */
export function useQueryParam(key, defaultValue) {
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        const newValue = new URLSearchParams(location.search).get(key)
        if (newValue) {
            setValue(newValue)
        }
    }, [key])

    return value
}