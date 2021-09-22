import { createSelector } from 'reselect'

import { selectInvitationSortingFilteringFlag } from '../featureFlags'

import { filterByPage, selectFilters, processRows } from '../tables'
import { AppState } from '../index'

export const selectInvitationsState = (state: AppState) => state.invitations
export const selectInvitations = (state: AppState) => state.invitations.data
export const selectInvitationsPagination = (state: AppState) => state.allPagination.invitations

const selectInvitationsArray = createSelector([selectInvitations], invitations => {
  return Object.values(invitations)
})

export const selectProcessedInvitations = createSelector(
  [selectInvitationsArray, selectFilters, selectInvitationSortingFilteringFlag],
  (invitations, { dateFilter, dateSort, searchQuery, seatType }, phase1bFlag) => {
    const processed = processRows({
      allowLatestInvite: true,
      allowLastSeen: phase1bFlag,
      allowSeatType: phase1bFlag,
      dateFilter,
      dateSort,
      rows: invitations,
      seatType,
      searchQuery
    })

    return processed
  }
)

export const selectDisplayedInvitations = createSelector(
  [selectProcessedInvitations, selectFilters],
  (invitations, { page = '1', dateSort }) => {
    // if dateSort is enabled, disable the default sort by name
    const sortByName = dateSort === undefined
    return filterByPage(page, invitations, sortByName)
  }
)

export const selectProcessedInvitationsCount = createSelector(
  [selectProcessedInvitations],
  invitations => {
    return invitations.length
  }
)

export const selectInvitationsLoading = createSelector(
  selectInvitationsState,
  invites => invites.isLoading
)

export const selectInvitationStatus = createSelector(selectInvitationsState, invitations => {
  return {
    isUpdating: invitations.isUpdating,
    isResending: invitations.isResending,
    isDeleting: invitations.isDeleting,
    updateSuccess: invitations.updateSuccess,
    resendSuccess: invitations.resendSuccess,
    deleteSuccess: invitations.deleteSuccess,
    resendInviteId: invitations.resendInviteId,
    isSending: invitations.isSending,
    sendSuccess: invitations.sendSuccess,
    sendFailure: invitations.sendFailure,
    invitesToSend: invitations.invitesToSend || []
  }
})
