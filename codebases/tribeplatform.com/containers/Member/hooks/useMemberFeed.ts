import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GET_MEMBER_FEED,
  GetMemberFeedQuery,
  GetMemberFeedQueryVariables,
} from 'tribe-api/graphql'
import { Post } from 'tribe-api/interfaces'

export type UseMemberFeedResult = PaginatedQueryResult<GetMemberFeedQuery> & {
  posts: Post[]
}

export const useMemberFeed = (
  variables: GetMemberFeedQueryVariables,
): UseMemberFeedResult => {
  const { loading, data, error, fetchMore } = useQuery<
    GetMemberFeedQuery,
    GetMemberFeedQueryVariables
  >(GET_MEMBER_FEED, {
    variables,
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.getMemberPosts?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getMemberPosts?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getMemberPosts, fetchMore])

  const posts = useMemo(
    () => data?.getMemberPosts?.edges?.map(edge => edge.node as Post) || [],
    [data?.getMemberPosts],
  )

  return {
    loading,
    error,
    data,
    posts,
    totalCount: data?.getMemberPosts?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getMemberPosts?.totalCount === 0,
  }
}
