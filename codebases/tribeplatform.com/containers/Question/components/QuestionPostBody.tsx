import React from 'react'

import { Box, Flex, HStack, Wrap } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Post } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Link } from 'tribe-components'

import {
  PostHeader,
  PostReactions,
  PostTitle,
  ReplyButton,
} from 'containers/Post/components'
import { usePostLink } from 'containers/Post/hooks'
import {
  getPostFieldValue,
  postLinkToPostCommentsLink,
} from 'containers/Post/utils'
import { QuestionPostContent } from 'containers/Question/components/QuestionPostContent'

import useAuthMember from 'hooks/useAuthMember'

export interface QuestionCardProps {
  post: Post
  comeBack?: boolean
  titleLink?: boolean
  defaultExpanded?: boolean
  onReply?: () => void
}

export const QuestionPostBody: React.FC<QuestionCardProps> = ({
  post,
  comeBack,
  titleLink,
  defaultExpanded,
  onReply,
}) => {
  const postLink = usePostLink(post, comeBack)
  const { authorized: hasReplyPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReply',
  )
  const { isGuest } = useAuthMember()
  const hideReplyBtn = !isGuest && !hasReplyPermission
  const postLinkHref = isGuest ? '#' : postLinkToPostCommentsLink(postLink)

  return (
    <Flex flexDirection="column" align="stretch">
      <PostHeader
        post={post}
        comeBack={comeBack}
        showSpaceOnUserBar={comeBack}
      />
      <Box mt={5} />
      <HStack>
        <PostReactions post={post} />
        <PostTitle post={post} comeBack={comeBack} titleLink={titleLink}>
          {getPostFieldValue(post, 'question')}
        </PostTitle>
      </HStack>

      <QuestionPostContent post={post} defaultExpanded={defaultExpanded} />
      <Wrap mt={5}>
        {!hideReplyBtn &&
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
      </Wrap>
    </Flex>
  )
}
