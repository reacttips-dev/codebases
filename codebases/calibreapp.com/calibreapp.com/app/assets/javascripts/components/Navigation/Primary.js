import React, { Suspense } from 'react'
import { useQuery } from '@apollo/client'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { useRouteMatch } from 'react-router-dom'

import { Text } from '../Type'
import { Flex, InlineBox, Box } from '../Grid'
import { SpadeIcon, HelpRoundIcon } from '../Icon'
import Avatar from '../Avatar'

import { Site as GetSite } from '../../queries/NavigationQueries.gql'

import NavLink from './Link'
import Item from './Item'
import Menu, { MenuList, DropdownButton, MenuButton } from './Menu'
import UserMenu from './UserMenu'
import HelpMenu from './HelpMenu'
import OrganisationMenu from './OrganisationMenu'
import SiteMenu from './SiteMenu'
import TeamMenu from './TeamMenu'
import Search from './Search'

import useBreakpoint from '../../hooks/useBreakpoint'
import truncate from '../../utils/smart-truncate'
import { useSession } from '../../providers/SessionProvider'

const CalibreIcon = React.lazy(() => import('../Icon/Calibre'))
const Button = React.lazy(() => import('../Button/Button'))
const ManageOrganisationLink = React.lazy(() => import('./OrganisationLink'))

const Divider = styled(InlineBox)`
  transform: rotate(20deg);
`
Divider.defaultProps = {
  as: 'span',
  backgroundColor: 'blue200',
  height: '21px',
  ml: '4px',
  mr: '2px',
  width: '1px'
}

const BrandLink = ({ full }) => {
  return (
    <Item>
      <NavLink to="/" forceRefresh={true} variant="white">
        {full ? (
          <Suspense fallback={<div />}>
            <CalibreIcon />
          </Suspense>
        ) : (
          <SpadeIcon />
        )}
      </NavLink>
    </Item>
  )
}

const UserLink = ({ teamId, orgId }) => {
  const { currentUser, currentRole: role } = useSession({
    teamId,
    orgId
  })
  const aboveTablet = useBreakpoint(1)
  const { name, avatar, email } = currentUser || {}

  const redirectParams = `?redirect_to=${window.location.pathname}`

  return email ? (
    <Box ml="auto">
      <Item mr="20px">
        <Suspense fallback={<div />}>
          <ManageOrganisationLink orgId={orgId} />
        </Suspense>
      </Item>
      <Item mr="20px">
        <Menu>
          {({ isExpanded }) => (
            <>
              <MenuButton className={isExpanded ? 'active' : ''}>
                <HelpRoundIcon
                  verticalAlign="middle"
                  mr={aboveTablet && '8px'}
                  mt={aboveTablet && '-2px'}
                />
                {aboveTablet ? (
                  <FormattedMessage id="navigation.links.docs" />
                ) : null}
              </MenuButton>
              <HelpMenu active={isExpanded} />
            </>
          )}
        </Menu>
      </Item>
      <Item key={email}>
        <Menu>
          {({ isExpanded }) => (
            <>
              <MenuButton>
                <Avatar
                  name={name}
                  email={email}
                  url={avatar}
                  size="medium"
                  variant={`${role}Link`}
                  className={isExpanded ? 'active' : ''}
                />
              </MenuButton>
              <UserMenu />
            </>
          )}
        </Menu>
      </Item>
    </Box>
  ) : (
    <Suspense fallback={<div />}>
      <Box ml="auto">
        <Item>
          <Button href={`/sign-up${redirectParams}`}>
            <FormattedMessage id="navigation.links.sign_up" />
          </Button>
        </Item>
        <Item>
          <Button variant="secondary" href={`/sign-in${redirectParams}`}>
            <FormattedMessage id="navigation.links.sign_in" />
          </Button>
        </Item>
      </Box>
    </Suspense>
  )
}

const SiteLink = ({
  orgId,
  teamId,
  siteId,
  forceRefresh,
  mobile,
  MenuComponent
}) => {
  const aboveMobile = useBreakpoint(0)
  const { data, loading, error } = useQuery(GetSite, {
    variables: { orgId, teamId, siteId }
  })
  const { team } = data || {}
  const {
    site,
    sitesList: { edges: sitesEdges }
  } = team || { sitesList: { edges: [] } }
  const { name } = site || {}

  if (error) return null

  return (
    <>
      {aboveMobile ? (
        <Item>
          <Divider />
        </Item>
      ) : null}
      {mobile ? <BrandLink /> : null}
      <Item mr="8px">
        <NavLink
          color="white"
          to={`/teams/${teamId}/${siteId}`}
          forceRefresh={forceRefresh}
        >
          {truncate(name || '…', 24)}
        </NavLink>
      </Item>
      {mobile || loading || sitesEdges.length > 1 ? (
        <Item mt="4px" key={siteId} data-qa="sitesDropdown">
          <Menu>
            {({ isExpanded }) => (
              <>
                <DropdownButton />
                {isExpanded ? (
                  <MenuList mobile={mobile} level="md">
                    <MenuComponent
                      orgId={orgId}
                      teamId={teamId}
                      siteId={siteId}
                    />
                  </MenuList>
                ) : null}
              </>
            )}
          </Menu>
        </Item>
      ) : null}
    </>
  )
}

const TeamLink = ({ orgId, teamId, forceRefresh, mobile, MenuComponent }) => {
  const { team, teams, memberships } = useSession({
    orgId,
    teamId
  })
  const { name } = team || {}

  return (
    <>
      {memberships.length < 2 || mobile ? <BrandLink /> : null}
      <Item mr="8px">
        <NavLink
          color="white"
          to={`/teams/${teamId}`}
          forceRefresh={forceRefresh}
        >
          {truncate(name, 24) || teamId}
        </NavLink>
      </Item>
      {mobile ||
      teams.length > 1 ||
      (teams.length > 0 && teamId != teams[0].slug) ? (
        <Item mt="4px" key={teamId} data-qa="teamsDropdown">
          <Menu>
            {({ isExpanded }) => (
              <>
                <DropdownButton />
                {isExpanded ? (
                  <MenuList mobile={mobile} level="md">
                    <MenuComponent orgId={orgId} teamId={teamId} />
                  </MenuList>
                ) : null}
              </>
            )}
          </Menu>
        </Item>
      ) : null}
    </>
  )
}

const OrganisationLink = ({
  staff,
  orgId,
  teamId,
  siteId,
  mobile,
  MenuComponent,
  forceRefresh
}) => {
  const matchSetup = useRouteMatch('/setup/:orgId?', {
    exact: false
  })
  const { membership, organisation, memberships, error } = useSession({
    orgId,
    teamId
  })

  if (!matchSetup && !mobile && !memberships.length)
    return (
      <Suspense fallback={<Item />}>
        <>
          <BrandLink />
          <Item>
            <Text color="white">
              <FormattedMessage id="navigation.no_organisation.text" />
            </Text>
          </Item>
          <Item>
            <Button href="/setup">
              <FormattedMessage id="navigation.no_organisation.cta" />
            </Button>
          </Item>
        </>
      </Suspense>
    )

  if (!mobile && teamId && memberships.length < 2) return null

  const { slug, name: organisationName } =
    membership?.organisation ||
    (!(error?.type === 'Organisation') && organisation) ||
    (memberships.length && memberships[0].organisation)

  return (
    <>
      <BrandLink />
      {organisationName ? (
        <>
          <Item mr="8px">
            <NavLink to={`/organisations/${slug}`} forceRefresh={forceRefresh}>
              {truncate(organisationName, 24)}
            </NavLink>
          </Item>

          {mobile || staff || memberships.length > 1 ? (
            <Item mt="4px" key={orgId} data-qa="organisationsDropdown">
              <Menu>
                {({ isExpanded }) => (
                  <>
                    <DropdownButton />
                    {isExpanded ? (
                      <MenuList mobile={mobile} level="md">
                        <MenuComponent
                          forceRefresh={forceRefresh}
                          orgId={slug}
                          teamId={teamId}
                          siteId={siteId}
                        />
                      </MenuList>
                    ) : null}
                  </>
                )}
              </Menu>
            </Item>
          ) : null}

          {!mobile && teamId ? (
            <Item>
              <Divider />
            </Item>
          ) : null}
        </>
      ) : null}
    </>
  )
}
OrganisationLink.defaultProps = {
  organisations: []
}

const PrimaryNavigation = ({ forceRefresh, orgId, teamId, siteId }) => {
  const { currentUser, memberships } = useSession({
    orgId,
    teamId
  })
  const aboveMobile = useBreakpoint(0)

  const showOrgLink = aboveMobile || (!aboveMobile && !teamId)
  const showTeamLink = teamId ? aboveMobile || (!aboveMobile && !siteId) : false
  const showSiteLink = !!siteId

  const CombinedMenu = ({ orgId, teamId, siteId }) => (
    <>
      <OrganisationMenu orgId={orgId} teamId={teamId} siteId={siteId} />
      {teamId ? (
        <TeamMenu orgId={orgId} teamId={teamId} siteId={siteId} />
      ) : null}
      {siteId ? (
        <SiteMenu orgId={orgId} teamId={teamId} siteId={siteId} />
      ) : null}
    </>
  )

  return (
    <Flex
      backgroundColor="blue500"
      alignItems="center"
      height="60px"
      px={3}
      data-qa="primaryNavigation"
    >
      <Box flex={1}>
        <Flex as="ul" flex={1} alignItems="center" height="100%">
          {!currentUser ? (
            <BrandLink full={true} />
          ) : aboveMobile ? (
            <>
              {showOrgLink ? (
                <OrganisationLink
                  staff={currentUser?.staff}
                  forceRefresh={forceRefresh}
                  orgId={orgId}
                  teamId={teamId}
                  mobile={false}
                  MenuComponent={OrganisationMenu}
                />
              ) : null}
              {showTeamLink ? (
                <TeamLink
                  forceRefresh={forceRefresh}
                  orgId={orgId}
                  teamId={teamId}
                  mobile={false}
                  MenuComponent={TeamMenu}
                />
              ) : null}
              {showSiteLink ? (
                <SiteLink
                  forceRefresh={forceRefresh}
                  orgId={orgId}
                  teamId={teamId}
                  siteId={siteId}
                  mobile={false}
                  MenuComponent={SiteMenu}
                />
              ) : null}
            </>
          ) : (
            <>
              {showSiteLink ? (
                <SiteLink
                  forceRefresh={forceRefresh}
                  orgId={orgId}
                  teamId={teamId}
                  siteId={siteId}
                  mobile={true}
                  MenuComponent={CombinedMenu}
                />
              ) : showTeamLink ? (
                <TeamLink
                  forceRefresh={forceRefresh}
                  orgId={orgId}
                  teamId={teamId}
                  mobile={true}
                  MenuComponent={CombinedMenu}
                />
              ) : (
                <OrganisationLink
                  forceRefresh={forceRefresh}
                  orgId={orgId}
                  teamId={teamId}
                  mobile={true}
                  MenuComponent={CombinedMenu}
                />
              )}
            </>
          )}
        </Flex>
      </Box>
      {aboveMobile && memberships.length ? (
        <Box flex={1} flexShrink={[2, 2, 1]} px={3}>
          <Search orgId={orgId} teamId={teamId} siteId={siteId} />
        </Box>
      ) : null}
      <Box flex={1}>
        <Flex as="ul" alignItems="center" height="100%">
          <UserLink orgId={orgId} teamId={teamId} />
        </Flex>
      </Box>
    </Flex>
  )
}

export default PrimaryNavigation
