import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import NavLink from './Link'
import { CustomiseIcon, ChevronIcon } from '../Icon'

import { useSession } from '../../providers/SessionProvider'
import useBreakpoint from '../../hooks/useBreakpoint'

const OrganisationLink = ({ orgId }) => {
  const { can, currentOrganisationId, memberships } = useSession({
    orgId
  })
  const aboveMobile = useBreakpoint(0)
  const aboveTablet = useBreakpoint(1)

  const showFullLink = memberships.length > 1 ? aboveTablet : aboveMobile

  const matchOrganisations = useRouteMatch('/organisations', {
    strict: false
  })

  if (currentOrganisationId && can('updateOrganisations'))
    return (
      <NavLink
        to={
          matchOrganisations
            ? `/organisations/${currentOrganisationId}`
            : `/organisations/${currentOrganisationId}/teams`
        }
        variant="navPrimaryAlt"
        py={0}
      >
        {matchOrganisations ? (
          <ChevronIcon
            verticalAlign="middle"
            mt="-3px"
            mr={showFullLink ? '8px' : 0}
            rotate="90deg"
          />
        ) : (
          <CustomiseIcon
            verticalAlign="middle"
            mt="-3px"
            mr={showFullLink ? '8px' : 0}
          />
        )}
        {showFullLink ? (
          <FormattedMessage
            id={`navigation.links.organisation.${
              matchOrganisations ? 'back' : 'manage'
            }`}
          />
        ) : null}
      </NavLink>
    )

  return null
}

export default OrganisationLink
