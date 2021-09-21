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
import classnames from 'classnames'

import SearchInputWrapper from './SearchInputWrapper'

type Props = {
  onBeforeExpand?: () => void
}

type State = {
  isSearchExpanded: boolean
}

class SearchAnythingBox extends Component<Props, State> {
  state: State = {
    isSearchExpanded: false,
  }

  render() {
    const { isSearchExpanded } = this.state

    const searchClasses = classnames(`chromeHeader-search`, {
      'chromeHeader-searchCollapsed': !isSearchExpanded,
      'chromeHeader-searchExpanded': isSearchExpanded,
    })

    return (
      <div
        className={searchClasses}
        onFocus={() => this.expandSearch()}
        onClick={() => this.expandSearch()}
      >
        <SearchInputWrapper
          isSearchExpanded={isSearchExpanded}
          onHide={() => this.collapseSearch()}
        />
      </div>
    )
  }

  expandSearch() {
    const { onBeforeExpand } = this.props
    const { isSearchExpanded } = this.state

    if (isSearchExpanded) {
      return
    }

    if (onBeforeExpand) {
      onBeforeExpand()
    }

    this.setState({ isSearchExpanded: true })
  }

  collapseSearch() {
    const { isSearchExpanded } = this.state

    if (!isSearchExpanded) {
      return
    }

    this.setState({ isSearchExpanded: false })
  }
}

export default SearchAnythingBox
