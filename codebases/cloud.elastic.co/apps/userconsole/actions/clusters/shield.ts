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

import asyncRequest from '../../../../actions/asyncRequests'
import { SAVE_SHIELD_CONFIG } from '../../constants/actions'
import { ElasticsearchCluster } from '../../../../types'

interface ShieldConfig {
  users: string
  users_roles: string
  roles: string
}

export function saveShieldConfig(cluster: ElasticsearchCluster, securityConfig: ShieldConfig) {
  const { regionId, id: clusterId } = cluster
  const url = `api/v0/clusters/${regionId}/${clusterId}/_shield`

  return asyncRequest({
    type: SAVE_SHIELD_CONFIG,
    method: `PUT`,
    url,
    meta: { regionId, clusterId },
    crumbs: [regionId, clusterId],
    payload: securityConfig,
  })
}
