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

import asyncRequest from '../asyncRequests'
import { SET_MAINTENANCE_MODE } from '../../constants/actions'

import {
  startDeploymentResourceMaintenanceModeUrl,
  stopDeploymentResourceMaintenanceModeUrl,
} from '../../lib/api/v1/urls'

import { AnyResourceInfo, SliderInstanceType } from '../../types'
import { ClusterInstanceInfo } from '../../lib/api/v1/types'

type Props = {
  stackDeploymentId: string
  instance: ClusterInstanceInfo
  resource: AnyResourceInfo
  kind: SliderInstanceType
  action: 'start' | 'stop'
}

export function setStackDeploymentMaintenanceMode({
  stackDeploymentId,
  instance,
  resource,
  kind,
  action,
}: Props) {
  const { id: resourceId, region: regionId, ref_id } = resource
  const { instance_name } = instance
  const instanceIds = [instance_name]

  const params = {
    deploymentId: stackDeploymentId,
    resourceKind: kind,
    refId: ref_id,
    instanceIds,
  }

  const url =
    action === `start`
      ? startDeploymentResourceMaintenanceModeUrl(params)
      : stopDeploymentResourceMaintenanceModeUrl(params)

  return asyncRequest({
    type: SET_MAINTENANCE_MODE,
    url,
    method: `post`,
    meta: {
      action,
      stackDeploymentId,
      kind,
      regionId,
      resourceId,
      instanceIds: instance_name,
      clusterId: resourceId, // Temporary while getClusterId expects an ES payload
    },
    crumbs: [regionId, resourceId, instance_name],
  })
}
