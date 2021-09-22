import cloneDeep from 'lodash/cloneDeep'

import { getItem, setItem } from './cache'

export const cachedInitialState = (name = '', initialState, cachedKeys = {}) => () => {
  let state = cloneDeep(initialState)

  if (Object.keys(cachedKeys).length > 0) {
    for (let key in cachedKeys) {
      state[key] = getItem(`home.${name}.${key}`, cachedKeys[key])
    }
  }

  return state
}

// createReducer removes some of the boilerplate in each reducer by unifying existing state
const createReducer = (initialState, actionHandlers, name = '', cachedKeys = []) => (state = null, action) => {
  if (!state) {
    state = typeof initialState === 'function' ? initialState() : initialState
  }

  // if we have an action, execute it against our state and data
  const reduceFn = actionHandlers[action.type]

  if (!actionHandlers[action.type]) {
    return state
  }

  const newState = reduceFn(state, action.data)

  // if no changes, == null will check for both undefined or null
  if (newState == null) {
    return state
  }

  if (cachedKeys.length > 0) {
    cachedKeys.forEach(k => {
      if (k in newState) {
        setItem(`home.${name}.${k}`, newState[k])
      }
    })
  }

  // and merge them together for a new state
  return {
    ...state,
    ...newState
  }
}

export default createReducer
