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
import { withRouter, RouteComponentProps } from 'react-router-dom'

import SearchInputWrapper from './SearchInputWrapper'

import { searchForAnything } from '../../../actions/searchForAnything'
import { push } from '../../../actions/history'

import { getSearchForAnythingById } from '../../../reducers'

import { RefinedSearchResult } from '../../../types'

type StateProps = {
  searchResults: (q: string) => RefinedSearchResult[] | undefined
}

type DispatchProps = {
  search: (queryString: string) => void
  push: (url: string) => void
}

type ConsumerProps = RouteComponentProps & {
  isSearchExpanded: boolean
  onHide: () => void
}

const mapStateToProps = (state) => ({
  searchResults: (queryString) => getSearchForAnythingById(state, getSearchId(queryString)),
})

const mapDispatchToProps: DispatchProps = {
  search: (queryString) => searchForAnything(getSearchId(queryString), queryString),
  push,
}

const ConnectedSearch = connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SearchInputWrapper)

export default withRouter<ConsumerProps, typeof ConnectedSearch>(ConnectedSearch)

function getSearchId(q) {
  return `search-anything-box/${q}`
}
