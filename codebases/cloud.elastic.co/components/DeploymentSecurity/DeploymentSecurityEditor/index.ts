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

import DeploymentSecurityEditor from './DeploymentSecurityEditor'

import { resetPassword } from '../../../actions/clusters'
import { fetchKibana } from '../../../actions/kibana'

import {
  fetchResetPasswordStatus,
  getKibana,
  fetchKibanaRequest,
  getStackDeploymentCreateResponse,
  getClusterCredentials,
} from '../../../reducers'

import { getConfigForKey, isFeatureActivated } from '../../../selectors'

import { getFirstEsClusterFromGet, getRegionId } from '../../../lib/stackDeployments'

import Feature from '../../../lib/feature'

import { ClusterCredentials } from '../../../lib/api/v1/types'
import {
  ElasticsearchCluster,
  AsyncRequestState,
  KibanaCluster,
  StackDeployment,
} from '../../../types'
import { getEsCredentialsFromCreateResponse } from '../../../lib/stackDeployments/credentials'

type StateProps = {
  resetPasswordStatus: AsyncRequestState
  fetchKibanaRequest: AsyncRequestState
  kibana?: KibanaCluster | null
  isIpFilteringEnabled: boolean
  trafficFilteringEnabled: boolean
  crossEnvCcsCcrEnabled: boolean
  isEce: boolean
  credentials: ClusterCredentials | null
}

type DispatchProps = {
  resetPassword: (deployment: StackDeployment) => void
  fetchKibana: (regionId: string, kibanaId: string) => void
}

type ConsumerProps = {
  deployment: StackDeployment
  cluster: ElasticsearchCluster
  kibanaId?: string | null
}

const mapStateToProps = (state, { deployment, kibanaId }: ConsumerProps): StateProps => {
  const { id } = deployment
  const regionId = getRegionId({ deployment })
  const elasticsearch = getFirstEsClusterFromGet({ deployment })
  const refId = elasticsearch ? elasticsearch.ref_id : null

  // If a createResponse exists, that means the deployment is being created, and the credentials
  // are in the response
  const createResponse = getStackDeploymentCreateResponse(state, deployment.id)
  const credentialsFromCreate = getEsCredentialsFromCreateResponse({ createResponse })

  // Otherwise, credentials are saved in state with the associated ES cluster
  const credentialsFromState = refId ? getClusterCredentials(state, id, refId) : null

  return {
    resetPasswordStatus: fetchResetPasswordStatus(state, id, refId),
    fetchKibanaRequest: fetchKibanaRequest(state, regionId, kibanaId!),
    kibana: getKibana(state, regionId!, kibanaId!),
    isIpFilteringEnabled: isFeatureActivated(state, Feature.ipFilteringEnabled),
    trafficFilteringEnabled: isFeatureActivated(state, Feature.trafficFiltering),
    crossEnvCcsCcrEnabled: isFeatureActivated(state, Feature.crossEnvCCSCCR),
    isEce: getConfigForKey(state, `APP_PLATFORM`) === `ece`,
    credentials: credentialsFromCreate || credentialsFromState,
  }
}

const mapDispatchToProps: DispatchProps = {
  resetPassword,
  fetchKibana,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeploymentSecurityEditor)
