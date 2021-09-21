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

import { getEsSettingsFromTemplate } from './deploymentTemplates'

import { gte, lt } from '../../semver'

import {
  DeploymentCreateRequest,
  ElasticsearchMasterInfo,
  ElasticsearchResourceInfo,
  ClusterInstanceInfo,
} from '../../api/v1/types'

export function getMasterInfo({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): ElasticsearchMasterInfo | null {
  if (!resource) {
    return null
  }

  const masterInfo = resource.info.elasticsearch.master_info

  return masterInfo
}

export function hasHealthyMasters({ resource }: { resource: ElasticsearchResourceInfo }): boolean {
  const masterInfo = getMasterInfo({ resource })

  if (!masterInfo) {
    return false
  }

  return masterInfo.healthy
}

export function getMasterCount({ resource }: { resource: ElasticsearchResourceInfo }): number {
  const masterInfo = getMasterInfo({ resource })

  if (!masterInfo) {
    return 0
  }

  return masterInfo.masters.filter((entry) => entry.master_node_id !== `null`).length
}

export function getInstancesWithNoMaster({
  resource,
}: {
  resource: ElasticsearchResourceInfo
}): string[] {
  const masterInfo = getMasterInfo({ resource })

  if (!masterInfo) {
    return []
  }

  return masterInfo.instances_with_no_master
}

export function getDedicatedMasterThreshold({
  cluster,
}: {
  cluster: ElasticsearchResourceInfo
}): number {
  const { settings } = cluster.info

  if (!settings) {
    return 0
  }

  if (!settings.dedicated_masters_threshold) {
    return 0
  }

  return settings.dedicated_masters_threshold
}

export function getDedicatedMasterThresholdFromTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate?: DeploymentCreateRequest
}): number {
  const settings = getEsSettingsFromTemplate({
    deploymentTemplate,
  })

  if (!settings) {
    return 0
  }

  if (!settings.dedicated_masters_threshold) {
    return 0
  }

  return settings.dedicated_masters_threshold
}

export function isMasterEligible({
  isMasterType,
  isTieBreaker,
  version,
}: {
  isMasterType: boolean
  isTieBreaker: boolean
  version: string | undefined
}): boolean {
  if (!isMasterType) {
    return false
  }

  if (isTieBreaker && version) {
    return lt(version, `7.3.0`)
  }

  return true
}

export function isMasterVoting({
  isMasterType,
  isTieBreaker,
  version,
}: {
  isMasterType: boolean
  isTieBreaker: boolean
  version: string | undefined
}): boolean {
  // if !isTieBreaker, masterVoting will be false
  // if no version, assume false.
  if (isTieBreaker && version) {
    return isMasterType && gte(version, `7.3.0`)
  }

  return false
}

export function isTiebreaker({ instance }: { instance: ClusterInstanceInfo }): boolean {
  return instance.instance_name.includes(`Tiebreaker`)
}
