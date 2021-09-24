import { useCallback } from 'react'

import { ApolloQueryResult, QueryHookOptions, useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GET_FEED,
  GetFeedQuery,
  GetFeedQueryVariables,
} from 'tribe-api/graphql'
import { Post } from 'tribe-api/interfaces'
import { useDeepMemo } from 'tribe-components'

type UseGetFeedResult = PaginatedQueryResult<GetFeedQuery> & {
  refetch: (
    variables?: GetFeedQueryVariables,
  ) => Promise<ApolloQueryResult<GetFeedQuery>>
  posts: Post[]
}

const useFeed = (
  variables: GetFeedQueryVariables,
  queryOptions?: QueryHookOptions,
): UseGetFeedResult => {
  const { loading, data, error, fetchMore, refetch } = useQuery<
    GetFeedQuery,
    GetFeedQueryVariables
  >(GET_FEED, {
    ...queryOptions,
    variables,
  })

  const hasNextPage = data?.getFeed?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getFeed?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data, fetchMore])

  const posts = useDeepMemo(
    () => data?.getFeed?.edges?.map(edge => edge.node as Post) || [],
    [data],
  )

  return {
    data,
    error,
    hasNextPage,
    isEmpty: !loading && data?.getFeed?.totalCount === 0,
    isInitialLoading: loading && data === undefined,
    loading,
    loadMore,
    posts,
    refetch,
    totalCount: data?.getFeed?.totalCount,
  }
}

export default useFeed
