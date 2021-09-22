import { Reducer } from 'redux'
import arrayToObject from '../../helpers/arrayToObj'

import { TRANSFER_OWNERSHIP as TEAM_TRANSFER_OWNERSHIP } from '../team'
import {
  FETCH,
  FETCH_AND_REPLACE,
  REMOVE_MEMBER_FROM_STORE,
  UPDATE,
  UPDATE_MEMBER_DATA,
  V2_FETCH // ff: team-management-web-accts-5535-performance-improvements
} from './members.actions'
import { MembersState } from './members.types'

export const initialState: MembersState = {
  data: {},
  status: 'initial',
  v2Status: 'initial' // ff: team-management-web-accts-5535-performance-improvements
}

const memberReducer: Reducer<MembersState> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MEMBER_DATA: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.member.id]: {
            ...state.data[action.member.id],
            ...action.member
          }
        }
      }
    }
    case FETCH.REQUEST: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case FETCH.SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...arrayToObject(action.payload.results, 'userID')
        },
        status: 'loaded'
      }
    }
    case FETCH.FAILURE: {
      return {
        ...state,
        status: 'error'
      }
    }

    // ff: team-management-web-accts-5535-performance-improvements
    case V2_FETCH.REQUEST: {
      return {
        ...state,
        v2Status: 'loading'
      }
    }
    case V2_FETCH.FIRST_PAGE_SUCCESS: {
      return {
        ...state,
        cursor: action.payload.cursor,
        data: {
          ...arrayToObject(action.payload.results, 'userID')
        },
        status: 'loaded',
        v2Status: action.payload.v2Status
      }
    }
    case V2_FETCH.MAX_SUCCESS: {
      return {
        ...state,
        cursor: action.payload.cursor,
        data: {
          ...arrayToObject(action.payload.results, 'userID')
        },
        status: 'loaded',
        v2Status: action.payload.v2Status
      }
    }
    case V2_FETCH.NEXT_MAX_SUCCESS: {
      return {
        ...state,
        cursor: action.payload.cursor,
        data: {
          ...state.data,
          ...arrayToObject(action.payload.results, 'userID')
        },
        status: 'loaded',
        v2Status: action.payload.v2Status
      }
    }
    case V2_FETCH.FAILURE: {
      return {
        ...state,
        v2Status: 'error'
      }
    }

    case FETCH_AND_REPLACE.REQUEST: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case FETCH_AND_REPLACE.SUCCESS: {
      return {
        ...initialState,
        data: {
          ...state.data,
          ...arrayToObject(action.payload.results, 'userID')
        },
        status: 'loaded'
      }
    }
    case FETCH_AND_REPLACE.FAILURE: {
      return {
        ...state,
        status: 'error'
      }
    }
    case UPDATE.REQUEST: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.userID]: {
            ...state.data[action.userID],
            isUpdating: true
          }
        }
      }
    }
    case UPDATE.SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.userID]: {
            ...action.payload.data,
            isUpdating: false
          }
        }
      }
    }
    case UPDATE.FAILURE: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.userID]: {
            ...state.data[action.userID],
            isUpdating: false
          }
        }
      }
    }
    case REMOVE_MEMBER_FROM_STORE: {
      const workingState = state
      delete workingState.data[action.memberId]
      return {
        ...workingState
      }
    }

    // This action comes from the teams store
    case TEAM_TRANSFER_OWNERSHIP.SUCCESS: {
      return {
        ...state,
        ...arrayToObject(action.payload.results, 'userID')
      }
    }
    default: {
      return state
    }
  }
}

export default memberReducer
