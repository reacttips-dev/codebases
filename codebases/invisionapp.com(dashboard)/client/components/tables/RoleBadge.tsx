import React from 'react'

import { Badge, Tooltip } from '@invisionapp/helios'
import { colors } from '@invisionapp/helios/css/theme'
import styled from 'styled-components'
import { RoleName } from '../../stores/roles'

type RoleBadgeProps = {
  roleName: RoleName
}

const roleBadgeDictionary: { [roleName: string]: string } = {
  Owner:
    'The team owner can manage all aspects of the team as well as update the team’s name and subdomain',
  Admin:
    'Admins can manage memberships and billing, as well as security, authentication, and team settings',
  Manager: 'Managers can update user roles and groups, as well as add and remove users',
  Guest: 'External guests can only access documents and spaces they are invited to'
}

const RoleBadge = (props: RoleBadgeProps) => {
  const { roleName } = props

  if (roleName === 'Member') {
    return null
  }

  return (
    <Wrapper>
      <Tooltip
        maxWidth={275}
        delayDuration={750}
        withDelay
        trigger={
          <StyledBadge compact className={roleName === 'Guest' ? 'gray' : ''}>
            {roleName}
          </StyledBadge>
        }
      >
        {roleBadgeDictionary[roleName]}
      </Tooltip>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: inline-block;
  margin-left: 5px;
  cursor: help;
`

const StyledBadge = styled(Badge)`
  font-size: 10px;
  text-transform: uppercase;

  &.gray {
    background: ${({ theme }) => theme.palette.structure.darker};
    color: ${colors.blackLighter};
  }
`

export default RoleBadge
