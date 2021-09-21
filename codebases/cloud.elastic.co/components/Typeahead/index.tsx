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
import cx from 'classnames'

import { EuiFieldText } from '@elastic/eui'

import Results from './Results'

import { isKeyCode, esc, enter, arrowUp, arrowDown } from '../../lib/characters'

import { ResultRecords } from './types'

type Props<Record> = {
  q?: string
  placeholder?: string
  search: (q: string) => void
  results?: ResultRecords<Record>
  goTo: (record: Record) => void
  onHide?: () => void
  children: (record: Record) => ReactNode
  className?: string
  isInvalid?: boolean
  isBidingTime?: boolean
  canShowResults?: boolean
  fullWidth?: boolean
  icon?: string
}

type DefaultProps = {
  q: string
  placeholder: string
  canShowResults: boolean
}

type State = {
  showResults: boolean
  query: string
  listPosition
}

const isEsc = isKeyCode(esc)
const isEnter = isKeyCode(enter)
const isArrowUp = isKeyCode(arrowUp)
const isArrowDown = isKeyCode(arrowDown)

const NOT_SHOWN = -1
const isShown = (listPosition) => listPosition > NOT_SHOWN

class Typeahead<Record> extends Component<Props<Record> & DefaultProps, State> {
  searchInput: any

  static defaultProps = {
    q: ``,
    placeholder: `Search for anything …`,
    canShowResults: true,
  }

  state: State = {
    showResults: false,
    query: this.props.q,
    listPosition: NOT_SHOWN,
  }

  componentDidMount() {
    window.addEventListener(`focusin`, this.hideResultsOnClickAway)
    window.addEventListener(`click`, this.hideResultsOnClickAway)
  }

  componentWillUnmount() {
    window.removeEventListener(`focusin`, this.hideResultsOnClickAway)
    window.removeEventListener(`click`, this.hideResultsOnClickAway)
  }

  render() {
    const { query, listPosition, showResults } = this.state

    const {
      icon,
      results,
      placeholder,
      className,
      children,
      fullWidth,
      canShowResults,
      isBidingTime,
      isInvalid,
    } = this.props

    const classes = cx(`search-container`, className)

    return (
      <div className={classes}>
        <EuiFieldText
          compressed={true}
          className='typeahead-input'
          aria-label='search'
          inputRef={(input) => {
            this.searchInput = input
          }}
          icon={icon}
          placeholder={placeholder}
          value={query}
          onChange={(e) => this.updateQuery(e.target.value)}
          onKeyDown={(e) => this.keyPressed(e)}
          onFocus={() => this.updateQueryOnFocus()}
          onClick={() => this.showResults()}
          fullWidth={fullWidth}
          isInvalid={isInvalid}
        />

        {canShowResults && showResults && results && (
          <Results<Record> results={results} position={listPosition} isBidingTime={isBidingTime}>
            {children}
          </Results>
        )}
      </div>
    )
  }

  showResults({ currentQuery = this.state.query } = {}) {
    if (currentQuery === ``) {
      this.hideResults({ raiseEvent: false })
      return
    }

    this.setState({ showResults: true })
  }

  hideResults({ raiseEvent = true } = {}) {
    const { onHide } = this.props
    const { showResults } = this.state

    if (showResults === false) {
      return
    }

    this.setState({ showResults: false })

    if (raiseEvent && onHide) {
      onHide()
    }
  }

  hideResultsOnClickAway = (e) => {
    if (this.isOneOfUs(e.target)) {
      return
    }

    this.hideResults()
  }

  isOneOfUs(element) {
    if (element === this.searchInput) {
      return true
    }

    if (element.closest(`.search-results`)) {
      return true
    }

    return false
  }

  keyPressed(e) {
    const { results } = this.props
    const { showResults, listPosition } = this.state

    if (isEsc(e)) {
      this.hideResults()
    }

    if (results == null) {
      return
    }

    const enter = isEnter(e)
    const openResult = showResults && enter && isShown(listPosition)

    if (openResult) {
      this.hideResults()
      this.props.goTo(results.record[listPosition])
      return
    }

    const up = isArrowUp(e)
    const down = isArrowDown(e)

    if (up || down) {
      const offset = up ? -1 : 1
      const nextPosition = this.getRollingPosition(listPosition + offset)
      this.updateListPosition(nextPosition)
      this.showResults()
      e.preventDefault()
    }
  }

  getRollingPosition(value) {
    const { results } = this.props
    const minPosition = 0
    const maxPosition = (results ? results.record.length : 0) - 1

    if (value < minPosition) {
      return maxPosition
    }

    if (value > maxPosition) {
      return minPosition
    }

    return value
  }

  updateListPosition(listPosition: number) {
    if (this.state.listPosition !== listPosition) {
      this.setState({ listPosition })
    }
  }

  updateQuery(query: string) {
    // when the query updates we don't
    // want to keep the current position
    this.updateListPosition(NOT_SHOWN)
    this.setState({ query })
    this.props.search(query)
    this.showResults({ currentQuery: query })
  }

  updateQueryOnFocus() {
    this.updateQuery(this.state.query)
  }
}

export default Typeahead

export { ResultRecords } from './types'
