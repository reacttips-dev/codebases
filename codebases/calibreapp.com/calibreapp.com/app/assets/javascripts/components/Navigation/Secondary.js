import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Flex } from '../Grid'

import Item from './Item'
import NavLink from './Link'
import { useSession } from '../../providers/SessionProvider'
import { breakpoint } from '../../utils/style'

const USER_LINKS = [
  {
    id: 'navigation.links.profile',
    to: () => '/you/settings/profile',
    forceRefresh: false
  },
  {
    id: 'navigation.links.notifications',
    to: () => '/you/settings/email-notifications',
    forceRefresh: false
  },
  {
    id: 'navigation.links.accessTokens',
    to: () => '/you/settings/tokens',
    exactMatch: false,
    forceRefresh: false
  }
]

const ORGANISATION_LINKS = [
  {
    id: 'navigation.links.sites',
    to: ({ orgId }) => `/teams/${orgId}`,
    match: ['/teams/:orgId', '/teams/:orgId/sites/new'],
    exactMatch: false,
    permission: 'readSites'
  },
  {
    id: 'navigation.links.members',
    to: ({ orgId }) => `/organisations/${orgId}/members`,
    match: ['/organisations/:orgId/members'],
    exactMatch: false,
    permission: 'updateOrganisations'
  },
  {
    id: 'navigation.links.api',
    to: ({ orgId }) => `/organisations/${orgId}/api`,
    exactMatch: false,
    permission: 'updateOrganisations'
  },
  {
    id: 'navigation.links.billing',
    to: ({ orgId }) => `/organisations/${orgId}/billing`,
    exactMatch: false,
    permission: 'readPlan'
  },
  {
    id: 'navigation.links.settings',
    to: ({ orgId }) => `/organisations/${orgId}/settings`,
    exactMatch: false,
    permission: 'updateOrganisations'
  }
]

const ORGANISATION_TEAM_LINKS = [
  {
    id: 'navigation.links.teams',
    to: ({ orgId }) => `/organisations/${orgId}/teams`,
    match: ['/organisations/:orgId/teams'],
    exactMatch: false,
    permission: 'updateOrganisations'
  },
  {
    id: 'navigation.links.people',
    to: ({ orgId }) => `/organisations/${orgId}/members`,
    match: ['/organisations/:orgId/members', '/organisations/:orgId/edit'],
    exactMatch: false,
    permission: 'updateOrganisations'
  },
  {
    id: 'navigation.links.api',
    to: ({ orgId }) => `/organisations/${orgId}/api`,
    exactMatch: false,
    permission: 'updateOrganisations'
  },
  {
    id: 'navigation.links.billing',
    to: ({ orgId }) => `/organisations/${orgId}/billing`,
    exactMatch: false,
    permission: 'updateOrganisations'
  },
  {
    id: 'navigation.links.settings',
    to: ({ orgId }) => `/organisations/${orgId}/settings`,
    exactMatch: false,
    permission: 'updateOrganisations'
  }
]

const TEAM_LINKS = [
  {
    id: 'navigation.links.sites',
    to: ({ teamId }) => `/teams/${teamId}`,
    match: ['/teams/:teamId/sites/new', '/teams/:teamId'],
    exactMatch: true,
    sites: true
  },
  {
    id: 'navigation.links.members',
    to: ({ teamId }) => `/teams/${teamId}/team`,
    exactMatch: false,
    sites: true
  }
]

const SITE_TEAM_LINKS = [
  {
    id: 'navigation.links.pulse',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}`,
    match: [
      '/teams/:orgId/:siteId/metrics/:measurement',
      '/teams/:orgId/:siteId'
    ],
    permission: 'readSites'
  },
  {
    id: 'navigation.links.pages',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/pages`,
    exactMatch: false,
    permission: 'readSites'
  },
  {
    id: 'navigation.links.snapshots',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/snapshots`,
    exactMatch: false,
    permission: 'readSites'
  },
  {
    id: 'navigation.links.budgets',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/budgets`,
    exactMatch: false,
    permission: 'readSites'
  },
  {
    id: 'navigation.links.settings',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/settings`,
    exactMatch: false,
    permission: 'updateSites'
  }
]

const Items = styled(Flex)`
  overflow-x: scroll;
  ${breakpoint(0)`
    overflow-x: auto;
  `};
`
Items.defaultProps = {
  as: 'ul',
  flex: 1,
  width: 1,
  alignItems: 'center'
}

const LoadingLinks = () => (
  <Items>
    <Item>
      <NavLink variant="navSecondary">&nbsp;</NavLink>
    </Item>
  </Items>
)

const Links = ({ links, forceRefresh, orgId, siteId, teamId }) => {
  return (
    <Items>
      {links.map(
        ({ id, to, forceRefresh: linkForceRefresh, exactMatch, match }) => (
          <Item key={id} mr="30px">
            <NavLink
              variant="navSecondary"
              to={to({ orgId, siteId, teamId })}
              match={match}
              forceRefresh={linkForceRefresh || forceRefresh}
              exactMatch={exactMatch}
            >
              <FormattedMessage id={id} />
            </NavLink>
          </Item>
        )
      )}
    </Items>
  )
}

const getLinks = ({ siteId, teamId, orgId, features, matchUser }) => {
  if (matchUser)
    return USER_LINKS.filter(({ feature }) =>
      feature ? features.includes(feature) : true
    )

  if (siteId) return SITE_TEAM_LINKS
  if (teamId) return TEAM_LINKS
  if (orgId) return ORGANISATION_TEAM_LINKS

  return []
}

const SecondaryNavigation = ({ forceRefresh, orgId, teamId, siteId }) => {
  const { can, features, organisation, error } = useSession({
    teamId,
    orgId
  })

  const matchSetup = useRouteMatch('/setup/:orgId?', {
    strict: false
  })

  const matchOrganisation = useRouteMatch('/organisations/:orgId', {
    exact: true,
    strict: true
  })

  const matchUser = useRouteMatch('/you', {
    strict: false
  })

  if (
    matchOrganisation?.isExact ||
    (!matchUser && !organisation) ||
    error?.type == 'Organisation'
  )
    return null

  if (matchSetup) return null

  const links = getLinks({
    features,
    orgId: organisation?.slug,
    teamId: teamId,
    siteId,
    matchUser
  })

  const filteredLinks = links.filter(({ permission }) =>
    permission ? can(permission) : true
  )

  return (
    <Flex
      backgroundColor="blue400"
      alignItems="center"
      px={3}
      data-qa="secondaryNavigation"
    >
      {filteredLinks.length ? (
        <Links
          links={filteredLinks}
          forceRefresh={forceRefresh}
          orgId={organisation?.slug}
          teamId={teamId}
          siteId={siteId}
        />
      ) : (
        <LoadingLinks />
      )}
    </Flex>
  )
}

export default SecondaryNavigation
