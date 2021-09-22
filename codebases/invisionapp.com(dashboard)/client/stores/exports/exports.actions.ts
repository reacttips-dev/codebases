import { AxiosResponse } from 'axios'
import { Dispatch } from 'redux'

import bffRequest from '../../utils/bffRequest'

export const FETCH_ALL_USERS = {
  REQUEST: 'export/all-users/FETCH.REQUEST',
  SUCCESS: 'export/all-users/FETCH.SUCCESS',
  FAILURE: 'export/all-sers/FETCH.FAILURE'
}
export const FETCH_PENDING_INVITATIONS = {
  REQUEST: 'export/pending-invitations/FETCH.REQUEST',
  SUCCESS: 'export/pending-invitations/FETCH.SUCCESS',
  FAILURE: 'export/pending-invitations/FETCH.FAILURE'
}
export const FETCH_USERS_BY_USER_GROUPS = {
  REQUEST: 'export/users-by-user-groups/FETCH.REQUEST',
  SUCCESS: 'export/users-by-user-groups/FETCH.SUCCESS',
  FAILURE: 'export/users-by-user-groups/FETCH.FAILURE'
}
export const FETCH_REMOVED_USERS = {
  REQUEST: 'export/removed-users/FETCH.REQUEST',
  SUCCESS: 'export/removed-users/FETCH.SUCCESS',
  FAILURE: 'export/removed-users/FETCH.FAILURE'
}

export const exportAllUsers = () => (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ALL_USERS.REQUEST })

  bffRequest
    .get('/teams/api/export/all-users', {})
    .then((response: AxiosResponse) => {
      dispatch({ type: FETCH_ALL_USERS.SUCCESS, payload: response.data })
    })
    .catch((/* response: AxiosError */) => {
      dispatch({ type: FETCH_ALL_USERS.FAILURE })
    })
}

export const fetchPendingInvitationsExport = () => (dispatch: Dispatch) => {
  dispatch({ type: FETCH_PENDING_INVITATIONS.REQUEST })

  bffRequest
    .get('/teams/api/invitations/all', {})
    .then((response: AxiosResponse) => {
      dispatch({ type: FETCH_PENDING_INVITATIONS.SUCCESS, payload: response.data })
    })
    .catch((/* err: AxiosError */) => {
      dispatch({ type: FETCH_PENDING_INVITATIONS.FAILURE })
    })
}

export const fetchUsersByUserGroupsExport = () => (dispatch: Dispatch) => {
  dispatch({ type: FETCH_USERS_BY_USER_GROUPS.REQUEST })

  bffRequest
    .get('/teams/api/export/all-users', {})
    .then((response: AxiosResponse) => {
      dispatch({ type: FETCH_USERS_BY_USER_GROUPS.SUCCESS, payload: response.data })
    })
    .catch((/* response: AxiosError */) => {
      dispatch({ type: FETCH_USERS_BY_USER_GROUPS.FAILURE })
    })
}

export const fetchRemovedUsersExport = () => (dispatch: Dispatch) => {
  dispatch({ type: FETCH_REMOVED_USERS.REQUEST })

  bffRequest
    .get('/teams/api/export/removed-users', {})
    .then((response: AxiosResponse) => {
      dispatch({ type: FETCH_REMOVED_USERS.SUCCESS, payload: response.data })
    })
    .catch((/* response: AxiosError */) => {
      dispatch({ type: FETCH_REMOVED_USERS.FAILURE })
    })
}
