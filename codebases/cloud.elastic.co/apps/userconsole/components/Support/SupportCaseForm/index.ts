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

import SupportCaseForm from './SupportCaseForm'

import { searchClusters } from '../../../../../actions/searchClusters'
import {
  createSupportCase,
  resetCreateSupportCaseRequest,
  SupportCaseData,
} from '../../../actions/supportCases'

import { getSearchClustersById, searchClusterRequest } from '../../../../../reducers'
import { createSupportCaseRequest, getProfile } from '../../../reducers'
import { SearchRecord } from '../../../../../reducers/searchClusters'
import { getConfigForKey } from '../../../../../selectors'

import { ThunkDispatch, ReduxState, ProfileState, AsyncRequestState } from '../../../../../types'
import { SearchRequest } from '../../../../../lib/api/v1/types'

const searchId = `search-deployments-help`

type StateProps = {
  profile: NonNullable<ProfileState>
  searchResults: SearchRecord | null
  searchRequest: AsyncRequestState
  isHeroku: boolean
  supportCaseRequest: AsyncRequestState
}

type DispatchProps = {
  search: (query: SearchRequest) => void
  createSupportCase: (supportCaseData: SupportCaseData) => Promise<any>
  resetCreateSupportCaseRequest: () => void
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  profile: getProfile(state)!,
  searchResults: getSearchClustersById(state, searchId),
  searchRequest: searchClusterRequest(state, searchId),
  supportCaseRequest: createSupportCaseRequest(state),
  isHeroku: getConfigForKey(state, `APP_FAMILY`) === `heroku`,
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  search: (query) => dispatch(searchClusters(searchId, query)),
  createSupportCase: (supportCase) => dispatch(createSupportCase(supportCase)),
  resetCreateSupportCaseRequest: () => dispatch(resetCreateSupportCaseRequest()),
})

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SupportCaseForm)
