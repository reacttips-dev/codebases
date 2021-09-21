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

import SlmSnapshotStatus from './SlmSnapshotStatus'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../../StackDeploymentEditor'

import { getStackDeployment } from '../../../../reducers'

import { ReduxState, StackDeployment } from '../../../../types'

type StateProps = {
  deployment: StackDeployment
}

interface DispatchProps {}

type OwnProps = {
  status: {
    nextSnapshotAt: string | null
    latestSuccessAt: string | null
    hasRecentEnoughSuccess: boolean
  }
}

type ConsumerProps = WithStackDeploymentRouteParamsProps & OwnProps

const mapStateToProps = (state: ReduxState, { stackDeploymentId }: ConsumerProps): StateProps => ({
  deployment: getStackDeployment(state, stackDeploymentId)!,
})

export default withStackDeploymentRouteParams<OwnProps>(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(SlmSnapshotStatus),
)
