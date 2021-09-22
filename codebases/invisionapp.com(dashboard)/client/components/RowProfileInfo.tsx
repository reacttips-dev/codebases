import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Avatar, Flex, Text, Truncate } from '@invisionapp/helios'
import RoleBadge from './tables/RoleBadge'
import { getAvatarUrl, getEmail, getName } from '../stores/store.helpers'
import { isMyself } from '../stores/members/members.helpers'
import { getRoleNameById } from '../stores/roles/roles.helpers'
import { selectAllRoles } from '../stores/roles/roles.selectors'
import { Member } from '../stores/members/members.types'
import { UserState } from '../stores/user'
import { RowItem } from '../stores/tables/tables.types'

interface RowProfileInfoProps {
  isInvite: boolean
  item: RowItem
  showEmailForName?: boolean
  showMyself?: boolean
  showRoleBadge?: boolean
  user?: UserState
}

export const RowProfileInfo = (props: RowProfileInfoProps) => {
  const { isInvite = false, item, showMyself = false, showRoleBadge = false, user } = props

  const allRoles = useSelector(selectAllRoles)

  if (item === undefined) {
    return null
  }

  const roleName = getRoleNameById(allRoles, item.roleID)
  const email = getEmail(item)
  const name = isInvite ? email : getName(item)
  const inviteCreatorEmail =
    isInvite && 'createdBy' in item && item.createdBy ? item.createdBy.email : null
  const avatarURL = getAvatarUrl(item)

  return (
    <Flex>
      <MemberAvatar color="dark" name={name} order="user" src={avatarURL} />
      <div>
        <Text order="body" color="text-darker">
          <strong>
            {name}
            {showMyself && (isMyself(user, item as Member) ? ' (you)' : '')}
          </strong>
          {showRoleBadge && roleName && <RoleBadge roleName={roleName} />}
        </Text>
        <Text order="body" size="smaller" color="text-lighter">
          {isInvite &&
            (inviteCreatorEmail ? (
              <span>Invited by {inviteCreatorEmail}</span>
            ) : (
              <span>Invited</span>
            ))}

          {!isInvite && email && (
            <Truncate placement="center" style={{ zIndex: 1 }}>
              {email}
            </Truncate>
          )}
        </Text>
      </div>
    </Flex>
  )
}

const MemberAvatar = styled(Avatar)`
  margin-right: ${({ theme }) => theme.spacing.s};
  float: left;
`
