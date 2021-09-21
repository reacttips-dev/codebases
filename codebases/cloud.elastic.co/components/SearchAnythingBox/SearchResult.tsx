/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React, { FunctionComponent } from 'react'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { CuiLink, withSmallErrorBoundary } from '../../cui'

import SearchResultStatus from './SearchResultStatus'
import SearchResultName from './SearchResultName'
import SearchResultType from './SearchResultType'
import SearchResultHighlights from './SearchResultHighlights'

import { resourceOverviewUrl } from './lib/urlBuilder'

import { RefinedSearchResult } from '../../types'

type Props = {
  searchResult: RefinedSearchResult
}

const SearchResult: FunctionComponent<Props> = ({ searchResult }) => {
  const result = (
    <div>
      <EuiFlexGroup
        data-test-id='search-result'
        gutterSize='s'
        alignItems='center'
        responsive={false}
      >
        <EuiFlexItem grow={false}>
          <SearchResultStatus searchResult={searchResult} />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup
            gutterSize='s'
            alignItems='center'
            justifyContent='spaceBetween'
            responsive={false}
          >
            <EuiFlexItem className='searchResult-description' grow={false}>
              <SearchResultName searchResult={searchResult} />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <SearchResultType searchResult={searchResult} />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <SearchResultHighlights searchResult={searchResult} />
    </div>
  )

  const href = resourceOverviewUrl(searchResult)

  if (href === null) {
    return result
  }

  return <CuiLink to={href}>{result}</CuiLink>
}

export default withSmallErrorBoundary(SearchResult)
