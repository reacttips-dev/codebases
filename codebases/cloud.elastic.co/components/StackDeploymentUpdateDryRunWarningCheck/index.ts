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

import { ReactElement } from 'react'
import { connect } from 'react-redux'

import StackDeploymentUpdateDryRunWarningCheck from './StackDeploymentUpdateDryRunWarningCheck'

import { getUpdateDeploymentDryRunResult, updateStackDeploymentDryRunRequest } from '../../reducers'

import { AsyncRequestState, ReduxState } from '../../types'

import { ReplyWarning, DeploymentUpdateResponse } from '../../lib/api/v1/types'

type StateProps = {
  updateDeploymentDryRunResult: DeploymentUpdateResponse | null
  updateDeploymentDryRunRequest: AsyncRequestState
}

interface DispatchProps {}

type ConsumerProps = {
  deploymentId: string
  children: (params: { dryRunWarnings: ReplyWarning[]; dryRunCheckPassed: boolean }) => ReactElement
}

const mapStateToProps = (state: ReduxState, { deploymentId }: ConsumerProps): StateProps => ({
  updateDeploymentDryRunRequest: updateStackDeploymentDryRunRequest(state, deploymentId),
  updateDeploymentDryRunResult: getUpdateDeploymentDryRunResult(state, deploymentId),
})

const mapDispatchToProps = (): DispatchProps => ({})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackDeploymentUpdateDryRunWarningCheck)
