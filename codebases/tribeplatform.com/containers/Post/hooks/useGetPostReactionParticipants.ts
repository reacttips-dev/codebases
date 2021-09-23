import { useCallback } from 'react'

import { useQuery } from '@apollo/client'
import { QueryResult } from '@apollo/client/react/types/types'

import {
  GET_POST_REACTION_PARTICIPANTS,
  GetPostReactionParticipantsQuery,
  GetPostReactionParticipantsQueryVariables,
} from 'tribe-api/graphql'
import { PostReactionParticipant } from 'tribe-api/interfaces'

export const DEFAULT_POST_REACTION_PARTICIPANTS_LIMIT = 10

type PaginatedQueryHelper = {
  hasNextPage: boolean
  loadMore: () => void
}

type UseGetPostsResult = QueryResult<
  GetPostReactionParticipantsQuery,
  GetPostReactionParticipantsQueryVariables
> &
  PaginatedQueryHelper & {
    participants: PostReactionParticipant[]
  }

export const useGetPostReactionParticipants = ({
  postId,
  reactionId,
  limit,
  after,
}: GetPostReactionParticipantsQueryVariables): UseGetPostsResult => {
  const result = useQuery<
    GetPostReactionParticipantsQuery,
    GetPostReactionParticipantsQueryVariables
  >(GET_POST_REACTION_PARTICIPANTS, {
    variables: {
      postId,
      reactionId,
      limit,
      after,
    },
    skip: !postId || !reactionId,
  })

  const hasNextPage =
    result?.data?.getPostReactionParticipants?.pageInfo?.hasNextPage || false

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      return result?.fetchMore({
        variables: {
          after: result.data?.getPostReactionParticipants?.pageInfo?.endCursor,
        },
      })
    }
  }, [hasNextPage, result])

  return {
    ...result,
    participants:
      result?.data?.getPostReactionParticipants?.edges?.map(
        edge => edge.node as PostReactionParticipant,
      ) || [],
    hasNextPage,
    loadMore,
  }
}
