import React, { FC } from 'react'

import { HStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ReplyLineIcon from 'remixicon-react/ReplyLineIcon'

import { Post } from 'tribe-api/interfaces'
import { Avatar, Icon, Text, UserBar } from 'tribe-components'
import { formatNumberWithCommas } from 'tribe-translation'

import { usePostLink } from 'containers/Post/hooks'
import { getPostFieldValue } from 'containers/Post/utils'

dayjs.extend(relativeTime)

interface DiscussionCardCompactProps {
  post: Post
}

export const DiscussionPostBodyCompact: FC<DiscussionCardCompactProps> = ({
  post,
}) => {
  const postLink = usePostLink(post, true)

  const subtitle = (
    <HStack spacing={1} mt={1}>
      <Avatar src={post?.space?.image} size="2xs" name={post?.space?.name} />
      <Text isTruncated>
        {post?.space?.name}
        {' · '}
        Posted {dayjs(post?.createdAt).fromNow()} by{' '}
        {post?.createdBy?.member?.name}
      </Text>
    </HStack>
  )

  return (
    <>
      <UserBar
        title={getPostFieldValue(post, 'title')}
        withPicture={false}
        subtitle={subtitle}
        titleLink={{ href: postLink }}
        subtitleLink={{ href: postLink }}
        maxW="full"
      />
      <HStack mt={2} spacing={2} data-testid="small-post-info">
        <Icon as={ReplyLineIcon} color="label.secondary" boxSize={5} />
        <Text textStyle="regular/small" color="label.secondary">
          {formatNumberWithCommas(post?.totalRepliesCount)}
        </Text>
      </HStack>
    </>
  )
}
