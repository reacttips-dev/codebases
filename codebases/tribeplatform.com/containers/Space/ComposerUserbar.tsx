import React from 'react'

import { SpaceQuery } from 'tribe-api'
import { Member, Post } from 'tribe-api/interfaces'
import { UserBar } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

const ComposerUserbar = ({
  post,
  space,
}: {
  post: Post | undefined
  space: SpaceQuery['space']
}) => {
  const { authUser } = useAuthMember()
  const user: Member = post?.owner?.member || authUser

  return (
    <UserBar
      title={user?.name}
      picture={user?.profilePicture}
      subtitle={
        <Trans
          i18nKey="post:header.posting_in"
          defaults="Posting in {{ spaceName }}"
          values={{
            spaceName: space?.name,
          }}
        />
      }
      avatarProps={{
        marginRight: '6px',
      }}
      flexGrow={0}
      flexShrink={0}
    />
  )
}

export default ComposerUserbar
