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

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import cx from 'classnames'

import { EuiPanel, EuiLoadingSpinner } from '@elastic/eui'

import { CuiAlert } from '../../cui'

type Props<Record> = {
  results?: {
    error?: Error
    isSearching: boolean
    record?: Record[]
  }
  isBidingTime?: boolean
  position: number
  children: (record: Record) => ReactNode
}

class TypeaheadResults<Record> extends Component<Props<Record>> {
  render() {
    return (
      <EuiPanel paddingSize='none' className='search-results'>
        {this.renderResults()}
      </EuiPanel>
    )
  }

  renderResults() {
    const { results, isBidingTime } = this.props

    if (results === undefined) {
      return null
    }

    const { error, isSearching, record } = results

    if (error) {
      return (
        <div className='search-results-none' data-test-id='noSearchResults'>
          <CuiAlert type='error'>{error}</CuiAlert>
        </div>
      )
    }

    if ((record === undefined && isSearching) || isBidingTime) {
      return (
        <div className='search-results-none' data-test-id='noSearchResults'>
          <EuiLoadingSpinner />
        </div>
      )
    }

    if (record === undefined || record.length === 0) {
      return (
        <div className='search-results-none' data-test-id='noSearchResults'>
          <CuiAlert type='warning'>
            <FormattedMessage
              id='typeahead-results.we-couldn-t-find-any-results-for-this-query'
              defaultMessage="We couldn't find any results for this query"
            />
          </CuiAlert>
        </div>
      )
    }

    return (
      <ul className='search-results-list' data-test-id='hasSearchResults'>
        {record.map(this.renderResult.bind(this))}
      </ul>
    )
  }

  renderResult(item, index) {
    const { position, children } = this.props

    const key = `${item.kind || item.type}-${item.id}`
    const searchResultClasses = cx(`search-result`, {
      'is-active': index === position,
    })

    return (
      <li key={key} className={searchResultClasses}>
        {children(item)}
      </li>
    )
  }
}

export default TypeaheadResults
