import { useCallback } from 'react'

import { useQuery } from '@apollo/client'

import {
  ExploreSpacesQuery,
  ExploreSpacesQueryVariables,
  GET_EXPLORE_SPACES,
} from 'tribe-api/graphql'
import { Space } from 'tribe-api/interfaces'

import { PaginatedQueryResult } from '../../@types'

export const DEFAULT_SPACES_LIMIT = 10

export type useGetExploreSpacesResult = PaginatedQueryResult<
  ExploreSpacesQuery
> & {
  spaces: Space[]
}

const useGetExploreSpaces = (
  props?: ExploreSpacesQueryVariables,
): useGetExploreSpacesResult => {
  const { limit = DEFAULT_SPACES_LIMIT } = props || {}
  const { data, loading, error, fetchMore } = useQuery<
    ExploreSpacesQuery,
    ExploreSpacesQueryVariables
  >(GET_EXPLORE_SPACES, {
    variables: {
      limit,
      ...props,
    },
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.exploreSpaces?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      fetchMore({
        variables: {
          after: data?.exploreSpaces?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.exploreSpaces, fetchMore])

  return {
    data,
    spaces: data?.exploreSpaces?.edges?.map(edge => edge.node as Space) || [],
    loading,
    error,
    totalCount: data?.exploreSpaces?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.exploreSpaces?.totalCount === 0,
  }
}

export default useGetExploreSpaces
