import {
    useReducer
} from 'react'

const reducer = (prevState, updatedProperty) => ({
    ...prevState,
    ...updatedProperty
})

/**
 * Similar to React class component setState
 * @param {Object} initialState
 * @return {[Object, Function]} tuple with state and setState function
 * @example
 * const [state, setState] = useSetState({ foo: 1, bar: 2 })
 * setState({ bar: 3 })
 */
export function useSetState(initialState = {}) {
    return useReducer(reducer, initialState)
}