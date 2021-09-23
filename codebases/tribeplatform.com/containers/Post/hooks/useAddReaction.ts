import { useCallback } from 'react'

import { gql, useMutation } from '@apollo/client'
import produce from 'immer'

import {
  AddReactionMutation,
  AddReactionMutationVariables,
  RemoveReactionMutation,
  RemoveReactionMutationVariables,
} from 'tribe-api/graphql'
import { ADD_REACTION, REMOVE_REACTION } from 'tribe-api/graphql/posts.gql'
import {
  PostReactionParticipant,
  Member,
  ActionStatus,
  Post,
} from 'tribe-api/interfaces'

import { logger } from 'lib/logger'

type UseAddReactionResult = {
  react: (post: Post, reaction: string, authUser: Member) => void
}

const useAddReaction = (): UseAddReactionResult => {
  const [addReaction] = useMutation<
    AddReactionMutation,
    AddReactionMutationVariables
  >(ADD_REACTION)

  const [removeReaction] = useMutation<
    RemoveReactionMutation,
    RemoveReactionMutationVariables
  >(REMOVE_REACTION)

  const onUpdate = (post: Post, optimisticReactions) => cache => {
    try {
      cache.writeFragment({
        id: cache.identify(post),
        fragment: gql`
          fragment MyReactions on Post {
            reactions {
              count
              reacted
              reaction
              participants(limit: 50) {
                nodes {
                  participant {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
        data: {
          reactions: optimisticReactions,
        },
      })
    } catch (e) {
      logger.error('error - updating cache for post reaction', e)
    }
  }

  const react = useCallback(
    (post: Post, reaction: string, authUser: Member) => {
      const likeReaction = post?.reactions?.find(it => it.reaction === reaction)
      const { reacted = false } = likeReaction || {}

      const userReaction: PostReactionParticipant = {
        __typename: 'PostReactionParticipant',
        participant: {
          ...authUser,
        },
      }

      const optimisticReactions = produce(post.reactions || [], draft => {
        const likeReaction = draft?.find(it => it.reaction === reaction)
        if (likeReaction) {
          likeReaction.reacted = !likeReaction.reacted
          if (likeReaction.reacted) {
            likeReaction.count += 1
            likeReaction.participants?.nodes?.push(userReaction)
          } else {
            likeReaction.count -= 1
            if (likeReaction.participants?.nodes) {
              likeReaction.participants.nodes = likeReaction.participants.nodes.filter(
                node => node.participant?.id !== authUser.id,
              )
            }
          }
        } else {
          draft?.push({
            participants: {
              __typename: 'PaginatedPostReactionParticipant',
              nodes: [userReaction],
              pageInfo: {
                __typename: 'PageInfo',
                hasNextPage: true,
              },
              totalCount: 0,
            },
            reacted: true,
            count: 1,
            reaction,
            __typename: 'PostReactionDetail',
          })
        }
      })

      if (!reacted) {
        return addReaction({
          variables: {
            input: {
              reaction,
            },
            postId: post.id,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addReaction: {
              __typename: 'Action',
              status: ActionStatus.SUCCEEDED,
            },
          },
          update: onUpdate(post, optimisticReactions),
        })
      }
      return removeReaction({
        variables: {
          reaction,
          postId: post.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeReaction: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: onUpdate(post, optimisticReactions),
      })
    },
    [],
  )
  return { react }
}

export default useAddReaction
