import React, { useState } from 'react'

import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../../Grid'
import Pagination from '../../../Pagination'
import Table, { Th, Tr, Thead, Tbody } from '../../../Table'
import { SortButton } from '../../../Button'

import AccessToken from './AccessToken'

import { sortByString, sortByInteger } from '../../../../utils/sort'

const AccessTokens = ({
  attributes,
  apiTokens,
  loading,
  pageInfo,
  nextPage,
  handleRevoke,
  currentUserUuid
}) => {
  const [sortBy, setSortBy] = useState('displayName')
  const [sortDirection, setSortDirection] = useState('asc')
  const sortedAccessTokens = apiTokens.slice().sort((a, b) => {
    switch (sortBy) {
      case 'expiresAt':
      case 'lastUsed':
        return sortByInteger(
          a[sortBy] || Date(),
          b[sortBy] || Date(),
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
          {sortedAccessTokens.map(apiKey => (
            <AccessToken
              key={apiKey.uuid}
              attributes={attributes}
              onRevoke={handleRevoke}
              currentUserUuid={currentUserUuid}
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

AccessToken.defaultProps = {
  attributes: ['displayName', 'displayTeam', 'expiresAt', 'lastUsed']
}

export default AccessTokens
