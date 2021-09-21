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
import DocumentationTile, { DispatchProps, StateProps, ConsumerProps } from './DocumentationTile'
import { fetchFeed } from '../../../../actions/feeds'

import { getFeed, fetchFeedRequest } from '../../../../reducers'

import { ReduxState } from '../../../../types'
import { fetchProfileRequest } from '../../../../apps/userconsole/reducers'

const mapStateToProps = (state: ReduxState, { inTrial }): StateProps => {
  const defaultFeed = inTrial ? `ess-documentation-trial` : `ess-documentation-paying`
  const version = `1.0.0`
  return {
    fetchDocsFeedRequest: fetchFeedRequest(state, `${defaultFeed}-${version}`),
    fetchProfileRequest: fetchProfileRequest(state),
    feeds: getFeed(state, defaultFeed, version, 5),
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchFeed,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentationTile)
