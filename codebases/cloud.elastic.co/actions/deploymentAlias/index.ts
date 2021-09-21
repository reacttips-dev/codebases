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
  GET_DEPLOYMENT_ALIAS_EDIT_ACCESS,
  UPDATE_DEPLOYMENT_ALIAS_EDIT_ACCESS,
  UPDATE_DEPLOYMENT_ALIAS,
} from '../../constants/actions'

import { StackDeployment } from '../../types'

import { createUpdateRequestFromGetResponse } from '../../lib/stackDeployments'

import {
  getConfigStoreOptionUrl,
  putConfigStoreOptionUrl,
  updateDeploymentUrl,
} from '../../lib/api/v1/urls'

export function updateDeploymentAlias({
  deployment,
  alias,
}: {
  deployment: StackDeployment
  alias: string
}) {
  const updatedDeploymentRequest = createUpdateRequestFromGetResponse({
    deployment,
  })

  const payload = {
    ...updatedDeploymentRequest,
    alias,
    prune_orphans: false,
  }

  return asyncRequest({
    crumbs: [deployment.id],
    type: UPDATE_DEPLOYMENT_ALIAS,
    method: `PUT`,
    url: updateDeploymentUrl({ deploymentId: deployment.id }),
    payload,
  })
}

export function fetchDeploymentAliasEditAccess({ regionId }: { regionId: string }) {
  return (dispatch) => {
    const option = `enable-deployment-alias`

    return dispatch(
      asyncRequest({
        crumbs: [regionId],
        type: GET_DEPLOYMENT_ALIAS_EDIT_ACCESS,
        method: `GET`,
        url: getConfigStoreOptionUrl({ configOptionId: option, regionId }),
        meta: {},
      }),
    )
  }
}

export function updateDeploymentAliasEditAccess({
  regionId,
  editAccess,
}: {
  regionId: string
  editAccess: boolean
}) {
  const option = `enable-deployment-alias`

  const payload: { value: string } = {
    value: editAccess.toString(),
  }

  return asyncRequest({
    crumbs: [regionId],
    type: UPDATE_DEPLOYMENT_ALIAS_EDIT_ACCESS,
    method: `PUT`,
    url: putConfigStoreOptionUrl({ configOptionId: option, regionId }),
    payload,
  })
}
