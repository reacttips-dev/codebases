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

import { DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE } from '../../constants/actions'
import { ElasticsearchId, RegionId } from '../../types'
import { generateEsClusterDiagnosticsUrl } from '../../lib/api/v1/urls'

export function downloadClusterDiagnosticBundle(regionId: RegionId, clusterId: ElasticsearchId) {
  const url = generateEsClusterDiagnosticsUrl({ regionId, clusterId })

  const headers = {
    Accept: `application/zip`,
  }

  return asyncRequest<string>({
    type: DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE,
    url,
    requestSettings: {
      binary: true,
      request: {
        headers,
      },
    },
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
  })
}

export const resetDownloadClusterDiagnosticBundleRequest = (...crumbs: string[]) =>
  resetAsyncRequest(DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE, crumbs)
