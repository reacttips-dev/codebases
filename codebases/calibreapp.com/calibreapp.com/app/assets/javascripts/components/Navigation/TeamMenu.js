import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import matchSorter from 'match-sorter'

import { Search } from '../Forms'
import { MenuSection, MenuLinks, MenuInput } from './Menu'

import { useSession } from '../../providers/SessionProvider'
import useBreakpoint from '../../hooks/useBreakpoint'
import truncate from '../../utils/smart-truncate'

const TeamMenu = ({ orgId, teamId }) => {
  const { teams } = useSession({ orgId, teamId })

  const aboveMobile = useBreakpoint(0)
  const searchRef = useRef()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTeams = searchTerm?.length
    ? matchSorter(teams, searchTerm, {
        keys: ['name', 'slug']
      })
    : teams

  const links = filteredTeams.map(({ name, slug }, index) => ({
    name: truncate(name, 30),
    id: slug,
    to: `/teams/${slug}`,
    active: teamId ? slug === teamId : index === 0
  }))

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
            <FormattedMessage id="navigation.menu.teams.search">
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
        <FormattedMessage id="navigation.menu.teams.title">
          {title => <MenuLinks title={title} links={links} />}
        </FormattedMessage>
      </MenuSection>
    </>
  )
}

export default TeamMenu
