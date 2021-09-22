import { AxiosResponse, AxiosError } from 'axios'
import { Dispatch } from 'redux'
import { createAction } from 'redux-actions'

import bffRequest from '../../utils/bffRequest'
import { GetState } from '../app'
import { generateConsts } from '../utils/generators'
import { selectAreUserGroupsLoading } from './userGroups.selectors'
import { AsyncCallbacks, UserGroup } from './userGroups.types'

export const UPDATE_USER_GROUP = 'user-groups/UPDATE_GROUP'
export const DELETE_USER_GROUP = 'user-groups/DELETE_USER_GROUP'
export const FETCH_USER_GROUPS = generateConsts('user-groups/FETCH')

export const fetchUserGroupsActions = {
  failure: createAction(
    FETCH_USER_GROUPS.FAILURE,
    (error: AxiosError) => error.response?.data
  ),
  request: createAction(FETCH_USER_GROUPS.REQUEST),
  success: createAction(FETCH_USER_GROUPS.SUCCESS, (response: AxiosResponse) => response.data)
}

export type FetchUserGroupsArgs = {
  runInBackground?: boolean
}

export const fetchUserGroups = ({ runInBackground = false }: FetchUserGroupsArgs = {}) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState()

  if (selectAreUserGroupsLoading(state)) {
    return null
  }

  if (!runInBackground) {
    dispatch(fetchUserGroupsActions.request())
  }

  return bffRequest
    .get(`/teams/api/user-groups`)
    .then((response: AxiosResponse) => {
      dispatch(fetchUserGroupsActions.success(response))
    })
    .catch((error: AxiosError) => {
      dispatch(fetchUserGroupsActions.failure(error))
    })
}

export const updateGroupData = (userGroup: UserGroup) => {
  return {
    type: UPDATE_USER_GROUP,
    payload: {
      userGroup
    }
  }
}

export type UpdateGroupArgs = {
  isDisabled?: boolean
  name: string
  userGroupID: string
  userIds?: Array<number>
} & AsyncCallbacks

export const updateGroup = ({
  isDisabled,
  name,
  userGroupID,
  userIds,
  onDone,
  onError
}: UpdateGroupArgs) => (dispatch: Dispatch, getState: GetState) => {
  const userState = getState().user

  if (userState.user === undefined) {
    return Promise.resolve()
  }

  const { user } = userState

  let changedByUserID

  // v1 user
  if ('id' in user) {
    changedByUserID = user.id
  }

  // v2 team user
  if ('userID' in user) {
    changedByUserID = user.userID
  }

  return bffRequest
    .patch(`/teams/api/user-groups/${userGroupID}`, {
      changedByUserID,
      isDisabled,
      name,
      userIds
    })
    .then((response: AxiosResponse) => {
      onDone()
      dispatch(updateGroupData(response.data))
    })
    .catch(() => {
      onError()
    })
}

type UpdateGroupNameArgs = {
  name: string
  userGroupID: string
} & AsyncCallbacks

export const updateGroupName = ({
  name,
  userGroupID,
  onDone,
  onError
}: UpdateGroupNameArgs & AsyncCallbacks) => (dispatch: Dispatch) => {
  dispatch(updateGroup({ userGroupID, name, onDone, onError }))
}

export const deleteGroupAction = (userGroupID: string) => {
  return {
    type: DELETE_USER_GROUP,
    payload: { userGroupID }
  }
}

export type DeleteGroupArgs = { id: string } & AsyncCallbacks

export const deleteGroup = ({ id, onDone, onError }: DeleteGroupArgs) => (
  dispatch: Dispatch
) => {
  return bffRequest
    .delete(`/teams/api/user-groups/${id}`)
    .then((response: AxiosResponse) => {
      dispatch(deleteGroupAction(id))
      onDone(response.data)
    })
    .catch((response: AxiosError) => {
      onError(response.response?.data)
    })
}
