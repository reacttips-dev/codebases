import React, { useEffect, useState, useCallback } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import UserReceivedLineIcon from 'remixicon-react/UserReceivedLineIcon'

import { SpaceQuery } from 'tribe-api'
import {
  ActionPermissions,
  Member,
  SpaceMember,
  SpaceRole,
} from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Button,
  Icon,
  Skeleton,
  SkeletonProvider,
  Tab,
  TableColumnWrapper,
  TableWrapper,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UserBar,
} from 'tribe-components'
import { i18n, Trans, useTranslation } from 'tribe-translation'

import { SpaceRoleDropdown } from 'components/common/SpaceRoleDropdown'

import { SpaceMemberOptions } from 'containers/Member/components/SpaceMemberOptions'
import {
  MEMBERS_LIMIT,
  useGetSpaceMembershipRequests,
  useSpaceMembers,
  useUpdateSpaceMemberRole,
} from 'containers/Space/hooks'

import useAuthMember from 'hooks/useAuthMember'
import useToggle from 'hooks/useToggle'

import { isIOS } from 'utils/ios'

import RequestList from '../../Member/components/MembersList/RequestList'
import AddMembersModal from './AddMembersModal'

export interface SpaceMembersProps {
  space: SpaceQuery['space']
}

const SpaceMembers = ({ space }: SpaceMembersProps) => {
  const { t } = useTranslation()

  const router = useRouter()

  const [isAddMembersModalOpen, toggleAddMembersModal] = useToggle(false)
  const [, rerender] = useState<any>(null)
  const {
    fetchMore,
    hasNextPage,
    loading,
    refetch,
    spaceMembers,
    totalCount,
  } = useSpaceMembers({
    spaceId: space?.id,
    limit: MEMBERS_LIMIT,
    skip: typeof window === 'undefined',
  })

  useEffect(() => {
    if (typeof refetch === 'function' && router?.query?.section === 'members') {
      refetch()
    }
  }, [refetch, router?.query?.section])

  const { spaceJoinRequests } = useGetSpaceMembershipRequests({
    spaceId: space?.id,
  })
  const { updateSpaceMemberRole } = useUpdateSpaceMemberRole({
    spaceId: space?.id,
  })
  const spaceRoles = space?.roles as SpaceRole[]
  const { authUser } = useAuthMember()

  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canAddMembers } = hasActionPermission(
    permissions || [],
    'addSpaceMembers',
  )

  const { authorized: hasUpdateRolePermission } = hasActionPermission(
    permissions || [],
    'updateSpaceMemberRole',
  )

  const {
    authorized: hasGetSpaceMembershipRequestsPermission,
  } = hasActionPermission(permissions || [], 'getSpaceMembershipRequests')

  // Fixing blank list rows on iOS: https://linear.app/tribe/issue/COR-91/space-members-not-displayed-correctly-on-mobile
  useEffect(() => {
    if (!isIOS()) return

    const timeout = setTimeout(() => rerender({}), 0)

    return () => {
      clearTimeout(timeout)
    }
  }, [rerender])

  return (
    <SkeletonProvider loading={loading}>
      <Box>
        <HStack
          w="full"
          justifyContent="space-between"
          display={['none', 'flex']}
          mb={30}
        >
          <Skeleton>
            {space?.membersCount > 0 && (
              <Text textStyle="medium/large">
                <Trans
                  i18nKey="space:card.membersCount"
                  defaults="{{ membersCount, numberWithCommas }} members"
                  values={{
                    membersCount: space?.membersCount,
                  }}
                />
              </Text>
            )}
          </Skeleton>
          {canAddMembers && (
            <Skeleton>
              <Button
                onClick={toggleAddMembersModal}
                size="sm"
                buttonType="primary"
                leftIcon={<Icon as={UserReceivedLineIcon} />}
              >
                <Trans i18nKey="space:card.members.add" defaults="Add people" />
              </Button>
            </Skeleton>
          )}
        </HStack>
        <Tabs>
          <TabList
            color="border.base"
            borderBottom="none"
            borderTopRadius="md"
            borderTop="1px solid"
            borderRight="1px solid"
            borderLeft="1px solid"
          >
            <Tab marginLeft="5">
              <Trans
                i18nKey="space:tab.activeCount"
                defaults="Active · {{ activeCount, numberWithCommas }}"
                values={{
                  activeCount: space?.membersCount || 0,
                }}
              />
            </Tab>
            {hasGetSpaceMembershipRequestsPermission && (
              <Tab>
                <Trans
                  i18nKey="space:tab.requestsCount"
                  defaults="Requests · {{ requestsCount, numberWithCommas }}"
                  values={{
                    requestsCount: spaceJoinRequests?.length || 0,
                  }}
                />
              </Tab>
            )}
          </TabList>
          <TabPanels>
            <TabPanel>
              <TableWrapper
                data={spaceMembers}
                hasMore={hasNextPage}
                total={totalCount}
                fetchMore={fetchMore}
                loading={loading}
                hasTab
              >
                <TableColumnWrapper
                  id="name"
                  title={t('common:name', 'Name')}
                  getColumnProps={() => ({
                    flexGrow: 1,
                    flexBasis: '40%',
                    overflow: 'hidden',
                  })}
                >
                  {spaceMember => <NameCell spaceMember={spaceMember} />}
                </TableColumnWrapper>

                <TableColumnWrapper
                  id="role"
                  title={t('member:list.space_role', 'Space Role')}
                >
                  {spaceMember => (
                    <RoleCell
                      spaceMember={spaceMember}
                      ownerId={space?.createdBy?.id}
                      hasUpdateRolePermission={hasUpdateRolePermission}
                      updateSpaceMemberRole={updateSpaceMemberRole}
                      spaceRoles={spaceRoles}
                    />
                  )}
                </TableColumnWrapper>
                <TableColumnWrapper id="actions">
                  {spaceMember => (
                    <ActionCell
                      spaceMember={spaceMember}
                      space={space}
                      authUser={authUser}
                    />
                  )}
                </TableColumnWrapper>
              </TableWrapper>
              {canAddMembers && (
                <AddMembersModal
                  isOpen={isAddMembersModalOpen}
                  onClose={toggleAddMembersModal}
                  spaceSlug={space?.slug}
                />
              )}
            </TabPanel>
            {hasGetSpaceMembershipRequestsPermission && (
              <TabPanel>
                <RequestList
                  loading={loading}
                  spaceJoinRequests={spaceJoinRequests}
                  ownerId={space?.createdBy?.id}
                  totalCount={totalCount}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </SkeletonProvider>
  )
}

const NameCell = ({ spaceMember }: { spaceMember: SpaceMember }) => {
  const router = useRouter()
  const { member } = spaceMember || {}

  const href = '/member/[memberId]'
  const as = `/member/${member?.id}`

  const goToMember = useCallback(() => {
    router.push(href, as)
  }, [href, as, router])

  return (
    <UserBar
      size="lg"
      title={member?.name}
      onTitleClick={goToMember}
      subtitle={member?.tagline}
      onSubtitleClick={goToMember}
      picture={member?.profilePicture}
      onPictureClick={goToMember}
      data-testid={`admin-role-${member?.id}`}
    />
  )
}

const RoleCell = ({
  spaceMember,
  hasUpdateRolePermission,
  spaceRoles,
  updateSpaceMemberRole,
  ownerId,
}: {
  spaceMember: SpaceMember
  hasUpdateRolePermission: boolean
  spaceRoles: SpaceRole[]
  updateSpaceMemberRole: ({ role, memberId }) => void
  ownerId?: string | null
}) => {
  const { member, role } = spaceMember || {}

  if (!member) {
    return null
  }

  const isOwner = ownerId === member?.id

  if (!hasUpdateRolePermission || isOwner) {
    return (
      <Skeleton>
        <Text
          color="label.primary"
          textStyle="regular/small"
          textTransform="capitalize"
          data-testid={`member-role-${member?.id}`}
        >
          {isOwner ? i18n.t('common:space.members.owner', 'Owner') : role?.name}
        </Text>
      </Skeleton>
    )
  }

  return (
    <SpaceRoleDropdown
      defaultValue={role}
      options={spaceRoles}
      onChange={role =>
        updateSpaceMemberRole({
          role,
          memberId: member?.id,
        })
      }
      memberId={member?.id}
    />
  )
}

const ActionCell = ({
  spaceMember,
  space,
  authUser,
}: {
  spaceMember: SpaceMember
  authUser: Member
  space: SpaceQuery['space']
}) => {
  const { member } = spaceMember || {}

  if (!member) return null

  const ownerId = space?.createdBy?.id
  if (!ownerId && member?.id === authUser?.id) {
    return null
  }

  if (ownerId && ownerId === member.id) {
    return null
  }

  return (
    <HStack justifyContent="flex-end">
      <SpaceMemberOptions spaceMember={spaceMember} space={space} />
    </HStack>
  )
}

export default SpaceMembers
