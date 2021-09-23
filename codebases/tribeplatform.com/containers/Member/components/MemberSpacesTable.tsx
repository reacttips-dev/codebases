import React from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import LogoutBoxLineIcon from 'remixicon-react/LogoutBoxLineIcon'
import Settings4LineIcon from 'remixicon-react/Settings4LineIcon'

import { Space, SpaceRole } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Text,
  UserBar,
  TableColumnWrapper,
  TableWrapper,
  Card,
  ImagePickerDropdown,
} from 'tribe-components'
import { useTribeFeature, Features } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import { ErrorDisclosure } from 'containers/Error/ErrorDisclosure'
import { MemberSpacesEmpty } from 'containers/Member/components/MemberSpacesEmpty'
import useMemberSpaces from 'containers/Member/hooks/useMemberSpaces'
import { useLeaveSpace } from 'containers/Space/hooks'
import { DEFAULT_SPACES_LIMIT } from 'containers/Space/useGetSpaces'

import useAuthMember from 'hooks/useAuthMember'

interface SpacesTableProps {
  memberId: string
}

export const MemberSpacesTable = ({ memberId }: SpacesTableProps) => {
  const {
    spaceMembers,
    loading,
    hasNextPage,
    totalCount,
    loadMore,
    searchResult,
    error,
  } = useMemberSpaces({
    memberId,
    limit: DEFAULT_SPACES_LIMIT,
  })
  const { authUser } = useAuthMember()
  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  if (error) {
    return (
      <Card>
        <ErrorDisclosure />
      </Card>
    )
  }

  return (
    <TableWrapper
      data={spaceMembers}
      hasMore={hasNextPage}
      total={totalCount}
      fetchMore={loadMore}
      showColumnsFilter={false}
      showHeaders={false}
      loading={loading}
      searchResult={searchResult}
      emptyStateComponent={<MemberSpacesEmpty memberId={memberId} />}
    >
      <TableColumnWrapper
        id="name"
        getColumnProps={() => ({
          flexGrow: 1,
          flexBasis: '40%',
          overflow: 'hidden',
        })}
      >
        {spaceMember => (
          <NameCell
            isImagePickerDropdownEnabled={isImagePickerDropdownEnabled}
            space={spaceMember.space}
          />
        )}
      </TableColumnWrapper>
      <TableColumnWrapper id="role">
        {spaceMember => <RoleCell role={spaceMember.role} />}
      </TableColumnWrapper>
      <TableColumnWrapper id="actions">
        {spaceMember => (
          <ActionCell
            space={spaceMember.space}
            isAuthUser={authUser?.id === spaceMember.member?.id}
          />
        )}
      </TableColumnWrapper>
    </TableWrapper>
  )
}

const NameCell = ({
  isImagePickerDropdownEnabled = false,
  space,
}: {
  isImagePickerDropdownEnabled: boolean
  space: Space
}) => {
  const memberLink = {
    href: '/[space-slug]/[section]',
    as: `/${space?.slug}/posts`,
  }

  return space?.image && isImagePickerDropdownEnabled ? (
    <HStack alignItems="center" spacing={3}>
      <ImagePickerDropdown
        emojiSize="md"
        isDisabled
        imageBoxSize={10}
        image={space?.image}
      />
      <VStack alignItems="flex-start" spacing={1}>
        <Text color="label.primary" textStyle="bold/medium">
          {space?.name}
        </Text>

        {space?.description && (
          <Text color="label.secondary" textStyle="regular/small">
            {space?.description}
          </Text>
        )}
      </VStack>
    </HStack>
  ) : (
    <UserBar
      size="lg"
      title={space?.name}
      titleLink={memberLink}
      subtitle={space?.description}
      subtitleLink={memberLink}
      picture={space?.image}
      pictureLink={memberLink}
    />
  )
}

const RoleCell = ({ role }: { role: SpaceRole }) => {
  return <Text color="label.secondary">{role?.name}</Text>
}

const ActionCell = ({
  space,
  isAuthUser,
}: {
  space: Space
  isAuthUser?: boolean
}) => {
  const router = useRouter()
  const { leaveSpace } = useLeaveSpace({ space })

  if (!isAuthUser) return null
  const { authorized: updatePermission } = hasActionPermission(
    space?.authMemberProps?.permissions || [],
    'updateSpace',
  )
  const { authorized: leavePermission } = hasActionPermission(
    space?.authMemberProps?.permissions || [],
    'leaveSpace',
  )

  if (!updatePermission && !leavePermission) return null

  const goToSpaceSetting = () => {
    router.push(
      '/admin/space/[space-slug]/[section]',
      `/admin/space/${space?.slug}/settings`,
    )
  }

  return (
    <HStack justifyContent="flex-end">
      <Dropdown isLazy>
        <DropdownIconButton />

        <DropdownList>
          {updatePermission && (
            <DropdownItem icon={Settings4LineIcon} onClick={goToSpaceSetting}>
              <Trans i18nKey="space.aria.settings" defaults="Settings" />
            </DropdownItem>
          )}

          {leavePermission && (
            <DropdownItem onClick={leaveSpace} icon={LogoutBoxLineIcon}>
              <Trans i18nKey="space.header.leave" defaults="Leave space" />
            </DropdownItem>
          )}
        </DropdownList>
      </Dropdown>
    </HStack>
  )
}
