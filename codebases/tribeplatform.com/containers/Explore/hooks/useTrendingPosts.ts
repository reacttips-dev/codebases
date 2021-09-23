import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'
import dayjs from 'dayjs'

import {
  GET_FEED,
  GetFeedQuery,
  GetFeedQueryVariables,
} from 'tribe-api/graphql'
import {
  Post,
  PostListFilterByEnum,
  PostListFilterByOperator,
  PostListOrderByEnum,
} from 'tribe-api/interfaces'
import { useDeepMemo } from 'tribe-components'

import { useGetSpaceTypes } from 'containers/Space/hooks/useGetSpaceTypes'

type UseGetFeedResult = QueryResult<GetFeedQuery> & {
  posts: Post[]
  isEmpty: boolean
  skip: boolean
}

const TRENDING_POSTS_LIMIT = 10

const useTrendingPosts = (): UseGetFeedResult => {
  const { spaceTypes } = useGetSpaceTypes()
  const postTypeIds = spaceTypes
    ?.flatMap(it => it.availablePostTypes || [])
    .filter(it => it?.name?.toLowerCase() === 'discussion')
    .map(it => it?.id)
  const skip = postTypeIds.length === 0

  const { loading, data, error } = useQuery<
    GetFeedQuery,
    GetFeedQueryVariables
  >(GET_FEED, {
    fetchPolicy: 'network-only',
    skip,
    variables: {
      filterBy: [
        {
          key: PostListFilterByEnum.CREATEDAT,
          value: JSON.stringify(
            dayjs()
              .subtract(15, 'day')
              .startOf('day')
              .toISOString(),
          ),
          operator: PostListFilterByOperator.GTE,
        },
      ],
      limit: TRENDING_POSTS_LIMIT,
      orderBy: PostListOrderByEnum.TOTALREPLIESCOUNT,
      postTypeIds,
    },
  })

  const posts = useDeepMemo(
    () => data?.getFeed?.edges?.map(edge => edge.node as Post) || [],
    [data],
  )

  return {
    data,
    error,
    loading,
    posts,
    isInitialLoading: loading && data === undefined,
    isEmpty: !loading && data?.getFeed?.totalCount === 0,
    skip,
  }
}

export default useTrendingPosts
