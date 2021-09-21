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

import React, { Component, Fragment } from 'react'
import { debounce, union, difference } from 'lodash'
import { defineMessages, injectIntl, IntlShape } from 'react-intl'

import { EuiBadge, EuiIcon, EuiSpacer } from '@elastic/eui'

import Typeahead from '../../../Typeahead'

import ShowAllocator from './ShowAllocator'

import createAllocatorQuery from './createAllocatorQuery'

import { AsyncRequestState, AllocatorSearchResult } from '../../../../types'
import { SearchRequest } from '../../../../lib/api/v1/types'

import './searchAllocators.scss'

export type Props = {
  intl: IntlShape
  searchAllocators: (query: SearchRequest) => void
  searchAllocatorsRequest: AsyncRequestState
  searchResults?: AllocatorSearchResult[]
  regionId: string
  allocatorId: string
  selectedAllocatorIds: string[]
  unselectAllocatorId: (allocatorId: string) => void
  selectAllocatorId: (allocatorId: string) => void
  placeholder?: string
}

type State = {
  q: string
  isBidingTime: boolean
}

// We don't want to search on every key press,
// so we only search if there have been query
// updates within a certain interval
const onSearch = debounce((cb) => cb(), 100)

class SearchAllocators extends Component<Props, State> {
  state: State = {
    q: ``,
    isBidingTime: false,
  }

  render() {
    const {
      intl: { formatMessage },
      placeholder,
      selectedAllocatorIds,
      searchResults,
    } = this.props

    const { q, isBidingTime } = this.state

    const messages = defineMessages({
      remove: {
        id: `search-allocators.remove`,
        defaultMessage: `Remove`,
      },
    })

    return (
      <div>
        <div className='searchClusters-container'>
          <Typeahead<AllocatorSearchResult>
            className='searchClusters-typeahead'
            icon='search'
            isBidingTime={isBidingTime}
            q={q}
            search={(qq) => this.search(qq, selectedAllocatorIds)}
            goTo={this.goTo}
            placeholder={placeholder}
            results={searchResults && { record: searchResults, isSearching: false }}
          >
            {(allocator: AllocatorSearchResult) => (
              <div className='allocatorResult-allocator' onClick={() => this.goTo(allocator)}>
                <ShowAllocator allocatorId={allocator.id} />
              </div>
            )}
          </Typeahead>
        </div>

        {selectedAllocatorIds.length > 0 && (
          <Fragment>
            <EuiSpacer size='s' />

            <div data-test-id='vacateOption-selectedAllocatorIds'>
              {selectedAllocatorIds.map((allocatorId) => (
                <EuiBadge
                  key={allocatorId}
                  onClick={() => this.unselectAllocator(allocatorId)}
                  onClickAriaLabel={formatMessage(messages.remove)}
                >
                  {allocatorId}

                  {` `}

                  <EuiIcon type='cross' />
                </EuiBadge>
              ))}
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  unselectAllocator(targetId: string) {
    const { q } = this.state
    const { unselectAllocatorId, selectedAllocatorIds } = this.props

    unselectAllocatorId(targetId)
    this.search(q, difference(selectedAllocatorIds, [targetId]))
  }

  search(q: string, selectedAllocatorIds: string[]) {
    const { searchAllocators, allocatorId } = this.props

    this.setState({ isBidingTime: true })

    onSearch(() => {
      this.setState({ isBidingTime: false, q })

      if (q.trim() === ``) {
        return
      }

      searchAllocators(
        createAllocatorQuery({
          query: q,
          excludedAllocatorIds: [...selectedAllocatorIds, allocatorId],
        }),
      )
    })
  }

  goTo = (allocator: AllocatorSearchResult) => {
    const { q } = this.state
    const { selectAllocatorId, selectedAllocatorIds } = this.props

    this.search(q, union(selectedAllocatorIds, [allocator.id]))
    selectAllocatorId(allocator.id)
  }
}

export default injectIntl(SearchAllocators)
