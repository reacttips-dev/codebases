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

import {
  GET_APP_SEARCH_READ_ONLY_MODE,
  SET_APP_SEARCH_READ_ONLY_MODE,
} from '../../constants/actions'

import { getAppsearchReadOnlyModeUrl, setAppsearchReadOnlyModeUrl } from '../../lib/api/v1/urls'
import { getFirstSliderClusterFromGet } from '../../lib/stackDeployments'

import { StackDeployment } from '../../types'
import { ReadOnlyRequest, AppSearchResourceInfo } from '../../lib/api/v1/types'

type GetAppSearchReadOnlyModeProps = {
  deployment: StackDeployment
}
type SetAppSearchReadOnlyModeProps = ReadOnlyRequest & {
  deployment: StackDeployment
}

export function fetchAppSearchReadOnlyMode({ deployment }: GetAppSearchReadOnlyModeProps) {
  return (dispatch) => {
    const urlParams = getUrlParams({ deployment })

    if (!urlParams) {
      return Promise.resolve()
    }

    const url = getAppsearchReadOnlyModeUrl(urlParams)

    return dispatch(
      asyncRequest({
        type: GET_APP_SEARCH_READ_ONLY_MODE,
        method: `get`,
        url,
        meta: { deploymentId: deployment.id },
        crumbs: [deployment.id],
      }),
    )
  }
}

export function setAppSearchReadOnlyMode({ deployment, enabled }: SetAppSearchReadOnlyModeProps) {
  return (dispatch) => {
    const urlParams = getUrlParams({ deployment })

    if (!urlParams) {
      return Promise.resolve()
    }

    const url = setAppsearchReadOnlyModeUrl(urlParams)

    const payload: ReadOnlyRequest = {
      enabled,
    }

    return dispatch(
      asyncRequest({
        type: SET_APP_SEARCH_READ_ONLY_MODE,
        method: `put`,
        url,
        payload,
        meta: { deploymentId: deployment.id },
        crumbs: [deployment.id],
      }),
    )
  }
}

function getUrlParams({ deployment }: { deployment: StackDeployment }) {
  const deploymentId = deployment.id

  const appSearchCluster = getFirstSliderClusterFromGet<AppSearchResourceInfo>({
    deployment,
    sliderInstanceType: `appsearch`,
  })

  if (!appSearchCluster) {
    return null
  }

  return {
    deploymentId,
    refId: appSearchCluster.ref_id,
    regionId: appSearchCluster.region,
  }
}
