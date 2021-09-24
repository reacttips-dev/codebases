import React from 'react'

import { BadgeProps } from '@chakra-ui/layout'
import ShieldUserLineIcon from 'remixicon-react/ShieldUserLineIcon'

import { Role, RoleType, SpaceRole } from 'tribe-api'
import { Badge, Icon } from 'tribe-components'

type MemberBadgeProps = BadgeProps & { memberRole?: Role | SpaceRole | null }
const MemberBadge = ({ memberRole, ...rest }: MemberBadgeProps) => {
  switch (memberRole?.type) {
    case RoleType.ADMIN:
      return (
        <Badge display="flex" alignItems="center" {...rest}>
          <Icon as={ShieldUserLineIcon} fontSize="md" mr={1} />
          {memberRole.name}
        </Badge>
      )
    case RoleType.MODERATOR:
      return <Badge {...rest}>{memberRole.name}</Badge>
    default:
      return null
  }
}

export default MemberBadge
