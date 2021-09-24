import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Box } from '../../../Grid'
import Table, { Th, Tr, Thead, Tbody } from '../../../Table'
import { SortButton } from '../../../Button'

import { sortByString } from '../../../../utils/sort'

import Member from './Member'

const MembersList = ({
  members,
  isAdmin,
  currentMemberUuid,
  onRemove,
  teamName
}) => {
  const [sortBy, setSortBy] = useState('displayName')
  const [sortDirection, setSortDirection] = useState('asc')
  const sortedMembers = members
    .slice()
    .sort((a, b) => sortByString(a[sortBy], b[sortBy], sortDirection))

  return (
    <Box pb="60px" data-testid="teamMembers">
      <Table bleed={0}>
        <Thead>
          <Tr>
            {['displayName'].map(attribute => (
              <Th key={attribute} py="15px" width="95%">
                <SortButton
                  attribute={attribute}
                  onUpdateSortBy={setSortBy}
                  onUpdateSortDirection={setSortDirection}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                >
                  <FormattedMessage
                    id={`memberManagement.table.${attribute}`}
                  />
                </SortButton>
              </Th>
            ))}
            <Th width="5%" textAlign="left">
              <FormattedMessage id="memberManagement.table.actions" />
            </Th>
          </Tr>
        </Thead>
        {sortedMembers?.length ? (
          <Tbody>
            {sortedMembers.map(member => (
              <Member
                key={member.uuid}
                teamName={teamName}
                onRemove={
                  (member.uuid === currentMemberUuid || isAdmin) && onRemove
                }
                isCurrentMember={member.uuid === currentMemberUuid}
                {...member}
              />
            ))}
          </Tbody>
        ) : null}
      </Table>
    </Box>
  )
}

export default MembersList
