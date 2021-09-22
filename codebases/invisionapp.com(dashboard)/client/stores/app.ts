import { Reducer, Dispatch } from 'redux'
import { batch } from 'react-redux'
import bffRequest, { BFFResponse, BFFResponseError } from '../utils/bffRequest'
import { fetchTeam } from './team'
import { fetchUser } from './user'
import { fetchPermissions } from './permissions'
import * as restrictions from './restrictions'
import { fetchBillingInfo } from './billing'
import { setFeatureFlags } from './featureFlags'
import { fetchRoles, setAllRoles } from './roles'
import { AppState } from './index'

export type GetState = () => AppState

export type AppStoreState = {
  loadStatus: { type: 'initial' } | { type: 'loaded' } | { type: 'error'; error: string }
  lockBodyScroll: boolean
}

export const APP_LOAD_ERROR = 'APP_LOAD_ERROR'
export const APP_LOADED = 'APP_LOADED'
export const LOCK_BODY_SCROLL = 'LOCK_BODY_SCROLL'

export const appLoadError = (error: BFFResponseError) => ({
  type: APP_LOAD_ERROR,
  payload: error
})

export const appLoaded = () => ({
  type: APP_LOADED
})

export const lockBodyScroll = () => ({
  type: LOCK_BODY_SCROLL,
  lockBodyScroll: true
})

export const unlockBodyScroll = () => ({
  type: LOCK_BODY_SCROLL,
  lockBodyScroll: false
})

export const load = (dispatch: Dispatch) => {
  /*
  NOTE: becuase of permission of viewing this information, it's probably
  best to load it separately for now.
  */
  dispatch(fetchBillingInfo())

  return bffRequest
    .get('/teams/api/app')
    .then((response: BFFResponse) => {
      batch(() => {
        dispatch(fetchUser.success(response.data.user))
        dispatch(fetchTeam.success(response.data.team))
        dispatch(fetchPermissions.success(response.data.permissions))
        dispatch(restrictions.load(response.data.restrictions))
        dispatch(setFeatureFlags(response.data.featureFlags))
        dispatch(fetchRoles.success(response.data.roles))
        dispatch(setAllRoles(response.data.allRoles))

        dispatch(appLoaded())
      })

      // InVision user metrics
      if (window.rum) {
        window.rum.markTime('spaDataFullyLoaded', { featureName: 'team-management-web' })
      }

      return response
    })
    .catch((error: BFFResponseError) => {
      dispatch(appLoadError(error))

      // InVision user metrics
      /* eslint-disable-next-line */
      window.rum &&
        window.rum.markTime('spaDataFullyLoaded', { featureName: 'team-management-web' })

      return Promise.reject(error)
    })
}

export const selectLoadStatus = (state: AppState) => state.app.loadStatus
export const selectLockedBodyScroll = (state: AppState) => state.app.lockBodyScroll

const initialState: AppStoreState = {
  loadStatus: { type: 'initial' },
  lockBodyScroll: false
}

export const appReducer: Reducer<AppStoreState> = (state = initialState, action) => {
  switch (action.type) {
    case APP_LOAD_ERROR: {
      return {
        ...state,
        loadStatus: {
          type: 'error',
          error: action.payload
        }
      }
    }

    case APP_LOADED: {
      return {
        ...state,
        loadStatus: {
          type: 'loaded'
        }
      }
    }

    case LOCK_BODY_SCROLL: {
      return {
        ...state,
        lockBodyScroll: !!action.lockBodyScroll
      }
    }

    default: {
      return state
    }
  }
}

export default {
  load,
  appLoadError,
  selectLoadStatus,
  selectLockedBodyScroll
}
