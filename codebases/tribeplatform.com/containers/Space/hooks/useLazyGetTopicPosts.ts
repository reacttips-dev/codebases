import { useCallback, useMemo } from 'react'

import { useLazyQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GetSpaceTopicPostsQuery,
  GetSpaceTopicPostsQueryVariables,
} from 'tribe-api/graphql'
import { GET_SPACE_TOPIC_POSTS } from 'tribe-api/graphql/posts.gql'
import { Post } from 'tribe-api/interfaces'

export const DEFAULT_POSTS_LIMIT = 10

type UseGetPostsResult = PaginatedQueryResult<GetSpaceTopicPostsQuery> & {
  posts: Post[]
  getTopicPosts: (topicId: string) => void
}

export const useLazyGetTopicPosts = ({
  spaceId,
  limit,
  after,
}: GetSpaceTopicPostsQueryVariables): UseGetPostsResult => {
  const [query, { loading, data, error, fetchMore }] = useLazyQuery<
    GetSpaceTopicPostsQuery,
    GetSpaceTopicPostsQueryVariables
  >(GET_SPACE_TOPIC_POSTS, {
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.getSpaceTopicPosts?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getSpaceTopicPosts?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getSpaceTopicPosts, fetchMore])

  const posts = useMemo(
    () => data?.getSpaceTopicPosts?.edges?.map(edge => edge.node as Post) || [],
    [data?.getSpaceTopicPosts],
  )

  const getTopicPosts = useCallback(
    (topicId: string) => {
      query({
        variables: {
          spaceId,
          limit,
          after,
          topicId,
        },
      })
    },
    [query],
  )

  return {
    loading,
    error,
    data,
    posts,
    getTopicPosts,
    totalCount: data?.getSpaceTopicPosts?.totalCount,
    isInitialLoading: loading && data?.getSpaceTopicPosts === undefined,
    isEmpty: !loading && data?.getSpaceTopicPosts?.totalCount === 0,
    hasNextPage,
    loadMore,
  }
}

export default useLazyGetTopicPosts
