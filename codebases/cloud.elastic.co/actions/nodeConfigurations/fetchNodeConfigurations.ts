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
import { FETCH_NODE_CONFIGURATIONS } from '../../constants/actions'

import { getConfigForKey } from '../../store'
import { NodeTypesApiResponse } from '../../types'

export function fetchNodeConfigurations(regionId) {
  const url =
    getConfigForKey(`APP_NAME`) === `userconsole`
      ? `/api/v1/regions/${regionId}/node_types/elasticsearch`
      : `/api/v0.1/regions/${regionId}/node_types/elasticsearch`

  return asyncRequest<NodeTypesApiResponse>({
    type: FETCH_NODE_CONFIGURATIONS,
    url,
    meta: { regionId, selfUrl: url },
    crumbs: [regionId],
    abortIfInProgress: true,
  })
}
