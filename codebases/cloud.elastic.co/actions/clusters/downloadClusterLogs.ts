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

import moment from 'moment'
import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import { DOWNLOAD_CLUSTER_LOGS } from '../../constants/actions'
import { ElasticsearchId, RegionId } from '../../types'
import { generateEsClusterLogsUrl } from '../../lib/api/v1/urls'

export function downloadClusterLogs(
  regionId: RegionId,
  clusterId: ElasticsearchId,
  dateInput: Date,
) {
  if (!moment(dateInput).isValid()) {
    throw new Error(`Can't download logs due to invalid date.`)
  }

  const date = moment(dateInput).format(`YYYY-MM-DD`)
  const url = generateEsClusterLogsUrl({ regionId, clusterId, date })

  const headers = {
    Accept: `application/zip`,
  }

  return asyncRequest<string>({
    type: DOWNLOAD_CLUSTER_LOGS,
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

export const resetDownloadClusterLogsRequest = (...crumbs: string[]) =>
  resetAsyncRequest(DOWNLOAD_CLUSTER_LOGS, crumbs)
