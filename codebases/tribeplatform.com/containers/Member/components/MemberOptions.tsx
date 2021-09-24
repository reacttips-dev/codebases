import React, { useCallback } from 'react'

import { useRouter } from 'next/router'
import UserLineIcon from 'remixicon-react/UserLineIcon'
import UserReceivedLineIcon from 'remixicon-react/UserReceivedLineIcon'

import { Member } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useRemoveNetworkMember } from 'containers/Network/hooks'

export const MemberOptions = ({ member }: { member: Member }) => {
  const router = useRouter()
  const memberLink = {
    href: '/member/[memberId]',
    as: `/member/${member.id}`,
  }
  const goToProfile = useCallback(
    () => router.push(memberLink?.href, memberLink?.as),
    [memberLink?.href, memberLink?.as, router],
  )
  const { authorized: hasRemovePermission } = hasActionPermission(
    member?.authMemberProps?.permissions || [],
    'removeMember',
  )
  const { removeMember } = useRemoveNetworkMember()

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
            onClick={() => removeMember(member)}
            textStyle="regular/medium"
            icon={UserReceivedLineIcon}
          >
            <Trans i18nKey="common:member.remove" defaults="Remove member" />
          </DropdownItem>
        )}
      </DropdownList>
    </Dropdown>
  )
}
