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

import StackDeploymentHealthProblems from './StackDeploymentHealthProblems'

import {
  cancelDeploymentResourcePlanRequest,
  saveClusterPlanRequest,
  updateKibanaPlanRequest,
  restartStackDeploymentResourceRequest,
  getAllocatorSearchResults,
} from '../../reducers'

import { getFirstSliderClusterFromGet, getRegionId } from '../../lib/stackDeployments'

import { AllocatorSearchResult, AsyncRequestState, ReduxState } from '../../types'

import { DeploymentSearchResponse, DeploymentGetResponse } from '../../lib/api/v1/types'

type StackDeployment = DeploymentSearchResponse | DeploymentGetResponse

type StateProps = {
  cancelPlanRequests: { [sliderInstanceType: string]: AsyncRequestState }
  deploymentAllocators?: AllocatorSearchResult[]
  updatePlanRequests: { [sliderInstanceType: string]: AsyncRequestState }
}

interface DispatchProps {}

type ConsumerProps = {
  deployment: StackDeployment
  onGettingStartedPage?: boolean
}

function getDeploymentAllocators(
  state: ReduxState,
  deployment: StackDeployment,
  onGettingStartedPage?: boolean,
): AllocatorSearchResult[] {
  if (!onGettingStartedPage) {
    return []
  }

  const regionId = getRegionId({ deployment })

  if (regionId === null) {
    return []
  }

  const deploymentAllocators = getAllocatorSearchResults(
    state,
    regionId,
    `search-deployment-allocators/${deployment.id}`,
  )

  return deploymentAllocators
}

const mapStateToProps = (
  state: ReduxState,
  { deployment, onGettingStartedPage }: ConsumerProps,
): StateProps => {
  // key "restart" and "cancel plan" requests by sliderInstanceType
  const updatePlanRequests = {}
  const cancelPlanRequests = {}

  Object.keys(deployment.resources).forEach((sliderInstanceType) => {
    const cluster = getFirstSliderClusterFromGet({
      deployment,
      sliderInstanceType,
    })

    if (!cluster) {
      return
    }

    // ES and Kibana have specific plan update actions; others use the generic
    // slider plan update action
    switch (sliderInstanceType) {
      case `elasticsearch`:
        updatePlanRequests[sliderInstanceType] = saveClusterPlanRequest(
          state,
          cluster.region,
          cluster.id,
        )
        break
      case `kibana`:
        updatePlanRequests[sliderInstanceType] = updateKibanaPlanRequest(
          state,
          cluster.region,
          cluster.id,
        )
        break
      default:
        updatePlanRequests[sliderInstanceType] = restartStackDeploymentResourceRequest(
          state,
          deployment.id,
          sliderInstanceType,
          cluster.ref_id,
        )
    }

    cancelPlanRequests[sliderInstanceType] = cancelDeploymentResourcePlanRequest(
      state,
      deployment.id,
      sliderInstanceType,
      cluster.ref_id,
    )
  })

  return {
    deploymentAllocators: getDeploymentAllocators(state, deployment, onGettingStartedPage),
    updatePlanRequests,
    cancelPlanRequests,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackDeploymentHealthProblems)
