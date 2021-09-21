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

import { getVersionStacksUrl } from '../../lib/api/v1/urls'
import { Region } from '../../types'

import asyncRequest from '../asyncRequests'
import { FETCH_VERSIONS } from '../../constants/actions'

export function fetchVersions(
  region: Region | string,
  { showUnusable = true }: { showUnusable?: boolean } = {},
) {
  const regionId = typeof region === `string` ? region : region.id

  /* On the API side, `show_unusable` defaults to `false` to maintain backwards
   * compatibility. However, this is inconsistent with FETCH_VERSION, which
   * acts as if `show_unusable=true` were the default. For that reason, and because
   * we don't want to break BWC, we default to `show_unusable=true` on the
   * FETCH_VERSIONS action in the front-end, avoiding any potential issues that may
   * result from this inconsistency.
   *
   * Learn more:
   *   https://github.com/elastic/cloud/issues/35759
   *   https://github.com/elastic/cloud/pull/35769
   *   https://github.com/elastic/cloud/pull/35768
   *   https://github.com/elastic/cloud/pull/35774
   *   https://github.com/elastic/cloud/pull/36268
   */
  const url = getVersionStacksUrl({ regionId, showUnusable })

  return asyncRequest({
    type: FETCH_VERSIONS,
    url,
    meta: { regionId },
    crumbs: [regionId],
    abortIfInProgress: true,
  })
}
