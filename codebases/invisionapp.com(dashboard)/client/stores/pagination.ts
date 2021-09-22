import { AnyAction, Reducer } from 'redux'
import union from 'lodash/union'
import { Member } from './members'
import { Invitation } from './invitations'
import { isGuest } from './roles'

export type Pagination = {
  isFetching: boolean
  isLoaded: boolean
  ids: number[]
  pageCount: number
  searchCount: number
  totalCount: number
}

export type AllPagination = {
  members: Pagination
  membersOnly: Pagination
  guests: Pagination
  invitations: Pagination
  totalCount: number
}

type ActionTypes = 'bulkSuccess' | 'failure' | 'request' | 'success'

export type AllowedTypes = {
  [action in ActionTypes]?: string
}

export type PaginationKey = 'members' | 'membersOnly' | 'guests' | 'invitations'

const getIdsPerKey = (ids: number[], results: Member[] | Invitation[], key: PaginationKey) => {
  if (key === 'membersOnly' || key === 'guests') {
    return (results as Array<Member | Invitation>)
      .filter((item: Member | Invitation) => {
        if (key === 'membersOnly') {
          return !isGuest(item.roleID)
        }

        return isGuest(item.roleID)
      })
      .map((obj: Member | Invitation) => {
        if ('userID' in obj) {
          return obj.userID
        }

        return obj.id
      })
  }

  // 'members' or 'invitations'
  return union(
    ids,
    (results as Array<Member | Invitation>).map((result: Member | Invitation) => {
      if ('userID' in result) {
        return result.userID
      }

      return result.id
    })
  )
}

const getSearchCount = (key: PaginationKey, paginationTotal: number, total: number) => {
  if (key === 'membersOnly' || key === 'guests') {
    return total
  }
  // 'members' or 'invitations'
  return paginationTotal
}

const getTotalCount = (
  key: PaginationKey,
  paginationTotal: number,
  total: number,
  stateTotalCount: number
) => {
  // action.payload.search.pagination.total doesn't work for membersOnly and guests because
  // this value is the total amount of members + guests
  if (key === 'membersOnly' || key === 'guests') {
    return total ?? stateTotalCount
  }
  // 'members' or 'invitations'
  return Math.max(paginationTotal, stateTotalCount ?? 0)
}

type PaginationReducerArgs = {
  types: AllowedTypes
  key: PaginationKey
}

const paginationReducer = ({ types = {}, key }: PaginationReducerArgs) => {
  if (typeof key !== 'string') {
    throw new Error('Expected key to be a string.')
  }

  const hasType = (type: string, allowedType: string | undefined) => {
    if (allowedType !== undefined && allowedType !== null) {
      return type === allowedType
    }

    return false
  }

  const initialState: Pagination = {
    isFetching: false,
    isLoaded: false,
    ids: [],
    pageCount: 0,
    searchCount: 0,
    totalCount: 0
  }

  const updatePagination: Reducer<Pagination> = (state: Pagination = initialState, action) => {
    switch (true) {
      case hasType(action.type, types.request):
        return {
          ...state,
          isFetching: true,
          isLoaded: false
        }
      case hasType(action.type, types.success): {
        const ids = getIdsPerKey(state.ids, action.payload.results, key)

        return {
          ...state,
          isFetching: false,
          isLoaded: true,
          ids,
          pageCount: (state.pageCount ?? 0) + 1,
          searchCount: getSearchCount(key, action.payload.search.pagination.total, ids.length),
          totalCount: getTotalCount(
            key,
            action.payload.search.pagination.total,
            ids.length,
            state.totalCount
          )
        }
      }
      case hasType(action.type, types.bulkSuccess):
        return {
          ...state,
          isFetching: false,
          isLoaded: true,
          ids: getIdsPerKey(state.ids, action.payload.results, key),
          searchCount: action.payload.search.pagination.total,
          totalCount: action.payload.search.pagination.total
        }
      case hasType(action.type, types.failure):
        return {
          ...state,
          isFetching: false,
          isLoaded: false
        }
      default:
        return state
    }
  }

  return (state: Pagination = initialState, action: AnyAction) => {
    // Update pagination by key
    switch (true) {
      case hasType(action.type, types.request):
      case hasType(action.type, types.success):
      case hasType(action.type, types.failure):
      case hasType(action.type, types.bulkSuccess):
        return {
          ...state,
          ...updatePagination(state, action)
        }
      default: {
        return state
      }
    }
  }
}

export default paginationReducer
