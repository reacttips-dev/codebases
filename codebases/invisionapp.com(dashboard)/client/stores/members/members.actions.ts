import { Dispatch } from 'redux'
import { AxiosResponse, AxiosError } from 'axios'
import { batch } from 'react-redux'
import bffRequest from '../../utils/bffRequest'
// @ts-ignore
import constants from '../../../shared/constants'
import { AppState } from '../index'
import { Member } from './members.types'
import { selectShouldLoadAllMembers } from './members.selectors'
import { fetchLastSeen, fetchLastSeenBackground, fetchLastSeenUpdate } from '../lastSeen'
import { selectUseV2MembersFlag } from '../featureFlags'
import { selectLocationQuery } from '../location'

export const UPDATE_MEMBER_DATA = 'members/UPDATE_MEMBER_DATA'

export const FETCH = {
  REQUEST: 'teams/members/FETCH.REQUEST',
  SUCCESS: 'teams/members/FETCH.SUCCESS',
  FAILURE: 'teams/members/FETCH.FAILURE'
}

// ff: team-management-web-accts-5535-performance-improvements
export const V2_FETCH = {
  REQUEST: 'teams/members/V2_FETCH.REQUEST',
  FIRST_PAGE_SUCCESS: 'teams/members/V2_FETCH.FIRST_PAGE_SUCCESS',
  MAX_SUCCESS: 'teams/members/V2_FETCH.MAX_SUCCESS',
  NEXT_MAX_SUCCESS: 'teams/members/V2_FETCH.NEXT_MAX_SUCCESS',
  FAILURE: 'teams/members/V2_FETCH.FAILURE'
}

export const FETCH_AND_REPLACE = {
  REQUEST: 'teams/members/FETCH_AND_REPLACE.REQUEST',
  SUCCESS: 'teams/members/FETCH_AND_REPLACE.SUCCESS',
  FAILURE: 'teams/members/FETCH_AND_REPLACE.FAILURE'
}

export const UPDATE = {
  REQUEST: 'teams/members/UPDATE.REQUEST',
  SUCCESS: 'teams/members/UPDATE.SUCCESS',
  FAILURE: 'teams/members/UPDATE.FAILURE'
}

export const REMOVE_MEMBER_FROM_STORE = 'members/REMOVE_MEMBER_FROM_STORE'

type ChangeSeatTypeArgs = {
  userId: number
  seatTypeId: number
  onDone: () => void
  onError: () => void
}

export const changeSeatType = ({
  userId,
  seatTypeId,
  onDone,
  onError
}: ChangeSeatTypeArgs) => (dispatch: Dispatch) => {
  dispatch({ type: UPDATE.REQUEST, userID: userId })

  bffRequest
    .put(`/teams/api/members/change-seat-type/${userId}`, {
      userId,
      seatTypeId
    })
    .then((response: AxiosResponse) => {
      dispatch({ type: UPDATE.SUCCESS, payload: response, userID: userId })
      onDone()
    })
    .catch(() => {
      dispatch({ type: UPDATE.FAILURE, userID: userId })
      onError()
    })
}

type ChangeRoleArgs = {
  userId: number
  newRoleId: number
  onDone: () => void
  onError: () => void
}

export const changeRole = ({ userId, newRoleId, onDone, onError }: ChangeRoleArgs) => (
  dispatch: Dispatch
) => {
  dispatch({ type: UPDATE.REQUEST, userID: userId })

  bffRequest
    .put(`/teams/api/members/change-role/${userId}`, {
      userId,
      newRoleId
    })
    .then((response: AxiosResponse) => {
      dispatch({ type: UPDATE.SUCCESS, payload: response, userID: userId })
      onDone()
    })
    .catch(() => {
      dispatch({ type: UPDATE.FAILURE, userID: userId })
      onError()
    })
}

export const replaceMember = (member: Member) => ({
  type: UPDATE.SUCCESS,
  payload: { data: member }
})

export const updateBulkMembers = (memberIds: number[]) => (dispatch: Dispatch) => {
  batch(() => {
    memberIds.forEach(memberId => {
      dispatch({ type: UPDATE.REQUEST, userID: memberId })
    })
  })
}

export const updateMemberData = (member: Partial<Member>) => ({
  type: UPDATE_MEMBER_DATA,
  member
})

export const updateMembersData = (members: Partial<Member>[]) => (dispatch: Dispatch) => {
  batch(() => {
    members.forEach(member => {
      dispatch(updateMemberData(member))
    })
  })
}

export const setMembersAsLoading = () => ({ type: FETCH.REQUEST })

export const fetchMembers = {
  request: (params = { limit: constants.peopleListPageSize, offset: 0, role: '' }) => (
    dispatch: Dispatch
  ) => {
    dispatch({ type: FETCH.REQUEST })

    bffRequest
      .get('/teams/api/members', { params })
      .then((response: AxiosResponse) => dispatch(fetchMembers.success(response.data)))
      .catch((response: AxiosError) => dispatch(fetchMembers.failure(response)))
  },
  success: (payload: Member[]) => ({ type: FETCH.SUCCESS, payload }),
  failure: (error: AxiosError) => ({
    type: FETCH.FAILURE,
    payload: { message: error.message }
  })
}

type FetchV2MembersSuccessArgs = {
  results: Member[]
  cursor: string
}
export const fetchV2Members = {
  request: () => {
    return { type: V2_FETCH.REQUEST }
  },
  firstPageSuccess: ({ results, cursor }: FetchV2MembersSuccessArgs) => {
    return {
      type: V2_FETCH.FIRST_PAGE_SUCCESS,
      payload: {
        results,
        cursor,
        v2Status: cursor ? 'loading' : 'loaded'
      }
    }
  },
  maxSuccess: ({ results, cursor }: FetchV2MembersSuccessArgs) => {
    return {
      type: V2_FETCH.MAX_SUCCESS,
      payload: {
        results,
        cursor,
        v2Status: cursor ? 'loading' : 'loaded'
      }
    }
  },
  nextMaxSuccess: ({ results, cursor }: FetchV2MembersSuccessArgs) => {
    return {
      type: V2_FETCH.NEXT_MAX_SUCCESS,
      payload: {
        results,
        cursor,
        v2Status: cursor ? 'loading' : 'loaded'
      }
    }
  },
  failure: (error: AxiosError) => {
    return { type: V2_FETCH.FAILURE, payload: error }
  }
}

type FetchAllMembersArgs = {
  background?: boolean
  force?: boolean
  removeId?: number
}

export const fetchAllV1Members = ({ background, force }: FetchAllMembersArgs = {}) => (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const state = getState()
  const shouldLoad = selectShouldLoadAllMembers(state) || force // eslint-disable-line

  // Only make the request if we have to
  if (!shouldLoad) {
    return
  }

  // Sometimes, the app will want to load all the data in the background without the UI showing
  // anything
  if (!background) {
    dispatch({ type: FETCH.REQUEST })
  }

  bffRequest
    .get('/teams/api/members/all')
    .then((response: AxiosResponse) => {
      dispatch(fetchMembers.success(response.data))

      const ids = response.data.results.map((member: Member) => member.userID)
      dispatch(fetchLastSeen(ids))
    })
    .catch((response: AxiosError) => dispatch(fetchMembers.failure(response)))
}

// ff: team-management-web-accts-5535-performance-improvements
export const fetchNextMaxV2Members = (cursor: string) => (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const state = getState()
  const lastCursor = state.members.cursor

  bffRequest
    .post('/teams/api/members/v2-next-max', { cursor })
    .then((response: AxiosResponse) => {
      const newCursor = response.data.search.pagination.next

      dispatch(
        fetchV2Members.nextMaxSuccess({ results: response.data.results, cursor: newCursor })
      )

      const ids = response.data.results.map((member: Member) => member.userID)

      dispatch(fetchLastSeenUpdate(ids))

      if (newCursor && newCursor !== lastCursor) {
        dispatch(fetchNextMaxV2Members(newCursor))
      }
    })
    .catch((response: AxiosError) => dispatch(fetchV2Members.failure(response)))
}

// ff: team-management-web-accts-5535-performance-improvements
export const fetchMaxV2Members = () => (dispatch: Dispatch) => {
  bffRequest
    .post('/teams/api/members/v2-max')
    .then((response: AxiosResponse) => {
      const cursor = response.data.search.pagination.next

      dispatch(fetchV2Members.maxSuccess({ results: response.data.results, cursor }))

      const ids = response.data.results.map((member: Member) => member.userID)
      dispatch(fetchLastSeenBackground(ids))

      if (cursor) {
        dispatch(fetchNextMaxV2Members(cursor))
      }
    })
    .catch((response: AxiosError) => dispatch(fetchV2Members.failure(response)))
}

// ff: team-management-web-accts-5535-performance-improvements
export const fetchFirstPageV2Members = ({ background, force }: FetchAllMembersArgs = {}) => (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const state = getState()
  const shouldLoad = selectShouldLoadAllMembers(state) || force

  if (!shouldLoad) {
    return
  }

  if (!background) {
    dispatch(fetchV2Members.request())
  }

  bffRequest
    .post('/teams/api/members/v2-first-page')
    .then((response: AxiosResponse) => {
      const cursor = response.data.search.pagination.next

      dispatch(fetchV2Members.firstPageSuccess({ results: response.data.results, cursor }))

      const ids = response.data.results.map((member: Member) => member.userID)
      dispatch(fetchLastSeen(ids))

      if (cursor) {
        dispatch(fetchMaxV2Members())
      }
    })
    .catch((response: AxiosError) => dispatch(fetchV2Members.failure(response)))
}

export const fetchAllMembers = (args: FetchAllMembersArgs = {}) => (
  dispatch: Dispatch,
  getState: () => AppState
) => {
  const state = getState()

  // ff: team-management-web-accts-5535-performance-improvements
  if (selectUseV2MembersFlag(state)) {
    const page = selectLocationQuery('page')(state)
    if (page !== undefined && page !== '1') {
      dispatch(fetchMaxV2Members())
    } else {
      dispatch(fetchFirstPageV2Members(args))
    }
  } else {
    dispatch(fetchAllV1Members(args))
  }
}

export const fetchAndReplaceMembers = {
  request: ({
    background = false,
    params = { limit: constants.peopleListPageSize, offset: 0, role: '' }
  } = {}) => (dispatch: Dispatch) => {
    // background is used for bulk edit, we call UPDATE.REQUEST from updateBulkMembers
    // passing the ids what will be changed
    if (!background) {
      dispatch({ type: FETCH_AND_REPLACE.REQUEST })
    }

    bffRequest
      .get('/teams/api/members', { params })
      .then((response: AxiosResponse) =>
        dispatch(fetchAndReplaceMembers.success(response.data))
      )
      .catch((response: AxiosError) => dispatch(fetchAndReplaceMembers.failure(response)))
  },
  success: (payload: Member[]) => ({ type: FETCH_AND_REPLACE.SUCCESS, payload }),
  failure: (message: AxiosError) => ({ type: FETCH_AND_REPLACE.FAILURE, payload: { message } })
}

export const removeUserFromStore = (memberId: number) => (dispatch: Dispatch) => {
  dispatch(fetchAllMembers({ background: true, force: true }))
  dispatch({ type: REMOVE_MEMBER_FROM_STORE, memberId })
}
