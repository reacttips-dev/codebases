import { useCallback, useEffect } from 'react'

import { FetchResult, MutationHookOptions, useMutation } from '@apollo/client'
import { ApolloCache } from '@apollo/client/cache/core/cache'
import { nanoid } from 'nanoid'

import {
  AddPostMutation,
  AddPostMutationVariables,
  ADD_POST,
  GetFeedQuery,
  GetFeedQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
  GET_FEED,
  GET_POSTS,
  SpaceQuery,
} from 'tribe-api/graphql'
import {
  PermissionContext,
  Post,
  PostEdge,
  PostMappingField,
  PostMappingFieldInput,
  PostStatus,
  PostType,
  Space,
  SpaceMember,
  SpaceRole,
  SpaceRoleType,
} from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import {
  generateMappingFieldForAnswer,
  generateMappingFieldForComment,
  generateMappingFieldForDiscussion,
  generateMappingFieldForQuestion,
} from 'containers/Post/utils'

import useAuthMember from 'hooks/useAuthMember'

import { logger } from 'lib/logger'

import { DEFAULT_POSTS_LIMIT } from './useGetPosts'

export type UseAddPostResult = {
  loading: boolean
  publish: (
    postType: PostType,
    title: string,
    content: string,
    tagNames?: Array<string> | null,
  ) => Promise<FetchResult<AddPostMutation>>
}

const useAddPost = (
  space: SpaceQuery['space'],
  mutationOptions?: MutationHookOptions<
    AddPostMutation,
    AddPostMutationVariables
  >,
): UseAddPostResult => {
  const { authUser, isGuest } = useAuthMember()

  const toast = useToast()
  const { t } = useTranslation()

  const updatePosts = (cache: ApolloCache<AddPostMutation>, newData: Post) => {
    if (!newData) {
      return
    }

    const { getPosts: posts } =
      cache.readQuery<GetPostsQuery, GetPostsQueryVariables>({
        query: GET_POSTS,
        variables: {
          limit: DEFAULT_POSTS_LIMIT,
          spaceIds: [newData?.space?.id ?? ''],
          excludePins: true,
        },
      }) || {}

    if (!posts) {
      return
    }

    const newPost: PostEdge = {
      __typename: 'PostEdge',
      cursor: '',
      node: {
        ...newData,
        repliedTo: null,
        replies: {
          __typename: 'PaginatedPost',
          totalCount: 0,
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            endCursor: '',
          },
          nodes: [],
        },
      },
    }

    const newEdges: PostEdge[] = posts.edges
      ? ([newPost, ...posts.edges] as PostEdge[])
      : [newPost]

    cache.writeQuery<GetPostsQuery, GetPostsQueryVariables>({
      query: GET_POSTS,
      variables: {
        limit: DEFAULT_POSTS_LIMIT,
        spaceIds: [newData?.space?.id ?? ''],
        excludePins: true,
      },
      data: {
        getPosts: {
          ...posts,
          __typename: 'PaginatedPost',
          totalCount: posts.totalCount + 1,
          edges: newEdges,
        },
      },
    })
  }

  const updateFeed = (
    cache: ApolloCache<AddPostMutation>,
    newData: Post,
    isGuest: boolean,
  ) => {
    if (!newData) {
      return
    }

    const { getFeed: posts } =
      cache.readQuery<GetFeedQuery, GetFeedQueryVariables>({
        query: GET_FEED,
        variables: {
          limit: DEFAULT_POSTS_LIMIT,
          onlyMemberSpaces: !isGuest,
        },
      }) || {}

    if (!posts) {
      return
    }

    const newPost: PostEdge = {
      __typename: 'PostEdge',
      cursor: '',
      node: {
        ...newData,
        repliedTo: null,
        replies: {
          __typename: 'PaginatedPost',
          totalCount: 0,
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: false,
            endCursor: '',
          },
          nodes: [],
        },
      },
    }

    const newEdges: PostEdge[] = posts.edges
      ? ([newPost, ...posts.edges] as PostEdge[])
      : [newPost]

    cache.writeQuery<GetFeedQuery, GetFeedQueryVariables>({
      query: GET_FEED,
      variables: { limit: DEFAULT_POSTS_LIMIT, onlyMemberSpaces: !isGuest },
      data: {
        getFeed: {
          ...posts,
          __typename: 'PaginatedPost',
          totalCount: posts.totalCount + 1,
          edges: newEdges,
        },
      },
    })
  }

  const [addPost, { loading, error }] = useMutation<
    AddPostMutation,
    AddPostMutationVariables
  >(ADD_POST, {
    ...mutationOptions,
  })

  const publish = useCallback(
    (postType, title, content, tagNames = []) => {
      const role: SpaceRole = {
        id: authUser?.role?.id ?? '',
        name: authUser?.role?.name ?? '',
        type: SpaceRoleType.MEMBER,
        scopes: [],
        __typename: 'SpaceRole',
      }
      const createdBy: SpaceMember = {
        __typename: 'SpaceMember',
        member: authUser,
        role,
      }

      let mappingFields: PostMappingField[]
      switch (postType?.name?.toLowerCase()) {
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
          mappingFields = []
          break
      }

      const mappingFieldsInput: PostMappingFieldInput[] = mappingFields.map(
        ({ __typename, ...rest }) => {
          return {
            ...rest,
          }
        },
      )

      const optimisticFlag = 'optimistic'
      const postSpace = space as Space

      const optimisticPost: AddPostMutation['addPost'] = {
        __typename: 'Post',
        topRepliers: [],
        mappingFields,
        hasMoreContent: false,
        shortContent: content,
        createdAt: new Date().toISOString(),
        createdBy,
        owner: createdBy,
        tags: [],
        pinnedInto: [],
        status: PostStatus.PUBLISHED,
        id: `${optimisticFlag}-${nanoid()}`,
        reactions: [],
        space: postSpace,
        slug: '',
        repliesCount: 0,
        totalRepliesCount: 0,
        embeds: null,
        mentions: null,
        repliedToIds: [],
        postTypeId: postType.id,
        postType,
        isAnonymous: false,
        isHidden: false,
        imageIds: [],
        authMemberProps: {
          __typename: 'PostAuthMemberProps',
          context: PermissionContext.POST,
          permissions: [],
        },
      }

      return addPost({
        variables: {
          spaceId: space?.id,
          postTypeId: postType.id,
          mappingFields: mappingFieldsInput,
          tagNames,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: optimisticPost,
        },
        update: (cache: ApolloCache<AddPostMutation>, { data }) => {
          const post = data?.addPost
          const isOptimisticPost = post?.id?.includes(optimisticFlag)
          try {
            if (!isOptimisticPost && post?.status === PostStatus.BLOCKED) {
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
            } else if (
              !isOptimisticPost &&
              post?.status === PostStatus.PUBLISHED
            ) {
              toast({
                title: t('post:feedback.published.title', {
                  defaultValue: 'Post has been published',
                }),
                status: 'success',
                duration: 5000,
              })
            }
            updatePosts(cache, data?.addPost as Post)
          } catch (e) {
            logger.error('error - updating GET_POSTS for useAddPost', e)
          }

          try {
            updateFeed(cache, data?.addPost as Post, isGuest)
          } catch (e) {
            logger.error('error - updating GET_FEED for useAddPost', e)
          }
        },
      })
    },
    [space, authUser, isGuest, addPost, t, toast],
  )

  useEffect(() => {
    if (error) {
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
  }, [error, t, toast])

  return {
    loading,
    publish,
  }
}

export default useAddPost
