import { gql, useApolloClient } from '@apollo/client'

import {
  PinPostToSpaceMutation,
  PinPostToSpaceMutationVariables,
  UnpinPostFromSpaceMutation,
  UnpinPostFromSpaceMutationVariables,
  PIN_POST_TO_SPACE,
  UNPIN_POST_FROM_SPACE,
} from 'tribe-api/graphql'
import { Post, PinnedInto, ActionStatus } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'

import { logger } from 'lib/logger'

const onUpdate = (post: Post, optimisticPinnedTo: PinnedInto | []) => cache => {
  try {
    cache.writeFragment({
      id: cache.identify(post),
      fragment: gql`
        fragment _ on Post {
          pinnedInto
        }
      `,
      data: {
        pinnedInto: optimisticPinnedTo,
      },
    })
  } catch (e) {
    logger.error('error - updating cache for post reaction', e)
  }
}

const usePinPost = (post: Post) => {
  const toast = useToast()
  const apolloClient = useApolloClient()

  const pin = async () => {
    if (post?.id == null) {
      logger.error('post id is undefined')
      return
    }
    apolloClient
      .mutate<PinPostToSpaceMutation, PinPostToSpaceMutationVariables>({
        mutation: PIN_POST_TO_SPACE,
        variables: {
          postId: post?.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          pinPostToSpace: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: onUpdate(post, PinnedInto.SPACE),
        errorPolicy: 'all',
      })
      .then(res => {
        const { errors } = res
        if (errors) {
          errors.forEach(error => {
            toast({
              description: error.message,
              status: 'error',
              position: 'top-right',
            })
          })
        }
        return res
      })
  }

  const unpin = async () => {
    if (post?.id == null) {
      logger.error('post id is undefined')
      return
    }
    apolloClient
      .mutate<UnpinPostFromSpaceMutation, UnpinPostFromSpaceMutationVariables>({
        mutation: UNPIN_POST_FROM_SPACE,
        variables: {
          postId: post?.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          unpinPostFromSpace: {
            __typename: 'Action',
            status: ActionStatus.SUCCEEDED,
          },
        },
        update: onUpdate(post, []),
      })
      .then(res => {
        return res
      })
  }

  const isPinned = post?.pinnedInto?.includes(PinnedInto.SPACE)

  return {
    pin,
    unpin,
    isPinned,
  }
}

export default usePinPost
