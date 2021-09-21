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

import ApmServerToken from './ApmServerToken'

import { fetchApm, stackDeploymentResetApmToken } from '../../../../actions/apm'

import { ApmResourceInfo } from '../../../../lib/api/v1/types'
import { StackDeployment, ThunkDispatch } from '../../../../types'

type StateProps = null

type DispatchProps = {
  resetApmToken: (regionId: string, apmId: string, deploymentId: string) => void
  fetchApm: (regionId: string, id: string) => void
}

type ConsumerProps = {
  deployment: StackDeployment
  resource: ApmResourceInfo
}

const mapStateToProps: StateProps = null

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  resetApmToken: (...args) => dispatch(stackDeploymentResetApmToken(...args)),
  fetchApm,
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ApmServerToken)
