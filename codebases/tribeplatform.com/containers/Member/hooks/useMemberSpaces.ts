import { useCallback, useState } from 'react'

import { useQuery } from '@apollo/client'
import { ApolloQueryResult } from '@apollo/client/core'
import { PaginatedQueryResult } from '@types'

import {
  MEMBER_SPACES,
  MemberSpacesQuery,
  MemberSpacesQueryVariables,
} from 'tribe-api/graphql'
import { SpaceMember } from 'tribe-api/interfaces'

export const DEFAULT_SPACES_LIMIT = 20

export type UseMemberSpacesResult = PaginatedQueryResult<MemberSpacesQuery> & {
  spaceMembers: SpaceMember[]
  query?: (
    variables?: Partial<MemberSpacesQueryVariables>,
  ) => Promise<ApolloQueryResult<MemberSpacesQuery>>
  searchResult: boolean
}

const useMemberSpaces = (
  props: MemberSpacesQueryVariables,
): UseMemberSpacesResult => {
  const { limit = DEFAULT_SPACES_LIMIT } = props || {}
  const { data, loading, error, fetchMore, refetch } = useQuery<
    MemberSpacesQuery,
    MemberSpacesQueryVariables
  >(MEMBER_SPACES, {
    variables: {
      ...props,
    },
    fetchPolicy: 'cache-and-network',
  })
  const [searchResult, setSearchResult] = useState(false)

  const hasNextPage = data?.memberSpaces?.pageInfo?.hasNextPage || false

  const query = useCallback(
    variables => {
      setSearchResult(!!variables?.query)
      return refetch({
        limit: variables?.limit || limit,
        // query: variables?.query,
      })
    },
    [refetch, limit],
  )

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.memberSpaces?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.memberSpaces, fetchMore])

  return {
    data,
    spaceMembers:
      data?.memberSpaces?.edges?.map(edge => edge.node as SpaceMember) || [],
    loading,
    error,
    totalCount: data?.memberSpaces?.totalCount,
    hasNextPage,
    loadMore,
    query,
    searchResult,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.memberSpaces?.totalCount === 0,
  }
}

export default useMemberSpaces
