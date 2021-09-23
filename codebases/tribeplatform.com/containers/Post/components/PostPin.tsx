import React from 'react'

import { Circle } from '@chakra-ui/react'
import PushPinFillIcon from 'remixicon-react/PushpinFillIcon'

import { Post } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Icon } from 'tribe-components'

import usePinPost from 'containers/Post/hooks/usePinPost'

type PostPinProps = {
  post: Post
  size: number
}

export const PostPin = ({ post, size }: PostPinProps) => {
  const { isPinned, unpin } = usePinPost(post)

  const { authorized: hasUnpinPermission } = hasActionPermission(
    post?.space?.authMemberProps?.permissions || [],
    'unpinPostFromSpace',
  )

  if (!isPinned) {
    return null
  }

  return (
    <Circle
      size={size}
      bg="accent.base"
      color="bg.base"
      cursor={hasUnpinPermission ? 'pointer' : 'default'}
      transition="all 250ms"
      _hover={{
        bg: 'accent.hover',
      }}
      onClick={hasUnpinPermission ? unpin : undefined}
      data-testid="post-pin"
    >
      <Icon as={PushPinFillIcon} boxSize="0.8em" />
    </Circle>
  )
}
