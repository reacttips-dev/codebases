import React, { FC } from 'react'

import { Box, HStack, Text } from '@chakra-ui/react'
import UserReceivedLineIcon from 'remixicon-react/UserReceivedLineIcon'

import { SpaceQuery } from 'tribe-api'
import {
  ActionPermissions,
  Member,
  Space,
  SpaceMember,
  SpaceRole,
} from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Button,
  Icon,
  Skeleton,
  Tab,
  TableColumnWrapper,
  TableWrapper,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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

import { useSpace } from 'hooks/space/useSpace'
import useAuthMember from 'hooks/useAuthMember'
import useToggle from 'hooks/useToggle'

import RequestList from '../../../../Member/components/MembersList/RequestList'
import AddMembersModal from '../../../../Space/components/AddMembersModal'

const SpaceMembersSettings: FC<{ slug: Space['slug'] }> = ({ slug }) => {
  const { t } = useTranslation()
  const { space } = useSpace({
    variables: {
      slug,
    },
  })
  const spaceRoles = space?.roles as SpaceRole[]
  const [isAddMembersModalOpen, toggleAddMembersModal] = useToggle(false)
  const {
    spaceMembers,
    totalCount,
    loading,
    hasNextPage,
    fetchMore,
  } = useSpaceMembers({
    spaceId: space?.id,
    limit: MEMBERS_LIMIT,
  })
  const { spaceJoinRequests } = useGetSpaceMembershipRequests({
    spaceId: space?.id,
  })
  const { updateSpaceMemberRole } = useUpdateSpaceMemberRole({
    spaceId: space?.id,
  })
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

  return (
    <Box>
      <HStack mb={30} justify="space-between" px={1}>
        <Text textStyle="bold/2xlarge">
          <Trans i18nKey="admin:sidebar.members" defaults="Members" />
        </Text>
        <Skeleton>
          <Button
            onClick={toggleAddMembersModal}
            size="sm"
            buttonType="primary"
            leftIcon={<Icon as={UserReceivedLineIcon} />}
          >
            <Trans i18nKey="space.card.members.add" defaults="Add people" />
          </Button>
        </Skeleton>
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
              i18nKey="space:tab.active"
              defaults="Active · {{count, ifNumAbbr }}"
              count={totalCount || 0}
            />
          </Tab>
          <Tab>
            <Trans
              i18nKey="space:tab.requested"
              defaults="Requests · {{count, ifNumAbbr }}"
              count={spaceJoinRequests?.length || 0}
            />
          </Tab>
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
              skeletonRowCount={8}
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
                spaceSlug={slug}
              />
            )}
          </TabPanel>
          <TabPanel>
            <RequestList
              loading={loading}
              spaceJoinRequests={spaceJoinRequests}
              ownerId={space?.createdBy?.id}
              totalCount={totalCount}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

const NameCell = ({ spaceMember }: { spaceMember: SpaceMember }) => {
  const { member } = spaceMember || {}

  if (!member) return null

  const memberLink = {
    href: '/member/[memberId]',
    as: `/member/${member.id}`,
  }

  return (
    <UserBar
      size="lg"
      title={member.name}
      titleLink={memberLink}
      subtitle={member.email}
      subtitleLink={memberLink}
      picture={member.profilePicture}
      pictureLink={memberLink}
      data-testid={`admin-role-${member.id}`}
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
          data-testid={`member-role-${member.id}`}
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

export default SpaceMembersSettings
