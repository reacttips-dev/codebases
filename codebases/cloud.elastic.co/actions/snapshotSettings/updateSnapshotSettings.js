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

import { get } from 'lodash'

import asyncRequest from '../asyncRequests'
import { UPDATE_SNAPSHOT_SETTINGS } from '../../constants/actions'
import { updateEsClusterSnapshotSettingsUrl } from '../../lib/api/v1/urls'

export function updateSnapshotSettings(cluster, payload) {
  const { id: clusterId, regionId } = cluster
  const url = updateEsClusterSnapshotSettingsUrl({ clusterId, regionId })
  const interval = payload.interval === `default` ? `30min` : payload.interval
  const [, intervalValue, intervalUnit] = interval.match(/(\d*)(\w*)/)
  const snapshots = get(payload, [`retention`, `snapshots`], 100)
  const maxAge = `${intervalValue * snapshots}${intervalUnit}`

  const settings = asyncRequest({
    type: UPDATE_SNAPSHOT_SETTINGS,
    method: `PATCH`,
    payload: {
      ...payload,
      retention: {
        ...payload.retention,
        max_age: maxAge,
      },
    },
    url,
    meta: { clusterId, regionId },
    crumbs: [regionId, clusterId],
  })

  return settings
}
