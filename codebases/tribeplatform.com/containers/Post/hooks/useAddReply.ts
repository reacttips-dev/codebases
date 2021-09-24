import { useCallback, useEffect } from 'react'

import {
  FetchResult,
  gql,
  MutationHookOptions,
  useMutation,
} from '@apollo/client'
import { ApolloCache } from '@apollo/client/cache/core/cache'
import { nanoid } from 'nanoid'
import Quill from 'quill'

import {
  AddReplyMutation,
  AddReplyMutationVariables,
  ADD_REPLY,
  GetRepliesQuery,
  GET_POST_REPLIES,
} from 'tribe-api/graphql'
import {
  PermissionContext,
  Post,
  PostEdge,
  PostMappingFieldInput,
  PostStatus,
  PostType,
} from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

import {
  generateMappingFieldForAnswer,
  generateMappingFieldForDiscussion,
} from '../utils'

let currentDelta = null

export type UseAddReplyResult = {
  loading: boolean
  addReply: ({
    content,
    postType,
  }: {
    content: string
    postType: PostType
  }) => Promise<FetchResult<AddReplyMutation>>
}

const useAddReply = (
  replyTo: Post,
  quill?: Quill,
  mutationOptions?: MutationHookOptions<
    AddReplyMutation,
    AddReplyMutationVariables
  >,
): UseAddReplyResult => {
  const { authUser } = useAuthMember()
  const toast = useToast()
  const { t } = useTranslation()

  const updatePost = (cache: ApolloCache<AddReplyMutation>, replyTo: Post) => {
    cache.writeFragment({
      id: cache.identify(replyTo),
      fragment: gql`
        fragment _ on Post {
          repliesCount
          totalRepliesCount
        }
      `,
      data: {
        repliesCount: replyTo.repliesCount + 1,
        totalRepliesCount: replyTo.totalRepliesCount + 1,
      },
    })
  }

  const updatePostReplies = (
    cache: ApolloCache<AddReplyMutation>,
    replyTo: Post,
    newData: Post,
  ) => {
    if (!newData) {
      return
    }
    const cachedQuery = cache.readQuery<GetRepliesQuery>({
      query: GET_POST_REPLIES,
      variables: { postId: replyTo.id },
    })

    if (!cachedQuery) return

    const { getReplies: replies } = cachedQuery
    const newReply: PostEdge = {
      __typename: 'PostEdge',
      cursor: '',
      node: newData,
    }

    const newEdges = replies.edges
      ? ([newReply, ...replies.edges] as PostEdge[])
      : [newReply]

    cache.writeQuery<GetRepliesQuery>({
      query: GET_POST_REPLIES,
      variables: { postId: replyTo.id },
      data: {
        getReplies: {
          ...replies,
          totalCount: replies.totalCount + 1,
          edges: newEdges,
        },
      },
    })
  }

  const [addReplyMutate, { loading, error }] = useMutation<
    AddReplyMutation,
    AddReplyMutationVariables
  >(ADD_REPLY, { ...mutationOptions })

  const addReply = useCallback(
    async ({ postType, content, quill }) => {
      currentDelta = quill?.getContents?.()
      const mappingFields =
        postType?.name === 'Comment'
          ? generateMappingFieldForDiscussion({
              title: '',
              content,
            })
          : generateMappingFieldForAnswer({
              content,
            })

      const mappingFieldsInput: PostMappingFieldInput[] = mappingFields.map(
        ({ __typename, ...rest }) => {
          return {
            ...rest,
          }
        },
      )

      const optimisticFlag = 'optimistic'

      const optimisticReply: AddReplyMutation['addReply'] = {
        __typename: 'Post',
        id: `${optimisticFlag}-${nanoid()}`,
        mappingFields,
        createdAt: new Date().toISOString(),
        createdBy: {
          __typename: 'SpaceMember',
          member: authUser,
          role: null,
        },
        embeds: null,
        mentions: null,
        owner: {
          __typename: 'SpaceMember',
          member: authUser,
          role: null,
        },
        authMemberProps: {
          __typename: 'PostAuthMemberProps',
          context: PermissionContext.POST,
          permissions: [],
        },
        shortContent: content,
        hasMoreContent: false,
        repliesCount: 0,
        totalRepliesCount: 0,
        space: replyTo.space,
        status: PostStatus.PUBLISHED,
        tags: [],
        reactions: [],
        postTypeId: postType.id,
        postType: replyTo.postType,
        repliedTo: {
          __typename: 'Post',
          id: '',
        },
        title: '',
      }

      return addReplyMutate({
        variables: {
          postTypeId: postType.id,
          mappingFields: mappingFieldsInput,
          postId: replyTo?.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addReply: optimisticReply,
        },
        update: (cache: ApolloCache<AddReplyMutation>, { data }) => {
          try {
            const reply = data?.addReply
            const isOptimisticReply = reply?.id?.includes(optimisticFlag)
            if (!isOptimisticReply && reply?.status === PostStatus.BLOCKED) {
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
            updatePost(cache, replyTo)
          } catch (e) {
            logger.error('error - updating GET_POST for useAddReply', e)
          }
          try {
            updatePostReplies(cache, replyTo, data?.addReply as Post)
          } catch (e) {
            logger.debug('error - updating GET_POST_REPLIES for useAddReply', e)
          }
        },
      })
    },
    [replyTo, addReplyMutate, authUser, toast, t],
  )

  useEffect(() => {
    if (error && quill) {
      quill.setContents(currentDelta)
      toast({
        title: t('post:feedback.postError.title', {
          defaultValue: 'Error occured',
        }),
        description: t('post:feedback.postError.description', {
          defaultValue: 'Please try posting again',
        }),
        status: 'error',
      })
    }
  }, [error, quill, t, toast])

  return {
    addReply,
    loading,
  }
}

export default useAddReply
