import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../../Grid'
import Pagination from '../../../Pagination'
import Table, { Th, Tr, Thead, Tbody } from '../../../Table'
import { SortButton } from '../../../Button'

import ApiToken from './ApiToken'

import { sortByString, sortByInteger } from '../../../../utils/sort'

const ApiTokens = ({
  attributes,
  apiTokens,
  loading,
  pageInfo,
  nextPage,
  orgId,
  handleRevoke,
  currentUserUuid
}) => {
  const [sortBy, setSortBy] = useState('displayName')
  const [sortDirection, setSortDirection] = useState('asc')
  const sortedApiTokens = apiTokens.slice().sort((a, b) => {
    switch (sortBy) {
      case 'expiresAt':
        return sortByInteger(
          a[sortBy] || Date(),
          b[sortBy] || Date(),
          sortDirection
        )
      case 'creator':
        return sortByString(
          a.creator?.displayName,
          b.creator?.displayName,
          sortDirection
        )
      default:
        return sortByString(a[sortBy], b[sortBy], sortDirection)
    }
  })

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
                  <FormattedMessage id={`apiToken.attributes.${attribute}`} />
                </SortButton>
              </Th>
            ))}
            <Th width="10%" textAlign="right">
              actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedApiTokens.map(apiKey => (
            <ApiToken
              key={apiKey.uuid}
              orgId={orgId}
              onRevoke={handleRevoke}
              currentUserUuid={currentUserUuid}
              attributes={attributes}
              {...apiKey}
            />
          ))}
        </Tbody>
      </Table>
      {!loading && pageInfo.hasNextPage && (
        <Flex>
          <Box mx="auto" mt={4}>
            <Pagination pageInfo={pageInfo} onNext={nextPage} />
          </Box>
        </Flex>
      )}
    </Box>
  )
}

ApiToken.defaultProps = {
  attributes: ['displayName', 'creator', 'expiresAt']
}

export default ApiTokens
