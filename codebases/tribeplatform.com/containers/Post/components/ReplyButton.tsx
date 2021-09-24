import React, { useCallback } from 'react'

import ReplyLineIcon from 'remixicon-react/ReplyLineIcon'

import { Post } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Button, ButtonProps, Icon } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

type ReplyButtonProps = Omit<ButtonProps, 'onClick'> & {
  post: Post | null
  onClick: (post: Post | null) => void
}

export const ReplyButton = ({ post, onClick, ...rest }: ReplyButtonProps) => {
  const { isGuest } = useAuthMember()

  const { authorized: hasReplyPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReply',
  )

  const handleClick = useCallback(() => {
    if (hasReplyPermission) {
      onClick(post)
    } else if (isGuest && typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }, [post, onClick, isGuest, hasReplyPermission])

  return (
    <Button
      variant="solid"
      colorScheme="gray"
      size="xs"
      color="label.secondary"
      leftIcon={<Icon as={ReplyLineIcon} />}
      onClick={handleClick}
      disabled={!isGuest && !hasReplyPermission}
      {...rest}
    >
      <Trans i18nKey="common:post.reactions.reply" defaults="Reply" />
    </Button>
  )
}
