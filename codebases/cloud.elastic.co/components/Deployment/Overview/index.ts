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
import { get } from 'lodash'

import { withTransaction } from '@elastic/apm-rum-react'

import DeploymentOverview from './Overview'

import {
  getApm,
  getAppSearchToEnterpriseSearchMigrationProgress,
  getCluster,
  getDeploymentTemplate,
  getKibana,
  getStackDeployment,
} from '../../../reducers'

import { getVersion } from '../../../reducers/clusters'

import { isFeatureActivated } from '../../../selectors'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../../StackDeploymentEditor'

import Feature from '../../../lib/feature'

import { ApmCluster, ElasticsearchCluster, KibanaCluster, StackDeployment } from '../../../types'
import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'
import { AppSearchToEnterpriseSearchMigrationProgress } from '../../../reducers/appSearchToEnterpriseSearchMigrationProgress'

type StateProps = {
  deployment: ElasticsearchCluster
  deploymentTemplate?: DeploymentTemplateInfoV2
  kibana?: KibanaCluster | null
  apm?: ApmCluster | null
  version: string
  hideClusterInsteadOfDelete: boolean
  hideClusterInsteadOfStop: boolean
  showNativeMemoryPressure: boolean
  stackDeployment?: StackDeployment | null
  appSearchToEnterpriseSearchProgress?: AppSearchToEnterpriseSearchMigrationProgress
  inTrial: boolean
}

interface DispatchProps {}

type OwnProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (
  state: any,
  { regionId, deploymentId, stackDeploymentId }: OwnProps,
): StateProps => {
  const deployment = getCluster(state, regionId, deploymentId!)!
  const { deploymentTemplateId, kibana, apm, _raw } = deployment
  const version = getVersion(_raw)

  return {
    deployment,
    deploymentTemplate: getDeploymentTemplate(state, regionId, deploymentTemplateId!, version),
    version,
    kibana: getKibana(state, regionId, kibana.id!),
    apm: getApm(state, regionId, apm.id!),
    hideClusterInsteadOfDelete: isFeatureActivated(state, Feature.hideClusterInsteadOfDelete),
    hideClusterInsteadOfStop: isFeatureActivated(state, Feature.hideClusterInsteadOfStop),
    showNativeMemoryPressure: isFeatureActivated(state, Feature.showNativeMemoryPressure),
    stackDeployment: getStackDeployment(state, stackDeploymentId),
    appSearchToEnterpriseSearchProgress: stackDeploymentId
      ? getAppSearchToEnterpriseSearchMigrationProgress(state, stackDeploymentId)
      : undefined,
    inTrial: get(state, [`profile`, `inTrial`], false),
  }
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, OwnProps>(mapStateToProps)(
    withTransaction(`Deployment overview`, `component`)(DeploymentOverview),
  ),
)
