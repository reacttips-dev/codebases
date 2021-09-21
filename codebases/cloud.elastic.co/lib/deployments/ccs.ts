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

import { find, some } from 'lodash'

import { isFeatureActivated } from '../../store'

import Feature from '../feature'

import { RemoteMapping, StackDeployment } from '../../types'
import { DeploymentTemplateInfoV2, RemoteResourceRef } from '../api/v1/types'

export function isCcsFeatureActivated(): boolean {
  return isFeatureActivated(Feature.crossClusterSearch)
}

export function isCrossClusterSearch({
  deploymentTemplate,
  deploymentTemplateId,
  systemOwned,
}: {
  deploymentTemplate?: DeploymentTemplateInfoV2
  deploymentTemplateId?: string | null
  systemOwned: boolean
}): boolean {
  if (!isCcsFeatureActivated()) {
    return false
  }

  if (systemOwned) {
    return false
  }

  if (
    typeof deploymentTemplateId === `string` &&
    deploymentTemplateId.includes(`cross-cluster-search`)
  ) {
    return true
  }

  if (!deploymentTemplate) {
    return false
  }

  if (!deploymentTemplate.metadata) {
    return false
  }

  const isCcs = {
    key: `cross-cluster-search`,
    value: `true`,
  }

  return some(deploymentTemplate.metadata, isCcs)
}

export function toRemoteDeploymentList({
  remotes,
  ccsDeployments,
}: {
  remotes: RemoteResourceRef[]
  ccsDeployments: StackDeployment[]
}): RemoteMapping[] {
  return remotes.map((remote) => {
    const ccsDeployment = find(ccsDeployments, { id: remote.deployment_id })!

    return {
      remote,
      ccsDeployment,
    }
  })
}
