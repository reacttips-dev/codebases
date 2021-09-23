import { useCallback, useEffect, useMemo, useState } from 'react'

import { QueryHookOptions, useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GetNetworkMembersQuery,
  GetNetworkMembersQueryVariables,
} from 'tribe-api/graphql'
import { GET_NETWORK_MEMBERS } from 'tribe-api/graphql/members.gql'
import { Member } from 'tribe-api/interfaces'

export const NETWORK_MEMBERS_LIMIT = 20

type UseNetworkMembersProps = QueryHookOptions<
  GetNetworkMembersQuery,
  GetNetworkMembersQueryVariables
> & {
  shouldPreserveInitialValue?: boolean
}

type UseNetworkMembersResult = PaginatedQueryResult<GetNetworkMembersQuery> & {
  members: Array<Member>
  query?: (
    variables?: Partial<GetNetworkMembersQueryVariables>,
  ) => Promise<void>
  searchResult: boolean
}

// Flag to control the initial value.
let shouldDisplayInitialValue = true
let initialMembers: Array<Member> = []

export const useNetworkMembers = (
  args: UseNetworkMembersProps = {
    variables: {
      limit: NETWORK_MEMBERS_LIMIT,
    },
    shouldPreserveInitialValue: false,
  },
): UseNetworkMembersResult => {
  const { shouldPreserveInitialValue = false, ...options } = args || {}

  const { loading, error, data, refetch, fetchMore } = useQuery<
    GetNetworkMembersQuery,
    GetNetworkMembersQueryVariables
  >(GET_NETWORK_MEMBERS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    ...options,
  })
  const [searchResult, setSearchResult] = useState(false)

  const { hasNextPage, endCursor } = data?.getMembers?.pageInfo || {
    hasNextPage: false,
  }
  const query = useCallback(
    async (variables?: Partial<GetNetworkMembersQueryVariables>) => {
      setSearchResult(!!variables?.query)

      refetch({
        limit: variables?.limit || options?.variables?.limit,
        query: variables?.query,
      })
    },
    [options?.variables?.limit, refetch],
  )

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: endCursor,
        },
      })
    }
  }, [hasNextPage, endCursor, fetchMore])

  const membersFromQuery: Array<Member> = useMemo(
    () => data?.getMembers?.edges?.map(edge => edge?.node as Member) || [],
    [data?.getMembers],
  )

  useEffect(() => {
    if (!loading) {
      shouldDisplayInitialValue = false
    }
  }, [loading])

  if (shouldPreserveInitialValue && data && initialMembers?.length === 0) {
    initialMembers = membersFromQuery.slice(0, options?.variables?.limit)
  }

  useEffect(() => {
    return () => {
      shouldDisplayInitialValue = true
    }
  }, [])

  const members = (() => {
    if (shouldDisplayInitialValue && shouldPreserveInitialValue)
      return initialMembers

    return membersFromQuery
  })()

  return {
    data,
    members,
    loading,
    error,
    hasNextPage,
    totalCount: data?.getMembers?.totalCount,
    query,
    loadMore,
    searchResult,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getMembers?.totalCount === 0,
  }
}

export default useNetworkMembers
