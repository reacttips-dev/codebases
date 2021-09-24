import React, { FC } from 'react'

import { Box, Flex, Wrap } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Post, PostStatus, ThemeTokens } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Link } from 'tribe-components'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import {
  PostHeader,
  PostReactionPicker,
  PostReactions,
  PostTitle,
  ReplyButton,
} from 'containers/Post/components'
import { usePostLink } from 'containers/Post/hooks'
import { getPostFieldValue } from 'containers/Post/utils'
import { postLinkToPostReplyLink } from 'containers/Post/utils/postLink'

import useAuthMember from 'hooks/useAuthMember'

import { DiscussionPostContent } from './DiscussionPostContent'

export interface DiscussionPostBodyProps {
  post: Post | null
  comeBack?: boolean
  titleLink?: boolean
  showSpaceOnUserBar?: boolean
  defaultExpanded?: boolean
  onReply?: () => void
}

export const DiscussionPostBody: FC<DiscussionPostBodyProps> = ({
  post,
  titleLink,
  comeBack,
  showSpaceOnUserBar,
  defaultExpanded,
  onReply,
}) => {
  const postLink = usePostLink(post, comeBack)
  const { isGuest } = useAuthMember()
  const { themeSettings } = useThemeSettings()

  const { authorized: hasReplyPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReply',
  )
  const hideReplyBtn = !isGuest && !hasReplyPermission
  const postLinkHref = isGuest ? '#' : postLinkToPostReplyLink(postLink)
  const isPostBlocked = post?.status === PostStatus.BLOCKED

  return (
    <Flex flexDirection="column" align="stretch">
      <PostHeader
        post={post}
        comeBack={comeBack}
        showSpaceOnUserBar={showSpaceOnUserBar}
      />
      <Box mt={5} />
      <PostTitle post={post} comeBack={comeBack} titleLink={titleLink}>
        {getPostFieldValue(post, 'title')}
      </PostTitle>
      <DiscussionPostContent
        post={post}
        defaultExpanded={defaultExpanded}
        themeSettings={themeSettings as ThemeTokens}
      />

      <Wrap mt={5}>
        {!hideReplyBtn &&
          !isPostBlocked &&
          (titleLink ? (
            <NextLink
              href={postLinkHref}
              passHref
              shallow={!hasReplyPermission}
            >
              <Link>
                <ReplyButton
                  post={post}
                  onClick={onReply ?? (() => null)}
                  date-testid="post-reply-btn"
                />
              </Link>
            </NextLink>
          ) : (
            <ReplyButton
              post={post}
              onClick={onReply ?? (() => null)}
              date-testid="post-reply-btn"
            />
          ))}
        {!isPostBlocked && <PostReactionPicker post={post} />}
        {!isPostBlocked && <PostReactions post={post} />}
      </Wrap>
    </Flex>
  )
}
