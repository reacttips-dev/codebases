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

import StackDeploymentNodesVisualization from './StackDeploymentNodesVisualization'
import { searchAllocatorsSimpleQuery } from '../../../actions/allocatorSearch'
import { fetchNodeStats } from '../../../actions/clusters/fetchNodeStats'
import { getConfigForKey, isFeatureActivated } from '../../../selectors'
import Feature from '../../../lib/feature'
import { SliderInstanceType, StackDeployment, ThunkDispatch } from '../../../types'
import { isPermitted } from '../../../lib/requiresPermission'
import Permission from '../../../lib/api/v1/permissions'
import { getDeploymentAllocatorIds, getRegionId } from '../../../lib/stackDeployments/selectors'
import createDeploymentAllocatorsQuery from './lib/createDeploymentAllocatorsQuery'

type StateProps = {
  disableNodeControlsIfPlanPending?: boolean
  shouldFetchDeploymentAllocators: boolean
}

interface DispatchProps {
  fetchDeploymentAllocators: () => void
  fetchNodeStats: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
  showNativeMemoryPressure?: boolean
  sliderInstanceType?: SliderInstanceType
}

const mapStateToProps = (state: any): StateProps => ({
  disableNodeControlsIfPlanPending: isFeatureActivated(
    state,
    Feature.disableNodeControlsIfPlanPending,
  ),
  shouldFetchDeploymentAllocators:
    getConfigForKey(state, `APP_NAME`) === `adminconsole` && isPermitted(Permission.getAllocator),
})

const mapDispatchToProps = (dispatch: ThunkDispatch, { deployment }): DispatchProps => {
  const regionId = getRegionId({ deployment })
  const allocatorIds = getDeploymentAllocatorIds({ deployment })

  return {
    fetchDeploymentAllocators: () => {
      if (regionId === null || allocatorIds.length === 0) {
        return
      }

      dispatch(
        searchAllocatorsSimpleQuery(
          `search-deployment-allocators/${deployment.id}`,
          regionId,
          createDeploymentAllocatorsQuery(allocatorIds),
        ),
      )
    },
    fetchNodeStats: () => dispatch(fetchNodeStats(deployment)),
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackDeploymentNodesVisualization)
