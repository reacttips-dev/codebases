import React from 'react'

import { HStack, Box, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

import {
  ActionPermissions,
  SpaceQuery,
  SpaceMembershipStatus,
  SpaceRoleType,
} from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import { Avatar, Skeleton, Text, Link } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { MEMBERS_LIMIT, useSpaceMembers } from 'containers/Space/hooks'

export interface MembersWidgetProps {
  space: SpaceQuery['space']
}

export const MembersWidget: React.FC<MembersWidgetProps> = ({ space }) => {
  const { t } = useTranslation()
  const memberRole = space?.roles?.find(it => it.type === SpaceRoleType.MEMBER)

  const { spaceMembers, loading } = useSpaceMembers({
    spaceId: space?.id,
    limit: MEMBERS_LIMIT,
    roleIds: memberRole ? [memberRole?.id] : [],
    skip: typeof window === 'undefined' || !memberRole,
  })

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canViewMembers } = hasActionPermission(
    permissions || [],
    'getSpaceMembers',
  )

  if (!spaceMembers?.length || !canViewMembers) {
    return null
  }

  const joined =
    space?.authMemberProps?.membershipStatus === SpaceMembershipStatus.JOINED

  const peopleInSpaceText = () => {
    if (space?.membersCount === 1) {
      return t(
        'common:widgets.members.youOnly',
        'You are a member of this group.',
      )
    }
    if (space?.membersCount >= 2) {
      return t(
        'common:widgets.members.youAndOthersCount',
        'You and {{ count, numberWithCommas }} more are members of this group.',
        { count: space?.membersCount - 1 },
      )
    }
    return ''
  }

  return (
    <Box>
      <VStack spacing="3" align="left">
        <Text textStyle="medium/medium">
          <Trans i18nKey="space.widgets.members.title" defaults="Members" />
        </Text>
        <Skeleton isLoaded={!loading}>
          <HStack>
            {spaceMembers?.slice(0, 6).map(({ member }) => {
              if (!member?.id) return null
              return (
                <NextLink
                  key={member.id}
                  href="/member/:authUserId"
                  as={`/member/${member.id}`}
                >
                  <Link>
                    <Avatar
                      key={member.id}
                      name={member.displayName || member.name}
                      src={member.profilePicture}
                    />
                  </Link>
                </NextLink>
              )
            })}
          </HStack>
        </Skeleton>
        <Skeleton>
          <Text color="label.secondary" textStyle="regular/xsmall">
            {joined
              ? peopleInSpaceText()
              : t(
                  'common:widgets.members.othersjoined',
                  '{{ name1 }} is part of this group.',
                  {
                    postProcess: 'interval',
                    name1: spaceMembers?.[0]?.member?.name,
                    name2: spaceMembers?.[1]?.member?.name,
                    restCount: space?.membersCount - 1,
                    count: space?.membersCount,
                  },
                )}
          </Text>
        </Skeleton>
      </VStack>
    </Box>
  )
}
