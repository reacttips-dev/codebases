import { AxiosError, AxiosResponse } from 'axios'
import { AnyAction, Dispatch } from 'redux'
import { selectIsLastSeenLoading } from './index'
import bffRequest from '../../utils/bffRequest'
import { GetState } from '../app'

export const LOADING = 'last-seen/loading'
export const SUCCESS = 'last-seen/success'
export const FAIL = 'last-seen/fail'
export const UPDATE = 'last-seen/update'

export const fetchLoading = () => {
  return { type: LOADING }
}

export const fetchSuccess = (response: AxiosResponse) => {
  return { type: SUCCESS, payload: response?.data }
}

export const fetchUpdate = (response: AxiosResponse) => {
  return { type: UPDATE, payload: response?.data }
}

export const fetchFail = (error: AxiosError) => {
  return { type: FAIL, payload: error.response?.data }
}

export const requestLastSeen = (
  success: (response: AxiosResponse) => AnyAction,
  userIDs: number[]
) => (dispatch: Dispatch) => {
  return bffRequest
    .post('/teams/api/members/last-seen', {
      ids: userIDs
    })
    .then((response: AxiosResponse) => {
      dispatch(success(response))
    })
    .catch((error: AxiosError) => {
      dispatch(fetchFail(error))
    })
}

export const fetchLastSeen = (userIDs: Array<number>) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()

  if (selectIsLastSeenLoading(state)) {
    return
  }

  dispatch(fetchLoading())

  dispatch(requestLastSeen(fetchSuccess, userIDs))
}

export const fetchLastSeenBackground = (userIDs: Array<number>) => (dispatch: Dispatch) => {
  dispatch(requestLastSeen(fetchSuccess, userIDs))
}

export const fetchLastSeenUpdate = (userIDs: Array<number>) => (dispatch: Dispatch) => {
  dispatch(requestLastSeen(fetchUpdate, userIDs))
}
