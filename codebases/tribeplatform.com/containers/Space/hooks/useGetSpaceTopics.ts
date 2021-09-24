import { useCallback, useMemo } from 'react'

import { useQuery, ApolloQueryResult } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GET_SPACE_TOPICS,
  GetSpaceTopicsQuery,
  GetSpaceTopicsQueryVariables,
} from 'tribe-api'
import { Tag } from 'tribe-api/interfaces'

export const DEFAULT_SPACE_TOPICS_LIMIT = 50

export type useGetSpaceTopicsResult = PaginatedQueryResult<
  GetSpaceTopicsQuery
> & {
  topics: Tag[]
  query?: (
    variables?: Partial<GetSpaceTopicsQueryVariables>,
  ) => Promise<ApolloQueryResult<GetSpaceTopicsQuery>>
}

export const useGetSpaceTopics = ({
  limit = DEFAULT_SPACE_TOPICS_LIMIT,
  spaceId,
}: GetSpaceTopicsQueryVariables): useGetSpaceTopicsResult => {
  const { data, loading, refetch, error } = useQuery<
    GetSpaceTopicsQuery,
    GetSpaceTopicsQueryVariables
  >(GET_SPACE_TOPICS, {
    variables: {
      limit,
      spaceId,
    },
  })

  const hasNextPage = data?.getSpaceTopics?.pageInfo?.hasNextPage || false

  const query = useCallback(
    variables =>
      refetch({
        limit: variables?.limit || limit,
        query: variables?.query,
      }),
    [refetch, limit],
  )

  const topics = useMemo(
    () => data?.getSpaceTopics?.edges?.map(edge => edge.node as Tag) || [],
    [data?.getSpaceTopics],
  )

  return {
    loading,
    error,
    data,
    topics,
    totalCount: data?.getSpaceTopics?.totalCount,
    hasNextPage,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    loadMore: () => {},
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getSpaceTopics?.totalCount === 0,
    query,
  }
}
