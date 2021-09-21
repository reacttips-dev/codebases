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

import DiskQuotaOverrideModal from './DiskQuotaOverrideModal'

import { resetSetDiskQuotaRequest } from '../../../../actions/clusters'
import { setStackDeploymentDiskQuota } from '../../../../actions/stackDeployments'

import { setDiskQuotaRequest } from '../../../../reducers'

import { getInstanceNames } from '../../../../lib/stackDeployments'

import {
  AnyResourceInfo,
  AsyncRequestState,
  StackDeployment,
  ThunkDispatch,
} from '../../../../types'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

type StateProps = {
  canApplyToAll: boolean
  setDiskQuotaRequest: AsyncRequestState
}

type DispatchProps = {
  setDiskQuota: (args: {
    diskQuota: number | null
    defaultDiskQuota: number
    previousDiskQuota: number
    applyToAll: boolean
  }) => Promise<any>
  resetSetDiskQuotaRequest: () => void
}

type ConsumerProps = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  instance: ClusterInstanceInfo
}

const mapStateToProps = (state: any, { instance, resource }: ConsumerProps): StateProps => {
  const instanceNames = getInstanceNames({ instance, resource, applyToAll: true })
  const canApplyToAll = size(instanceNames) > 1

  return {
    canApplyToAll,
    setDiskQuotaRequest: setDiskQuotaRequest(state, resource.region, resource.id),
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment, instance, resource }: ConsumerProps,
): DispatchProps => ({
  setDiskQuota: ({ diskQuota, previousDiskQuota, defaultDiskQuota, applyToAll }) =>
    dispatch(
      setStackDeploymentDiskQuota({
        deployment,
        resource,
        instanceIds: getInstanceNames({ instance, resource, applyToAll }),
        diskQuota,
        previousDiskQuota,
        defaultDiskQuota,
      }),
    ),
  resetSetDiskQuotaRequest: () => dispatch(resetSetDiskQuotaRequest(resource.region, resource.id)),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(DiskQuotaOverrideModal)
