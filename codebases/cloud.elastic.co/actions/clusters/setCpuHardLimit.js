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

import { fetchCluster } from './fetchCluster'
import saveClusterDataOfType from './saveClusterDataOfType'
import { getClusterMetadata } from '../../reducers/clusters'
import { SET_CPU_HARD_LIMIT } from '../../constants/actions'
import { replaceIn } from '../../lib/immutability-helpers'

const { save } = saveClusterDataOfType(SET_CPU_HARD_LIMIT)

export const setCpuHardLimit = (cluster, enabled) => (dispatch) =>
  dispatch(
    save(
      cluster,
      replaceIn(getClusterMetadata(cluster), [`resources`, `cpu`, `hard_limit`], enabled),
    ),
  ).then(() => dispatch(fetchCluster(cluster.regionId, cluster.id)))
