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

import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'

import Account from './Account'
import { getProfile } from '../../../../apps/userconsole/reducers'
import { isFeatureActivated } from '../../../../selectors'
import Feature from '../../../../lib/feature'
import { UserProfile } from '../../../../types'

interface StateProps {
  profile: UserProfile | null
  showAccountActivityTab: boolean
  showBillingTab: boolean
}

interface ConsumerProps extends RouteComponentProps {
  isRouteFSTraced?: boolean
}

interface DispatchProps {}

const mapStateToProps = (state): StateProps => ({
  profile: getProfile(state),
  showAccountActivityTab: isFeatureActivated(state, Feature.showAccountActivity),
  showBillingTab: isFeatureActivated(state, Feature.showBillingPage),
})

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(Account),
)
