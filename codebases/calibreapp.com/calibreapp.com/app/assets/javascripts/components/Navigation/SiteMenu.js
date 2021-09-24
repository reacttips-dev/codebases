import React, { useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import { Sites as GetSites } from '../../queries/NavigationQueries.gql'

import { Search } from '../Forms'
import { MenuInput, MenuAction, MenuSection, MenuLinks } from './Menu'

import useBreakpoint from '../../hooks/useBreakpoint'
import truncate from '../../utils/smart-truncate'
import { useSession } from '../../providers/SessionProvider'

const SiteMenu = ({ teamId, siteId }) => {
  const { can } = useSession({ teamId })
  const aboveMobile = useBreakpoint(0)
  const searchRef = useRef()
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading, fetchMore } = useQuery(GetSites, {
    variables: { teamId, sitesFilter: { nameContains: searchTerm } },
    fetchPolicy: 'cache-and-network'
  })
  const { team } = data || {}
  const {
    sitesList: { edges, pageInfo }
  } = team || { sitesList: {} }
  const { hasNextPage, endCursor } = pageInfo || {}

  const links = (edges || []).map(({ node: { name, slug } }) => ({
    name: truncate(name, 30),
    id: slug,
    to: `/teams/${teamId}/${slug}`,
    active: slug === siteId
  }))

  const onLoadMore = () => {
    fetchMore({
      variables: {
        cursor: endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        Object.assign({}, prev, {
          team: {
            ...prev.team,
            // To get around a bug in @apollo/client and to force a re-render
            // we update the top level object …
            bustCache: 1,
            sitesList: {
              ...prev.team.sitesList,
              edges: [
                ...prev.team.sitesList.edges,
                ...fetchMoreResult.team.sitesList.edges
              ],
              pageInfo: fetchMoreResult.team.sitesList.pageInfo
            }
          }
        })
    })
  }

  return (
    <>
      {aboveMobile ? (
        <MenuSection>
          <MenuInput
            onSelect={() => {
              searchRef.current.focus()
            }}
            onClick={e => {
              e.preventDefault()
              searchRef.current.focus()
            }}
          >
            <FormattedMessage id="navigation.menu.sites.search">
              {label => (
                <Search
                  ref={searchRef}
                  onChange={setSearchTerm}
                  placeholder={label}
                  width={1}
                />
              )}
            </FormattedMessage>
          </MenuInput>
        </MenuSection>
      ) : null}
      <MenuSection>
        {!loading && searchTerm.length && !links.length ? (
          <FormattedMessage id="sites.no_results" />
        ) : (
          <FormattedMessage id="navigation.menu.sites.title">
            {title => (
              <MenuLinks
                title={title}
                links={links}
                loading={loading}
                onLoadMore={onLoadMore}
                hasMore={hasNextPage}
              />
            )}
          </FormattedMessage>
        )}
      </MenuSection>
      {can('createSites') ? (
        <MenuSection>
          <MenuAction
            variant="primary"
            to={`/teams/${teamId}/sites/new`}
            width={1}
          >
            <FormattedMessage id="navigation.menu.sites.new" />
          </MenuAction>
        </MenuSection>
      ) : null}
    </>
  )
}

export default SiteMenu
