import { createSelector } from 'reselect'
import { selectLocationQuery } from '../location'
import { StatusTypeKey } from '../members/members.types'
import { DateFilterKey, DateSortKey, Filters } from './tables.types'

export const selectFilters = createSelector(
  selectLocationQuery('page'),
  selectLocationQuery('search'),
  selectLocationQuery('statusType'),
  selectLocationQuery('dateFilter'),
  selectLocationQuery('dateSort'),
  selectLocationQuery('docCountSort'),
  selectLocationQuery('seatType'),
  (
    page?: string,
    searchQuery?: string,
    statusType?: StatusTypeKey,
    dateFilter?: DateFilterKey,
    dateSort?: DateSortKey,
    docCountSort?: DateSortKey,
    seatType?: string
  ): Filters => ({
    page,
    searchQuery,
    statusType,
    dateFilter,
    dateSort,
    docCountSort,
    seatType
  })
)

export const selectIsFiltering = createSelector(selectFilters, (filters: Filters) => {
  const filterKeys: string[] = Object.keys(filters)
  let isFiltering = false
  let index = 0

  while (index < filterKeys.length && !isFiltering) {
    const key = filterKeys[index]
    isFiltering = !!filters[key]
    index += 1
  }

  return isFiltering
})
