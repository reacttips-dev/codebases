import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import {
  GET_POST_REPLIES,
  GetRepliesQuery,
  GetRepliesQueryVariables,
} from 'tribe-api/graphql'
import { Post } from 'tribe-api/interfaces'

export const DEFAULT_COMMENT_LIMIT = 10
export const LOAD_MORE_COMMENT_LIMIT = 10

export type UseGetPostCommentsResult = PaginatedQueryResult<GetRepliesQuery> & {
  comments: Post[]
}

export const useGetPostComments = ({
  postId,
  limit = DEFAULT_COMMENT_LIMIT,
}: {
  postId: string
  limit?: number
}): UseGetPostCommentsResult => {
  const { data, loading, error, fetchMore } = useQuery<
    GetRepliesQuery,
    GetRepliesQueryVariables
  >(GET_POST_REPLIES, {
    variables: {
      postId,
      limit,
    },
    skip: !postId || typeof window === 'undefined',
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.getReplies?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      return fetchMore({
        variables: {
          after: data?.getReplies?.pageInfo?.endCursor,
          limit: LOAD_MORE_COMMENT_LIMIT,
          reverse: true,
        },
      })
    }
  }, [hasNextPage, data?.getReplies, fetchMore])

  const comments: Post[] = useMemo(
    () => data?.getReplies?.edges?.map(edge => edge.node as Post) || [],
    [data?.getReplies],
  )

  return {
    loading,
    error,
    data,
    comments,
    totalCount: data?.getReplies?.totalCount,
    hasNextPage,
    loadMore,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getReplies?.totalCount === 0,
  }
}
