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

// NOTE: Deliberately not using our implementation of semver which removes prerelease attributes, because in this one special case
// we do actually care about the prerelease. If Kibana is on 6.3.2-beta.1, then it should be allowed to be upgraded to 6.3.2

import { compare, lt } from 'semver'

import { ElasticsearchCluster, KibanaCluster } from '../types'

export default function canUpgradeKibana(
  kibana: KibanaCluster,
  deployment: ElasticsearchCluster,
): boolean {
  if (kibana.isStopped) {
    return false
  }

  return !upgradeKibanaMessage(kibana, deployment)
}

type KibanaUpgradeMessage =
  | false
  | 'planIsPending'
  | 'missingDeploymentVersion'
  | 'versionIsUpToDate'

export function upgradeKibanaMessage(
  kibana: KibanaCluster,
  deployment: ElasticsearchCluster,
): KibanaUpgradeMessage {
  if (deployment.plan.isPending || kibana.plan.isPending) {
    return `planIsPending`
  }

  if (deployment.plan.version == null) {
    // if we can't find a version for ES, then something is wrong (cluster stopped, or broken) so just abort
    return `missingDeploymentVersion`
  }

  if (kibana.plan.version == null) {
    // if we can't find a version for Kibana, we assume it's the deployment version if we can't find the it from the topology
    const instances = kibana.instances.record || []
    const instancesWithVersion = instances.filter((instance) => instance.version != null)
    const minKibanaInstance = instancesWithVersion.sort((a, b) =>
      compare(a.version!, b.version!),
    )[0]
    const minKibanaVersion = minKibanaInstance?.version

    if (minKibanaVersion == null) {
      return `versionIsUpToDate`
    }

    return lt(minKibanaVersion, deployment.plan.version) ? false : `versionIsUpToDate`
  }

  return lt(kibana.plan.version, deployment.plan.version) ? false : `versionIsUpToDate`
}

export function getExpectedKibanaVersion(kibana: KibanaCluster, deployment: ElasticsearchCluster) {
  if (deployment.plan.isPending || kibana.plan.isPending) {
    return null
  }

  if (deployment.plan.version == null) {
    // if we can't find a version for ES, then something is wrong (cluster stopped, or broken) so just abort
    return null
  }

  return deployment.plan.version
}
