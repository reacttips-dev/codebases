import { Reducer } from 'redux'
import { LoadingStatus } from '../utils/loadingStatus'

const LOADING = 'featureFlags/loading'
const SUCCESS = 'featureFlags/success'
const FAIL = 'featureFlags/fail'

type Flags = {
  [flag: string]: boolean
}

export type FeatureFlagState = {
  data: Flags
  status: LoadingStatus
}

export const setFeatureFlags = (flags: Flags) => ({
  type: SUCCESS,
  flags
})

export const initialState: FeatureFlagState = {
  data: {},
  status: 'initial' // initial | loading | loaded | error
}

const featureFlagReducer: Reducer<FeatureFlagState> = (state = initialState, action) => {
  switch (action.type) {
    case LOADING: {
      return { ...state, status: 'loading' }
    }

    case SUCCESS: {
      return { ...state, status: 'loaded', data: { ...action.flags } }
    }

    case FAIL: {
      return { ...state, status: 'error', data: { ...action.payload } }
    }

    default: {
      return state
    }
  }
}

export default featureFlagReducer
