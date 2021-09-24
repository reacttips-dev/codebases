import React, { useCallback } from 'react'

import { useRouter } from 'next/router'
import UserLineIcon from 'remixicon-react/UserLineIcon'
import UserReceivedLineIcon from 'remixicon-react/UserReceivedLineIcon'

import { SpaceQuery, ActionPermissions, SpaceMember } from 'tribe-api'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useRemoveSpaceMember } from 'containers/Space/hooks'

export const SpaceMemberOptions = ({
  space,
  spaceMember,
}: {
  space: SpaceQuery['space']
  spaceMember: SpaceMember
}) => {
  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]
  const { authorized: hasRemovePermission } = hasActionPermission(
    permissions || [],
    'removeSpaceMembers',
  )

  const router = useRouter()
  const { member } = spaceMember || {}

  const memberLink = {
    href: '/member/[memberId]',
    as: `/member/${member?.id}`,
  }

  const goToProfile = useCallback(
    () => router.push(memberLink?.href, memberLink?.as),
    [memberLink?.href, memberLink?.as, router],
  )
  const { removeSpaceMember } = useRemoveSpaceMember(space)

  if (!member) return null

  return (
    <Dropdown>
      <DropdownIconButton px={0} data-testid={`options-button-${member.id}`} />
      <DropdownList>
        <DropdownItem
          data-testid={`options-view-profile-button-${member.id}`}
          icon={UserLineIcon}
          onClick={goToProfile}
        >
          <Text textStyle="medium/medium">
            <Trans i18nKey="member:list.viewProfile" defaults="View profile" />
          </Text>
        </DropdownItem>

        {hasRemovePermission && (
          <DropdownItem
            data-testid={`options-delete-button-${member.id}`}
            onClick={() => removeSpaceMember(member)}
            icon={UserReceivedLineIcon}
            textStyle="regular/medium"
          >
            <Trans i18nKey="common:member.remove" defaults="Remove member" />
          </DropdownItem>
        )}
      </DropdownList>
    </Dropdown>
  )
}
