import React, { useCallback, useRef } from 'react'

import { Box, HStack, VStack, Divider, Center } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Post } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { SkeletonProvider, Text } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { ComposerRefImperativeHandle } from 'containers/Composer/@types'
import useInsertMention from 'containers/Composer/hooks/useInsertMention'
import { usePreloadedPostComments } from 'containers/Post/hooks'

import { useToggle } from 'hooks/useToggle'

import { Comment } from './Comment'
import { LoadMoreCommentsLink } from './LoadMoreCommentsLink'
import { ReplyComposer } from './ReplyComposer'

dayjs.extend(relativeTime)

const firstName = (post: Post | null) => {
  const name = post?.repliedTo?.owner?.member?.name

  if (!name) return name

  const indexOfFirstSpace = name.indexOf(' ')

  if (indexOfFirstSpace !== -1) {
    return name.substring(0, indexOfFirstSpace)
  }

  return name
}

export interface CommentThreadProps {
  post: Post | null
  rootPostAddress: string
  showDivider?: boolean
}

export const CommentThread = ({
  post,
  rootPostAddress,
  showDivider = false,
}: CommentThreadProps) => {
  const inputRef: { current: ComposerRefImperativeHandle | null } = useRef(null)
  const { t } = useTranslation()
  const insertMention = useInsertMention()

  const [expanded, toggleExpanded, open] = useToggle(false)

  const mention = useCallback(
    member => {
      const quill = inputRef?.current?.getQuill()
      if (member && quill) {
        insertMention(quill, member)
      }

      quill.root.setAttribute(
        'data-placeholder',
        t('post:reply.placeholder', {
          defaultValue: `Reply to {{name}}...`,
          name: member.name,
        }),
      )

      quill?.focus()
    },
    [insertMention],
  )

  const onReply = value => {
    mention(value?.owner?.member)
  }
  const { authorized: hasAddReplyPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReply',
  )

  return (
    <div style={{ position: 'relative' }}>
      {showDivider && (
        <Center
          mt={6}
          height="100%"
          width="40px"
          position="absolute"
          zIndex="base"
        >
          <Divider orientation="vertical"></Divider>
        </Center>
      )}
      <Comment
        post={post}
        type="comment"
        onReplyClick={() => {
          open()
          // to make sure composer mounted
          setTimeout(() => {
            mention(post?.owner?.member)
          }, 100)
        }}
        rootPostAddress={rootPostAddress}
      />
      {!expanded && post && Number(post?.repliesCount) > 0 && (
        <Box pl={12}>
          <Box cursor="pointer" onClick={toggleExpanded}>
            <CollapsedCommentThread post={post} />
          </Box>
        </Box>
      )}
      {expanded && post && (
        <Box pl={12}>
          <VStack spacing="5" align="stretch">
            <Box mt={4}>
              <ExpandedCommentThread
                post={post}
                onReply={onReply}
                rootPostAddress={rootPostAddress}
              />
            </Box>
            {hasAddReplyPermission && (
              <Box mt={5}>
                <ReplyComposer
                  key={`${post?.id}-composer`}
                  ref={inputRef}
                  replyTo={post}
                  placeholder={t('post:reply.placeholder', {
                    defaultValue: `Reply to {{name}}...`,
                    name: firstName(post),
                  })}
                />
              </Box>
            )}
          </VStack>
        </Box>
      )}
    </div>
  )
}

const CollapsedCommentThread = ({ post }: { post: Post }) => {
  return (
    <HStack pt={3}>
      <Text fontWeight="medium" color="label.primary">
        <Trans
          i18nKey="post:replies.count"
          defaults="View {{ count, ifNumAbbr }} replies"
          values={{ count: post?.repliesCount }}
        />
      </Text>
    </HStack>
  )
}

const ExpandedCommentThread = ({
  post,
  onReply,
  rootPostAddress,
}: {
  post: Post
  onReply: (post: Post) => void
  rootPostAddress: string
}) => {
  const {
    comments: replies,
    isInitialLoading,
    previousCommentCount,
    totalCount,
    loadMore,
  } = usePreloadedPostComments({
    postId: post.id,
  })

  return (
    <SkeletonProvider loading={isInitialLoading}>
      <LoadMoreCommentsLink
        loadMore={loadMore}
        previousCommentCount={previousCommentCount}
        totalCount={totalCount || 0}
        type="reply"
      />
      {isInitialLoading &&
        post.repliesCount > 0 &&
        [...Array(Math.min(post.repliesCount, 5))].map((_, index) => (
          // It's a static array, so we can use indexes as keys
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} position="relative" mt={5}>
            <CommentThread
              post={null}
              rootPostAddress={rootPostAddress}
              showDivider
            />
          </Box>
        ))}
      {replies.map(reply => (
        <Box key={reply.id} position="relative" mt={5}>
          <Center
            mt={6}
            height="100%"
            width="40px"
            position="absolute"
            zIndex="base"
          >
            <Divider orientation="vertical"></Divider>
          </Center>
          <Comment
            key={reply.id}
            post={reply}
            type="reply"
            onReplyClick={onReply}
            rootPostAddress={rootPostAddress}
          />
        </Box>
      ))}
    </SkeletonProvider>
  )
}
