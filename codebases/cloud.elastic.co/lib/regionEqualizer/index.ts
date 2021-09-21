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

import { flatMap, sortBy } from 'lodash'

import { PlatformInfo, Provider } from '../../lib/api/v1/types'

export function getRegionIds({
  error,
  payload,
}: {
  error?: Error
  payload: PlatformInfo | Provider[]
}): string[] {
  if (error || !payload) {
    return []
  }

  if (!Array.isArray(payload)) {
    const regionIds = payload.regions.map((region) => region.region_id)

    return sortBy(regionIds)
  }

  const regions = flatMap(payload, (provider) => provider.regions)
  const regionIds = regions.map((region) => region.identifier)

  return sortBy(regionIds)
}
