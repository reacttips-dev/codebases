import { useCallback, useState } from 'react'

import { ApolloQueryResult, useQuery } from '@apollo/client'

import {
  GET_SPACES,
  GetSpacesQuery,
  GetSpacesQueryVariables,
} from 'tribe-api/graphql'
import { Space } from 'tribe-api/interfaces'

import { PaginatedQueryResult } from '../../@types'

export const DEFAULT_SPACES_LIMIT = 20

export type UseGetSpacesResult = PaginatedQueryResult<GetSpacesQuery> & {
  spaces: Space[]
  query: (
    variables?: Partial<GetSpacesQueryVariables>,
  ) => Promise<ApolloQueryResult<GetSpacesQuery>>
  searchResult: boolean
}

const useGetSpaces = (props?: GetSpacesQueryVariables): UseGetSpacesResult => {
  const { limit = DEFAULT_SPACES_LIMIT } = props || {}
  const { data, loading, error, fetchMore, refetch } = useQuery<
    GetSpacesQuery,
    GetSpacesQueryVariables
  >(GET_SPACES, {
    variables: {
      limit,
      ...props,
    },
    fetchPolicy: 'cache-and-network',
  })
  const [searchResult, setSearchResult] = useState(false)

  const hasNextPage = data?.getSpaces?.pageInfo?.hasNextPage || false

  const query = useCallback(
    async variables => {
      setSearchResult(!!variables?.query)

      const result = await refetch({
        limit: variables?.limit || limit,
        query: variables?.query,
      })

      return result
    },
    [refetch, limit],
  )

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getSpaces?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getSpaces, fetchMore])

  const spaces = data?.getSpaces?.edges?.map(edge => edge.node as Space) || []

  return {
    data,
    spaces,
    loading,
    error,
    totalCount: data?.getSpaces?.totalCount,
    hasNextPage,
    loadMore,
    query,
    searchResult,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getSpaces?.totalCount === 0,
  }
}

export default useGetSpaces
