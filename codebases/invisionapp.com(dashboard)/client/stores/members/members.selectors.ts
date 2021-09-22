import { createSelector } from 'reselect'
import { selectUser } from '../user'
import { LastSeenByUser, selectLastSeen } from '../lastSeen'
import {
  Filters,
  selectFilters,
  filterByPage,
  DateSortKey,
  processRows,
  RowItem,
  filterByStatus
} from '../tables'
import { selectBillableUserIds, selectShowStatus, selectIsBillableLoaded } from '../billing'
import { selectMemberSortingFilteringFlag, selectUseV2MembersFlag } from '../featureFlags'
import { selectLocationQuery } from '../location'
import { Member, MembersObject } from './index'
import { AppState } from '../index'
import { isGuest } from '../roles'
import { getBulkEditableItems } from './members.helpers'
import { MembersState } from './members.types'

/*
 *  We start with a MembersObject that contains both members and guests.
 *
 * TODO: maybe one day we can fetch members and guests separately
 *
 *  glossary:
 *
 *  - "members and guests": all member types returned from the fetch call
 *  - "members": members only, no guests
 *  - "guests": guests, no members
 *  - "processed members": the full list of members that have been sorted and/or filtered
 *  - "displayed members": processed members shown on the current page
 *  - "processed guests": the full list of guests that have been sorted and/or filtered
 *  - "displayed guests": processed guests shown on the current page
 */

//-----------------------------------------------------------------------------------------
//  getting values straight from the store
//-----------------------------------------------------------------------------------------

export const selectMembersState = (state: AppState) => state.members
export const selectMembersAndGuests = (state: AppState) => state.members.data
export const selectMembersPagination = (state: AppState) => state.allPagination.members

//-----------------------------------------------------------------------------------------
//  helper selectors
//-----------------------------------------------------------------------------------------

export const selectMembersStatus = createSelector([selectMembersState], membersState => {
  return membersState.status
})

export const selectV2MembersStatus = createSelector([selectMembersState], membersState => {
  return membersState.v2Status
})

export const selectShouldLoadAllMembers = createSelector(
  [selectMembersPagination],
  pagination => {
    return pagination.ids?.length === 0 || pagination.totalCount > pagination.ids?.length
  }
)

export const selectIsLoading = createSelector(
  [selectMembersState],
  (membersState: MembersState) => membersState.status === 'loading'
)

export const selectIsLoaded = createSelector(
  [selectMembersState],
  (membersState: MembersState) => membersState.status === 'loaded'
)

export const selectIsV2Loaded = createSelector(
  [selectMembersState],
  membersState => membersState.v2Status === 'loaded'
)

export const selectHasMembersError = createSelector(
  [selectMembersStatus, selectV2MembersStatus],
  (membersStatus, v2MembersStatus) => {
    return membersStatus === 'error' || v2MembersStatus === 'error'
  }
)

//-----------------------------------------------------------------------------------------
//  members and guests
//-----------------------------------------------------------------------------------------

export const selectMembersAndGuestsArray = createSelector(
  [selectMembersAndGuests],
  (members: MembersObject): Member[] => {
    const array: Member[] = []

    Object.keys(members).forEach(id => {
      array.push(members[id])
    })

    // for some reason, there can be undefined or empty values here
    return array.filter(member => member && member.userID)
  }
)

//-----------------------------------------------------------------------------------------
//  members only
//-----------------------------------------------------------------------------------------

export const selectMembersArray = createSelector([selectMembersAndGuests], members => {
  return Object.values(members).filter(member => {
    return member && member.userID && isGuest(member.roleID) === false
  })
})

export const selectProcessedMembers = createSelector(
  [
    selectFilters,
    selectMembersArray,
    selectLastSeen,
    selectLocationQuery('dateSort'),
    selectMemberSortingFilteringFlag
  ],
  (
    { dateFilter, searchQuery, seatType }: Filters,
    members: Member[],
    allLastSeen: LastSeenByUser,
    dateSort: DateSortKey,
    phase1bFlag
  ) => {
    const processedRows = processRows({
      allowLastSeen: phase1bFlag,
      allowSeatType: phase1bFlag,
      dateFilter,
      dateSort,
      lastSeenIds: allLastSeen,
      phase1bFlag,
      rows: members,
      searchQuery,
      seatType
    })

    return processedRows
  }
)

export const selectTotalMembersCount = createSelector(
  [selectIsV2Loaded, selectMembersArray, selectUseV2MembersFlag],
  (isV2Loaded, members, useV2Members) => {
    if (useV2Members === false || isV2Loaded === true) {
      return members.length
    }

    return 0
  }
)

export const selectProcessedMembersCount = createSelector(
  [selectProcessedMembers],
  members => {
    return members.length
  }
)

export const selectDisplayedMembers = createSelector(
  [selectProcessedMembers, selectFilters, selectLocationQuery('dateSort')],
  (processedMembers, { page = '1' }, dateSort) => {
    // if dateSort is enabled, disable the default sort by name
    const sortByName = dateSort === undefined
    return filterByPage(page, processedMembers, sortByName) as Member[]
  }
)

export const selectMemberIds = createSelector(
  [selectMembersArray],
  (members: Member[]): number[] => {
    return members.map(member => member.userID)
  }
)

export const selectBulkEditableMembers = createSelector(
  [selectUser, selectProcessedMembers],
  (currentUser, processedMembers: RowItem[]) => {
    return getBulkEditableItems(currentUser, processedMembers as Member[])
  }
)

export const selectBulkEditableDisplayedMembers = createSelector(
  [selectUser, selectDisplayedMembers],
  (currentUser, displayedMembers: Member[]) => {
    return getBulkEditableItems(currentUser, displayedMembers)
  }
)

//-----------------------------------------------------------------------------------------
//  guests
//-----------------------------------------------------------------------------------------

const selectGuestsArray = createSelector([selectMembersAndGuests], members => {
  return Object.values(members).filter(member => {
    return member && member.userID && isGuest(member.roleID) === true
  })
})

export const selectTotalGuestsCount = createSelector(
  [selectGuestsArray, selectIsV2Loaded, selectUseV2MembersFlag],
  (guests, isV2Loaded, useV2Members) => {
    if (useV2Members === false || isV2Loaded === true) {
      return guests.length
    }

    return 0
  }
)

export const selectProcessedGuests = createSelector(
  [
    selectFilters,
    selectGuestsArray,
    selectBillableUserIds,
    selectIsBillableLoaded,
    selectLastSeen,
    selectLocationQuery('dateSort'),
    selectShowStatus,
    selectMemberSortingFilteringFlag
  ],
  (
    { dateFilter, searchQuery, statusType, seatType }: Filters,
    guests: Member[],
    billableUserIds,
    areBillableUsersLoaded,
    lastSeenIds: LastSeenByUser,
    dateSort: DateSortKey,
    showStatusFlag,
    phase1bFlag
  ) => {
    const processedGuests = processRows({
      allowLastSeen: phase1bFlag,
      allowSeatType: phase1bFlag,
      allowStatus: showStatusFlag && areBillableUsersLoaded,
      billableUserIds,
      dateFilter,
      dateSort,
      lastSeenIds,
      phase1bFlag,
      rows: guests,
      searchQuery,
      seatType,
      statusType
    })

    return processedGuests
  }
)

export const selectProcessedGuestsCount = createSelector([selectProcessedGuests], guests => {
  return guests.length
})

export const selectDisplayedGuests = createSelector(
  [selectProcessedGuests, selectFilters, selectLocationQuery('dateSort')],
  (processedGuests, { page = '1' }, dateSort) => {
    // if dateSort is enabled, disable the default sort by name
    const sortByName = dateSort === undefined
    return filterByPage(page, processedGuests, sortByName) as Member[]
  }
)

export const selectActiveGuestsCount = createSelector(
  [selectProcessedGuests, selectShowStatus, selectIsBillableLoaded, selectBillableUserIds],
  (processedGuests, showStatusFlag, areBillableUsersLoaded, billableUserIds) => {
    if (showStatusFlag === false || areBillableUsersLoaded === false) {
      return 0
    }

    const activeGuests = filterByStatus({
      billableUserIds,
      rows: processedGuests as Member[],
      statusTypeKey: 'active'
    })
    return activeGuests.length
  }
)

export const selectInactiveGuestsCount = createSelector(
  [selectProcessedGuests, selectShowStatus, selectIsBillableLoaded, selectBillableUserIds],
  (processedGuests, showStatusFlag, areBillableUsersLoaded, billableUserIds) => {
    if (showStatusFlag === false || areBillableUsersLoaded === false) {
      return 0
    }

    const activeGuests = filterByStatus({
      billableUserIds,
      rows: processedGuests as Member[],
      statusTypeKey: 'inactive'
    })
    return activeGuests.length
  }
)

export const selectBulkEditableGuests = createSelector(
  [selectUser, selectProcessedGuests],
  (user, processedGuests) => {
    return getBulkEditableItems(user, processedGuests as Member[])
  }
)

export const selectBulkEditableDisplayedGuests = createSelector(
  [selectUser, selectDisplayedGuests],
  (user, displayedGuests: Member[]) => {
    return getBulkEditableItems(user, displayedGuests)
  }
)

export const selectGuestIds = createSelector(
  [selectGuestsArray],
  (guests: Member[]): number[] => {
    return guests.map(guest => guest.userID)
  }
)
