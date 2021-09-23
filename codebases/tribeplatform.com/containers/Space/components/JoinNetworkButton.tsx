import React from 'react'

import NextLink from 'next/link'
import AddFillIcon from 'remixicon-react/AddFillIcon'

import { hasActionPermission } from 'tribe-api'
import { Button } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

export const JoinNetworkButton = () => {
  const { network } = useGetNetwork()

  const { authorized: canJoinNetwork } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'joinNetwork',
  )

  if (!canJoinNetwork) return null

  return (
    <NextLink href="/auth/signup">
      <Button
        buttonType="primary"
        leftIcon={<AddFillIcon size={16} />}
        size="sm"
      >
        <Trans
          i18nKey="common:network.join.title"
          defaults="Join {{name}}"
          values={{ name: network?.name }}
        />
      </Button>
    </NextLink>
  )
}
