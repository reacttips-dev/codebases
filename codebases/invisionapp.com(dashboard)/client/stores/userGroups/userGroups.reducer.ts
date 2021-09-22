import { Reducer } from 'redux'
import findIndex from 'lodash/findIndex'
import { UserGroupsState } from './userGroups.types'
import { FETCH_USER_GROUPS, DELETE_USER_GROUP, UPDATE_USER_GROUP } from './userGroups.actions'

export const initialState: UserGroupsState = {
  data: [],
  status: 'initial' // initial | loading | loaded | error
}

const userGroupsReducer: Reducer<UserGroupsState> = (
  state = initialState,
  action
): UserGroupsState => {
  switch (action.type) {
    case FETCH_USER_GROUPS.FAILURE: {
      return { ...state, status: 'error' }
    }
    case FETCH_USER_GROUPS.REQUEST: {
      return { ...state, status: 'loading' }
    }
    case FETCH_USER_GROUPS.SUCCESS: {
      return { ...state, status: 'loaded', data: [...action.payload] }
    }

    case DELETE_USER_GROUP: {
      const userGroupIndex = findIndex(state.data, { userGroupID: action.payload.userGroupID })
      const newData = [...state.data]

      newData.splice(userGroupIndex, 1)

      return {
        ...state,
        data: newData
      }
    }

    case UPDATE_USER_GROUP: {
      const { userGroup } = action.payload
      const userGroupIndex = findIndex(state.data, { userGroupID: userGroup.userGroupID })
      const newData = [...state.data]

      newData[userGroupIndex] = {
        ...newData[userGroupIndex],
        ...userGroup
      }

      return {
        ...state,
        data: newData
      }
    }
    default: {
      return state
    }
  }
}

export default userGroupsReducer
