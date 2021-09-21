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

import NodeTileMenu from './NodeTileMenu'

import {
  fetchDeployment,
  setStackDeploymentInstanceStatus,
  setStackDeploymentMaintenanceMode,
} from '../../../../actions/stackDeployments'

import { startHeapDumpCapture } from '../../../../actions/heapDumps'
import { push } from '../../../../actions/history'

import { startHeapDumpCaptureRequest } from '../../../../reducers'

import { getConfigForKey, isFeatureActivated } from '../../../../selectors'

import { SAD_hasUnexpiredSudo } from '../../../../lib/auth'
import { heapDumpsUrl } from '../../../../lib/urlBuilder'

import { isPermitted } from '../../../../lib/requiresPermission'

import Permission from '../../../../lib/api/v1/permissions'
import Feature from '../../../../lib/feature'

import {
  ClusterInstanceConfigurationInfo,
  ClusterInstanceInfo,
  ElasticsearchResourceInfo,
} from '../../../../lib/api/v1/types'

import {
  AsyncRequestState,
  ThunkDispatch,
  ReduxState,
  SliderInstanceType,
  StackDeployment,
} from '../../../../types'

interface StateProps {
  canCaptureHeapDumps: boolean
  canMoveNode: boolean
  disableNodeControlsIfPlanPending?: boolean
  diskQuotaOverride: boolean
  hasSudo: boolean
  instanceCapacityOverride: boolean
  isAdminConsole: boolean
  isSudoFeatureActivated: boolean
  type: 'node' | 'instance'
  startHeapDumpCaptureRequest: AsyncRequestState
}

interface ConsumerProps {
  deployment: StackDeployment
  instance: ClusterInstanceInfo
  instanceConfiguration?: ClusterInstanceConfigurationInfo
  resource: ElasticsearchResourceInfo
  kind: SliderInstanceType
}

interface DispatchProps {
  fetchDeployment: () => void
  startHeapDumpCapture: () => Promise<any>
  startInstance: () => Promise<any>
  startRouting: () => Promise<any>
  stopInstance: () => Promise<any>
  stopRouting: () => Promise<any>
}

const mapStateToProps = (
  state: ReduxState,
  { deployment, resource, kind, instance }: ConsumerProps,
): StateProps => {
  const isAdminConsole = getConfigForKey(state, `APP_NAME`) === `adminconsole`
  const hasEs = get(resource, [`info`, `elasticsearch`]) != null

  const diskQuotaOverride = hasEs && isFeatureActivated(state, Feature.diskQuotaOverride)

  const instanceCapacityOverride =
    hasEs && isFeatureActivated(state, Feature.instanceCapacityOverride)

  const deploymentId = deployment.id
  const refId = resource.ref_id
  const instanceId = instance.instance_name

  return {
    canCaptureHeapDumps:
      isPermitted(Permission.captureDeploymentInstanceHeapDump) && kind === 'elasticsearch',
    canMoveNode: isAdminConsole,
    disableNodeControlsIfPlanPending: isFeatureActivated(
      state,
      Feature.disableNodeControlsIfPlanPending,
    ),
    diskQuotaOverride,
    hasSudo: SAD_hasUnexpiredSudo(),
    instanceCapacityOverride,
    isAdminConsole,
    isSudoFeatureActivated: isFeatureActivated(state, Feature.sudo),
    startHeapDumpCaptureRequest: startHeapDumpCaptureRequest(
      state,
      deploymentId,
      refId,
      instanceId,
    ),
    type: kind === `elasticsearch` ? `node` : `instance`,
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment: { id: deploymentId }, kind, instance, resource }: ConsumerProps,
): DispatchProps => ({
  fetchDeployment: () => dispatch(fetchDeployment({ deploymentId })),
  startRouting: () =>
    dispatch(
      setStackDeploymentMaintenanceMode({
        instance,
        resource,
        kind,
        stackDeploymentId: deploymentId,
        action: `stop`,
      }),
    ),
  stopRouting: () =>
    dispatch(
      setStackDeploymentMaintenanceMode({
        instance,
        resource,
        kind,
        stackDeploymentId: deploymentId,
        action: `start`,
      }),
    ),
  startInstance: () =>
    dispatch(
      setStackDeploymentInstanceStatus({
        instance,
        resource,
        kind,
        stackDeploymentId: deploymentId,
        action: `start`,
      }),
    ),
  stopInstance: () =>
    dispatch(
      setStackDeploymentInstanceStatus({
        instance,
        resource,
        kind,
        stackDeploymentId: deploymentId,
        action: `stop`,
      }),
    ),
  startHeapDumpCapture: () =>
    dispatch(
      startHeapDumpCapture({
        deploymentId,
        resourceKind: kind,
        refId: resource.ref_id,
        instanceId: instance.instance_name,
      }),
    ).then(() => dispatch(push(heapDumpsUrl(deploymentId)))),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(NodeTileMenu)
