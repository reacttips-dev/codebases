import { useCallback, useMemo } from 'react'

import { MutationHookOptions, useMutation } from '@apollo/client'
import merge from 'lodash.merge'

import {
  UpdatePostMutation,
  UpdatePostMutationVariables,
  UPDATE_POST,
  GetPostQuery,
  GET_POST,
} from 'tribe-api/graphql'
import {
  Post,
  PostMappingField,
  PostMappingFieldInput,
  PostStatus,
} from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useGetPost from 'containers/Post/hooks/useGetPost'
import {
  generateMappingFieldForAnswer,
  generateMappingFieldForComment,
  generateMappingFieldForDiscussion,
  generateMappingFieldForQuestion,
} from 'containers/Post/utils'

import useAuthUserInfo from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

const useUpdatePost = (
  postId: Post['id'],
  mutationOptions?: MutationHookOptions<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >,
) => {
  const { post } = useGetPost({ postId })
  const { authUser } = useAuthUserInfo()
  const GetPostQuery = useMemo(
    () => ({
      query: GET_POST,
      variables: { postId },
    }),
    [postId],
  )

  const toast = useToast()
  const { t } = useTranslation()

  const [updatePost, { loading }] = useMutation<
    UpdatePostMutation,
    UpdatePostMutationVariables
  >(UPDATE_POST, mutationOptions)

  const update = useCallback(
    (title: string, content: string, tagNames: Array<string> = []) => {
      let mappingFields: PostMappingField[] = []
      switch (post?.postType?.name?.toLowerCase()) {
        case 'discussion':
          mappingFields = generateMappingFieldForDiscussion({
            title,
            content,
          })
          break
        case 'comment':
          mappingFields = generateMappingFieldForComment({
            content,
          })
          break
        case 'question':
          mappingFields = generateMappingFieldForQuestion({
            title,
            content,
          })
          break
        case 'answer':
          mappingFields = generateMappingFieldForAnswer({
            content,
          })
          break
        default:
          break
      }

      const mappingFieldsInput: PostMappingFieldInput[] = mappingFields.map(
        ({ __typename, ...rest }) => {
          return {
            ...rest,
          }
        },
      )

      updatePost({
        variables: {
          id: postId,
          mappingFields: mappingFieldsInput,
          tagNames,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updatePost: merge(post, { mappingFields }),
        },
        update: (cache, { data: fetchedData }) => {
          try {
            if (!authUser) {
              return
            }
            if (
              post?.status !== PostStatus.BLOCKED &&
              fetchedData?.updatePost?.status === PostStatus.BLOCKED
            ) {
              toast({
                title: t('post:feedback.blocked.title', {
                  defaultValue: 'Pending review',
                }),
                description: t('post:feedback.blocked.description', {
                  defaultValue:
                    'Your post will be visible to others once it’s been reviewed by a moderator',
                }),
                status: 'warning',
                duration: 7000,
              })
            }
            const data = cache.readQuery<GetPostQuery>(GetPostQuery)

            cache.writeQuery({
              ...GetPostQuery,
              data: {
                ...data,
                getPost: {
                  ...data?.getPost,
                  ...fetchedData?.updatePost,
                },
              },
            })
          } catch (e) {
            logger.error('useUpdatePost: cannot update cache', e)
          }
        },
      })
    },
    [postId, authUser, GetPostQuery, post, updatePost],
  )

  return {
    loading,
    update,
  }
}

export default useUpdatePost
