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

import React, { ReactNode } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import loadable from '@loadable/component'

import { EuiLoadingContent } from '@elastic/eui'

import { clearCreateDeploymentResponse } from '../../../actions/stackDeployments'
import { clearClusterCredentials } from '../../../actions/clusters'
import { clearApmToken } from '../../../actions/apm'

import {
  fetchStackDeploymentRequest,
  getApm,
  getCluster,
  getDeletedStackDeploymentIds,
  getDeploymentTemplate,
  getKibana,
  getStackDeployment,
} from '../../../reducers'

import withStackDeploymentPolling from './withStackDeploymentPolling'

import {
  getRegionId,
  getVersion,
  getDeploymentTemplateId,
  getFirstEsClusterFromGet,
} from '../../../lib/stackDeployments'

import { isFeatureActivated } from '../../../store'

import Feature from '../../../lib/feature'

import {
  ApmCluster,
  AsyncRequestState,
  ElasticsearchCluster,
  KibanaCluster,
  ReduxState,
  StackDeployment,
} from '../../../types'

import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

type StateProps = {
  regionId: string
  deploymentId: string
  titleId: string
  deployment?: ElasticsearchCluster | null
  deploymentRequest: AsyncRequestState
  deploymentTemplate?: DeploymentTemplateInfoV2
  kibana?: KibanaCluster | null
  apm?: ApmCluster | null
  shouldShowRegion: boolean
  wasDeleted: boolean
  location: RouteComponentProps['location']
  stackDeployment: StackDeployment | null
}

type DispatchProps = {
  clearCreateDeploymentResponse: (params: { deploymentId: string }) => void
  clearClusterCredentials: (params: { deployment: StackDeployment }) => void
  clearApmToken: (regionId: string, apmId: string) => void
}

type ConsumerProps = {
  stackDeploymentId: string
  children?: ReactNode
}

type ConnectedConsumerProps = ConsumerProps & RouteComponentProps

const DeploymentDependencyLoader = loadable(() => import(`./DeploymentDependencyLoader`), {
  fallback: <EuiLoadingContent />,
})

const mapStateToProps = (
  state: ReduxState,
  { location, stackDeploymentId }: ConnectedConsumerProps,
): StateProps => {
  const deployment = getStackDeployment(state, stackDeploymentId)
  const esClusterId = deployment && getEsClusterId({ deployment })
  const regionId = deployment && getRegionId({ deployment })
  const esCluster = getCluster(state, regionId!, esClusterId!)

  const deploymentTemplate: any = deployment
    ? getDeploymentTemplate(
        state,
        regionId!,
        getDeploymentTemplateId({ deployment })!,
        getVersion({ deployment }),
      )
    : null

  const deletedDeploymentIds = getDeletedStackDeploymentIds(state)
  const wasDeleted = deletedDeploymentIds.includes(stackDeploymentId)

  return {
    apm: esCluster ? getApm(state, regionId!, esCluster.apm.id!) : undefined,
    deployment: esCluster,
    deploymentId: esClusterId!,
    deploymentRequest: fetchStackDeploymentRequest(state, stackDeploymentId),
    deploymentTemplate,
    kibana: esCluster ? getKibana(state, regionId!, esCluster.kibana.id!) : undefined,
    location,
    regionId: regionId!,
    shouldShowRegion: isFeatureActivated(Feature.regionNames),
    stackDeployment: deployment,
    titleId: stackDeploymentId,
    wasDeleted,
  }
}

const mapDispatchToProps: DispatchProps = {
  clearCreateDeploymentResponse,
  clearClusterCredentials,
  clearApmToken,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStackDeploymentPolling(withRouter(DeploymentDependencyLoader)))

function getEsClusterId({ deployment }: { deployment: StackDeployment | null }): string | null {
  if (!deployment) {
    return null
  }

  const esCluster = getFirstEsClusterFromGet({ deployment })

  if (!esCluster) {
    return null
  }

  return esCluster.id
}
