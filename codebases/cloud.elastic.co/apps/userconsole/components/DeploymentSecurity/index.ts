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

import { withTransaction } from '@elastic/apm-rum-react'

import DeploymentSecurity from './DeploymentSecurity'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../../../components/StackDeploymentEditor'

import { saveShieldConfig } from '../../actions/clusters/shield'

import { saveShieldConfigRequest } from '../../reducers'

import { getCluster, getStackDeployment } from '../../../../reducers'

import { ElasticsearchCluster, AsyncRequestState, StackDeployment } from '../../../../types'

interface ShieldConfig {
  users: string
  users_roles: string
  roles: string
}

type StateProps = {
  deployment: StackDeployment | null
  cluster?: ElasticsearchCluster | null
  saveShieldConfigRequest: AsyncRequestState
}

type DispatchProps = {
  saveShieldConfig: (cluster: ElasticsearchCluster, shieldConfig: ShieldConfig) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (
  state,
  { stackDeploymentId, regionId, deploymentId }: ConsumerProps,
): StateProps => ({
  deployment: getStackDeployment(state, stackDeploymentId),
  cluster: getCluster(state, regionId, deploymentId!),
  saveShieldConfigRequest: saveShieldConfigRequest(state, regionId, deploymentId),
})

const mapDispatchToProps: DispatchProps = {
  saveShieldConfig,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(withTransaction(`Deployment security`, `component`)(DeploymentSecurity)),
)
