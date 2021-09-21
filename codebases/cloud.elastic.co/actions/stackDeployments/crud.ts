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

import {
  CREATE_STACK_DEPLOYMENT,
  DELETE_STACK_DEPLOYMENT,
  CLEAR_STACK_DEPLOYMENT_CREATE_RESPONSE,
  FETCH_STACK_DEPLOYMENT,
  SEARCH_STACK_DEPLOYMENTS,
  UPDATE_STACK_DEPLOYMENT,
  UPDATE_STACK_DEPLOYMENT_DRY_RUN,
} from '../../constants/actions'

import redirectToDeploymentsPage from './redirectToDeploymentsPage'
import { redirectToStackDeploymentActivity } from '../clusters'

import { createOrganization } from '../organizations'

import { shouldCreateOrganization } from '../../lib/organizations'

import { addDeletedDeploymentToast } from '../../lib/toasts'

import { isFeatureActivated } from '../../selectors'

import Feature from '../../lib/feature'

import {
  createDeploymentUrl,
  deleteDeploymentUrl,
  getDeploymentUrl,
  searchDeploymentsUrl,
  updateDeploymentUrl,
} from '../../lib/api/v1/urls'

import {
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  SearchRequest,
} from '../../lib/api/v1/types'

import { ReduxState, UserProfile } from '../../types'

export function fetchDeployment({ deploymentId }: { deploymentId: string }) {
  return (dispatch, getState) => {
    const state = getState()

    const url = getDeploymentUrl(
      getDeploymentUrlParams({
        state,
        deploymentId,
      }),
    )

    return dispatch(
      asyncRequest({
        type: FETCH_STACK_DEPLOYMENT,
        method: `GET`,
        url,
        meta: { deploymentId },
        crumbs: [deploymentId],
      }),
    )
  }
}

function getDeploymentUrlParams({
  state,
  deploymentId,
  convertLegacyPlans = isFeatureActivated(state, Feature.convertLegacyPlans),
  enrichWithTemplate = true,
}: {
  state: ReduxState
  deploymentId: string
  convertLegacyPlans?: boolean
  enrichWithTemplate?: boolean
}): {
  deploymentId: string
  showSecurity?: boolean | null
  showMetadata?: boolean | null
  showPlans?: boolean | null
  showPlanLogs?: boolean | null
  showPlanHistory?: boolean | null
  showPlanDefaults?: boolean | null
  convertLegacyPlans?: boolean | null
  showSystemAlerts?: number | null
  showSettings?: boolean | null
  enrichWithTemplate?: boolean | null
} {
  return {
    deploymentId,
    showMetadata: true,
    showPlanDefaults: true,
    showPlanHistory: true,
    showPlanLogs: true,
    showSecurity: true,
    showSettings: true,

    // We don't separate alerts by type so 20 is a guess as to what will give us at least a few of each 99% of the time
    showSystemAlerts: 20,

    // When true:
    //   (1) Changes non-DNT plans to include e.g. master, ML node information with zero nodes
    //   (2) Changes DNT plans to include disabled instance types, by including them in the
    //       cluster topology with zero size. This makes it easy to later enable them.
    convertLegacyPlans,
    enrichWithTemplate,
  }
}

export function searchDeployments({ queryId, query }: { queryId: string; query: SearchRequest }) {
  const url = searchDeploymentsUrl()

  return asyncRequest({
    type: SEARCH_STACK_DEPLOYMENTS,
    method: `POST`,
    url,
    meta: { queryId },
    crumbs: [queryId],
    payload: query,
  })
}

export function createDeployment({
  deployment,
  profile,
}: {
  deployment: DeploymentCreateRequest
  profile?: UserProfile | null
}) {
  const url = createDeploymentUrl()

  return (dispatch) => {
    if (shouldCreateOrganization({ profile })) {
      return dispatch(createOrganization({})).then(() => dispatch(createDeploymentCall()))
    }

    return dispatch(createDeploymentCall())
  }

  function createDeploymentCall() {
    return asyncRequest({
      type: CREATE_STACK_DEPLOYMENT,
      method: `POST`,
      url,
      payload: deployment,
    })
  }
}

export function clearCreateDeploymentResponse({ deploymentId }: { deploymentId: string }) {
  return {
    type: CLEAR_STACK_DEPLOYMENT_CREATE_RESPONSE,
    meta: {
      deploymentId,
    },
  }
}

export function updateDeployment({
  deploymentId,
  deployment,
  redirect = true,
  dryRun = false,
}: {
  deploymentId: string
  deployment: DeploymentUpdateRequest
  redirect?: boolean
  dryRun?: boolean
}) {
  const url = updateDeploymentUrl({
    deploymentId,
    validateOnly: dryRun,
  })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: dryRun ? UPDATE_STACK_DEPLOYMENT_DRY_RUN : UPDATE_STACK_DEPLOYMENT,
        method: `PUT`,
        url,
        payload: deployment,
        meta: { deploymentId },
        crumbs: [deploymentId],
      }),
    ).then((actionResult) => {
      if (dryRun) {
        return actionResult
      }

      dispatch(clearCreateDeploymentResponse({ deploymentId })) // if the create request is still around, clean up to avoid amiguity

      const refetchAction = dispatch(fetchDeployment({ deploymentId }))

      if (!redirect) {
        return refetchAction
      }

      return dispatch(redirectToStackDeploymentActivity(deploymentId))
    })
}

export function deleteDeployment({ deploymentId }: { deploymentId: string }) {
  const url = deleteDeploymentUrl({
    deploymentId,
  })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: DELETE_STACK_DEPLOYMENT,
        method: `DELETE`,
        url,
        meta: { deploymentId },
        crumbs: [deploymentId],
      }),
    ).then(() => {
      addDeletedDeploymentToast()
      return dispatch(redirectToDeploymentsPage())
    })
}

export const resetCreateDeployment = (...crumbs: string[]) =>
  resetAsyncRequest(CREATE_STACK_DEPLOYMENT, crumbs)

export const resetFetchDeployment = (...crumbs: string[]) =>
  resetAsyncRequest(FETCH_STACK_DEPLOYMENT, crumbs)

export const resetUpdateDeployment = (...crumbs: string[]) =>
  resetAsyncRequest(UPDATE_STACK_DEPLOYMENT, crumbs)

export const resetUpdateDeploymentDryRun = (...crumbs: string[]) =>
  resetAsyncRequest(UPDATE_STACK_DEPLOYMENT_DRY_RUN, crumbs)
