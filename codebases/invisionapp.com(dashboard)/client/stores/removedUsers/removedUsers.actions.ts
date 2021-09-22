import { AxiosResponse } from 'axios'
import { browserHistory } from 'react-router'
import { Dispatch } from 'redux'

import bffRequest from '../../utils/bffRequest'

import { AppState } from '../index'
import { RemovedUser } from './removedUsers.types'
import { getRemovedUsers } from './removedUsers.selectors'

import { invitePeople, bulkInviteUsers } from '../inviteModal'

import { trackPeopleRemovedUserInvite } from '../../helpers/analytics'

export const actions = {
  LOAD: 'removedUsers/LOAD',
  INIT_DATA: 'removedUsers/INIT_DATA',
  SET_DOCS_COUNT: 'removedUsers/SET_DOCS_COUNT',
  INIT_DATA_WITH_ERROR: 'removedUsers/INIT_DATA_WITH_ERROR'
}

export const initData = (payload: RemovedUser[]) => ({
  type: actions.INIT_DATA,
  payload
})

const initDataWithError = (payload: { errorMessage: string; users: RemovedUser[] }) => {
  return {
    type: actions.INIT_DATA_WITH_ERROR,
    payload
  }
}

export const load = ({ background } = { background: false }) => (dispatch: Dispatch) => {
  if (!background) {
    dispatch({
      type: actions.LOAD
    })
  }

  return bffRequest
    .get('/teams/api/team/removed-users', {
      timeout: 10000 // NOTE: Bump up timeout until optimizations are done to the BTAPI endpoint
    })
    .then((response: AxiosResponse) => {
      if (response.data.partialErrorMessage) {
        return dispatch(initDataWithError(response.data))
      }

      return dispatch(initData(response.data))
    })
}

export const deleteUserDocs = (fromUserId: string | number) => {
  return bffRequest.delete(`/teams/api/bulk-transfer/delete-documents/${fromUserId}`)
}

export const setUserDocsCount = ({ userId, count }: { userId: number; count: number }) => ({
  type: actions.SET_DOCS_COUNT,
  count,
  userId
})

export const startReinvitingUser = ({
  email,
  roleKey
}: {
  email: string
  roleKey: string
}) => (dispatch: Dispatch) => {
  dispatch(
    invitePeople.updatePeople({
      emails: email,
      roleKey
    })
  )

  trackPeopleRemovedUserInvite()

  setTimeout(() => {
    browserHistory.push('/teams/invite/confirm?backTo=/teams/people/removed')
  }, 0)
}

export const startBulkReinvitingUsers = (userIds: number[]) => (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const { users } = getRemovedUsers(getState())

  const peopleToInvite = users
    .filter(user => userIds.includes(user.userID))
    .map(({ email, roleName }) => ({
      email,
      roleName
    }))

  dispatch(bulkInviteUsers(peopleToInvite))

  trackPeopleRemovedUserInvite()

  setTimeout(() => {
    browserHistory.push('/teams/invite/confirm?backTo=/teams/people/removed')
  }, 0)
}
