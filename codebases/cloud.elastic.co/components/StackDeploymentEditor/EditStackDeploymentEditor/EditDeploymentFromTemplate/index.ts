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

import { get } from 'lodash'
import { connect } from 'react-redux'

import EditDeploymentFromTemplate from './EditDeploymentFromTemplate'

import {
  fetchInstanceConfigurationIfNeeded,
  fetchInstanceConfigurationsIfNeeded,
} from '../../../../actions/topology/instanceConfigurations'

import { fetchRegionIfNeeded } from '../../../../actions/regions'

import { updateIndexPatterns } from '../../../../actions/deployments/curation'
import { updateDeployment } from '../../../../actions/stackDeployments'

import {
  getCluster,
  getInstanceConfigurations,
  getVersionStacks,
  updateStackDeploymentRequest,
} from '../../../../reducers'

import { getConfigForKey, isFeatureActivated } from '../../../../selectors'

import { getFirstEsClusterFromGet } from '../../../../lib/stackDeployments'

import Feature from '../../../../lib/feature'

import {
  AsyncRequestState,
  ElasticsearchCluster,
  RegionId,
  StackDeploymentUpdateRequest,
} from '../../../../types'

import {
  ApmTopologyElement,
  ClusterCurationSpec,
  DeploymentUpdateRequest,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  KibanaClusterTopologyElement,
  StackVersionConfig,
} from '../../../../lib/api/v1/types'

type AnyTopologyElement =
  | ElasticsearchClusterTopologyElement
  | KibanaClusterTopologyElement
  | ApmTopologyElement

type StateProps = {
  esCluster?: ElasticsearchCluster | null
  esVersions?: StackVersionConfig[] | null
  hideExtraFailoverOptions: boolean
  instanceConfigurations?: InstanceConfiguration[]
  inTrial: boolean
  isHeroku: boolean
  readOnlyIndexCurationTargets: boolean
  ucIlmBetaBadge: boolean
  updateStackDeploymentRequest: AsyncRequestState
}

type DispatchProps = {
  fetchRegionIfNeeded: (regionId: RegionId) => void
  fetchInstanceConfigurationIfNeeded: (regionId: RegionId, id: string) => void
  fetchInstanceConfigurationsIfNeeded: (regionId: RegionId) => void
  updateDeployment: (settings: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
  updateIndexPatterns: (settings: {
    regionId: string
    deploymentId: string
    indexPatterns: ClusterCurationSpec[]
  }) => void
}

type ConsumerProps = {
  regionId: string
  editorState: StackDeploymentUpdateRequest
  onChange: (nodeConfiguration: AnyTopologyElement, path: string[], value: any) => void
}

const mapStateToProps = (state, { regionId, editorState }: ConsumerProps): StateProps => {
  const { id, deploymentUnderEdit } = editorState
  const esCluster = getFirstEsClusterFromGet({ deployment: deploymentUnderEdit })!

  const instanceConfigurations = getInstanceConfigurations(state, regionId)

  return {
    esCluster: esCluster ? getCluster(state, regionId, esCluster.id) : undefined,
    isHeroku: getConfigForKey(state, `APP_FAMILY`) === `heroku`,
    readOnlyIndexCurationTargets: isFeatureActivated(state, Feature.readonlyIndexCurationTargets),
    hideExtraFailoverOptions: isFeatureActivated(state, Feature.hideExtraFailoverOptions),
    instanceConfigurations,
    esVersions: getVersionStacks(state, regionId),
    ucIlmBetaBadge: isFeatureActivated(state, Feature.ucIlmBetaBadge),
    updateStackDeploymentRequest: updateStackDeploymentRequest(state, id),
    inTrial: get(state, [`profile`, `inTrial`], false),
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchRegionIfNeeded,
  fetchInstanceConfigurationIfNeeded,
  fetchInstanceConfigurationsIfNeeded,
  updateDeployment,
  updateIndexPatterns,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(EditDeploymentFromTemplate)
