import { createSelector } from 'reselect'
import { AppState } from '..'

export const selectUserGroupsState = createSelector(
  (state: AppState) => state.userGroups,
  groups => groups
)

export const selectUserGroups = createSelector([selectUserGroupsState], userGroupsState => {
  return userGroupsState.data
})

export const selectUserGroupsStatus = createSelector(
  [selectUserGroupsState],
  userGroupsState => {
    return userGroupsState.status
  }
)

export const selectHasUserGroupsError = createSelector([selectUserGroupsStatus], status => {
  return status === 'error'
})

export const selectAreUserGroupsLoading = createSelector([selectUserGroupsStatus], status => {
  return status === 'loading'
})

export const selectAreUserGroupsLoaded = createSelector([selectUserGroupsStatus], status => {
  return status === 'loaded'
})

export const selectUserGroupsLength = createSelector(selectUserGroups, userGroups => {
  return userGroups ? userGroups.length : 0
})
