import React from 'react'

import { Box, Flex, HStack, Wrap, WrapItem } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'
import TimeLineIcon from 'remixicon-react/TimeLineIcon'

import { PostStatus } from 'tribe-api'
import { Post } from 'tribe-api/interfaces'
import {
  Icon,
  Link,
  Skeleton,
  SkeletonText,
  Text,
  UserBar,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useDisplayMember from 'containers/Member/hooks/useDisplayMember'
import { ReplyButton } from 'containers/Post/components'
import { POST_COMMENT_HIGHLIGHT_ID } from 'containers/Post/components/PostComments'

import { PostContent } from './PostContent'
import PostOptions from './PostOptions'
import { PostReactionPicker, PostReactions } from './PostReactions'

dayjs.extend(relativeTime)

export interface CommentProps {
  post: Post | null
  // 1st level answer is a comment, 2nd level answer is a reply
  type: 'comment' | 'reply'
  onReplyClick: (post: Post) => void
  rootPostAddress: string
}

export const Comment = ({
  post,
  onReplyClick,
  rootPostAddress,
}: CommentProps) => {
  const { owner, createdAt } = post || {}

  const author = owner?.member
  const { showMember } = useDisplayMember(author?.id, author?.role)

  const commentAnchor = `${POST_COMMENT_HIGHLIGHT_ID}${post?.id}`
  const isPostBlocked = post?.status === PostStatus.BLOCKED

  const subtitle = (
    <>
      {author?.tagline && !isPostBlocked && (
        <>
          <Link
            href={`#${POST_COMMENT_HIGHLIGHT_ID}${post?.id}`}
            fontWeight="regular"
            overflow="hidden"
            isTruncated
            maxWidth="calc(40%)"
          >
            {author?.tagline}
          </Link>
          {' • '}
        </>
      )}
      {isPostBlocked && (
        <>
          <HStack display="inline-block" spacing={1}>
            <Text
              color="warning.base"
              textStyle="medium/small"
              display="inline"
            >
              <Trans
                i18nKey="post:feedback.pending.title"
                defaults="Pending Review"
              />
            </Text>
            <Icon as={TimeLineIcon} size={16} color="warning.base" />
          </HStack>
          {' • '}
        </>
      )}
      <NextLink
        key="date"
        href="/[space-slug]/post/[post-address]"
        as={`/${rootPostAddress}#${commentAnchor}`}
        passHref
      >
        <Link id={commentAnchor} fontWeight="regular">
          {dayjs(createdAt).fromNow()}
        </Link>
      </NextLink>
    </>
  )

  return (
    <Flex flexDirection="column" align="stretch">
      <HStack justify="space-between">
        <UserBar
          picture={author?.profilePicture}
          title={author?.name}
          subtitle={subtitle}
          onPictureClick={showMember}
          onTitleClick={showMember}
        />
        {post?.id && <PostOptions post={post} />}
      </HStack>

      <Flex flexDirection="column" align="stretch" ml={12} mt={1}>
        <Skeleton fallback={<SkeletonText noOfLines={2} />}>
          <PostContent post={post} />
        </Skeleton>

        <Box mt={3}>
          <Wrap>
            <WrapItem>
              <ReplyButton
                post={post}
                onClick={onReplyClick}
                data-testid="post-comment-reply-btn"
              />
            </WrapItem>
            <PostReactionPicker post={post} />
            <PostReactions post={post} />
          </Wrap>
        </Box>
      </Flex>
    </Flex>
  )
}
