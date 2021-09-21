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

import ApmIntroNotification from './ApmIntroNotification'

import { dismissNotification } from '../../../../actions/notificationMessages'

import { getNotificationsState } from '../../../../reducers'

import {
  APM_INTRO_NOTIFICATION_STORAGE_KEY,
  ReduxState,
  StackDeployment,
  ThunkDispatch,
} from '../../../../types'

type StateProps = {
  notificationMessage: { dismissed: boolean | null }
}

type DispatchProps = {
  dismissNotification: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  notificationMessage: getNotificationsState(state, APM_INTRO_NOTIFICATION_STORAGE_KEY),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  dismissNotification: () => dispatch(dismissNotification(APM_INTRO_NOTIFICATION_STORAGE_KEY)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ApmIntroNotification)
