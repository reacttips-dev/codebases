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

import { getVersionStackUrl } from '../../lib/api/v1/urls'
import { Region } from '../../types'

import asyncRequest from '../asyncRequests'
import { FETCH_VERSION } from '../../constants/actions'

export function fetchVersion(version: string, region: Region | string) {
  const regionId = typeof region === `string` ? region : region.id

  const url = getVersionStackUrl({ version, regionId })

  return asyncRequest({
    type: FETCH_VERSION,
    url,
    meta: { regionId, version },
    crumbs: [regionId, version],
  })
}
