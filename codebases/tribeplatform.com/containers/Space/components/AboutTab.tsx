import React from 'react'

import { VStack } from '@chakra-ui/react'

import { SpaceQuery } from 'tribe-api'
import { ActionPermissions } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'

import { AboutMembers } from 'containers/Space/components/AboutMembers'
import { AboutSpace } from 'containers/Space/components/AboutSpace'

export interface AboutProps {
  space: SpaceQuery['space']
  spaceLoading?: boolean
}

export const AboutTab = ({ space, spaceLoading = false }: AboutProps) => {
  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]
  const { authorized: canViewMembers } = hasActionPermission(
    permissions || [],
    'getSpaceMembers',
  )

  return (
    <VStack spacing={8}>
      <AboutSpace space={space} spaceLoading={spaceLoading} />
      {canViewMembers && (
        <AboutMembers space={space} spaceLoading={spaceLoading} />
      )}
    </VStack>
  )
}

export default AboutTab
