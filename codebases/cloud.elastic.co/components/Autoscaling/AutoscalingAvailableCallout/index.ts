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

import AutoscalingAvailableCallout from './AutoscalingAvailableCallout'

import { updateDeployment } from '../../../actions/stackDeployments'

import { StackDeployment } from '../../../types'

import { DeploymentTemplateInfoV2, DeploymentUpdateRequest } from '../../../lib/api/v1/types'

interface StateProps {}

type DispatchProps = {
  updateDeployment: (settings: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
}
type ConsumerProps = {
  stackDeployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2
}

const mapStateToProps = (): StateProps => ({})

const mapDispatchToProps: DispatchProps = {
  updateDeployment,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AutoscalingAvailableCallout)
