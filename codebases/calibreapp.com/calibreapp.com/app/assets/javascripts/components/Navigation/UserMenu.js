import React from 'react'
import { useIntl } from 'react-intl'

import { MenuLinks, MenuList, MenuSection } from './Menu'
import { Text, Strong } from '../Type'
import { Flex, Box } from '../Grid'
import Badge from '../Badge'

import { useSession } from '../../providers/SessionProvider'

const BADGE_TYPE = {
  admin: 'error',
  member: 'success',
  viewer: 'neutral'
}

const UserMenu = () => {
  const { features, currentUser, currentRole: role } = useSession()
  const { name, email, staff } = currentUser
  const intl = useIntl()

  const MENU_LINKS = [
    {
      name: intl.formatMessage({ id: 'navigation.menu.users.profile' }),
      to: '/you/settings/profile',
      forceRefresh: false
    },
    {
      name: intl.formatMessage({ id: 'navigation.menu.users.notifications' }),
      to: '/you/settings/email-notifications',
      forceRefresh: false
    },
    {
      name: intl.formatMessage({ id: 'navigation.menu.users.accessTokens' }),
      to: '/you/settings/tokens',
      forceRefresh: false
    },
    {
      name: intl.formatMessage({ id: 'navigation.menu.users.sign_out' }),
      to: '/sign-out',
      forceRefresh: true
    }
  ]
  const label = intl.formatMessage({
    id: `organisations.members.roles.${role}`
  })

  const links = MENU_LINKS.filter(({ feature }) =>
    feature ? features.includes(feature) : true
  )

  if (staff) {
    links.splice(0, 0, {
      name: 'Admin',
      to: '/admin',
      forceRefresh: true
    })
  }

  return (
    <MenuList level="sm" mt="-8px">
      <MenuSection px={2}>
        <Flex alignItems="center">
          <Box mr="8px">
            <Strong fontWeight={600}>{name}</Strong>
          </Box>
          <Box lineHeight={1}>
            <Badge type={BADGE_TYPE[role]}>{label}</Badge>
          </Box>
        </Flex>
        <Box>
          <Text color="grey300">{email}</Text>
        </Box>
      </MenuSection>
      <MenuSection>
        <MenuLinks links={links} maxHeight="100%" />
      </MenuSection>
    </MenuList>
  )
}

export default UserMenu
