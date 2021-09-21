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

import SlmCallouts from './SlmCallouts'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../../StackDeploymentEditor'

import { enableSlm } from '../../../../actions/snapshotSettings'

import { getConfigForKey } from '../../../../selectors'

import { enableSlmRequest, getStackDeployment } from '../../../../reducers'

import { AsyncRequestState, CloudAppPlatform, ReduxState, StackDeployment } from '../../../../types'

type StateProps = {
  appPlatform: CloudAppPlatform
  deployment: StackDeployment
  enableSlmRequest: AsyncRequestState
}

type DispatchProps = {
  enableSlm: (deploymentId: string, refId: string) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (state: ReduxState, { stackDeploymentId }: ConsumerProps): StateProps => ({
  appPlatform: getConfigForKey(state, `APP_PLATFORM`),
  deployment: getStackDeployment(state, stackDeploymentId)!,
  enableSlmRequest: enableSlmRequest(state),
})

const mapDispatchToProps: DispatchProps = {
  enableSlm,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(SlmCallouts),
)
