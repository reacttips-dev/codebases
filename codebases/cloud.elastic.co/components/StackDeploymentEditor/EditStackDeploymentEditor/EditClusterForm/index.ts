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

import EditClusterForm from './EditClusterForm'

import { updateDeployment } from '../../../../actions/stackDeployments'
import { fetchRegionIfNeeded } from '../../../../actions/regions'
import { fetchNodeConfigurations } from '../../../../actions/nodeConfigurations'

import {
  getCluster,
  getNodeConfigurations,
  getVersionStacks,
  updateStackDeploymentRequest,
} from '../../../../reducers'

import { isFeatureActivated } from '../../../../selectors'

import { getFirstEsClusterFromGet } from '../../../../lib/stackDeployments'

import Feature from '../../../../lib/feature'

import {
  StackDeploymentUpdateRequest,
  AsyncRequestState,
  ElasticsearchCluster,
} from '../../../../types'

import { NodeConfigurationState } from '../../../../reducers/nodeConfigurations'

import { DeploymentUpdateRequest, StackVersionConfig } from '../../../../lib/api/v1/types'

type StateProps = {
  esCluster?: ElasticsearchCluster | null
  esVersions?: StackVersionConfig[] | null
  nodeConfigurations?: {
    [id: string]: NodeConfigurationState
  }
  hideExtraFailoverOptions: boolean
  updateStackDeploymentRequest: AsyncRequestState
}

type DispatchProps = {
  updateDeployment: (settings: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
  fetchRegionIfNeeded: (regionId: string) => void
  fetchNodeConfigurations: (regionId: string) => void
}

type ConsumerProps = {
  editorState: StackDeploymentUpdateRequest
}

const mapStateToProps = (state, { editorState }: ConsumerProps): StateProps => {
  const { regionId, id, deploymentUnderEdit } = editorState
  const esCluster = getFirstEsClusterFromGet({ deployment: deploymentUnderEdit })

  return {
    esCluster: esCluster ? getCluster(state, regionId, esCluster.id) : undefined,
    hideExtraFailoverOptions: isFeatureActivated(state, Feature.hideExtraFailoverOptions),
    esVersions: getVersionStacks(state, regionId),
    updateStackDeploymentRequest: updateStackDeploymentRequest(state, id),
    nodeConfigurations: getNodeConfigurations(state, regionId),
  }
}

const mapDispatchToProps: DispatchProps = {
  fetchRegionIfNeeded,
  fetchNodeConfigurations,
  updateDeployment,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(EditClusterForm)

export type { Props } from './EditClusterForm'
