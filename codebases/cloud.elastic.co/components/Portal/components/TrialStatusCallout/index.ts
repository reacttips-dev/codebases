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
import TrialStatusCallout from './TrialStatusCallout'

import { getProfile, fetchProfileRequest } from '../../../../apps/userconsole/reducers/index'

import { AsyncRequestState, ProfileState, ReduxState } from '../../../../types'

type StateProps = {
  fetchProfileRequest: AsyncRequestState
  profile: ProfileState
}

interface DispatchProps {}

type ConsumerProps = {
  onDismiss?: () => void
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  fetchProfileRequest: fetchProfileRequest(state),
  profile: getProfile(state)!,
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(TrialStatusCallout)
