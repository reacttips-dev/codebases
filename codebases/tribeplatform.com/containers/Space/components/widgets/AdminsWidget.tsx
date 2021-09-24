import React from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

import { ActionPermissions, SpaceRoleType, SpaceQuery } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Avatar, Card, Link, Skeleton, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { MEMBERS_LIMIT, useSpaceMembers } from 'containers/Space/hooks'

export interface AdminsWidgetProps {
  space: SpaceQuery['space']
}

export const AdminsWidget: React.FC<AdminsWidgetProps> = ({ space }) => {
  const adminRole = space?.roles?.find(it => it.type === SpaceRoleType.ADMIN)

  const { spaceMembers, loading } = useSpaceMembers({
    spaceId: space?.id,
    limit: MEMBERS_LIMIT,
    roleIds: adminRole ? [adminRole?.id] : [],
    skip: typeof window === 'undefined',
  })

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canViewMembers } = hasActionPermission(
    permissions || [],
    'getSpaceMembers',
  )

  if (!spaceMembers?.length || !canViewMembers) {
    return null
  }

  return (
    <Card>
      <VStack spacing="3" align="left">
        <Text textStyle="medium/medium">
          <Trans i18nKey="space.widgets.admins.title" defaults="Admins" />
        </Text>
        <Skeleton isLoaded={!loading}>
          <HStack>
            {spaceMembers?.slice(0, 6).map(({ member }) => (
              <NextLink
                key={member?.id}
                href="/member/:authUserId"
                as={`/member/${member?.id}`}
              >
                <Link>
                  <Avatar
                    key={member?.id}
                    name={member?.displayName || member?.name}
                    src={member?.profilePicture}
                  />
                </Link>
              </NextLink>
            ))}
          </HStack>
        </Skeleton>
      </VStack>
    </Card>
  )
}
