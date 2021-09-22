import { Reducer } from 'redux'

import { generateConsts } from '../utils/generators'
import { Role, RolesState } from './roles.types'

export const FETCH = generateConsts('roles/FETCH')

export const SET_ALL_ROLES = 'allRoles/SET_ALL_ROLES'

export const setAllRoles = (roles: Array<Role>) => ({
  type: SET_ALL_ROLES,
  roles
})

export const fetchRoles = {
  request: () => ({ type: FETCH.REQUEST }),
  success: (payload: Role[]) => ({
    type: FETCH.SUCCESS,
    payload
  }),
  failure: (message: string) => ({
    type: FETCH.FAILURE,
    payload: { message }
  })
}

export const initialState: RolesState = {
  allowedRoles: { data: [], status: 'initial' },
  allRoles: { data: [], status: 'initial' }
}

const rolesReducer: Reducer<RolesState> = (state = initialState, action): RolesState => {
  switch (action.type) {
    case FETCH.REQUEST: {
      return {
        ...state,
        allowedRoles: {
          ...state.allowedRoles,
          status: 'loading'
        }
      }
    }

    case FETCH.SUCCESS: {
      return {
        ...state,
        allowedRoles: {
          ...state.allowedRoles,
          data: [...action.payload],
          status: 'loaded'
        }
      }
    }

    case FETCH.FAILURE: {
      return {
        ...state,
        allowedRoles: {
          ...state.allowedRoles,
          status: 'error'
        }
      }
    }

    case SET_ALL_ROLES: {
      return {
        ...state,
        allRoles: {
          ...state.allRoles,
          data: action.roles
        }
      }
    }

    default: {
      return state
    }
  }
}

export default rolesReducer
