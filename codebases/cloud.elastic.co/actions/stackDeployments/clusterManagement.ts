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

import { fetchDeployment } from './crud'

import {
  CANCEL_DEPLOYMENT_RESOURCE_PLAN,
  DELETE_DEPLOYMENT_RESOURCE,
  RESTART_DEPLOYMENT_ES_RESOURCE,
  RESTART_DEPLOYMENT_RESOURCE,
  RESTORE_DEPLOYMENT,
  SHUTDOWN_DEPLOYMENT,
  SHUTDOWN_DEPLOYMENT_RESOURCE,
  UPGRADE_DEPLOYMENT_RESOURCE,
} from '../../constants/actions'

import { addHiddenDeploymentToast, addTerminatedDeploymentToast } from '../../lib/toasts'

import redirectToDeploymentsPage from './redirectToDeploymentsPage'

import {
  cancelDeploymentResourcePendingPlanUrl,
  deleteDeploymentStatelessResourceUrl,
  restartDeploymentEsResourceUrl,
  restartDeploymentStatelessResourceUrl,
  restoreDeploymentUrl,
  shutdownDeploymentStatelessResourceUrl,
  shutdownDeploymentUrl,
  upgradeDeploymentStatelessResourceUrl,
} from '../../lib/api/v1/urls'

import { RestartStrategy, SliderInstanceType } from '../../types'

export const shutdownStackDeployment =
  ({
    deploymentId,
    hide,
    skipSnapshot,
    showAsDeleted,
  }: {
    deploymentId: string
    hide?: boolean
    skipSnapshot?: boolean
    showAsDeleted?: boolean
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: SHUTDOWN_DEPLOYMENT,
        method: `POST`,
        url: shutdownDeploymentUrl({ deploymentId, hide, skipSnapshot }),
        meta: { deploymentId },
        crumbs: [deploymentId],
      }),
    ).then(() => {
      if (hide && !showAsDeleted) {
        addHiddenDeploymentToast()
      } else {
        addTerminatedDeploymentToast()
      }

      return dispatch(fetchDeployment({ deploymentId })).then(() => {
        if (hide) {
          return dispatch(redirectToDeploymentsPage())
        }
      })
    })

export const restoreStackDeployment =
  ({ deploymentId, restoreSnapshot }: { deploymentId: string; restoreSnapshot?: boolean }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: RESTORE_DEPLOYMENT,
        method: `POST`,
        url: restoreDeploymentUrl({ deploymentId, restoreSnapshot }),
        meta: { deploymentId },
        crumbs: [deploymentId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const shutdownStackDeploymentResource =
  ({
    deploymentId,
    resourceType,
    resourceRefId,
    hide,
    skipSnapshot,
  }: {
    deploymentId: string
    resourceRefId: string
    resourceType: SliderInstanceType
    hide?: boolean
    skipSnapshot?: boolean
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: SHUTDOWN_DEPLOYMENT_RESOURCE,
        method: `POST`,
        url: shutdownDeploymentStatelessResourceUrl({
          deploymentId,
          statelessResourceKind: resourceType,
          refId: resourceRefId,
          hide,
          skipSnapshot,
        }),
        meta: { deploymentId, resourceType, resourceRefId },
        crumbs: [deploymentId, resourceType, resourceRefId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const restartStackDeploymentResource =
  ({
    deploymentId,
    resourceType,
    resourceRefId,
    cancelPending,
  }: {
    deploymentId: string
    resourceRefId: string
    resourceType: SliderInstanceType
    cancelPending?: boolean
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: RESTART_DEPLOYMENT_RESOURCE,
        method: `POST`,
        url: restartDeploymentStatelessResourceUrl({
          deploymentId,
          statelessResourceKind: resourceType,
          refId: resourceRefId,
          cancelPending,
        }),
        meta: { deploymentId, resourceType, resourceRefId },
        crumbs: [deploymentId, resourceType, resourceRefId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const restartStackDeploymentEsResource =
  ({
    deploymentId,
    resourceRefId,
    skipSnapshot,
    restoreSnapshot,
    cancelPending,
    groupAttribute,
  }: {
    deploymentId: string
    resourceRefId: string
    skipSnapshot?: boolean
    restoreSnapshot?: boolean
    cancelPending?: boolean
    groupAttribute?: RestartStrategy
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: RESTART_DEPLOYMENT_ES_RESOURCE,
        method: `POST`,
        url: restartDeploymentEsResourceUrl({
          deploymentId,
          refId: resourceRefId,
          skipSnapshot,
          restoreSnapshot,
          cancelPending,
          groupAttribute,
        }),
        meta: { deploymentId, resourceRefId },
        crumbs: [deploymentId, resourceRefId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const upgradeStackDeploymentResource =
  ({
    deploymentId,
    resourceRefId,
    resourceType,
    validateOnly,
  }: {
    deploymentId: string
    resourceRefId: string
    resourceType: SliderInstanceType
    validateOnly?: boolean
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPGRADE_DEPLOYMENT_RESOURCE,
        method: `POST`,
        url: upgradeDeploymentStatelessResourceUrl({
          deploymentId,
          statelessResourceKind: resourceType,
          refId: resourceRefId,
          validateOnly,
        }),
        meta: { deploymentId, resourceType, resourceRefId },
        crumbs: [deploymentId, resourceType, resourceRefId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const deleteStackDeploymentResource =
  ({
    deploymentId,
    resourceRefId,
    resourceType,
  }: {
    deploymentId: string
    resourceRefId: string
    resourceType: SliderInstanceType
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: DELETE_DEPLOYMENT_RESOURCE,
        method: `DELETE`,
        url: deleteDeploymentStatelessResourceUrl({
          deploymentId,
          statelessResourceKind: resourceType,
          refId: resourceRefId,
        }),
        meta: { deploymentId, resourceType, resourceRefId },
        crumbs: [deploymentId, resourceType, resourceRefId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const cancelDeploymentResourcePlan =
  ({
    deploymentId,
    resourceKind,
    resourceRefId,
  }: {
    deploymentId: string
    resourceKind: SliderInstanceType
    resourceRefId: string
  }) =>
  (dispatch) =>
    dispatch(
      asyncRequest({
        type: CANCEL_DEPLOYMENT_RESOURCE_PLAN,
        method: `DELETE`,
        url: cancelDeploymentResourcePendingPlanUrl({
          deploymentId,
          resourceKind,
          refId: resourceRefId,
        }),
        meta: { deploymentId, resourceKind, resourceRefId },
        crumbs: [deploymentId, resourceKind, resourceRefId],
      }),
    ).then(() => dispatch(fetchDeployment({ deploymentId })))

export const resetShutdownStackDeployment = (...crumbs: string[]) =>
  resetAsyncRequest(SHUTDOWN_DEPLOYMENT, crumbs)

export const resetShutdownStackDeploymentResource = (...crumbs: string[]) =>
  resetAsyncRequest(SHUTDOWN_DEPLOYMENT_RESOURCE, crumbs)

export const resetRestartStackDeploymentResource = (...crumbs: string[]) =>
  resetAsyncRequest(RESTART_DEPLOYMENT_RESOURCE, crumbs)

export const resetRestartStackDeploymentEsResource = (...crumbs: string[]) =>
  resetAsyncRequest(RESTART_DEPLOYMENT_ES_RESOURCE, crumbs)

export const resetCancelDeploymentResourcePlan = (...crumbs: string[]) =>
  resetAsyncRequest(CANCEL_DEPLOYMENT_RESOURCE_PLAN, crumbs)

export const resetUpgradeStackDeploymentResource = (...crumbs: string[]) =>
  resetAsyncRequest(UPGRADE_DEPLOYMENT_RESOURCE, crumbs)

export const resetDeleteStackDeploymentResource = (...crumbs: string[]) =>
  resetAsyncRequest(DELETE_DEPLOYMENT_RESOURCE, crumbs)

export const resetRestoreStackDeployment = (...crumbs: string[]) =>
  resetAsyncRequest(RESTORE_DEPLOYMENT, crumbs)
