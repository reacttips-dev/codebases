import { useCallback } from 'react'

import { useApolloClient } from '@apollo/client'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'

import {
  GET_POST,
  RemovePostMutation,
  RemovePostMutationVariables,
  REMOVE_POST,
} from 'tribe-api/graphql'
import { Post } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { logger } from 'lib/logger'

const useRemovePost = (post: Post) => {
  const apolloClient = useApolloClient()
  const toast = useToast()
  const { t } = useTranslation()

  const remove = useCallback(async () => {
    if (!post?.id) {
      logger.error('post id is undefined')
      return
    }

    apolloClient
      .mutate<RemovePostMutation, RemovePostMutationVariables>({
        mutation: REMOVE_POST,
        variables: {
          postId: post?.id,
        },
        refetchQueries: post?.repliedTo?.id
          ? [
              {
                query: GET_POST,
                variables: {
                  postId: post.repliedTo.id,
                },
              },
            ]
          : [],
      })
      .then(res => {
        try {
          const removePost = (existingPostsRefs, { readField }) => {
            if (Array.isArray(existingPostsRefs?.edges)) {
              return {
                ...existingPostsRefs,
                edges: existingPostsRefs?.edges?.filter(
                  postRef => post?.id !== readField('id', postRef?.node),
                ),
              }
            }
            return existingPostsRefs
          }
          apolloClient.cache.modify({
            fields: {
              getReplies(existingRepliesRefs, details) {
                return removePost(existingRepliesRefs, details)
              },
              getPosts(existingPostsRefs, details) {
                return removePost(existingPostsRefs, details)
              },
              getFeed(existingPostsRefs, details) {
                return removePost(existingPostsRefs, details)
              },
            },
          })
        } catch (e) {
          logger.warn("couldn't invalidate the posts cache", post?.id, e)
        }
        return res
      })
      .then(res => {
        toast({
          title: t('post.delete.success.title', 'Post deleted'),
          description: t(
            'post.delete.success.description',
            'Post and replies have been deleted.',
          ),
          icon: DeleteBinLineIcon,
        })
        return res
      })
  }, [post?.id])

  return {
    remove,
  }
}

export default useRemovePost
