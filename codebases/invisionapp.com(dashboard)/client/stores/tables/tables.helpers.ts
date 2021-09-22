import { sortBy } from 'lodash'
import { RowItem } from '.'

// @ts-ignore - this can't be TS yet because it's used in the bff
import constants from '../../../shared/constants'
import { getDaysFromNow } from '../../helpers/dates'
import { emailNameSearch } from '../../utils/fuzzySearch'
import { LastSeenByUser } from '../lastSeen'
import { Member, StatusTypeKey } from '../members'
import { UserDocumentCounts } from '../removedUsers'
import { getName } from '../store.helpers'
import { DateFilterKey, DateSortKey } from './tables.types'

export function getCurrentPage(page: string) {
  const pageNumber = parseInt(page || '1', 10)

  if (Number.isNaN(pageNumber)) {
    return 1
  }

  return pageNumber
}

export function getStartIndex(page: string, pageSize: number = constants.peopleListPageSize) {
  return pageSize * (getCurrentPage(page) - 1)
}

export function getUpperBoundsIndex(
  page: string,
  pageSize: number = constants.peopleListPageSize
) {
  return getStartIndex(page, pageSize) + pageSize
}

export function getLowerCaseName(item: RowItem) {
  const name = getName(item)
  return name ? name.toLowerCase() : null
}

export function filterByPage(
  page: string,
  items: RowItem[],
  enableSorting = false,
  pageSize = constants.peopleListPageSize
) {
  if (enableSorting) {
    const sortedByName = sortBy(items, [item => getLowerCaseName(item)])

    return sortedByName.slice(
      getStartIndex(page, pageSize),
      getUpperBoundsIndex(page, pageSize)
    )
  }

  return items.slice(getStartIndex(page, pageSize), getUpperBoundsIndex(page, pageSize))
}

export function filterBySearchQuery(searchQuery = '', items: RowItem[]): RowItem[] {
  if (searchQuery.length >= 2) {
    return emailNameSearch(searchQuery, items)
  }

  return items
}

type FilterByLastSeenArgs = {
  rows: RowItem[]
  lastSeenIds?: LastSeenByUser
  dateFilter?: DateFilterKey
}

export function filterByLastSeen(args: FilterByLastSeenArgs) {
  const { rows, lastSeenIds, dateFilter } = args

  if (!rows || rows.length === 0) {
    return []
  }

  if (dateFilter === undefined || lastSeenIds === undefined) {
    return rows
  }

  let filteredItems = [...rows]

  filteredItems = filteredItems.filter((item: RowItem) => {
    let lastSeenData

    if ('userID' in item) {
      lastSeenData = lastSeenIds[item.userID]
      if (lastSeenData === undefined) {
        return false
      }

      const daysDiff = getDaysFromNow(lastSeenData.lastActiveAt)
      return daysDiff >= +dateFilter
    }

    return false
  })

  return filteredItems
}

type SortByLastSeenArgs = {
  dateSort?: string
  lastSeenIds?: LastSeenByUser
  rows: RowItem[]
}

export function sortByLastSeen(args: SortByLastSeenArgs) {
  const { dateSort, rows, lastSeenIds } = args

  if (dateSort === undefined || lastSeenIds === undefined) {
    return rows
  }

  let sorted = [...rows]

  const seenUsers = sorted.filter(row => {
    return 'userID' in row && !!lastSeenIds[row.userID]
  })

  const unseenUsers = sorted.filter(row => {
    return 'userID' in row && !lastSeenIds[row.userID]
  })

  // only sort the users that have been seen
  const sortedSeenUsers = seenUsers.sort((a: RowItem, b: RowItem) => {
    if ('userID' in a && 'userID' in b) {
      const row1 = lastSeenIds[a.userID]
      const row2 = lastSeenIds[b.userID]

      if (row1 && row2) {
        const lastActiveA = row1.lastActiveAt
        const lastActiveB = row2.lastActiveAt
        const daysDiffFirst = getDaysFromNow(lastActiveA)
        const daysDiffSecond = getDaysFromNow(lastActiveB)

        return daysDiffFirst > daysDiffSecond ? -1 : 0
      }
      return 0
    }

    return -1
  })

  // then add on the "N/A" rows to the beginning in descending order, which is furthest in the past
  sorted = [...unseenUsers, ...sortedSeenUsers]

  if (dateSort === 'asc') {
    sorted = sorted.reverse()
  }

  return sorted
}

type SortByDocumentCountsArgs = {
  docCountSort?: string
  rows: RowItem[]
  userDocumentCounts?: UserDocumentCounts
}

export function sortByDocumentCounts(args: SortByDocumentCountsArgs) {
  const { docCountSort, userDocumentCounts, rows } = args

  if (docCountSort === undefined || userDocumentCounts === undefined) {
    return rows
  }

  const sorted = rows.sort((a: RowItem, b: RowItem) => {
    if ('userID' in a && 'userID' in b) {
      const docCountA = userDocumentCounts[a.userID]?.documentCount
      const docCountB = userDocumentCounts[b.userID]?.documentCount

      if (docCountA === undefined || docCountB === undefined) {
        return 0
      }
      return docCountA > docCountB ? -1 : 0
    }
    return -1
  })

  if (docCountSort === 'asc') {
    return sorted.reverse()
  }

  return sorted
}

type FilterBySeatTypeArgs = {
  rows: RowItem[]
  seatTypeId: number | string
}

export function filterBySeatType(args: FilterBySeatTypeArgs) {
  const { rows, seatTypeId } = args
  let seatType = seatTypeId

  if (seatTypeId === undefined) {
    return []
  }

  if (typeof seatTypeId === 'string') {
    seatType = parseInt(seatTypeId, 10)

    if (Number.isNaN(seatType)) {
      return []
    }
  }

  const filtered = rows.filter((item: RowItem) => item.seatTypeID === seatType)

  return filtered
}

type filterByLatestInvite = {
  dateFilter: DateFilterKey
  rows: RowItem[]
}

export function filterByLatestInvite(args: filterByLatestInvite) {
  const { dateFilter, rows } = args

  const filtered = rows.filter((row: RowItem) => {
    if ('latestInvite' in row) {
      const daysDiff = getDaysFromNow(row.latestInvite)
      return daysDiff >= +dateFilter
    }

    return false
  })

  return filtered
}

type SortByLatestInviteArgs = {
  dateSort: DateSortKey
  rows: RowItem[]
}

export function sortByLatestInvite(args: SortByLatestInviteArgs) {
  const { dateSort, rows } = args
  let sorted = [...rows]

  sorted = rows.sort((a, b) => {
    if ('latestInvite' in a && 'latestInvite' in b) {
      return a.latestInvite > b.latestInvite ? -1 : 0
    }

    return -1
  })

  if (dateSort === 'asc') {
    sorted = sorted.reverse()
  }

  return sorted
}

type SortByRemovedDateArgs = {
  dateSort: DateSortKey
  rows: RowItem[]
}

export function sortByRemovedDate(args: SortByRemovedDateArgs) {
  const { dateSort, rows } = args
  let sorted = [...rows]

  sorted = rows.sort((a, b) => {
    if ('endedAt' in a && 'endedAt' in b) {
      return a.endedAt > b.endedAt ? -1 : 0
    }

    return -1
  })

  if (dateSort === 'asc') {
    sorted = sorted.reverse()
  }

  return sorted
}

type FilterByStatusArgs = {
  billableUserIds: number[]
  rows: Member[]
  statusTypeKey: StatusTypeKey
}

export function filterByStatus(args: FilterByStatusArgs) {
  const { billableUserIds, rows, statusTypeKey } = args

  if (!statusTypeKey) {
    return []
  }

  const results = rows.filter(rows => {
    const isActive = billableUserIds.includes(rows.userID)

    if (
      (statusTypeKey === 'active' && isActive) ||
      (statusTypeKey === 'inactive' && !isActive)
    ) {
      return true
    }

    return false
  })

  return results
}

export type ProcessRowsArgs = {
  allowDocumentCounts?: boolean
  allowLatestInvite?: boolean
  allowLastSeen?: boolean
  allowRemovedDate?: boolean
  allowSeatType?: boolean
  allowStatus?: boolean
  billableUserIds?: number[]
  dateFilter?: DateFilterKey
  dateSort?: DateSortKey
  docCountSort?: DateSortKey
  lastSeenIds?: LastSeenByUser
  phase1bFlag?: boolean
  rows: RowItem[]
  searchQuery?: string
  seatType?: number | string
  showStatus?: boolean
  statusType?: StatusTypeKey
  userDocumentCounts?: UserDocumentCounts
}

export function processRows(args: ProcessRowsArgs): RowItem[] {
  const {
    allowDocumentCounts = false,
    allowLastSeen = false,
    allowLatestInvite = false,
    allowRemovedDate = false,
    allowSeatType = false,
    allowStatus = false,
    billableUserIds,
    dateFilter,
    dateSort,
    docCountSort,
    lastSeenIds,
    rows = [],
    searchQuery,
    seatType,
    statusType,
    userDocumentCounts
  } = args

  if (rows === undefined || rows.length === 0) {
    return []
  }

  let processedRows = [...rows]

  // ---- FILTERING ----

  // ---- search query
  processedRows = filterBySearchQuery(searchQuery, rows)

  // ---- seat type
  if (allowSeatType && seatType !== undefined) {
    processedRows = filterBySeatType({ rows: processedRows, seatTypeId: seatType })
  }

  // ---- last seen
  if (allowLastSeen) {
    processedRows = filterByLastSeen({ rows: processedRows, lastSeenIds, dateFilter })
  }

  // ---- latest invite date
  if (allowLatestInvite && dateFilter) {
    processedRows = filterByLatestInvite({ rows: processedRows, dateFilter })
  }

  // ---- status
  if (allowStatus && statusType && billableUserIds) {
    processedRows = filterByStatus({
      statusTypeKey: statusType,
      rows: processedRows as Member[],
      billableUserIds
    })
  }

  // ---- SORTING ----
  if (allowLastSeen) {
    processedRows = sortByLastSeen({ dateSort, rows: processedRows, lastSeenIds })
  }

  if (allowLatestInvite && dateSort) {
    processedRows = sortByLatestInvite({ rows: processedRows, dateSort })
  }

  if (allowRemovedDate && dateSort) {
    processedRows = sortByRemovedDate({ rows: processedRows, dateSort })
  }

  if (allowDocumentCounts && docCountSort) {
    processedRows = sortByDocumentCounts({
      rows: processedRows,
      docCountSort,
      userDocumentCounts
    })
  }

  return processedRows
}
