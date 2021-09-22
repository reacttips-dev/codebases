import { createSelector } from 'reselect'
import { AppState } from '..'
import { selectLocationQuery } from '../location'

export const selectFeatureFlags = (state: AppState) => state?.featureFlags?.data ?? {}
export const selectFlagsAreLoaded = (state: AppState) => state.featureFlags.status === 'loaded'

export const selectAllowExporting = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-accts-5576-csv-exports']
  }
)

export const selectDocTransferFeatureFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-self-serve-doc-transfer']
  }
)

export const selectGuestStatusFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-accts-5476-guest-billing-info']
  }
)

export const selectInvitationSortingFilteringFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-accts-5575-sort-filter-invitations']
  }
)

export const selectMemberSortingFilteringFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-accts-5575-sort-filter-members-guests']
  }
)

export const selectRemovedUsersSortingFilteringFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-accts-5575-sort-filter-removed-users']
  }
)

export const selectShowSeatTypeFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-accts-5318-seat-type']
  }
)

export const selectTransferDocsWhenRemovedFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded],
  (featureFlags, flagsAreLoaded) => {
    if (flagsAreLoaded === false) {
      return false
    }

    return !!featureFlags['team-management-web-transfer-removed-user-docs-accts-1849']
  }
)

export const selectUseV2MembersFlag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded, selectLocationQuery('forceV2')],
  (featureFlags, flagsAreLoaded, v2Param) => {
    if (flagsAreLoaded === false) {
      return false
    }

    if (v2Param !== undefined) {
      return v2Param === 'true'
    }

    return !!featureFlags['team-management-web-accts-5535-performance-improvements']
  }
)

export const selectAuditLogV2Flag = createSelector(
  [selectFeatureFlags, selectFlagsAreLoaded, selectLocationQuery('forceAuditLogV2')],
  (featureFlags, flagsAreLoaded, v2Param) => {
    if (flagsAreLoaded === false) {
      return false
    }

    if (v2Param !== undefined) {
      return v2Param === 'true'
    }

    return !!featureFlags['team-management-web-accts-5718-audit-log-v2']
  }
)
