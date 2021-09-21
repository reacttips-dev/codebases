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
import { size } from 'lodash'

import InstanceCapacityOverrideModal from './InstanceCapacityOverrideModal'

import { resetSetInstanceCapacityRequest } from '../../../../actions/clusters'
import { setStackDeploymentInstanceCapacity } from '../../../../actions/stackDeployments'

import { setInstanceCapacityRequest, getDeploymentTemplate } from '../../../../reducers'

import {
  getDeploymentTemplateId,
  getInstanceNames,
  getRegionId,
  getVersion,
} from '../../../../lib/stackDeployments'

import {
  AnyResourceInfo,
  AsyncRequestState,
  StackDeployment,
  ThunkDispatch,
} from '../../../../types'

import { ClusterInstanceInfo, DeploymentTemplateInfoV2 } from '../../../../lib/api/v1/types'

type StateProps = {
  canApplyToAll: boolean
  setInstanceCapacityRequest: AsyncRequestState
  deploymentTemplate?: DeploymentTemplateInfoV2 | null
}

type DispatchProps = {
  setInstanceCapacity: (args: {
    instanceCapacity: number | null
    applyToAll: boolean
  }) => Promise<any>
  resetSetInstanceCapacityRequest: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  instance: ClusterInstanceInfo
}

const mapStateToProps = (
  state: any,
  { deployment, instance, resource }: ConsumerProps,
): StateProps => {
  const instanceNames = getInstanceNames({ instance, resource, applyToAll: true })
  const canApplyToAll = size(instanceNames) > 1
  const regionId = getRegionId({ deployment })
  const version = getVersion({ deployment })
  const templateId = getDeploymentTemplateId({ deployment })

  return {
    canApplyToAll,
    setInstanceCapacityRequest: setInstanceCapacityRequest(state, resource.region, resource.id),
    deploymentTemplate: getDeploymentTemplate(state, regionId!, templateId!, version),
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment, instance, resource }: ConsumerProps,
): DispatchProps => ({
  setInstanceCapacity: ({ instanceCapacity, applyToAll }) =>
    dispatch(
      setStackDeploymentInstanceCapacity({
        deployment,
        resource,
        instanceIds: getInstanceNames({ instance, resource, applyToAll }),
        instanceCapacity,
      }),
    ),

  resetSetInstanceCapacityRequest: () =>
    dispatch(resetSetInstanceCapacityRequest(resource.region, resource.id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(InstanceCapacityOverrideModal)
