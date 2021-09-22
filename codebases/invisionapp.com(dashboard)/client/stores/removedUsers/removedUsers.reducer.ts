import { Reducer } from 'redux'

import { RemovedUsersState } from './removedUsers.types'
import { actions } from './removedUsers.actions'

export const initialState: RemovedUsersState = {
  status: 'initial',
  users: []
}

const removedUsersReducer: Reducer<RemovedUsersState> = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD: {
      return {
        ...state,
        status: 'loading'
      }
    }

    case actions.INIT_DATA: {
      return {
        ...state,
        status: 'loaded',
        users: action.payload
      }
    }

    case actions.INIT_DATA_WITH_ERROR: {
      return {
        ...state,
        status: 'error',
        users: action.payload.users,
        errorMessage: action.payload.partialErrorMessage
      }
    }

    case actions.SET_DOCS_COUNT: {
      return {
        ...state,
        users: state.users.map(user => {
          const newUser =
            user.userID === action.userId ? { ...user, documentCount: action.count } : user

          return newUser
        })
      }
    }

    default: {
      return state
    }
  }
}

export default removedUsersReducer
