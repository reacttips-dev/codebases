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
import { difference, find, intersection, keys, pickBy, without } from 'lodash'

import { isEnabledConfiguration } from '../../deployments/conversion'
import { getTopology, getVersion } from './fundamentals'
import { gte } from '../../semver'

import {
  ClusterInstanceInfo,
  DeploymentGetResponse,
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  ElasticsearchClusterTopologyElement,
} from '../../api/v1/types'
import {
  AllNodeRoles,
  AnyTopologyElement,
  AnyTopologyElementWithNodeRoles,
  DataRole,
  NodeRole,
  NodeRoles,
  SliderNodeType,
  VersionNumber,
} from '../../../types'

export const MINIMUM_NODE_ROLES_VERSION = `7.10.0`

// order is important here -- it provides the default ordering for tiers,
// including which tier is regarded as the more important in the case of
// multiple (e.g. hot > content means a combined name of "Hot data and Content
// tier" instead of "Content and Hot data tier")
export const DATA_ROLES = [
  'data',
  'data_hot',
  'data_content',
  'data_warm',
  'data_cold',
  'data_frozen',
] as const

export const ELASTICSEARCH_NODE_ROLES = [
  ...DATA_ROLES,
  'master',
  'ingest',
  'ml',
  'remote_cluster_client',
  'transform',
] as const

// These are roles we don't display in the UI
export const HIDDEN_NODE_ROLES = ['remote_cluster_client', 'transform'] as const

/*
 * Returns true if any sized ES topology element has a valid node_roles property
 */
export function isDeploymentGetUsingNodeRoles({
  deployment,
}: {
  deployment: Pick<DeploymentGetResponse, 'resources'>
}): boolean {
  const version = getVersion({ deployment })

  if (!version) {
    return false
  }

  if (!supportsNodeRoles({ version })) {
    return false
  }

  const esResource = deployment.resources?.elasticsearch?.[0]
  const topology = getTopology({ resource: esResource })
  return topology
    .filter(isEnabledConfiguration)
    .some((topologyElement) => topologyElement.node_roles)
}

export function supportsNodeRoles({
  version,
}: {
  version: VersionNumber | null | undefined
}): boolean {
  if (!version) {
    return false
  }

  return gte(version, MINIMUM_NODE_ROLES_VERSION)
}

export function isRoleAnyDataRole(role: NodeRoles): boolean {
  return role === `data` || DATA_ROLES.includes(role as DataRole)
}

export function getNodeRoles({
  topologyElement,
  version,
}: {
  topologyElement: AnyTopologyElement
  version?: VersionNumber | undefined | null
}): AllNodeRoles {
  const { node_roles, node_type } = topologyElement as ElasticsearchClusterTopologyElement

  // return from node_roles if it exists, otherwise node_type -- UNLESS a
  // version is provided that is known to not support node_roles, which will
  // always return from node_type
  const roles =
    version && !supportsNodeRoles({ version })
      ? keys(pickBy(node_type))
      : node_roles || keys(pickBy(node_type))

  return intersection(ELASTICSEARCH_NODE_ROLES, roles) as AllNodeRoles
}

export function getUnhiddenNodeRoles({
  topologyElement,
  version,
}: {
  topologyElement: ElasticsearchClusterTopologyElement
  version?: VersionNumber | undefined | null
}): AllNodeRoles {
  return difference(getNodeRoles({ topologyElement, version }), HIDDEN_NODE_ROLES)
}

export function getNodeRolesFromInstance({
  instance,
}: {
  instance: ClusterInstanceInfo
}): Array<NodeRole | 'data'> {
  const { node_roles } = instance

  return intersection(ELASTICSEARCH_NODE_ROLES, node_roles) as Array<NodeRole | 'data'>
}

export function isData({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  return getNodeRoles({ topologyElement }).some(isRoleAnyDataRole)
}

export function isMaster({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  return hasNodeRole({ topologyElement, role: `master` })
}

export function isIngest({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  return hasNodeRole({ topologyElement, role: `ingest` })
}

export function isHot({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  const roles = getNodeRoles({ topologyElement })

  if (roles.includes(`data_hot`)) {
    return true
  }

  if (
    roles.includes(`data`) &&
    (topologyElement as ElasticsearchClusterTopologyElement).elasticsearch?.node_attributes
      ?.data === `hot`
  ) {
    return true
  }

  return false
}

export function isWarm({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  const roles = getNodeRoles({ topologyElement })

  if (roles.includes(`data_warm`)) {
    return true
  }

  if (
    roles.includes(`data`) &&
    (topologyElement as ElasticsearchClusterTopologyElement).elasticsearch?.node_attributes
      ?.data === `warm`
  ) {
    return true
  }

  return false
}

export function isCold({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  const roles = getNodeRoles({ topologyElement })

  if (roles.includes(`data_cold`)) {
    return true
  }

  if (
    roles.includes(`data`) &&
    (topologyElement as ElasticsearchClusterTopologyElement).elasticsearch?.node_attributes
      ?.data === `cold`
  ) {
    return true
  }

  return false
}

export function isFrozen({ topologyElement }: { topologyElement: AnyTopologyElement }): boolean {
  const roles = getNodeRoles({ topologyElement })

  if (roles.includes(`data_frozen`)) {
    return true
  }

  if (
    roles.includes(`data`) &&
    (topologyElement as ElasticsearchClusterTopologyElement).elasticsearch?.node_attributes
      ?.data === `frozen`
  ) {
    return true
  }

  return false
}

export function supportsFrozenTier({
  version,
}: {
  version: VersionNumber | null | undefined
}): boolean {
  if (!version) {
    return false
  }

  return gte(version, `7.12.0`)
}

export function supportsFrozenTierAutoscaling({
  version,
}: {
  version: VersionNumber | null | undefined
}): boolean {
  if (!version) {
    return false
  }

  return gte(version, `7.13.0-SNAPSHOT`)
}

export function isDedicatedData({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): boolean {
  const roles = getNodeRoles({ topologyElement })

  return roles.length > 0 && roles.every(isRoleAnyDataRole)
}

export function isDedicatedEsNodeType({
  topologyElement,
  nodeType,
}: {
  topologyElement: AnyTopologyElement
  nodeType: NodeRole
}): boolean {
  return !isData({ topologyElement }) && getNodeRoles({ topologyElement }).includes(nodeType)
}

export function isDedicatedMaster({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): boolean {
  return isDedicatedEsNodeType({ topologyElement, nodeType: `master` })
}

export function isDedicatedIngest({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): boolean {
  return isDedicatedEsNodeType({ topologyElement, nodeType: `ingest` })
}

export function isDedicatedML({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): boolean {
  return isDedicatedEsNodeType({ topologyElement, nodeType: `ml` })
}

export function hasNodeRole({
  topologyElement,
  role,
}: {
  topologyElement: AnyTopologyElement
  role: string
}): boolean {
  return getNodeRoles({ topologyElement }).includes(role as NodeRole)
}

export function getDataRoles({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): DataRole[] {
  return intersection(DATA_ROLES, getNodeRoles({ topologyElement })) as DataRole[]
}

export function getSliderNodeTypeForTopologyElement({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): SliderNodeType | undefined {
  const roles = getNodeRoles({
    topologyElement: topologyElement as AnyTopologyElementWithNodeRoles,
  })

  // easy stuff first: topology elements without node roles...
  if (roles.length === 0) {
    return undefined
  }

  // ...and topology elements with a single node role
  if (roles.length === 1) {
    return roles[0]
  }

  // ...and dedicated ES node types that can contain additional node roles
  if (isDedicatedMaster({ topologyElement })) {
    return `master`
  }

  if (isDedicatedIngest({ topologyElement })) {
    return `ingest`
  }

  if (isDedicatedML({ topologyElement })) {
    return `ml`
  }

  // otherwise go with the first matching DATA_ROLE
  const nodeRole = find(DATA_ROLES, (role) =>
    hasNodeRole({
      topologyElement: topologyElement as AnyTopologyElementWithNodeRoles,
      role: role as NodeRole,
    }),
  )

  return nodeRole
}

export function isRiskyWithSingleZone({
  topologyElement,
}: {
  topologyElement: AnyTopologyElement
}): boolean {
  if (!isData({ topologyElement })) {
    return false
  }

  if (
    getDataRoles({ topologyElement }).includes(`data_cold`) ||
    getDataRoles({ topologyElement }).includes(`data_frozen`)
  ) {
    return false
  }

  return true
}

/*
 * Returns true if any sized ES topology element has a valid node_roles property
 */
export function isUsingNodeRoles({
  deployment,
}: {
  deployment:
    | Pick<DeploymentCreateRequest, 'resources'>
    | Pick<DeploymentUpdateRequest, 'resources'>
}): boolean {
  const esPayload = deployment.resources?.elasticsearch?.[0]
  const version = esPayload?.plan.elasticsearch.version

  if (!version) {
    return false
  }

  if (!supportsNodeRoles({ version })) {
    return false
  }

  return (deployment.resources?.elasticsearch || []).some((cluster) =>
    cluster.plan.cluster_topology
      .filter(isEnabledConfiguration)
      .some((topologyElement) => topologyElement.node_roles),
  )
}

interface SanitizeNodeRolesForDisplay {
  (nodeRoles: AllNodeRoles): AllNodeRoles
  (nodeRoles: string[]): string[]
}

export const sanitizeNodeRolesForDisplay: SanitizeNodeRolesForDisplay = (nodeRoles) =>
  without(nodeRoles, ...HIDDEN_NODE_ROLES)
