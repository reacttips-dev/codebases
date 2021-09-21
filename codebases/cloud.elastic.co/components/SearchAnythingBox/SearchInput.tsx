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

import React, { Component } from 'react'

import Typeahead from '../Typeahead'
import SearchResult from './SearchResult'

import { resourceOverviewUrl } from './lib/urlBuilder'

import { RefinedSearchResult } from '../../types'

import './search.scss'

type Props = {
  isSearchExpanded: boolean
  isBidingTime: boolean
  onHide: () => void
  onChange: (q: string) => void
  push: (url: string) => void
  q?: string
  search: (q: string) => void
  searchResults: (q: string) => RefinedSearchResult[]
}

type DefaultProps = {
  q: string
}

class SearchInput extends Component<Props & DefaultProps> {
  static defaultProps: DefaultProps = {
    q: ``,
  }

  componentDidMount() {
    this.search()
  }

  componentDidUpdate(prevProps: Props) {
    this.search(prevProps.q)
  }

  render() {
    const { q, isSearchExpanded, isBidingTime, onChange, onHide, searchResults } = this.props
    const results = searchResults(q)
    const resultRecords = results && { record: results, isSearching: false }

    return (
      <Typeahead<RefinedSearchResult>
        icon='search'
        q={q}
        canShowResults={isSearchExpanded}
        isBidingTime={isBidingTime}
        onHide={onHide}
        search={onChange}
        goTo={this.goTo}
        results={resultRecords}
      >
        {(searchResult) => <SearchResult searchResult={searchResult} />}
      </Typeahead>
    )
  }

  goTo = (searchResult) => {
    const { push } = this.props
    const href = resourceOverviewUrl(searchResult)

    if (href === null) {
      return
    }

    push(href)
  }

  search = (prevQ?: string) => {
    const { isSearchExpanded, search, q } = this.props

    if (isSearchExpanded && prevQ !== q) {
      search(q)
    }
  }
}

export default SearchInput
