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

import { gte } from 'semver'

import { isStopped, getVersion, getKibanaVersion, hasOngoingConfigurationChange } from './selectors'

import { DeploymentResources } from '../api/v1/types'

type KibanaUpgradeState =
  | 'safeToUpgrade'
  | 'planIsPending'
  | 'missingDeploymentVersion'
  | 'versionIsUpToDate'

export function shouldUpgradeKibanaVersion({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const { resources } = deployment
  const [kibanaResource] = resources.kibana

  if (!kibanaResource) {
    return false
  }

  if (isStopped({ resource: kibanaResource })) {
    return false
  }

  const state = getKibanaUpgradeState({ deployment })

  return state === `safeToUpgrade`
}

export function getKibanaUpgradeState({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): KibanaUpgradeState {
  if (hasOngoingConfigurationChange({ deployment })) {
    return `planIsPending`
  }

  const esVersion = getVersion({ deployment })

  if (!esVersion) {
    // if we can't find a version for ES, then something is wrong (cluster stopped, or broken) so just abort
    return `missingDeploymentVersion`
  }

  const kibanaVersion = getKibanaVersion({ deployment })

  // if we can't find a version for Kibana, we assume it's the deployment version
  if (!kibanaVersion || gte(kibanaVersion, esVersion)) {
    return `versionIsUpToDate`
  }

  return `safeToUpgrade`
}
