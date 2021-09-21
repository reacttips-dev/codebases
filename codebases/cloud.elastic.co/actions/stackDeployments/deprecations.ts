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

import { FETCH_DEPRECATIONS } from '../../constants/actions'

import asyncRequest from '../asyncRequests'

import { getEsProxyRequestsUrl } from '../../lib/api/v1/urls'

export function fetchDeprecations({
  version,
  regionId,
  clusterId,
}: {
  version: string
  regionId: string
  clusterId: string
}) {
  const url = getEsProxyRequestsUrl({
    clusterId,
    regionId,
    elasticsearchPath: `_xpack/migration/deprecations`,
  })

  return asyncRequest({
    type: FETCH_DEPRECATIONS,
    url,
    meta: { regionId, clusterId, version },
    crumbs: [regionId, clusterId],
    requestSettings: {
      request: {
        headers: {
          'X-Management-Request': true,
        },
      },
    },
  })
}
