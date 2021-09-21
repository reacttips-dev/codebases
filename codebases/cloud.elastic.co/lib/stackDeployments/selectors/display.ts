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
import { find, get, size, some } from 'lodash'

import { getPlanInfo } from './fundamentals'
import { isMasterEligible, isMasterVoting, isTiebreaker } from './masters'
import { getNodeRoles, getNodeRolesFromInstance, sanitizeNodeRolesForDisplay } from './nodeRoles'

import {
  ElasticsearchClusterTopologyElement,
  ElasticsearchResourceInfo,
  ClusterInstanceInfo,
} from '../../api/v1/types'
import { InstanceSummary, StackDeployment, AnyResourceInfo } from '../../../types'

const DISPLAY_ID_LENGTH = 7

export function getDisplayName({ deployment }: { deployment: StackDeployment }): string {
  if (deployment.name === deployment.id) {
    return getDisplayId({ deployment })
  }

  if (deployment.name.trim()) {
    return deployment.name.trim()
  }

  return getDisplayId({ deployment })
}

export function getDisplayId({ deployment }: { deployment: StackDeployment }): string {
  return deployment.id.slice(0, DISPLAY_ID_LENGTH)
}

export const getEsTypeDisplayNames = ({ instance, kind, resource }: InstanceSummary): string[] => {
  const esNodeTypes = getEsNodeTypesForDisplay({ instance, resource })

  if (size(esNodeTypes) === 0) {
    return []
  }

  // Get helper variables
  const esResource = kind === `elasticsearch` ? (resource as ElasticsearchResourceInfo) : null
  const isMaster =
    esResource &&
    some(
      esResource.info.elasticsearch.master_info.masters,
      (master) => master.master_instance_name === instance.instance_name,
    )

  const version = instance.service_version!
  const isTieBreaker = isTiebreaker({ instance })

  // Get names
  const esTypeDisplayNames = sanitizeNodeRolesForDisplay(esNodeTypes).map((esNodeType) => {
    const isMasterType = esNodeType === `master`

    const masterEligible = isMasterEligible({ isMasterType, isTieBreaker, version })
    const masterVoting = isMasterVoting({ isMasterType, isTieBreaker, version })
    const masterElected = isMasterType && isMaster

    return getEsTypeDisplayName({
      masterElected,
      masterEligible,
      masterVoting,
      esNodeType,
    })
  })

  return esTypeDisplayNames
}

const getEsTypeDisplayName = ({
  masterElected,
  masterEligible,
  masterVoting,
  esNodeType,
}: {
  masterElected: boolean | null
  masterEligible: boolean
  masterVoting: boolean
  esNodeType: string
}) => {
  // Master elected first, as masterElected and masterEligible may both be true
  if (masterElected) {
    return `master`
  }

  if (masterEligible) {
    return `master eligible`
  }

  if (masterVoting) {
    return `master voting`
  }

  return esNodeType
}

const getEsNodeTypesForDisplay = ({
  instance,
  resource,
}: {
  instance: ClusterInstanceInfo
  resource: AnyResourceInfo
}): string[] => {
  let esNodeTypes: string[] = []

  if (Array.isArray(instance.node_roles)) {
    // If the instance has node roles use those directly
    esNodeTypes = getNodeRolesFromInstance({ instance })
  } else {
    // Otherwise fall back to matching via instance config
    const instanceConfiguration = instance.instance_configuration
    const planInfo = getPlanInfo({ resource })
    const topologyElement = find(
      get(planInfo, [`plan`, `cluster_topology`], []),
      (nodeConfiguration: ElasticsearchClusterTopologyElement) =>
        nodeConfiguration.instance_configuration_id ===
        (instanceConfiguration && instanceConfiguration.id),
    )

    if (!topologyElement) {
      return []
    }

    esNodeTypes = getNodeRoles({ topologyElement })
  }

  if (size(esNodeTypes) !== 0) {
    const ingestIndex = esNodeTypes.indexOf(`ingest`)

    if (ingestIndex !== -1) {
      esNodeTypes.splice(ingestIndex, 0, `coordinating`)
    }
  }

  return esNodeTypes
}
