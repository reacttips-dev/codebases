import { useCallback } from 'react'

import { ApolloError, gql, useMutation } from '@apollo/client'

import {
  Post,
  HidePostMutationVariables,
  HidePostMutation,
  UnhidePostMutationVariables,
  UnhidePostMutation,
  ActionStatus,
  HIDE_POST,
  UNHIDE_POST,
} from 'tribe-api'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

const onUpdate = (post: Post, isHidden: Post['isHidden']) => cache => {
  try {
    cache.writeFragment({
      id: cache.identify(post),
      fragment: gql`
        fragment _ on Post {
          isHidden
        }
      `,
      data: {
        isHidden,
      },
    })
  } catch (e) {
    logger.error('error - updating cache for post reaction', e)
  }
}

const useHidePost = (post: Post) => {
  const toast = useToast()
  const { t } = useTranslation()

  const toastErrors = useCallback(
    (error: ApolloError) => {
      toast({
        description: error.message,
        status: 'error',
        position: 'top-right',
      })
    },
    [toast],
  )

  const [hidePostMutation] = useMutation<
    HidePostMutation,
    HidePostMutationVariables
  >(HIDE_POST, {
    onError: toastErrors,
  })

  const [unhidePostMutation] = useMutation<
    UnhidePostMutation,
    UnhidePostMutationVariables
  >(UNHIDE_POST, {
    onError: toastErrors,
  })

  const hide = useCallback(async () => {
    if (post?.id == null) {
      logger.error('post id is undefined')
      return
    }

    const { errors } = await hidePostMutation({
      variables: {
        postId: post?.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        hidePost: {
          __typename: 'Action',
          status: ActionStatus.SUCCEEDED,
        },
      },
      update: onUpdate(post, true),
    })

    if (!errors) {
      toast({
        title: t('post:hidden.title', 'Post hidden'),
        description: t(
          'post:hidden.description',
          'People won’t see this post in their Feed, but it’s still visible for the author.',
        ),
        width: '360px',
      })
    }
  }, [post, toast, toastErrors])

  const unhide = useCallback(async () => {
    if (post?.id == null) {
      logger.error('post id is undefined')
      return
    }

    return unhidePostMutation({
      variables: {
        postId: post?.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        unhidePost: {
          __typename: 'Action',
          status: ActionStatus.SUCCEEDED,
        },
      },
      update: onUpdate(post, false),
    }).catch(toastErrors)
  }, [post, toastErrors, unhidePostMutation])

  return {
    hide,
    unhide,
  }
}

export default useHidePost
