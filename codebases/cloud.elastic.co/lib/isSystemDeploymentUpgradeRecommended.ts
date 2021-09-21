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

import { lt } from 'semver'

import { getConfigForKey } from '../store'
import { ElasticsearchCluster } from '../types'

export function getRecommendedVersion() {
  return getConfigForKey(`RECOMMENDED_MINIMUM_SYSTEM_DEPLOYMENT_VERSION`)
}

export default function isSystemDeploymentUpgradeRecommended(
  deployment: ElasticsearchCluster,
): boolean {
  const recommendedMinimumVersion = getRecommendedVersion()

  if (recommendedMinimumVersion == null) {
    return false
  }

  if (deployment.isSystemOwned !== true) {
    return false
  }

  if (deployment.plan == null || deployment.plan.version == null) {
    return false
  }

  return lt(deployment.plan.version, recommendedMinimumVersion)
}
