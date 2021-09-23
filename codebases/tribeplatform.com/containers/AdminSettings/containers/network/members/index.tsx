import React, { useCallback, useEffect } from 'react'

import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/react'

import { Member, MemberStatus, Role } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Divider,
  SIDEBAR_VISIBLE,
  Skeleton,
  Tab,
  TableColumnWrapper,
  TableWrapper,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  UserBar,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { RoleDropdown } from 'components/common/RoleDropdown'

import { InviteMembersButton } from 'containers/AdminSettings/containers/network/members/components/InviteMembersButton'
import { MembersCountBox } from 'containers/AdminSettings/containers/network/members/components/MembersCountBox'
import { MemberOptions } from 'containers/Member/components/MemberOptions'
import useUpdateMember from 'containers/Member/hooks/useUpdateMember'
import { useGetRoles, useInviteNetworkMembers } from 'containers/Network/hooks'

import useAuthMember from 'hooks/useAuthMember'
import useMemberInvitations from 'hooks/useMemberInvitations'
import useNetworkMembers from 'hooks/useNetworkMembers'

import Truthy from 'utils/truthy'

import InvitedList from '../../../../Member/components/MembersList/InvitedList'

const staticProps = {
  nameColumnProps: () => ({
    flexGrow: 1,
    flexBasis: '40%',
    overflow: 'hidden',
  }),
  roleColumnProps: () => ({
    style: {
      flexGrow: 1,
      flexShrink: 1,
    },
  }),
}

const NetworkMembersSetting = () => {
  const { t } = useTranslation()
  const {
    loading: networkMembersLoading,
    members,
    totalCount,
    hasNextPage,
    loadMore: fetchMore,
    query: searchQuery,
    searchResult,
  } = useNetworkMembers()
  const {
    loading: memberInvitationsLoading,
    members: memberInvitation,
    totalCount: totalInvitationCount,
    hasNextPage: memberInvitationHasNextPage,
    loadMore: fetchMoreInvitations,
    query: searchInvitationQuery,
    searchResult: searchResultInvitations,
  } = useMemberInvitations()
  const { inviteNetworkMembers } = useInviteNetworkMembers()
  const { authUser } = useAuthMember()
  const { roles } = useGetRoles()

  const isLoading = networkMembersLoading || memberInvitationsLoading

  const memberList = members?.filter(
    e => e !== null && e.status !== MemberStatus.DELETED,
  )

  const filteredInvitationList = memberInvitation?.filter(e => e !== null)

  // Remove duplicate invitations
  const memberInvitationList = Array.from(
    new Set(filteredInvitationList?.map(e => e.inviteeEmail)),
  )
    .map(a => filteredInvitationList.find(b => b.inviteeEmail === a))
    .filter(Truthy)

  let invitationCount = isLoading ? 0 : totalInvitationCount || 0

  // Count of removed duplicates
  const filteredOutMembersCount =
    memberInvitation.length - memberInvitationList.length

  // Remove duplicate invitations from total count
  if (!isLoading && filteredOutMembersCount > 0) {
    invitationCount -= filteredOutMembersCount
  }

  return (
    <Box>
      <Grid
        columnGap={2}
        display={{
          base: 'none',
          [SIDEBAR_VISIBLE]: 'grid',
        }}
        justify="space-between"
        mb={8}
        px={0}
        rowGap={0}
        templateColumns="4fr max-content max-content"
        templateRows="auto"
        templateAreas={'"title countBox inviteMembers"'}
      >
        <Text gridArea="title" textStyle="bold/2xlarge">
          <Trans i18nKey="admin:sidebar.members" defaults="Members" />
        </Text>
        <MembersCountBox gridArea="countBox" />
        <InviteMembersButton gridArea="inviteMembers" />
      </Grid>
      <VStack
        display={{
          base: 'flex',
          [SIDEBAR_VISIBLE]: 'none',
        }}
        mb={8}
        px={4}
        spacing={4}
        width="100%"
      >
        <HStack justifyContent="space-between" width="100%">
          <Text textStyle="bold/2xlarge">
            <Trans i18nKey="admin:sidebar.members" defaults="Members" />
          </Text>
          <InviteMembersButton />
        </HStack>

        <MembersCountBox />
      </VStack>
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
              i18nKey="network:tab.active"
              defaults="Active · {{ count, ifNumAbbr }}"
              count={totalCount || 0}
            />
          </Tab>
          <Tab>
            <Trans
              i18nKey="network:tab.invited"
              defaults="Invited · {{ count, ifNumAbbr }}"
              count={invitationCount || 0}
            />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableWrapper
              data={memberList}
              hasMore={hasNextPage}
              total={totalCount}
              fetchMore={fetchMore}
              loading={isLoading}
              onSearch={searchQuery}
              searchResult={searchResult}
              searchPlaceholder={t('member:list.search', 'Search member...')}
              skeletonRowCount={8}
              hasTab
            >
              <TableColumnWrapper
                id="name"
                title={t('common:name', 'Name')}
                getColumnProps={staticProps.nameColumnProps}
              >
                {member => <NameCell member={member} />}
              </TableColumnWrapper>
              <TableColumnWrapper
                id="role"
                title={t('common:member.role', 'Role')}
                getColumnProps={staticProps.nameColumnProps}
              >
                {member => (
                  <RoleCell member={member} roles={roles} authUser={authUser} />
                )}
              </TableColumnWrapper>
              <TableColumnWrapper id="actions">
                {member => <ActionCell member={member} authUser={authUser} />}
              </TableColumnWrapper>
            </TableWrapper>
            <Divider />
          </TabPanel>
          <TabPanel>
            {memberInvitationList && (
              <InvitedList
                loading={isLoading}
                memberInvitations={memberInvitationList || []}
                fetchMore={fetchMoreInvitations}
                totalCount={invitationCount}
                hasNextPage={memberInvitationHasNextPage}
                handleInvite={inviteNetworkMembers}
                searchResult={searchResultInvitations}
                onSearch={searchInvitationQuery}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

const NameCell = ({ member }: { member: Member }) => {
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

interface RoleCellProps {
  member: Member
  roles: Role[]
  authUser: Member
}

const RoleCell = ({ member, roles, authUser }: RoleCellProps) => {
  const { authorized: hasUpdateRolePermission } = hasActionPermission(
    member?.authMemberProps?.permissions || [],
    'updateMember',
  )
  const { updateMember, error } = useUpdateMember()
  const toast = useToast()
  const { t } = useTranslation()
  const updateMemberRole = useCallback(
    ({ roleId, memberId }) => {
      updateMember({ roleId }, memberId)
    },
    [updateMember],
  )

  useEffect(() => {
    if (error) {
      toast({
        title: t('member:list.roleChangeError.title', {
          defaultValue: 'Error',
        }),
        description: error?.message,
        status: 'error',
      })
    }
  }, [error, t, toast])

  if (!member) {
    return null
  }

  if (!hasUpdateRolePermission || member?.id === authUser?.id) {
    return (
      <Skeleton>
        <Text
          color="label.primary"
          textStyle="regular/small"
          textTransform="capitalize"
          data-testid={`member-role-${member.id}`}
        >
          {member?.role?.name}
        </Text>
      </Skeleton>
    )
  }

  return (
    <RoleDropdown
      defaultValue={member?.role}
      options={roles}
      onChange={role =>
        updateMemberRole({
          roleId: role?.id,
          memberId: member?.id,
        })
      }
      memberId={member?.id}
    />
  )
}

const ActionCell = ({
  member,
  authUser,
}: {
  member: Member
  authUser: Member
}) => {
  if (!member) return null

  if (member?.id === authUser?.id) {
    return null
  }

  return (
    <HStack justifyContent="flex-end">
      <MemberOptions member={member} />
    </HStack>
  )
}

export default NetworkMembersSetting
