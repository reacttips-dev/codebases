import React from 'react'
import { FormattedMessage } from 'react-intl'

import { MenuSection, MenuLinks } from './Menu'

import { useSession } from '../../providers/SessionProvider'
import truncate from '../../utils/smart-truncate'

const OrganisationMenu = ({ orgId, forceRefresh }) => {
  const { memberships } = useSession()
  const organisations = memberships.map(({ organisation }) => organisation)

  const links = organisations.map(({ name, slug }, index) => ({
    name: truncate(name, 30),
    id: slug,
    to: `/organisations/${slug}`,
    forceRefresh,
    active: orgId ? slug === orgId : index === 0
  }))

  return (
    <FormattedMessage id="navigation.menu.organisations.title">
      {title => (
        <MenuSection>
          <MenuLinks title={title} links={links} />
        </MenuSection>
      )}
    </FormattedMessage>
  )
}

export default OrganisationMenu
