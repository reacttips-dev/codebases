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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { SET_MONITORING_DEPLOYMENT, STOP_MONITORING_DEPLOYMENT } from '../../constants/actions'
import { updateDeploymentUrl } from '../../lib/api/v1/urls'
import { DeploymentUpdateRequest } from '../../lib/api/v1/types'
import {
  getCancelMonitoringPayload,
  updateMonitoringPayload,
  getFirstRefId,
} from '../../lib/stackDeployments'
import { StackDeployment, ThunkAction } from '../../types'
import { fetchDeployment } from './crud'

export function setDeploymentMonitoring({
  deploymentFrom,
  deploymentTo,
  logsMonitoring,
  metricsMonitoring,
}: {
  deploymentFrom: StackDeployment
  deploymentTo: StackDeployment
  logsMonitoring: boolean
  metricsMonitoring: boolean
}): ThunkAction {
  const deploymentId = deploymentFrom.id

  if (!deploymentId) {
    throw new Error(`Expected deploymentFrom.id for deployment to send logs and metrics`)
  }

  const monitoringDeploymentId = deploymentTo.id

  if (!monitoringDeploymentId) {
    throw new Error(`Expected deploymentTo.id for deployment to send logs and metrics`)
  }

  const hidePrunedOrphans = false

  const url = updateDeploymentUrl({
    deploymentId,
    hidePrunedOrphans,
  })

  const refId = getFirstRefId({ deployment: deploymentTo, sliderInstanceType: `elasticsearch` })

  const payload: DeploymentUpdateRequest = updateMonitoringPayload({
    monitoringDeploymentId,
    refId,
    logsMonitoring,
    metricsMonitoring,
    hidePrunedOrphans,
  })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: SET_MONITORING_DEPLOYMENT,
        url,
        method: `PUT`,
        meta: {
          deploymentId,
        },
        crumbs: [deploymentId],
        payload,
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))
}

export function resetStopDeploymentMonitoringRequest(deploymentId: string) {
  resetAsyncRequest(STOP_MONITORING_DEPLOYMENT, [deploymentId])
}

export function resetSetDeploymentMonitoringRequest(deploymentId: string) {
  resetAsyncRequest(SET_MONITORING_DEPLOYMENT, [deploymentId])
}

export function stopDeploymentMonitoring(deploymentId: string) {
  const hidePrunedOrphans = false
  const url = updateDeploymentUrl({ deploymentId, hidePrunedOrphans })

  const payload: DeploymentUpdateRequest = getCancelMonitoringPayload({ hidePrunedOrphans })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: STOP_MONITORING_DEPLOYMENT,
        url,
        method: `PUT`,
        meta: { deploymentId },
        crumbs: [deploymentId],
        payload,
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))
}
