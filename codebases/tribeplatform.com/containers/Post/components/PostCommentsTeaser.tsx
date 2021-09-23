import React from 'react'

import { HStack, Spacer } from '@chakra-ui/react'
import NextLink from 'next/link'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'

import { Post } from 'tribe-api/interfaces'
import { Avatar, AvatarGroup, Icon, Link, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { usePostLink } from '../hooks/usePostLink'
import { postLinkToPostCommentsLink } from '../utils/postLink'

interface PostCommentsTeaserProps {
  post: Post | null
  containerCardPadding: number
  comeBack?: boolean
}

export const PostCommentsTeaser = ({
  post,
  containerCardPadding,
  comeBack,
}: PostCommentsTeaserProps) => {
  const postLink = usePostLink(post, comeBack)

  const authors = Array.from(
    new Set(post?.replies?.nodes?.map(comment => comment.owner?.member)),
  )

  return (
    <NextLink href={postLinkToPostCommentsLink(postLink)} passHref>
      <Link
        variant="unstyled"
        as={HStack}
        mx={-containerCardPadding}
        mb={-containerCardPadding}
        padding={containerCardPadding}
        pt={5}
        transition="background 250ms"
        _hover={{ bg: 'bg.secondary' }}
      >
        <AvatarGroup size="xs">
          {authors.length === 0 && <Avatar name="" />}
          {authors.map(member => (
            <Avatar
              border="none"
              key={member?.id}
              name={member?.name}
              src={member?.profilePicture}
            />
          ))}
        </AvatarGroup>
        <Text textStyle="medium/medium">
          {post?.postType?.name === 'Discussion' && (
            <Trans
              i18nKey="post:comments.commentsCount"
              defaults="{{ commentsCount, numberWithCommas }} comments"
              values={{
                commentsCount: post.totalRepliesCount,
              }}
            />
          )}
          {post?.postType?.name === 'Question' && (
            <Trans
              i18nKey="question:replies.repliesCount"
              defaults="{{ repliesCount, numberWithCommas }} replies"
              values={{
                repliesCount: post.totalRepliesCount,
              }}
            />
          )}
        </Text>
        <Spacer />
        <Icon as={ArrowRightLineIcon} />
      </Link>
    </NextLink>
  )
}
