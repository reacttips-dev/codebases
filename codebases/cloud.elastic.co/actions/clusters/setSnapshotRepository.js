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

import saveClusterDataOfType from './saveClusterDataOfType'
import { getClusterMetadata } from '../../reducers/clusters'
import { SET_SNAPSHOT_REPOSITORY } from '../../constants/actions'

const { save, reset } = saveClusterDataOfType(SET_SNAPSHOT_REPOSITORY)

export const setSnapshotRepository = (cluster, repositoryId) => {
  const metadata = getClusterMetadata(cluster)
  const slm = Boolean(metadata.snapshot?.slm)

  return save(cluster, {
    ...metadata,
    snapshot: {
      repository: {
        config: {
          snapshot_config_type: `reference`,
          repository_id: repositoryId,
        },
      },
      enabled: true,
      slm,
    },
  })
}

export { reset as resetSetSnapshotRepositoryRequest }
