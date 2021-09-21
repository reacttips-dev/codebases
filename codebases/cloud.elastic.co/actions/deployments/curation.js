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
import { UPDATE_CURATION_INDEX_PATTERNS } from '../../constants/actions'
import { updateEsClusterCurationSettingsUrl } from '../../lib/api/v1/urls'

export function updateIndexPatterns({ regionId, deploymentId, indexPatterns }) {
  const url = updateEsClusterCurationSettingsUrl({
    regionId,
    clusterId: deploymentId,
  })

  const payload = { specs: indexPatterns }

  return asyncRequest({
    type: UPDATE_CURATION_INDEX_PATTERNS,
    method: `PUT`,
    url,
    payload,
    meta: { regionId, deploymentId, clusterId: deploymentId },
    crumbs: [regionId, deploymentId],
  })
}

export const resetUpdateIndexPatternsRequest = (...crumbs) =>
  resetAsyncRequest(UPDATE_CURATION_INDEX_PATTERNS, crumbs)
