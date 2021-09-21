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

import { flatMap, last, uniq } from 'lodash'
import { compare, lt, sort } from 'semver'

import { shouldUpgradeKibanaVersion } from './upgradesToKibana'
import {
  isStopped,
  getVersion,
  getFirstSliderClusterFromGet,
  hasOngoingConfigurationChange,
} from './selectors'
import { getSupportedSliderInstanceTypes } from '../sliders'

import { SliderInstanceType, AnyResourceInfo, VersionNumber } from '../../types'
import { DeploymentResources } from '../api/v1/types'

export function shouldUpgradeSliderVersion({
  deployment,
  sliderInstanceType,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
}): boolean {
  // Still use shouldUpgradeKibanaVersion for
  // Kibana, as it has special upgrade rules.
  if (sliderInstanceType === `kibana`) {
    return shouldUpgradeKibanaVersion({ deployment })
  }

  const { resources } = deployment
  const sliderResources = resources[sliderInstanceType]

  if (!sliderResources) {
    return false
  }

  const [sliderResource] = sliderResources

  if (!sliderResource) {
    return false
  }

  if (isStopped({ resource: sliderResource })) {
    return false
  }

  const expectedVersion = getExpectedSliderVersion({ deployment })

  if (expectedVersion === null) {
    return false
  }

  const sliderVersion = getSliderVersion({ deployment, sliderInstanceType })

  if (sliderVersion === null) {
    return false
  }

  return lt(sliderVersion, expectedVersion)
}

export function getSliderVersion({
  deployment,
  sliderInstanceType,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
}): string | null {
  const { resources } = deployment
  const sliderResources: AnyResourceInfo[] = resources[sliderInstanceType]

  if (!sliderResources) {
    return null
  }

  const [sliderResource] = sliderResources

  if (!sliderResource) {
    return null
  }

  // There might some cases where we have multiple topology elements for a Kibana (eg multiple zones or a failed plan). Most likely the versions
  // would be the same, but in the extremely rare case of different versions, we pick the lower version because it's more likely
  // that the lower version is the one that is actually "correct". Imagine a Kibana upgrade that failed, there will be a new node with the new
  // version, and an old node with the old version. But since the upgrade failed, the plan version would still be the old one.

  const [minSliderVersion] = getSliderInstanceVersions({
    resource: sliderResource,
    sliderInstanceType,
  })

  if (!minSliderVersion) {
    return null
  }

  return minSliderVersion
}

// While it's very rare that we have instances with different versions,
// we still need to check for this when we're upgrading a deployment.
export function getSliderInstanceVersions({
  resource,
  sliderInstanceType,
}: {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
}): Array<string | null> {
  const planInfo = resource.info.plan_info.current
  let planVersion: string | null = null

  if (
    planInfo &&
    planInfo.plan &&
    planInfo.plan[sliderInstanceType] &&
    planInfo.plan[sliderInstanceType].version
  ) {
    planVersion = planInfo.plan[sliderInstanceType].version as string
  }

  const liveInstances = resource.info.topology.instances

  return (
    liveInstances
      // Fall back to version on the plan if a service_version doesn't exist
      .map(({ service_version }) => service_version || planVersion)
      // Filter out cases where neither exist
      .filter((version) => Boolean(version))
      // @ts-ignore we already get rid of all instances with no version
      .sort((a, b) => compare(a, b))
  )
}

export function getExpectedSliderVersion({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  if (hasOngoingConfigurationChange({ deployment })) {
    return null
  }

  const highestVersion = getHighestSliderVersion({ deployment })

  return highestVersion || null
}

export function getLowestSliderVersion({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | undefined {
  return getAllSliderInstanceVersions({ deployment })[0]
}

export function getHighestSliderVersion({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | undefined {
  return last(getAllSliderInstanceVersions({ deployment }))
}

export function hasMismatchingVersions({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const version = getVersion({ deployment })

  // 2.x ES versions come packaged with a 4.x Kibana install
  // so this is a valid case for those deployments.
  if (version && lt(version, `3.0.0`)) {
    return false
  }

  const isPending = hasOngoingConfigurationChange({ deployment })

  if (isPending) {
    return false
  }

  return uniq(getAllSliderInstanceVersions({ deployment })).length > 1
}

export function getSliderInstancesTypeRequiringUpgrade({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): SliderInstanceType[] {
  return getSupportedSliderInstanceTypes().filter((sliderInstanceType) =>
    shouldUpgradeSliderVersion({ deployment, sliderInstanceType }),
  )
}

function getAllSliderInstanceVersions({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): VersionNumber[] {
  const { resources } = deployment

  if (!resources) {
    return [] // sanity
  }

  const versions = flatMap(getSupportedSliderInstanceTypes(), (sliderInstanceType) => {
    const resource = getFirstSliderClusterFromGet({ deployment, sliderInstanceType })

    if (!resource) {
      return []
    }

    return getSliderInstanceVersions({ resource, sliderInstanceType })
  }).filter(Boolean) as VersionNumber[]

  return sort(versions)
}
