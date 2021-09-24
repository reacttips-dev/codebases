import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Box } from '../../../Grid'
import Table, { Th, Tr, Thead, Tbody } from '../../../Table'
import { SortButton } from '../../../Button'

import { sortByInteger, sortByString } from '../../../../utils/sort'

import Team from './Team'

const TeamsList = ({ orgId, teams, onRemove }) => {
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const sortedTeams = teams.slice().sort((a, b) => {
    switch (sortBy) {
      case 'sitesCount':
      case 'membersCount':
        return sortByInteger(a[sortBy], b[sortBy], sortDirection)
      default:
        return sortByString(a[sortBy], b[sortBy], sortDirection)
    }
  })

  return (
    <Box pb="60px" data-testid="teams">
      <Table bleed={0}>
        <Thead>
          <Tr>
            {['name', 'sitesCount', 'membersCount'].map((attribute, index) => (
              <Th key={attribute} py="15px" width={index === 1 ? '20%' : '35%'}>
                <SortButton
                  attribute={attribute}
                  onUpdateSortBy={setSortBy}
                  onUpdateSortDirection={setSortDirection}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                >
                  <FormattedMessage id={`teams.attributes.${attribute}`} />
                </SortButton>
              </Th>
            ))}
            <Th width="10%" textAlign="left">
              <FormattedMessage id="teams.attributes.actions" />
            </Th>
          </Tr>
        </Thead>
        {sortedTeams?.length ? (
          <Tbody>
            {sortedTeams.map(team => (
              <Team
                key={team.slug}
                orgId={orgId}
                onRemove={onRemove}
                {...team}
              />
            ))}
          </Tbody>
        ) : null}
      </Table>
    </Box>
  )
}

export default TeamsList
