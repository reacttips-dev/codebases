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

import { getFirstEsClusterFromGet } from './fundamentals'

import { AnyResourceInfo } from '../../../types'

import { ClusterMetadataInfo, DeploymentResources, DeploymentMetadata } from '../../api/v1/types'

export function getRawMetadataBag({ resource }: { resource: AnyResourceInfo }) {
  if (!resource.info.metadata) {
    return null
  }

  const metadataBag = resource.info.metadata.raw as any

  return metadataBag
}

export function isLocked({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const { resources } = deployment
  const [esResource] = resources.elasticsearch
  return Boolean(esResource.info.locked)
}

export function isHidden({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
    metadata?: DeploymentMetadata
  }
}): boolean {
  const { metadata, resources } = deployment

  if (!metadata) {
    return false
  }

  const hiddenTopLevel = metadata.hidden === true

  if (hiddenTopLevel) {
    return true
  }

  const [esResource] = resources.elasticsearch

  if (!esResource) {
    return false
  }

  return isHiddenResource({ resource: esResource })
}

export function isHiddenResource({ resource }: { resource: AnyResourceInfo }): boolean {
  const esSettings = resource.info.settings

  if (!esSettings) {
    return false
  }

  return (esSettings.metadata && esSettings.metadata.hidden) || false
}

export function getHiddenTimestamp({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  const { resources } = deployment
  const [esResource] = resources.elasticsearch

  if (!esResource) {
    return null
  }

  const metadataBag = getRawMetadataBag({ resource: esResource })

  if (!metadataBag) {
    return null
  }

  return metadataBag.hidden_timestamp
}

export function getSubscriptionLevel({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): string | null {
  const esCluster = getFirstEsClusterFromGet({ deployment })

  return (
    (esCluster &&
      esCluster.info.settings &&
      esCluster.info.settings.metadata &&
      esCluster.info.settings.metadata.subscription_level) ||
    null
  )
}

export function isPremium({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): boolean {
  const level = getSubscriptionLevel({ deployment })
  return typeof level === `string` && level !== `standard`
}

export function isSystemOwned({
  deployment,
}: {
  deployment: {
    metadata?: DeploymentMetadata
  }
}): boolean {
  if (!deployment.metadata) {
    return false
  }

  const systemOwned = deployment.metadata.system_owned

  return systemOwned || false
}

export function getOwnerId({
  deployment,
}: {
  deployment: {
    metadata?: DeploymentMetadata
  }
}): string | null {
  if (!deployment.metadata) {
    return null
  }

  const ownerId = deployment.metadata.owner_id

  return ownerId || null
}

export function getOrganizationId({
  deployment,
}: {
  deployment: {
    metadata?: DeploymentMetadata
  }
}): string | null {
  if (!deployment.metadata) {
    return null
  }

  const organizationId = deployment.metadata.organization_id

  return organizationId || null
}

export function getClusterMetadata({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): ClusterMetadataInfo | null {
  const elasticsearch = getFirstEsClusterFromGet({ deployment })

  if (!elasticsearch) {
    return null
  }

  return elasticsearch.info.metadata
}

export function getDeploymentTags({
  deployment,
}: {
  deployment: {
    metadata?: DeploymentMetadata
  }
}): Array<{ key: string; value: string }> | null {
  if (!deployment.metadata) {
    return null
  }

  return deployment.metadata.tags || null
}
