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

import EnableCrossClusterReplicationCallout from './EnableCrossClusterReplicationCallout'

import { fetchDeployment } from '../../../actions/stackDeployments'
import { enableCrossClusterReplication } from '../../../actions/deployments/ccr'

import {
  getFirstEsClusterFromGet,
  getDeploymentTemplateId,
  getRegionId,
  getVersion,
} from '../../../lib/stackDeployments'

import { enableCrossClusterReplicationRequest, getDeploymentTemplate } from '../../../reducers'
import { getConfigForKey } from '../../../selectors'

import { isFeatureActivated } from '../../../store'
import Feature from '../../../lib/feature'
import Permission from '../../../lib/api/v1/permissions'
import requiresPermission from '../../../lib/requiresPermission'

import { StateProps, DispatchProps, ConsumerProps } from './types'
import { ThunkDispatch, ReduxState } from '../../../types'

const mapStateToProps: (state: ReduxState, consumerProps: ConsumerProps) => StateProps = (
  state,
  { deployment },
) => {
  const esResource = getFirstEsClusterFromGet({ deployment })!
  const regionId = getRegionId({ deployment })!
  const deploymentTemplateId = getDeploymentTemplateId({ deployment })!
  const version = getVersion({ deployment })
  const { ref_id: refId } = esResource

  return {
    isCrossEnvCcsCcrActivated: isFeatureActivated(Feature.crossEnvCCSCCR),
    isEce: getConfigForKey(state, `APP_PLATFORM`) === `ece`,
    deploymentTemplate: getDeploymentTemplate(state, regionId, deploymentTemplateId, version),
    enableCrossClusterReplicationRequest: enableCrossClusterReplicationRequest(
      state,
      deployment.id,
      refId,
    ),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  enableCrossClusterReplication: (...args) => dispatch(enableCrossClusterReplication(...args)),
  fetchDeployment: (...args) => dispatch(fetchDeployment(...args)),
})

const controlledComponent = requiresPermission(
  EnableCrossClusterReplicationCallout,
  Permission.enableDeploymentResourceCcr,
)

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(controlledComponent)
