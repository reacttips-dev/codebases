import { Reducer } from 'redux'
import { ExportState } from './exports.types'
import {
  FETCH_ALL_USERS,
  FETCH_PENDING_INVITATIONS,
  FETCH_REMOVED_USERS,
  FETCH_USERS_BY_USER_GROUPS
} from './exports.actions'

export const initialState: ExportState = {
  allUsers: {
    data: {
      allUsers: [],
      documentCounts: [],
      loginActivity: [],
      userGroups: []
    },
    status: 'initial'
  },
  pendingInvitations: {
    data: [],
    status: 'initial'
  },
  usersByUserGroups: {
    data: {
      allUsers: [],
      documentCounts: [],
      loginActivity: [],
      userGroups: []
    },
    status: 'initial'
  },
  removedUsers: {
    data: {
      removedUsers: [],
      loginActivity: []
    },
    status: 'initial'
  }
}

const exportsReducer: Reducer<ExportState> = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_USERS.REQUEST: {
      return {
        ...state,
        allUsers: {
          ...state.allUsers,
          status: 'loading'
        }
      }
    }
    case FETCH_ALL_USERS.SUCCESS: {
      return {
        ...state,
        allUsers: {
          data: action.payload.data,
          status: 'loaded'
        }
      }
    }
    case FETCH_ALL_USERS.FAILURE: {
      return {
        ...state,
        allUsers: {
          data: initialState.allUsers.data,
          status: 'error'
        }
      }
    }
    case FETCH_PENDING_INVITATIONS.REQUEST: {
      return {
        ...state,
        pendingInvitations: {
          ...state.pendingInvitations,
          status: 'loading'
        }
      }
    }
    case FETCH_PENDING_INVITATIONS.SUCCESS: {
      return {
        ...state,
        pendingInvitations: {
          data: action.payload.results,
          status: 'loaded'
        }
      }
    }
    case FETCH_PENDING_INVITATIONS.FAILURE: {
      return {
        ...state,
        pendingInvitations: {
          data: initialState.pendingInvitations.data,
          status: 'error'
        }
      }
    }
    case FETCH_USERS_BY_USER_GROUPS.REQUEST: {
      return {
        ...state,
        usersByUserGroups: {
          ...state.usersByUserGroups,
          status: 'loading'
        }
      }
    }
    case FETCH_USERS_BY_USER_GROUPS.SUCCESS: {
      return {
        ...state,
        usersByUserGroups: {
          data: action.payload.data,
          status: 'loaded'
        }
      }
    }
    case FETCH_USERS_BY_USER_GROUPS.FAILURE: {
      return {
        ...state,
        usersByUserGroups: {
          data: initialState.usersByUserGroups.data,
          status: 'error'
        }
      }
    }
    case FETCH_REMOVED_USERS.REQUEST: {
      return {
        ...state,
        removedUsers: {
          ...state.removedUsers,
          status: 'loading'
        }
      }
    }
    case FETCH_REMOVED_USERS.SUCCESS: {
      return {
        ...state,
        removedUsers: {
          data: action.payload,
          status: 'loaded'
        }
      }
    }
    case FETCH_REMOVED_USERS.FAILURE: {
      return {
        ...state,
        removedUsers: {
          data: initialState.removedUsers.data,
          status: 'error'
        }
      }
    }
    default: {
      return state
    }
  }
}

export default exportsReducer
