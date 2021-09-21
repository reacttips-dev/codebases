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

import DeploymentVersionUpgradeModal from './DeploymentVersionUpgradeModal'

import { fetchExtensions } from '../../../../../actions/deploymentExtensions'

import { startAppSearchToEnterpriseSearchMigration } from '../../../../../actions/appSearchToEnterpriseSearchMigration'

import { upgradeAssistant } from '../../../../../actions/clusters'

import {
  fetchDeployment,
  fetchDeprecations,
  resetUpdateDeployment,
  updateDeployment,
} from '../../../../../actions/stackDeployments'

import {
  fetchDeprecationsAssistantRequest,
  fetchDeprecationsRequest,
  getDeploymentExtensions,
  getVersionStack,
  getVersionStacks,
  getDeploymentTemplate,
  getDeprecations,
  updateStackDeploymentRequest,
} from '../../../../../reducers'

import {
  getDeploymentTemplateId,
  getFirstEsClusterFromGet,
  getFirstSliderClusterFromGet,
  getLowestSliderVersion,
  getRegionId,
} from '../../../../../lib/stackDeployments'

import { lt } from '../../../../../lib/semver'

import { getConfigForKey } from '../../../../../store'

import {
  DeploymentUpdateRequest,
  DeploymentTemplateInfoV2,
  Extension,
  KibanaResourceInfo,
  StackVersionConfig,
} from '../../../../../lib/api/v1/types'

import {
  AsyncRequestState,
  DeprecationsResponse,
  ReduxState,
  StackDeployment,
  ThunkDispatch,
  VersionNumber,
} from '../../../../../types'

type StateProps = {
  availableVersions?: string[]
  deploymentTemplate?: DeploymentTemplateInfoV2
  extensions: Extension[] | null
  getDeprecations: (
    regionId: string,
    clusterId: string,
    version: VersionNumber,
  ) => DeprecationsResponse | undefined
  fetchDeprecationsAssistantRequest: AsyncRequestState
  fetchDeprecationsRequest: AsyncRequestState
  updateStackDeploymentRequest: AsyncRequestState
  versionStacks?: StackVersionConfig[] | null
}

type DispatchProps = {
  fetchExtensions: () => void
  upgradeAssistant: (args: {
    version: string
    previousVersion: string
    clusterId: string
    regionId: string
  }) => void
  updateDeployment: (args: {
    deploymentId: string
    deployment: DeploymentUpdateRequest
    redirect?: boolean
    dryRun?: boolean
  }) => Promise<void>
  resetUpdateDeployment: (deploymentId: string) => void
  fetchDeployment: (args: { deploymentId: string }) => void
  fetchDeprecations: (args: { regionId: string; clusterId: string; version: VersionNumber }) => void
  startAppSearchToEnterpriseSearchMigration: (args: { deployment: StackDeployment }) => void
}

type ConsumerProps = {
  deployment: StackDeployment
  isLoadingRegion?: boolean
  onCancel: () => void
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const regionId = getRegionId({
    deployment,
  })!
  const templateId = getDeploymentTemplateId({
    deployment,
  })!

  // If a deployment is partially upgraded, we pick the lowest
  // found version found in each resource to upgrade from.
  const lowestVersion = getLowestSliderVersion({
    deployment,
  })!

  const esCluster = getFirstEsClusterFromGet({ deployment })!
  const kibana = getFirstSliderClusterFromGet<KibanaResourceInfo>({
    deployment,
    sliderInstanceType: `kibana`,
  })!

  const versionStack = getVersionStack(state, regionId, lowestVersion)
  const versionStacks = getVersionStacks(state, regionId)
  // if there is no Kibana, then this doesn't make any sense. To make sure we don't break the code here, we just pass in a fake id
  // this variable isn't used later if Kibana is not enabled.
  const deprecationsAssistantRequest = fetchDeprecationsAssistantRequest(
    state,
    regionId,
    kibana?.id || 'not-a-thing-at-all',
  )

  return {
    availableVersions: versionStack?.upgradable_to,
    extensions: getConfigForKey(`APP_NAME`) === `userconsole` ? getDeploymentExtensions(state) : [],
    updateStackDeploymentRequest: updateStackDeploymentRequest(state, deployment.id),
    getDeprecations: (pendingVersion) =>
      getDeprecations(state, regionId, getDeprecationsClusterId(), pendingVersion),
    fetchDeprecationsRequest: fetchDeprecationsRequest(state, regionId, esCluster.id),
    fetchDeprecationsAssistantRequest: deprecationsAssistantRequest,
    versionStacks,
    deploymentTemplate: getDeploymentTemplate(state, regionId, templateId, lowestVersion),
  }

  function getDeprecationsClusterId() {
    // deprecations assistant is based on whether we have a kibana and what version of ES we have
    if (kibana == null) {
      return esCluster.id
    }

    if (lt(lowestVersion, `6.7.0`)) {
      return esCluster.id
    }

    return kibana.id
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchExtensions: () => dispatch(fetchExtensions()),
  fetchDeployment: (args) => dispatch(fetchDeployment(args)),
  fetchDeprecations: (args) => dispatch(fetchDeprecations(args)),
  resetUpdateDeployment: (deploymentId: string) => dispatch(resetUpdateDeployment(deploymentId)),
  upgradeAssistant: (args) => dispatch(upgradeAssistant(args)),
  updateDeployment: (args) => dispatch(updateDeployment(args)),
  startAppSearchToEnterpriseSearchMigration: (args) =>
    dispatch(startAppSearchToEnterpriseSearchMigration(args)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentVersionUpgradeModal)
