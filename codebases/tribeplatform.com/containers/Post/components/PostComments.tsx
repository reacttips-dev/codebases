import React, { forwardRef, RefObject, useEffect, useState } from 'react'

import { Box, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ReplyLineIcon from 'remixicon-react/ReplyLineIcon'

import { Post, PostStatus } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Button, Card, Emoji, SkeletonProvider, Text } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { ComposerRefImperativeHandle } from 'containers/Composer/@types'
import { NOTIFICATIONS_FROM_PARAM } from 'containers/Notifications'

import { usePreloadedPostComments } from '../hooks/usePreloadedPostComments'
import { getPostLink } from '../utils/utils'
import { CommentThread } from './CommentThread'
import { HighlightedComment } from './HighlightedComment'
import { LoadMoreCommentsLink } from './LoadMoreCommentsLink'
import { ReplyComposer } from './ReplyComposer'

export const POST_REPLY_SECTION_ID = 'reply'

export const POST_COMMENTS_SECTION_ID = 'comments'

export const POST_COMMENT_HIGHLIGHT_ID = 'comment/'

interface PostCommentsProps {
  isReplyComposerVisible?: boolean
  post: Post
  showReplyComposer: () => void
}

export const PostComments = forwardRef(
  (
    {
      isReplyComposerVisible = false,
      post,
      showReplyComposer,
    }: PostCommentsProps,
    ref: RefObject<ComposerRefImperativeHandle>,
  ) => {
    const router = useRouter()
    const { t } = useTranslation()
    const {
      comments,
      isInitialLoading,
      previousCommentCount,
      totalCount,
      loadMore,
    } = usePreloadedPostComments({
      postId: post.id,
    })

    const { authorized: hasAddReplyPermission } = hasActionPermission(
      post?.authMemberProps?.permissions || [],
      'addReply',
    )

    const [highlightedCommentId, setHighlightedCommentId] = useState<
      string | undefined
    >()
    const [commentsIncludeHighlight, setCommentsIncludeHighlight] = useState(
      false,
    )

    const hash = router?.asPath?.split('#')?.[1]

    const isPostBlocked = post?.status === PostStatus.BLOCKED

    useEffect(() => {
      const url = decodeURIComponent(router?.asPath)
      const comingFromNotifications = url.includes(NOTIFICATIONS_FROM_PARAM)

      if (!comingFromNotifications) return

      const commentId = hash?.includes(POST_COMMENT_HIGHLIGHT_ID)
        ? hash?.replace(POST_COMMENT_HIGHLIGHT_ID, '')
        : null

      if (commentId) {
        setHighlightedCommentId(commentId)

        setCommentsIncludeHighlight(comments?.some(it => it?.id === commentId))
      }
    }, [router.asPath, comments, hash, router])

    if (
      (post && post?.totalRepliesCount === 0 && !hasAddReplyPermission) ||
      isPostBlocked
    ) {
      return null
    }

    if (
      !post?.repliesCount &&
      !isReplyComposerVisible &&
      hasAddReplyPermission &&
      !hash?.includes(POST_REPLY_SECTION_ID)
    ) {
      return (
        <VStack
          p={8}
          border="1px solid"
          borderColor="border.base"
          borderRadius="base"
          bgColor="bg.base"
        >
          <Emoji src="wave" size="xs" />
          <Box>
            <Text textStyle="regular/medium" mt={1} color="label.secondary">
              <Trans
                i18nKey="post:comments.empty_text"
                defaults="Be the first to add a reply"
              />
            </Text>
          </Box>

          <Box>
            <Button
              isDisabled={post?.status === PostStatus.DELETED}
              onClick={showReplyComposer}
              data-testid="post-reply-box-toggler-button"
              leftIcon={<ReplyLineIcon size="20px" />}
              mt={2}
            >
              <Trans i18nKey="post:comments.reply_button" defaults="Reply" />
            </Button>
          </Box>
        </VStack>
      )
    }

    return (
      <SkeletonProvider loading={isInitialLoading}>
        {highlightedCommentId && !commentsIncludeHighlight && (
          <HighlightedComment postId={highlightedCommentId} />
        )}
        {post?.totalRepliesCount > 0 && (
          <VStack
            as={Card}
            id={POST_COMMENTS_SECTION_ID}
            spacing="5"
            align="stretch"
          >
            <LoadMoreCommentsLink
              loadMore={loadMore}
              previousCommentCount={previousCommentCount}
              totalCount={totalCount || 0}
              type="comment"
            />
            {isInitialLoading &&
              post.totalRepliesCount > 0 &&
              [...Array(Math.min(post?.totalRepliesCount, 10))].map(
                (_, index) => {
                  return (
                    <CommentThread
                      // It's a static array, so we can use indexes as keys
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      post={null}
                      rootPostAddress={getPostLink(
                        post?.space?.slug,
                        post?.slug,
                        post?.id,
                      )}
                    />
                  )
                },
              )}
            {comments.map((comment, i) => (
              <CommentThread
                key={comment.id}
                post={comment}
                rootPostAddress={getPostLink(
                  post?.space?.slug,
                  post?.slug,
                  post?.id,
                )}
                showDivider={i !== comments.length - 1}
              />
            ))}
          </VStack>
        )}
        {isReplyComposerVisible && (
          <ReplyComposer
            placeholder={t('post:comment.placeholder', 'Add a reply...')}
            ref={ref}
            replyTo={post}
          />
        )}
      </SkeletonProvider>
    )
  },
)
