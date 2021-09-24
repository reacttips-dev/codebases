import { useQuery } from '@apollo/client'
import { QueryResult } from '@types'

import {
  GET_POST,
  GetPostQuery,
  GetPostQueryVariables,
} from 'tribe-api/graphql'
import { Post } from 'tribe-api/interfaces'

type UseGetPostResult = QueryResult<GetPostQuery> & {
  post: Post | null
}

const useGetPost = ({ postId }: GetPostQueryVariables): UseGetPostResult => {
  const { data, error, loading } = useQuery<
    GetPostQuery,
    GetPostQueryVariables
  >(GET_POST, {
    variables: {
      postId,
    },
    skip: !postId,
    fetchPolicy: 'cache-and-network',
    partialRefetch: true,
    returnPartialData: true,
  })

  return {
    data,
    error,
    loading,
    post: (data?.getPost as Post) || null,
    isInitialLoading: loading && !data?.getPost?.id,
  }
}

export default useGetPost
