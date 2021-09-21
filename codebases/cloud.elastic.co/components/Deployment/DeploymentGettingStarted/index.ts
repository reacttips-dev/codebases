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
import { RouteComponentProps } from 'react-router'

import DeploymentGettingStarted, { QueryParams } from './DeploymentGettingStarted'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../StackDeploymentEditor'

import {
  getClusterCredentials,
  fetchResetPasswordStatus,
  getCluster,
  getDeploymentTemplate,
  getStackDeployment,
  getStackDeploymentCreateResponse,
} from '../../../reducers'
import { getVersion } from '../../../reducers/clusters'

import { resetPassword } from '../../../actions/clusters'

import { getConfigForKey } from '../../../selectors'
import { getGettingStartedType, getFirstEsClusterFromGet } from '../../../lib/stackDeployments'

import { getEsCredentialsFromCreateResponse } from '../../../lib/stackDeployments/credentials'

import {
  StackDeployment,
  ElasticsearchCluster,
  AsyncRequestState,
  SliderInstanceType,
} from '../../../types'
import { DeploymentTemplateInfoV2, ClusterCredentials } from '../../../lib/api/v1/types'

type StateProps = {
  instanceType: SliderInstanceType
  deployment: ElasticsearchCluster
  stackDeployment: StackDeployment | null
  deploymentTemplate?: DeploymentTemplateInfoV2
  resetPasswordStatus: AsyncRequestState
  credentials: ClusterCredentials | null
  isAnyAdminConsole: boolean
  match: RouteComponentProps<QueryParams>['match']
}

type DispatchProps = {
  resetPassword: (deployment: StackDeployment) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (
  state: any,
  { regionId, deploymentId, stackDeploymentId, match }: ConsumerProps,
): StateProps => {
  const deployment = getCluster(state, regionId, deploymentId!)!
  const stackDeployment = getStackDeployment(state, stackDeploymentId)
  const { deploymentTemplateId, _raw } = deployment
  const version = getVersion(_raw)
  const instanceType = getGettingStartedType({ deployment: stackDeployment! })
  // If a createResponse exists, that means the deployment is being created, and the credentials
  // are in the response
  const createResponse = getStackDeploymentCreateResponse(state, stackDeployment!.id)
  const credentialsFromCreate = getEsCredentialsFromCreateResponse({ createResponse })
  const { id } = deployment!
  const esCluster = getFirstEsClusterFromGet({ deployment: stackDeployment! })
  const refId = esCluster ? esCluster.ref_id : null
  // Otherwise, credentials are saved in state with the associated ES cluster
  const credentialsFromState = refId ? getClusterCredentials(state, id, refId) : null

  return {
    match,
    deployment,
    deploymentTemplate: getDeploymentTemplate(state, regionId, deploymentTemplateId!, version),
    stackDeployment: getStackDeployment(state, stackDeploymentId),
    instanceType,
    resetPasswordStatus: fetchResetPasswordStatus(state, id, refId),
    credentials: credentialsFromCreate || credentialsFromState,
    isAnyAdminConsole: getConfigForKey(state, `APP_NAME`) === `adminconsole`,
  }
}

const mapDispatchToProps: DispatchProps = {
  resetPassword,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(DeploymentGettingStarted),
)
