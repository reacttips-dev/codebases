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

import { ENABLE_CROSS_CLUSTER_REPLICATION } from '../../constants/actions'

import { enableDeploymentResourceCcrUrl } from '../../lib/api/v1/urls'

type EnableCrossClusterReplicationParams = {
  deploymentId: string
  refId: string
}

export function enableCrossClusterReplication({
  deploymentId,
  refId,
}: EnableCrossClusterReplicationParams) {
  const url = enableDeploymentResourceCcrUrl({
    deploymentId,
    refId,
  })

  return asyncRequest({
    type: ENABLE_CROSS_CLUSTER_REPLICATION,
    method: `POST`,
    url,
    meta: { deploymentId, refId },
    crumbs: [deploymentId, refId],
  })
}

export const resetUpdateCcsSettingsRequest = (...crumbs) =>
  resetAsyncRequest(ENABLE_CROSS_CLUSTER_REPLICATION, crumbs)
