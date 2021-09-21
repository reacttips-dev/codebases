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

import { set, cloneDeep, intersection, omit, remove } from 'lodash'

import { ensureDedicatedMasterAwareTopology } from './dedicatedMasters'
import { ensureCorrectIndexManagementSettings } from './indexManagement'

import {
  isSizedSliderResourcePayload,
  isUsingNodeRoles,
  getFirstEsCluster,
  supportsFrozenTier,
} from './selectors'

import { sanitizeForAutoscaling } from './autoscaling'
import { getSupportedSliderInstanceTypes } from '../sliders'

import { lt } from '../semver'
import { getAllowedPluginsForVersions } from '../plugins'
import { getMinimumMemoryFromPlan, filterIngestPluginsOnMemory } from '../deployments/plan'

import { normalizeNodeRoles, setNodeRoleInPlace } from './nodeRoles'

import { DeepPartial } from '../ts-essentials'
import { markShallow } from '../immutability-helpers'

import {
  AnyPayload,
  ElasticsearchCluster,
  Region,
  SliderInstanceType,
  StackDeploymentCreateRequest,
  StackDeploymentUpsertRequest,
} from '../../types'

import {
  DeploymentCreateRequest,
  DeploymentTemplateInfoV2,
  DeploymentUpdateRequest,
  ElasticsearchClusterSettings,
  ElasticsearchPayload,
  InstanceConfiguration,
  DeploymentObservabilitySettings,
  StackVersionConfig,
} from '../api/v1/types'

export function getCreatePayload({
  region,
  editorState,
  stackVersions,
  filterIngestPlugins,
  hasIndexCuration,
}: {
  region: Region
  editorState: StackDeploymentCreateRequest
  stackVersions?: StackVersionConfig[] | null
  filterIngestPlugins?: boolean
  hasIndexCuration?: boolean
}): DeploymentCreateRequest | null {
  const { deployment: editorDeployment, deploymentTemplate } = editorState

  if (!deploymentTemplate) {
    return null
  }

  const instanceConfigurations = deploymentTemplate.instance_configurations!

  const deployment = cloneDeep(editorDeployment)

  if (Array.isArray(deployment.resources!.elasticsearch)) {
    for (const cluster of deployment.resources!.elasticsearch) {
      sanitizeMasterNodeTypes({ region, deploymentTemplate, cluster, instanceConfigurations })
      stripOutIndexCuration({ cluster, hasIndexCuration })
      sanitizeIngest({
        cluster,
        stackVersions: stackVersions!,
        instanceConfigurations,
        filterIngestPlugins,
      })
    }
  }

  // ensure we don't send both ILM and Index Curation settings
  ensureCorrectIndexManagementSettings({
    deployment,
    deploymentTemplate,
  })

  filterUnsizedResources({ deployment })
  filterUnsupportedEsTiers({ deployment })
  normalizeNodeRoles({ deployment })
  removeIllegalProperties({ deployment })
  sanitizeForAutoscaling({ deployment })

  return deployment
}

export function filterUnsizedResources({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): void {
  const { resources } = deployment

  if (!resources) {
    return
  }

  const sliderInstanceTypes = getSupportedSliderInstanceTypes()
  const resourceTypes = intersection(sliderInstanceTypes, Object.keys(resources))

  for (const resourceType of resourceTypes) {
    // ensure we don't submit empty resources
    resources[resourceType] = resources[resourceType].filter((resource) =>
      isSizedSliderResourcePayload({ resource, resourceType }),
    )
  }
}

export function filterUnsupportedEsTiers({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): void {
  const esResource = getFirstEsCluster({ deployment })

  if (!esResource) {
    return
  }

  const esVersion = esResource.plan.elasticsearch.version

  if (!esVersion) {
    return
  }

  if (!supportsFrozenTier({ version: esVersion })) {
    remove(esResource.plan.cluster_topology, ({ id }) => id === `frozen`)
  }
}

export function removeIllegalProperties({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): void {
  const esResource = getFirstEsCluster({ deployment })

  if (!esResource) {
    return
  }

  // remove node_roles-required sliders if this deployment either isn't using or
  // doesn't support the property
  if (!isUsingNodeRoles({ deployment })) {
    remove(esResource.plan.cluster_topology, ({ id }) => id === `cold`)
    remove(esResource.plan.cluster_topology, ({ id }) => id === `frozen`)
  }

  // remove `topology_element_control`
  esResource.plan.cluster_topology.forEach((topologyElement) => {
    delete topologyElement.topology_element_control
  })
}

function sanitizeMasterNodeTypes({
  region,
  deploymentTemplate,
  cluster,
  instanceConfigurations,
}: {
  region: Region
  deploymentTemplate: DeploymentTemplateInfoV2
  cluster: ElasticsearchPayload
  instanceConfigurations: InstanceConfiguration[]
}) {
  // Sanitize master node types.
  cluster.plan.cluster_topology = ensureDedicatedMasterAwareTopology({
    region,
    deploymentTemplate,
    cluster,
    instanceConfigurations,
    onlySized: false,
  })
}

function stripOutIndexCuration({
  cluster,
  hasIndexCuration,
}: {
  cluster: ElasticsearchPayload
  hasIndexCuration?: boolean
}) {
  if (hasIndexCuration) {
    return
  }

  // Strip out index curation defaults when we don't want index curation enabled
  cluster.plan.elasticsearch.curation = undefined

  if (cluster.settings) {
    cluster.settings.curation = undefined
  }
}

function sanitizeIngest({
  cluster,
  stackVersions,
  instanceConfigurations,
  filterIngestPlugins,
}: {
  cluster: ElasticsearchPayload
  instanceConfigurations: InstanceConfiguration[]
  stackVersions: StackVersionConfig[]
  filterIngestPlugins?: boolean
}) {
  const { plan } = cluster
  const nodeConfigurations = plan.cluster_topology
  const esVersion = plan.elasticsearch.version

  if (!esVersion) {
    return
  }

  // Ingest plugin versioning awareness
  if (filterIngestPlugins) {
    const minimumMemory = getMinimumMemoryFromPlan(plan, instanceConfigurations)
    const allowedPlugins = getAllowedPluginsForVersions({ plan, versions: stackVersions })

    nodeConfigurations.forEach((nodeConfiguration) => {
      const plugins =
        (nodeConfiguration.elasticsearch &&
          nodeConfiguration.elasticsearch.enabled_built_in_plugins) ||
        []

      const nextPlugins = filterIngestPluginsOnMemory({
        plugins,
        allowedPlugins,
        minimumMemory,
        esVersion,
      })

      if (!nodeConfiguration.elasticsearch) {
        nodeConfiguration.elasticsearch = {}
      }

      nodeConfiguration.elasticsearch.enabled_built_in_plugins = nextPlugins
    })
  }

  const isLegacyStack = lt(esVersion, `5.0.0`)

  // Disable `ingest` for clusters <= 2.x, which don't support that node type
  if (isLegacyStack) {
    nodeConfigurations.forEach((topologyElement) => {
      setNodeRoleInPlace({ topologyElement, role: `ingest`, value: false })
    })
  }
}

export function getDeploymentNameSetter({
  onChange,
}: {
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
}) {
  return (name: string) => onChange({ deployment: { name } })
}

export function getDeploymentVersionSetter({
  editorState,
  onChange,
}: {
  editorState: StackDeploymentUpsertRequest
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
}) {
  return (version: string) => {
    const nextState = cloneDeep(editorState)

    nextState._joltVersion = version

    onChange(nextState)
  }
}

export function setDeploymentVersion({
  deployment,
  intendedVersion,
  stackVersion,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  intendedVersion: string | null
  stackVersion?: StackVersionConfig | null
}): void {
  const { resources } = deployment

  if (!resources) {
    return
  }

  const sliderInstanceTypes = getSupportedSliderInstanceTypes()
  const resourceTypes = intersection(sliderInstanceTypes, Object.keys(resources))

  for (const resourceType of resourceTypes) {
    const resourcesOfType: AnyPayload[] | undefined = resources[resourceType]

    if (!Array.isArray(resourcesOfType)) {
      continue
    }

    for (const resource of resourcesOfType) {
      setResourceVersion({ resource, resourceType, intendedVersion, stackVersion })
    }
  }
}

function setResourceVersion({
  resource,
  resourceType,
  intendedVersion,
  stackVersion,
}: {
  resource: AnyPayload
  resourceType: SliderInstanceType
  intendedVersion: string | null
  stackVersion?: StackVersionConfig | null
}) {
  if (!resource.plan) {
    return
  }

  if (!resource.plan[resourceType]) {
    resource.plan[resourceType] = {}
  }

  resource.plan[resourceType].version = getVersion()

  if (!Array.isArray(resource.plan.cluster_topology)) {
    return
  }

  /* A version might already be set on individual topology elements,
   * but it should always span the resource
   * we delete the element-specific version while upgrading to ensure consistency
   * https://github.com/elastic/cloud/pull/41764
   * https://github.com/elastic/support-dev-help/issues/8294
   */
  for (const nodeConfiguration of resource.plan.cluster_topology) {
    if (nodeConfiguration[resourceType]) {
      delete nodeConfiguration[resourceType].version
    }
  }

  function getVersion() {
    if (!stackVersion) {
      return intendedVersion // and hope for the best
    }

    const resourceStack = stackVersion[resourceType]

    if (resourceStack) {
      const resourceSpecificVersion = resourceStack.version

      if (resourceSpecificVersion) {
        return resourceSpecificVersion
      }
    }

    const globalStackVersion = stackVersion.version

    if (globalStackVersion) {
      return globalStackVersion
    }

    return intendedVersion // and hope for the best
  }
}

export function changeRestoreFromSnapshot({
  onChange,
  source,
  snapshotName = `__latest_success__`,
}: {
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
  source?: ElasticsearchCluster | null
  snapshotName?: string
}) {
  if (!source) {
    onChangeRestoreFromSnapshot(null)
    return
  }

  onChangeRestoreFromSnapshot({
    snapshot_name: snapshotName,
    source_cluster_id: source.id,
  })

  function onChangeRestoreFromSnapshot(restoreFromSnapshot) {
    onChange({
      deployment: {
        resources: {
          elasticsearch: [
            {
              plan: {
                transient: {
                  restore_snapshot: restoreFromSnapshot,
                },
              },
            },
          ],
        },
      },
    })
  }
}

export function setObservabilitySettings({
  onChange,
  settings,
  deployment,
}: {
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
  settings: DeploymentObservabilitySettings | null
  deployment?: DeploymentCreateRequest
}) {
  if (settings === null) {
    const nextDeploymentSettings = markShallow(omit(deployment?.settings || {}, 'observability'))

    onChange({
      deployment: {
        settings: nextDeploymentSettings,
      },
    })

    return
  }

  onChange({
    deployment: {
      settings: {
        observability: markShallow({ ...settings }),
      },
    },
  })
}

export function setEsSettings({
  onChange,
  settings,
}: {
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
  settings: DeepPartial<ElasticsearchClusterSettings> | null
}) {
  onChange({
    deployment: {
      resources: {
        elasticsearch: [
          {
            settings: settings === null ? undefined : settings,
          },
        ],
      },
    },
  })
}

export function changeEsAt({
  onChange,
  path,
  value,
}: {
  onChange: (
    changes: DeepPartial<StackDeploymentUpsertRequest>,
    settings?: { shallow?: boolean },
  ) => void
  path: string | string[]
  value: any
}) {
  const changes = set({}, path, value)

  onChange({
    deployment: {
      resources: {
        elasticsearch: [changes],
      },
    },
  })
}
