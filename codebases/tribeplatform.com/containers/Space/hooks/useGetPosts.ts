import { useCallback, useMemo } from 'react'

import { useQuery } from '@apollo/client'
import { PaginatedQueryResult } from '@types'

import { GetPostsQuery, GetPostsQueryVariables } from 'tribe-api/graphql'
import { GET_POSTS } from 'tribe-api/graphql/posts.gql'
import { Post } from 'tribe-api/interfaces'

export const DEFAULT_POSTS_LIMIT = 10

type UseGetPostsResult = PaginatedQueryResult<GetPostsQuery> & {
  posts: Post[]
}

export const useGetPosts = ({
  spaceIds,
  limit,
  after,
  excludePins = false,
  filterBy,
}: GetPostsQueryVariables): UseGetPostsResult => {
  let skip = false
  if (Array.isArray(spaceIds) && spaceIds.length > 0) {
    skip = !spaceIds.every(s => Boolean(s))
  }

  const { loading, data, error, fetchMore } = useQuery<
    GetPostsQuery,
    GetPostsQueryVariables
  >(GET_POSTS, {
    variables: {
      spaceIds,
      limit,
      after,
      excludePins,
      filterBy,
    },
    skip,
    fetchPolicy: 'cache-and-network',
  })

  const hasNextPage = data?.getPosts?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage && fetchMore) {
      return fetchMore({
        variables: {
          after: data?.getPosts?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, data?.getPosts, fetchMore])

  const posts = useMemo(
    () => data?.getPosts?.edges?.map(edge => edge.node as Post) || [],
    [data?.getPosts],
  )

  return {
    loading,
    error,
    data,
    posts,
    totalCount: data?.getPosts?.totalCount,
    isInitialLoading: loading && data?.getPosts === undefined,
    isEmpty: !loading && data?.getPosts?.totalCount === 0,
    hasNextPage,
    loadMore,
  }
}

export default useGetPosts
