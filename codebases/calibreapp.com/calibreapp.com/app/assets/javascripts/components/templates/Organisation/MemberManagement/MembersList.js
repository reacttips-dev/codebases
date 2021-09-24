import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../../Grid'
import Pagination from '../../../Pagination'
import Table, { Th, Tr, Thead, Tbody } from '../../../Table'
import { SortButton } from '../../../Button'

import { sortByString, sortByInteger } from '../../../../utils/sort'

import Member from './Member'

const MembersList = ({
  members,
  pageInfo,
  nextPage,
  orgId,
  currentMemberUuid,
  organisationName,
  onRemove,
  onResendInvite
}) => {
  const [sortBy, setSortBy] = useState('displayName')
  const [sortDirection, setSortDirection] = useState('asc')
  const sortedMembers = members.slice().sort((a, b) => {
    switch (sortBy) {
      case 'lastSeenAt':
        return sortByInteger(a[sortBy], b[sortBy], sortDirection)
      default:
        return sortByString(a[sortBy], b[sortBy], sortDirection)
    }
  })

  let attributes = [
    'displayName',
    'roleLabel',
    'teamNames',
    'stateLabel',
    'lastSeenAt'
  ]

  const moreThanOneAdmin =
    members.filter(({ state, role }) => state === 'active' && role === 'admin')
      .length > 1

  return (
    <Box pb="60px">
      <Table bleed={0}>
        <Thead>
          <Tr>
            {attributes.map(attribute => (
              <Th
                key={attribute}
                py="15px"
                width={`${(100 - 10) / attributes.length}%`}
              >
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
            <Th width="10%" textAlign="left">
              <FormattedMessage id="memberManagement.table.actions" />
            </Th>
          </Tr>
        </Thead>
        {sortedMembers?.length ? (
          <Tbody>
            {sortedMembers.map(member => (
              <Member
                key={member.uuid}
                orgId={orgId}
                organisationName={organisationName}
                onRemove={onRemove}
                onResendInvite={onResendInvite}
                isLastAdmin={member.role === 'admin' && !moreThanOneAdmin}
                isCurrentMember={member.uuid === currentMemberUuid}
                attributes={attributes}
                {...member}
              />
            ))}
          </Tbody>
        ) : null}
      </Table>
      {pageInfo?.hasNextPage && (
        <Flex>
          <Box mx="auto" mt={4}>
            <Pagination pageInfo={pageInfo} onNext={nextPage} />
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export default MembersList
