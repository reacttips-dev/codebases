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

import { connect } from 'react-redux'

import SearchAllocators from './SearchAllocators'

import { searchAllocators } from '../../../../actions/allocatorSearch'

import { searchAllocatorsRequest, getAllocatorSearchResults } from '../../../../reducers'

import { AsyncRequestState, AllocatorSearchResult } from '../../../../types'
import { SearchRequest } from '../../../../lib/api/v1/types'

type StateProps = {
  searchResults?: AllocatorSearchResult[]
  searchAllocatorsRequest: AsyncRequestState
}

type DispatchProps = {
  searchAllocators: (query: SearchRequest) => void
}

type ConsumerProps = {
  regionId: string
  allocatorId: string
  selectedAllocatorIds: string[]
  unselectAllocatorId: (allocatorId: string) => void
  selectAllocatorId: (allocatorId: string) => void
  placeholder?: string
}

const mapStateToProps = (state, { regionId }: ConsumerProps): StateProps => ({
  searchResults: getAllocatorSearchResults(state, regionId, `search-allocators`),
  searchAllocatorsRequest: searchAllocatorsRequest(state, regionId, `search-allocators`),
})

const mapDispatchToProps = (dispatch, { regionId }: ConsumerProps): DispatchProps => ({
  searchAllocators: (query) =>
    dispatch(searchAllocators({ regionId, queryId: `search-allocators`, query })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SearchAllocators)
