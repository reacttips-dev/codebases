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

import { debounce } from 'lodash'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { parse, stringify } from 'query-string'

import SearchInput from '../SearchInput'

import { RefinedSearchResult } from '../../../types'

type StateProps = {
  searchResults: (q: string) => RefinedSearchResult[]
}

type DispatchProps = {
  search: (q: string) => void
  push: (url: string) => void
}

type ConsumerProps = {
  isSearchExpanded: boolean
  onHide: () => void
}

type Props = StateProps & DispatchProps & ConsumerProps & RouteComponentProps

type State = {
  isBidingTime: boolean
}

// We don't want to search on every key press,
// so we only search if there have been query
// updates within a certain interval
const changeDebounceTime = 100
const queryStringKey = `_q`

class SearchInputWrapper extends Component<Props, State> {
  state: State = {
    isBidingTime: false,
  }

  componentDidUpdate(prevProps: Props) {
    this.onLocationChange(prevProps)
  }

  render() {
    const { isBidingTime } = this.state
    const { location, ...otherProps } = this.props
    const query = parse(location.search.slice(1))
    const qs = query[queryStringKey]
    const q = Array.isArray(qs) ? qs.join(`,`) : qs || ``

    return (
      <SearchInput q={q} onChange={this.onChange} isBidingTime={isBidingTime} {...otherProps} />
    )
  }

  onChange = (q) => {
    this.setState({ isBidingTime: true })
    this.onChangeDebounced(q)
  }

  // eslint-disable-next-line react/sort-comp
  onChangeDebounced = debounce((q) => {
    const { push, location } = this.props

    const prevQuery = parse(location.search.slice(1))

    const query = {
      ...prevQuery,
      [queryStringKey]: q,
    }

    push(`${location.pathname}?${stringify(query)}`)

    this.setState({ isBidingTime: false })
  }, changeDebounceTime)

  onLocationChange(prevProps: Props) {
    const { location, onHide } = this.props

    if (location.pathname === prevProps.location.pathname) {
      return
    }

    if (onHide) {
      onHide()
    }
  }
}

export default withRouter(SearchInputWrapper)
