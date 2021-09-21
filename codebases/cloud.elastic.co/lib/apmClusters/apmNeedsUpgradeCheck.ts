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

// NOTE: Consult kibanaNeedsUpgradeCheck.js for additional comments as it is the basis for this file
import { compare, lt } from 'semver'

import { ApmCluster, ElasticsearchCluster } from '../../types'

export default function canUpgradeApm(apm: ApmCluster, deployment: ElasticsearchCluster) {
  if (apm.isStopped) {
    return false
  }

  const expectedMinVersion = getExpectedApmVersion(apm, deployment)

  if (expectedMinVersion == null) {
    // if we can't find a version for ES, then something is wrong (cluster stopped, or broken) so just abort
    return false
  }

  if (apm.plan.version != null) {
    return lt(apm.plan.version, expectedMinVersion)
  }

  // something is wrong. But we can try and find the version from the topology. This might be happening because for a while we were creating
  // apms with no version specified in the plan
  const instances = apm.instances.record

  if (instances == null) {
    return false
  }

  const instancesWithVersion = instances.filter((instance) => instance.version != null)

  if (instancesWithVersion.length === 0) {
    return false
  }

  const minApmInstance = instancesWithVersion.sort((a, b) => compare(a.version!, b.version!))[0]

  if (minApmInstance == null) {
    return false
  }

  const minApmVersion = minApmInstance.version

  if (deployment.plan.version == null || minApmVersion == null) {
    return false
  }

  return lt(minApmVersion, expectedMinVersion)
}

export function getExpectedApmVersion(apm: ApmCluster, deployment: ElasticsearchCluster) {
  if (deployment.plan.isPending || apm.plan.isPending) {
    return null
  }

  if (deployment.plan.version == null) {
    // if we can't find a version for ES, then something is wrong (cluster stopped, or broken) so just abort
    return null
  }

  return deployment.plan.version
}
