import { Reducer } from 'redux'
import { createSelector } from 'reselect'
import { generateConsts } from './utils/generators'
import { AppState } from './index'

export type PermissionsState = Partial<{ [permission: string]: any }> & {
  isLoading: boolean
}

export type Permissions = Record<string, boolean>

type Access = {
  [name: string]: {
    allow: boolean
    force: boolean
    reason?: string
  }
}

type RawPermissions = {
  [name: string]: {
    allow: boolean
    force: boolean
    reason?: string
  }
}

type Restrictions = any[]

type PermissionsFromServer = {
  access: Access
  permissions: RawPermissions
  restrictions: Restrictions
}

// Action Constants
export const FETCH = generateConsts('teams/permissions/FETCH')

// Actions
export const fetchPermissions = {
  request: () => ({ type: FETCH.REQUEST }),
  success: (payload: PermissionsFromServer) => ({
    type: FETCH.SUCCESS,
    payload
  }),
  failure: (message: string) => ({
    type: FETCH.FAILURE,
    payload: { message }
  })
}

// State
const initialState: PermissionsState = {
  isLoading: true

  // TODO: Use to test billing type stuff until permission gets into teams-api
  // 'People.ChangeSeatType': true
}

const formatPermissions = (permissions: RawPermissions) => {
  return Object.entries(permissions).reduce((output, [key, value]) => {
    return { ...output, [key]: value.allow }
  }, {})
}

// Reducers
const permissionsReducer: Reducer<PermissionsState> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH.REQUEST: {
      return {
        ...state,
        isLoading: true
      }
    }

    case FETCH.FAILURE: {
      return {
        ...state,
        isLoading: false
      }
    }

    case FETCH.SUCCESS: {
      // Access is permissions + restrictions
      const access = formatPermissions(action.payload.access)
      // Regular permissions without restrictions
      const permissions = formatPermissions(action.payload.permissions)

      const newState = {
        ...state,
        rawPermissions: action.payload,
        access,
        ...permissions,
        isLoading: false
      }

      return newState
    }

    default: {
      return state
    }
  }
}

export default permissionsReducer

// Selectors
export const selectPermissions = (state: AppState) => state.permissions
export const selectPermission = (state: AppState, permission?: string) =>
  // @ts-ignore
  permission && (selectPermissions(state) || {})[permission]

export const selectorPermission = (permission = '') =>
  // @ts-ignore
  createSelector(selectPermissions, permissions => permissions[permission])
