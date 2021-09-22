import { AxiosError, AxiosResponse } from 'axios'
import { Dispatch } from 'redux'
import { batch } from 'react-redux'
import { createAction } from 'redux-actions'

import { AppState } from '..'
import bffRequest from '../../utils/bffRequest'
import { Invitation, InviteToSend, LoadOptions } from './invitations.types'
// @ts-ignore
import constants from '../../../shared/constants'
import { RoleId } from '../roles/roles.types'
import { trackTeamInvitesSent } from '../../helpers/analytics'

export const FETCH = {
  REQUEST: 'teams/invitations/FETCH.REQUEST',
  SUCCESS: 'teams/invitations/FETCH.SUCCESS',
  FAILURE: 'teams/invitations/FETCH.FAILURE'
}

export const FETCH_ONE = {
  REQUEST: 'teams/invitations/FETCH_ONE.REQUEST',
  SUCCESS: 'teams/invitations/FETCH_ONE.SUCCESS',
  FAILURE: 'teams/invitations/FETCH_ONE.FAILURE'
}

export const FETCH_AND_REPLACE = {
  REQUEST: 'teams/invitations/FETCH_AND_REPLACE.REQUEST',
  SUCCESS: 'teams/invitations/FETCH_AND_REPLACE.SUCCESS',
  FAILURE: 'teams/invitations/FETCH_AND_REPLACE.FAILURE'
}

export const UPDATE = {
  REQUEST: 'teams/invitations/UPDATE.REQUEST',
  SUCCESS: 'teams/invitations/UPDATE.SUCCESS',
  FAILURE: 'teams/invitations/UPDATE.FAILURE'
}

export const RESEND = {
  REQUEST: 'teams/invitations/RESEND.REQUEST',
  SUCCESS: 'teams/invitations/RESEND.SUCCESS',
  FAILURE: 'teams/invitations/RESEND.FAILURE'
}

export const SEND = {
  REQUEST: 'teams/invitations/SEND.REQUEST',
  SUCCESS: 'teams/invitations/SEND.SUCCESS',
  FAILURE: 'teams/invitations/SEND.FAILURE'
}

export const REMOVE_INVITE_FROM_STORE = 'invitations/REMOVE_INVITE_FROM_STORE'

export const RESET_STATUS = 'teams/invitations/RESET_STATUS'

export const resetInvitationStatus = createAction(RESET_STATUS)

type FetchInvitationsRequestParams = {
  limit: number
  offset: number
}

export const fetchInvitations = {
  request: (
    params: FetchInvitationsRequestParams = { limit: constants.peopleListPageSize, offset: 0 }
  ) => (dispatch: Dispatch) => {
    dispatch({ type: FETCH.REQUEST })

    bffRequest
      .get('/teams/api/invitations', { params })
      .then((response: AxiosResponse) => dispatch(fetchInvitations.success(response.data)))
      .catch((err: AxiosError) => dispatch(fetchInvitations.failure(err.response?.data)))
  },
  success: (payload: Invitation[]) => ({ type: FETCH.SUCCESS, payload }),
  failure: (message: string) => ({ type: FETCH.FAILURE, payload: { message } })
}

export const fetchAndReplaceInvitations = {
  request: ({ background }: LoadOptions = {}) => (dispatch: Dispatch) => {
    if (!background) {
      dispatch({ type: FETCH_AND_REPLACE.REQUEST })
    }

    bffRequest
      .get('/teams/api/invitations/all')
      .then((response: AxiosResponse) =>
        dispatch(fetchAndReplaceInvitations.success(response.data))
      )
      .catch((err: AxiosError) =>
        dispatch(fetchAndReplaceInvitations.failure(err.response?.data))
      )
  },
  success: (payload: Invitation[]) => ({ type: FETCH_AND_REPLACE.SUCCESS, payload }),
  failure: (message: string) => ({ type: FETCH_AND_REPLACE.FAILURE, payload: { message } })
}

export const fetchAllInvitations = ({ background, force }: LoadOptions = {}) => (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const state = getState()

  const pagination = state.allPagination.invitations
  const shouldLoad =
    pagination.ids.length === 0 || pagination.totalCount > pagination.ids.length || force

  // Only make the request if we have to
  if (!shouldLoad) {
    return
  }

  // Sometimes, the app will want to load all the data in the background without the UI showing
  // anything
  if (!background) {
    dispatch({ type: FETCH.REQUEST })
  }

  bffRequest
    .get('/teams/api/invitations/all')
    .then((response: AxiosResponse) => dispatch(fetchInvitations.success(response.data)))
    .catch((err: AxiosError) => dispatch(fetchInvitations.failure(err.response?.data)))
}

type ChangeInvitationSeatTypeArgs = {
  invitationId: number
  seatTypeId: number
  onDone: () => void
  onError: () => void
}

export const changeInvitationSeatType = ({
  invitationId,
  seatTypeId,
  onDone,
  onError
}: ChangeInvitationSeatTypeArgs) => (dispatch: Dispatch) => {
  dispatch({ type: UPDATE.REQUEST, id: invitationId })

  bffRequest
    .put(`/teams/api/invitations/change-seat-type/${invitationId}`, {
      invitationId,
      seatTypeId
    })
    .then((response: AxiosResponse) => {
      dispatch({ type: UPDATE.SUCCESS, payload: response })
      onDone()
    })
    .catch((err: AxiosError) => {
      dispatch({ type: UPDATE.FAILURE, payload: err.response?.data, invitationId })
      onError()
    })
}

type GetInvitationFromTokenArgs = {
  token: string
  onDone: (email: string) => void
  onError: (v?: AxiosResponse) => void
}

export const getInvitationFromToken = ({
  token,
  onDone,
  onError
}: GetInvitationFromTokenArgs) => (dispatch: Dispatch) => {
  dispatch({ type: FETCH.REQUEST, token })

  bffRequest
    .get('/teams/api/request-access', { params: { token } })
    .then((response: AxiosResponse) => {
      onDone(response.data?.email)
    })
    .catch((err: AxiosError) => {
      onError(err?.response)
    })
}

type ChangeInvitationRoleArgs = {
  invitationId: number
  roleId: RoleId
  onDone: () => void
  onError: () => void
}
export const changeInvitationRole = ({
  invitationId,
  roleId,
  onDone,
  onError
}: ChangeInvitationRoleArgs) => (dispatch: Dispatch) => {
  dispatch({ type: UPDATE.REQUEST, id: invitationId })

  bffRequest
    .put(`/teams/api/invitations/${invitationId}/change-role`, {
      roleId,
      invitationId
    })
    .then((response: AxiosResponse) => {
      dispatch({ type: UPDATE.SUCCESS, payload: response })
      onDone()
    })
    .catch((err: AxiosError) => {
      dispatch({ type: UPDATE.FAILURE, payload: err.response?.data, invitationId })
      onError()
    })
}

export const updateBulkInvitations = (ids: string[]) => (dispatch: Dispatch) => {
  batch(() => {
    ids.forEach(id => {
      dispatch({ type: UPDATE.REQUEST, id })
    })
  })
}

type ResendInvitationArgs = {
  invitationId: number
  onDone: () => void
  onError: () => void
}

export const resendInvitation = ({ invitationId, onDone, onError }: ResendInvitationArgs) => (
  dispatch: Dispatch
) => {
  dispatch({ type: RESEND.REQUEST, id: invitationId })

  bffRequest
    .post(`/teams/api/invitations/${invitationId}/resend`)
    .then((response: AxiosResponse) => {
      dispatch({ type: RESEND.SUCCESS, payload: response?.data })
      onDone()
    })
    .catch((err: AxiosError) => {
      dispatch({ type: RESEND.FAILURE, payload: err.response?.data, id: invitationId })
      onError()
    })
}

type SendInvitationArgs = {
  invites: InviteToSend[]
  onDone: () => void
  onError: () => void
}

export const sendInvitations = ({ invites, onDone, onError }: SendInvitationArgs) => (
  dispatch: Dispatch
) => {
  dispatch({ type: SEND.REQUEST })

  bffRequest
    .post(`/teams/api/invitations/`, { invites })
    .then((response: AxiosResponse) => {
      dispatch(fetchAllInvitations())
      trackTeamInvitesSent(response?.data.invites.length)
      dispatch({ type: SEND.SUCCESS, payload: response?.data })
      onDone()
    })
    .catch((err: AxiosError) => {
      dispatch({ type: SEND.FAILURE, payload: err?.message })
      onError()
    })
}

export function removeInviteFromStore(inviteId: string) {
  return (dispatch: Dispatch) => {
    dispatch({ type: REMOVE_INVITE_FROM_STORE, inviteId })
    dispatch(fetchAndReplaceInvitations.request({ background: true }))
  }
}

// TODO: the request and failure actions aren't handled in the reducer so is this even used?
export const fetchInvitation = {
  request: createAction(FETCH_ONE.REQUEST, (endpoint: string, notification: string) => {
    return {
      endpoint,
      notification
    }
  }),
  success: createAction(FETCH_ONE.SUCCESS, (response: Invitation) => response),
  failure: createAction(FETCH_ONE.FAILURE, (message: AxiosError) => {
    return { message }
  })
}
