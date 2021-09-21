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

import { SET_SNAPSHOT_SETTINGS } from '../../constants/actions'
import { ElasticsearchCluster, SetSnapshotSettings } from '../../types'

export function setSnapshotSettings(cluster: ElasticsearchCluster, value: SetSnapshotSettings) {
  const { id: clusterId, regionId } = cluster

  return {
    type: SET_SNAPSHOT_SETTINGS,
    payload: value,
    meta: { clusterId, regionId },
  }
}
