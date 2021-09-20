import {
    useState,
    useCallback
} from 'react'

/**
 * Handles boolean value state.
 * @param {boolean} initialState
 */
export function useToggle(initialState) {
    const [value, setValue] = useState(initialState)

    const handleToggle = useCallback(
        newValue => {
            if (typeof newValue === 'boolean') {
                setValue(newValue)
            } else {
                setValue(!value)
            }
        }, [value]
    )

    return [value, handleToggle]
}