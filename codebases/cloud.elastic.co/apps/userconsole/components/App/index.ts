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

import App from './App'

import { goToUrl } from '../../../../actions/search'
import { fetchRootIfNeeded } from '../../../../actions/root'
import { fetchProfileIfNeeded } from '../../actions/profile'

import { getRoot, fetchRootRequest } from '../../../../reducers'

import { getProfile } from '../../reducers'

import { getConfig, getConfigForKey, isFeatureActivated } from '../../../../selectors'
import Feature from '../../../../lib/feature'

import { AppConfig } from '../../../../../config/types'
import { AsyncRequestState, RootConfig, ThunkDispatch, ProfileState } from '../../../../types'

interface StateProps {
  pollingInterval: number
  config: AppConfig
  root: RootConfig
  profile: ProfileState
  isFullStoryActivated: boolean
  fetchRootRequest: AsyncRequestState
  intercomChatFeature: boolean
}

interface DispatchProps {
  fetchProfileIfNeeded: () => Promise<any>
  fetchRootIfNeeded: (config: AppConfig) => void
  push: (url: string) => void
}

interface ConsumerProps {
  isPortalRoute?: boolean
  isCreateUrl?: boolean
  isGettingStartedUrl?: boolean
  isRouteFSTraced?: boolean
}

const mapStateToProps = (state): StateProps => ({
  config: getConfig(state),
  root: getRoot(state),
  profile: getProfile(state),
  fetchRootRequest: fetchRootRequest(state),
  isFullStoryActivated: isFeatureActivated(state, Feature.userconsoleRunFullStory),
  pollingInterval: getConfigForKey(state, `POLLING_INTERVAL`),
  intercomChatFeature: isFeatureActivated(state, Feature.intercomChat),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchRootIfNeeded: (config) => dispatch(fetchRootIfNeeded(config)),
  fetchProfileIfNeeded: () => dispatch(fetchProfileIfNeeded()),
  push: (url) => dispatch(goToUrl(url)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(App)
