import React, { useState, useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import matchSorter from 'match-sorter'

import HarRequestTableRow from './HarRequestTableRow'
import { Search } from './Forms'
import { Text } from './Type'
import { SortButton } from './Button'
import { sortByString, sortByInteger } from '../utils/sort'
import getItemValue from '../utils/getItemValue'
import CategoryContext from './CategoryContext'
import Table, { Th } from './Table'

const PRIORITIES = ['Very High', 'High', 'Medium', 'Low', 'Very Low']

const Requests = ({ entries, searchTerm }) => {
  const { categories } = useContext(CategoryContext)
  const [sortBy, setSortBy] = useState('sequence')
  const [sortDirection, setSortDirection] = useState('asc')

  let requests = entries.filter(({ assetClassification }) => {
    const category = categories.find(
      category => category.name === assetClassification
    )
    return category ? !category.hidden : true
  })

  if (searchTerm !== '') {
    requests = matchSorter(requests, searchTerm, {
      keys: [
        {
          threshold: matchSorter.rankings.STARTS_WITH,
          key: 'assetClassification'
        },
        'request.url',
        'request.httpVersion'
      ]
    })
  }

  const sortedRequests = requests.sort((a, b) => {
    const [primary] = getItemValue(a, sortBy) || []
    const [secondary] = getItemValue(b, sortBy) || []
    if (
      [
        'sequence',
        'response.status',
        'response._transferSize',
        'response.content.size',
        'totalRequestTime'
      ].includes(sortBy)
    ) {
      return sortByInteger(
        parseInt(primary),
        parseInt(secondary),
        sortDirection
      )
    } else if (sortBy === 'priority') {
      return sortByInteger(
        PRIORITIES.indexOf(primary),
        PRIORITIES.indexOf(secondary),
        sortDirection
      )
    } else {
      return sortByString(primary, secondary, sortDirection)
    }
  })

  if (!sortedRequests.length)
    return (
      <div className="type-centered type-large">
        <p>No requests match `{searchTerm}`</p>
      </div>
    )

  const Sort = ({ attribute, children }) => (
    <SortButton
      attribute={attribute}
      onUpdateSortBy={setSortBy}
      onUpdateSortDirection={setSortDirection}
      sortBy={sortBy}
      sortDirection={sortDirection}
    >
      {children}
    </SortButton>
  )

  return (
    <Table>
      <thead>
        <tr>
          <Th level="xs">
            <Sort attribute="sequence">#</Sort>
          </Th>
          <Th level="xs">
            <Sort attribute="method">Method</Sort>
          </Th>
          <Th level="xs">
            <Sort attribute="response.status">Status</Sort>
          </Th>
          <Th level="lg">
            <Sort attribute="pathname">Name</Sort>
          </Th>
          <Th level="xs">
            <Sort attribute="host">Domain</Sort>
          </Th>
          <Th level="xs">
            <Sort attribute="response.httpVersion">Protocol</Sort>
          </Th>
          <Th level="xs">
            <Sort attribute="priority">Priority</Sort>
          </Th>
          <Th>
            <Sort attribute="assetClassification">Type</Sort>
          </Th>
          <Th textAlgin="right">
            <Sort attribute="response._transferSize">Transferred</Sort>
          </Th>
          <Th textAlgin="right">
            <Sort attribute="response.content.size">Size</Sort>
          </Th>
          <Th level="xs" textAlgin="right">
            <Sort attribute="totalRequestTime">Timing</Sort>
          </Th>
        </tr>
      </thead>
      {sortedRequests
        .filter(({ hidden }) => !hidden)
        .map(entry => (
          <HarRequestTableRow key={entry.sequence} {...entry} />
        ))}
    </Table>
  )
}

const HarRequestTable = ({ har, harUrl, entries }) => {
  const [searchTerm, setSearchTerm] = useState()

  return (
    <div className="page-section">
      <div className="row">
        <div className="col-xs-12 col-md-3">
          <h2 className="m--b3 type-medium">
            Requests
            {!(searchTerm && searchTerm.length) || (
              <> matching “{searchTerm}”</>
            )}
          </h2>
        </div>

        <div className="col-xs-12 col-md-9 end-md">
          <a
            className="btn btn--secondary m--r1"
            href={harUrl}
            target="_blank"
            rel="noreferrer"
          >
            Download HAR
          </a>
          <Search onChange={setSearchTerm} placeholder="Filter requests" />
        </div>
      </div>

      {(har && har.error && (
        <Text as="p" color="grey300">
          <FormattedMessage
            id="testArtifact.error"
            values={{ error: har.error }}
          />
        </Text>
      )) ||
        (entries && entries.length && (
          <Requests entries={entries} searchTerm={searchTerm} />
        )) || (
          <Text as="p" color="grey300">
            <FormattedMessage id="testArtifact.unavailable" />
          </Text>
        )}
    </div>
  )
}

export default HarRequestTable
