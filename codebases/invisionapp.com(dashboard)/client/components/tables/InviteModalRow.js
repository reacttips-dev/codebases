import React from 'react'
import styled from 'styled-components'
import { Dropdown, Text } from '@invisionapp/helios'
import { truncateEmail } from '../../helpers/string'
import Avatar from '../ProportionedAvatar'

const InviteModalRow = ({ onRemoveInvite, onRoleChange, person, roleName, roles }) => {
  const rolesDropdownItems = roles.map(role => {
    const { id, name } = role

    return {
      label: name,
      type: 'item',
      selected: person.roleID === id,
      disabled: person.roleID === id,
      onClick: () => onRoleChange(person, role)
    }
  })

  const dropdownItems = rolesDropdownItems.concat([
    {
      type: 'divider'
    },
    {
      label: 'Remove invitation',
      type: 'item',
      onClick: () => onRemoveInvite(person)
    }
  ])

  // Note: Row cannot be a li, because Helios dropdown 'unstyledTrigger' prop
  // would hide the chevron.
  return (
    <Row key={person.email + person.roleID}>
      <Column flex>
        <div>
          <UserAvatar>
            <Avatar order="user" color="dark" name={person.email} alt={person.email} />
          </UserAvatar>
          <UserEmail order="body" color="text-darker">
            {truncateEmail(person.email)}
          </UserEmail>
        </div>
      </Column>
      <Column align="right">
        <Dropdown trigger={roleName} items={dropdownItems} />
      </Column>
    </Row>
  )
}

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.m} ${theme.spacing.s}`};
  border-bottom: 1px solid ${({ theme }) => theme.palette.structure.lighter};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.palette.structure.lighter};
  }
`

const UserAvatar = styled.div`
  display: inline-block;
  margin-right: ${({ theme }) => theme.spacing.s};
  vertical-align: middle;
`
const UserEmail = styled(Text)`
  display: inline;
`

const Column = styled.div`
  position: relative;
  flex: ${props => (props.flex ? '1' : 'none')};
  text-align: ${props => props.align || 'left'};
  white-space: nowrap;
`

export default InviteModalRow
