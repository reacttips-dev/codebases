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

import EditMonitoring from './EditMonitoring'

import {
  setDeploymentMonitoring,
  stopDeploymentMonitoring,
} from '../../../../actions/stackDeployments'

import { setDeploymentMonitoringRequest } from '../../../../reducers'

import { getConfigForKey } from '../../../../selectors'

import { AsyncRequestState, StackDeployment } from '../../../../types'

type StateProps = {
  isHeroku: boolean
  setDeploymentMonitoringRequest: AsyncRequestState
}

type UpdateMonitoringSettings = {
  deploymentFrom: StackDeployment
  deploymentTo: StackDeployment
  logsMonitoring: boolean
  metricsMonitoring: boolean
}

interface DispatchProps {
  setDeploymentMonitoring: (settings: UpdateMonitoringSettings) => void
  stopDeploymentMonitoring: (deploymentId: string) => void
}

interface ConsumerProps {
  deployment: StackDeployment
}

const mapStateToProps = (state, { deployment }: ConsumerProps): StateProps => ({
  setDeploymentMonitoringRequest: setDeploymentMonitoringRequest(state, deployment.id),
  isHeroku: getConfigForKey(state, `APP_FAMILY`) === `heroku`,
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
  stopDeploymentMonitoring: (deploymentId: string) =>
    dispatch(stopDeploymentMonitoring(deploymentId)),
  setDeploymentMonitoring: (settings: UpdateMonitoringSettings) =>
    dispatch(setDeploymentMonitoring(settings)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(EditMonitoring)
