import { Reducer } from 'redux'
import arrayToObject from '../../helpers/arrayToObj'
import { FAIL, LOADING, SUCCESS, UPDATE } from './lastSeen.actions'
import { LastSeenState } from './lastSeen.types'

export const initialState: LastSeenState = {
  data: {},
  status: 'initial'
}

// Reducers
const lastSeenReducer: Reducer<LastSeenState> = (
  state = initialState,
  action
): LastSeenState => {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case SUCCESS: {
      return {
        ...state,
        data: arrayToObject(action.payload, 'userId'),
        status: 'loaded'
      }
    }
    case UPDATE: {
      return {
        ...state,
        data: {
          ...state.data,
          ...arrayToObject(action.payload, 'userId')
        },
        status: 'loaded'
      }
    }
    case FAIL: {
      return {
        ...state,
        status: 'error'
      }
    }
    default: {
      return state
    }
  }
}

export default lastSeenReducer
