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

import { getDeploymentEuiHealthColor } from './reduxTypeBasedDeploymentHealth'

import { EuiHealthColor } from './problems'

import { ApmCluster, Cluster, ElasticsearchCluster, KibanaCluster } from '../../types'

export function getClusterHealthColor(cluster: Cluster): EuiHealthColor {
  if (cluster.kind === `kibana`) {
    return getDeploymentEuiHealthColor({ kibanaCluster: cluster as unknown as KibanaCluster })
  }

  if (cluster.kind === `apm`) {
    return getDeploymentEuiHealthColor({ apmCluster: cluster as unknown as ApmCluster })
  }

  if (cluster.kind === `elasticsearch`) {
    return getDeploymentEuiHealthColor({ deployment: cluster as unknown as ElasticsearchCluster })
  }

  throw new Error(`Unexpected cluster object`)
}
