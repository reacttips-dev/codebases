import React from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import NextLink from 'next/link'
import ReplyLineIcon from 'remixicon-react/ReplyLineIcon'

import { Post } from 'tribe-api/interfaces'
import {
  Avatar,
  AvatarGroup,
  Icon,
  Link,
  Skeleton,
  Text,
} from 'tribe-components'
import { formatNumberWithCommas } from 'tribe-translation'

import { PostPin, PostReactions } from 'containers/Post/components'
import { usePostLink } from 'containers/Post/hooks'
import {
  getPostFieldValue,
  postLinkToPostCommentsLink,
} from 'containers/Post/utils'

export interface QuestionListItemProps {
  post: Post | null
  comeBack?: boolean
}

export const QuestionPostBodyCompact: React.FC<QuestionListItemProps> = ({
  post,
  comeBack,
}) => {
  const questionLink = usePostLink(post, comeBack)

  const authors = Array.from(
    new Set(post?.replies?.nodes?.map(comment => comment.owner?.member)),
  )

  const avatars = () => {
    if (authors.length === 0) {
      return (
        <Avatar
          size="sm"
          name={post?.owner?.member?.name}
          src={post?.owner?.member?.profilePicture}
        />
      )
    }
    return (
      <AvatarGroup size="sm">
        {authors.map(member => (
          <Avatar
            key={member?.id}
            name={member?.name}
            src={member?.profilePicture}
          />
        ))}
      </AvatarGroup>
    )
  }

  return (
    <HStack justify="space-between" spacing={5}>
      <HStack>
        <Skeleton>
          <PostReactions post={post} />
        </Skeleton>

        <VStack align="stretch" pl={3}>
          <Skeleton>
            <HStack>
              {post && <PostPin post={post} size={5} />}
              <NextLink href={questionLink} passHref>
                <Link variant="unstyled">
                  <Text
                    textStyle="medium/medium"
                    color="label.primary"
                    noOfLines={2}
                  >
                    {getPostFieldValue(post, 'question')}
                  </Text>
                </Link>
              </NextLink>
            </HStack>
          </Skeleton>
          <Text fontSize="sm" color="label.secondary">
            <NextLink href={`/member/${post?.owner?.member?.id}`} passHref>
              <Link variant="unstyled">{post?.owner?.member?.name}</Link>
            </NextLink>
            {' · '}
            <NextLink href={questionLink} passHref>
              <Link variant="unstyled">
                {post?.createdAt && dayjs(post?.createdAt).fromNow()}
              </Link>
            </NextLink>
          </Text>
        </VStack>
      </HStack>
      <HStack
        minWidth={{
          base: '52px',
          sm: 100,
        }}
        justify="space-between"
      >
        <Box display={['none', 'block']}>
          <NextLink href={postLinkToPostCommentsLink(questionLink)} passHref>
            <Link variant="unstyled">{avatars()}</Link>
          </NextLink>
        </Box>
        <Box>
          <Skeleton>
            <NextLink href={postLinkToPostCommentsLink(questionLink)} passHref>
              <Link variant="unstyled">
                <HStack color="label.secondary">
                  <Icon as={ReplyLineIcon} boxSize="1.2em" />
                  <Text>
                    {formatNumberWithCommas(post?.totalRepliesCount || 0)}
                  </Text>
                </HStack>
              </Link>
            </NextLink>
          </Skeleton>
        </Box>
      </HStack>
    </HStack>
  )
}
