import { createSelector } from 'reselect'
import get from 'lodash/get'

import { Filters, filterByPage, selectFilters, processRows } from '../tables'

import { AppState } from '../index'
import { selectRemovedUsersSortingFilteringFlag } from '../featureFlags'
import { selectUserDocumentCounts } from '../userDocumentCounts'
import { selectInvitations } from '../invitations'

import { RemovedUser } from './removedUsers.types'

// ---
export const getRemovedUsers = (state: AppState) => state.removedUsers

export const selectInvitedRemovedUsers = createSelector(
  [selectInvitations, getRemovedUsers],
  (invitations, removedUsers) => {
    return removedUsers?.users?.filter((removedUser: RemovedUser) =>
      Object.keys(invitations).some(
        invitation => removedUser.email === get(invitations[invitation], 'email')
      )
    )
  }
)

export const selectProcessedRemovedUsers = createSelector(
  [
    selectFilters,
    getRemovedUsers,
    selectUserDocumentCounts,
    selectRemovedUsersSortingFilteringFlag
  ],
  (
    { searchQuery, seatType, docCountSort, dateSort }: Filters,
    { users },
    userDocumentCounts,
    phase1bFlag
  ) => {
    const processedRows = processRows({
      allowDocumentCounts: phase1bFlag,
      allowRemovedDate: true,
      allowSeatType: phase1bFlag,
      dateSort,
      docCountSort,
      phase1bFlag,
      rows: users,
      searchQuery,
      seatType,
      userDocumentCounts
    })

    return processedRows
  }
)

export const selectProcessedRemovesUsersCount = createSelector(
  [selectProcessedRemovedUsers],
  removedUsers => removedUsers.length
)

export const selectRemovedUsers = getRemovedUsers
export const selectRemovedUsersLen = createSelector(
  selectRemovedUsers,
  removedUsers => removedUsers.users.length ?? 0
)
export const selectRemovedUsersErrorMessage = createSelector(
  selectRemovedUsers,
  removedUsers => removedUsers.errorMessage
)

export const checkInvitedRemovedUsers = (
  userID: number,
  invitedRemovedUsers: RemovedUser[]
) => {
  return invitedRemovedUsers.some(user => userID === user.userID)
}

export const selectBulkEditableRemovedUsers = createSelector(
  selectProcessedRemovedUsers,
  selectInvitedRemovedUsers,
  (users, invitedUsers) =>
    users.filter(user => {
      if ('userID' in user) {
        return !checkInvitedRemovedUsers(user.userID, invitedUsers)
      }
      return false
    })
)

export const selectDisplayedRemovedUsers = createSelector(
  [selectProcessedRemovedUsers, selectFilters],
  (removedUsers, { page = '1', dateSort, docCountSort }) => {
    // N.B.: if dateSort or docCountSort is enabled, disable the default sort by name
    const sortByName = dateSort === undefined && docCountSort === undefined
    return filterByPage(page, removedUsers, sortByName)
  }
)

export const selectIsLoaded = (state: AppState) => state.removedUsers.status === 'loaded'
export const selectIsLoading = (state: AppState) => state.removedUsers.status === 'loading'
