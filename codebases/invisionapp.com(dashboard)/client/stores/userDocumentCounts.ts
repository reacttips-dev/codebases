import { AxiosResponse, AxiosError } from 'axios'
import { Reducer, Dispatch } from 'redux'
import { createSelector } from 'reselect'
import { LoadingStatus } from './utils/loadingStatus'
import bffRequest from '../utils/bffRequest'
import { AppState } from './index'
import arrayToObject from '../helpers/arrayToObj'

interface UserDocumentsCountData {
  documentCount?: number
  id?: string
  userId?: number
}

export type UserDocumentsCountsByUser = {
  [index: number]: UserDocumentsCountData
}

export type UserDocumentCountsState = {
  data: UserDocumentsCountsByUser
  status: LoadingStatus
}

type GetState = () => any & AppState

// Action Constants
export const LOADING = 'user-document-counts/loading'
export const SUCCESS = 'user-document-counts/success'
export const FAIL = 'user-document-counts/fail'

export const isLoading = (userDocumentCountsState: UserDocumentCountsState) => {
  return userDocumentCountsState.status === 'loading'
}

// Actions
export const fetchUserDocumentCounts = (userIDs: Array<number>) => (
  dispatch: Dispatch<any>,
  getState: GetState
) => {
  const state = getState()

  // Only make the request one at a time
  if (isLoading(state.userDocumentCounts)) {
    return
  }

  dispatch({ type: LOADING })

  bffRequest
    .post(`/teams/api/members/user-document-counts`, {
      ids: userIDs
    })
    .then((response: AxiosResponse) => {
      dispatch({ type: SUCCESS, payload: response.data })
    })
    .catch((error: AxiosError) => {
      dispatch({ type: FAIL, payload: error.response?.data })
    })
}

export const initialState: UserDocumentCountsState = {
  data: {},
  status: 'initial' // initial | loading | loaded | error
}

// Reducers
const userDocumentCountsReducer: Reducer<UserDocumentCountsState> = (
  state = initialState,
  action
): UserDocumentCountsState => {
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

// Selectors
export const selectUserDocumentCounts = createSelector(
  (state: AppState) => state.userDocumentCounts,
  userDocumentCounts => {
    return userDocumentCounts.data
  }
)

export default userDocumentCountsReducer
