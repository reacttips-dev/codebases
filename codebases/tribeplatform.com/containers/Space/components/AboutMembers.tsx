import React from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import MoreLineIcon from 'remixicon-react/MoreLineIcon'

import { SpaceRoleType, SpaceQuery } from 'tribe-api'
import {
  Avatar,
  Button,
  Card,
  Icon,
  IconButton,
  Skeleton,
  SkeletonProvider,
  Text,
  Link,
} from 'tribe-components'
import {
  formatNumberWithCommas,
  Trans,
  useTranslation,
} from 'tribe-translation'

import { MEMBERS_LIMIT, useSpaceMembers } from 'containers/Space/hooks'

const renderMemberAvatar = admin =>
  admin.member ? (
    <NextLink
      key={admin.member.id}
      href="/member/:authUserId"
      as={`/member/${admin.member.id}`}
      passHref
    >
      <Link>
        <Avatar src={admin.member.profilePicture} name={admin.member.name} />
      </Link>
    </NextLink>
  ) : null

export interface AboutMembersProps {
  space: SpaceQuery['space']
  spaceLoading?: boolean
}

const MAX_AVATARS_COUNT = 13
const MIN_AVATARS_COUNT = 5

export const AboutMembers = ({
  space,
  spaceLoading = false,
}: AboutMembersProps) => {
  const { t } = useTranslation()
  const adminRole = space?.roles?.find(it => it.type === SpaceRoleType.ADMIN)
  const memberRole = space?.roles?.find(it => it.type === SpaceRoleType.MEMBER)

  const {
    spaceMembers: members,
    totalCount: totalMembers,
    loading,
  } = useSpaceMembers({
    spaceId: space?.id,
    limit: MEMBERS_LIMIT,
    roleIds: memberRole ? [memberRole?.id] : [],
    skip: typeof window === 'undefined' || !memberRole,
  })
  const { spaceMembers: admins, totalCount: totalAdmins } = useSpaceMembers({
    spaceId: space?.id,
    limit: MEMBERS_LIMIT,
    roleIds: adminRole ? [adminRole?.id] : [],
    skip: typeof window === 'undefined' || !adminRole,
  })

  const availableAvatarsCount =
    typeof window !== 'undefined'
      ? Math.min(Math.floor((window.innerWidth - 70) / 40), MAX_AVATARS_COUNT)
      : MIN_AVATARS_COUNT

  return (
    <SkeletonProvider loading={spaceLoading || loading}>
      <Card w="full">
        <VStack align="flex-start">
          <HStack mb={3}>
            <Text textStyle="semibold/xlarge">
              <Trans i18nKey="space:about.members.title" defaults="Members" />
            </Text>
            <Skeleton>
              <Text color="label.secondary" textStyle="semibold/xlarge">
                {` · ${formatNumberWithCommas(space?.membersCount)}`}
              </Text>
            </Skeleton>
          </HStack>

          {admins?.length > 0 && (
            <>
              <HStack>{admins?.slice(0, 10)?.map(renderMemberAvatar)}</HStack>

              <Text mb={3} color="label.secondary">
                {t('space:about.members.adminsinterval', {
                  postProcess: 'interval',
                  defaultValue: '{{ count, ifNumAbbr }} Admins',
                  count: totalAdmins || 0,
                  restCount: totalAdmins ? totalAdmins - 2 : 0,
                  name1: admins?.[0]?.member?.name,
                  name2: admins?.[1]?.member?.name,
                })}
              </Text>
            </>
          )}

          {members?.length > 0 && (
            <>
              <HStack>
                {members
                  .slice(0, availableAvatarsCount)
                  ?.map(renderMemberAvatar)}
                {availableAvatarsCount < members.length && (
                  <NextLink
                    href="/[space-slug]/[section]"
                    as={`/${space?.slug}/members`}
                  >
                    <IconButton
                      aria-label={t(
                        'space:about.members.seeAllMembers',
                        'See all',
                      )}
                      size="sm"
                      buttonType="secondary"
                      icon={<Icon as={MoreLineIcon} width={3} />}
                      isRound
                    />
                  </NextLink>
                )}
              </HStack>
              <Text mb={3} color="label.secondary">
                {t('space:about.members.membersInterval', {
                  postProcess: 'interval',
                  defaultValue: '{{ count, ifNumAbbr }} Members',
                  count: totalMembers || 0,
                  restCount: totalMembers ? totalMembers - 3 : 0,
                  name1: members?.[0]?.member?.name,
                  name2: members?.[1]?.member?.name,
                  name3: members?.[2]?.member?.name,
                })}
              </Text>

              <NextLink
                href="/[space-slug]/[section]"
                as={`/${space?.slug}/members`}
              >
                <Button buttonType="secondary" isFullWidth>
                  <Trans
                    i18nKey="space:about.members.seeAllMembers"
                    defaults="See all"
                  />
                </Button>
              </NextLink>
            </>
          )}
        </VStack>
      </Card>
    </SkeletonProvider>
  )
}
