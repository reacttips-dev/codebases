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

import { pick, sortBy } from 'lodash'

import moment from 'moment'
import leftPad from 'left-pad'

import { defineMessages, WrappedComponentProps } from 'react-intl'

import {
  getEsPlanFromGet,
  countInstances,
  getCurrentMemoryCapacity,
  getCurrentStorageCapacity,
  getDisplayName,
  getHiddenTimestamp,
  getLatestSnapshotSuccess,
  getOrganizationId,
  getPlatformId,
  getRegionId,
  getSubscriptionLevel,
  getVersion,
  hasEnabledSnapshots,
  hasInstancesUnderMaintenance,
  hasOngoingConfigurationChange,
  isEsStopped,
  getNodeRoles,
} from '../../../lib/stackDeployments'

import prettySize from '../../../lib/prettySize'

import {
  ElasticsearchClusterTopologyElement,
  DeploymentSearchResponse,
  TopologySize,
} from '../../../lib/api/v1/types'

type GetModelsParams = WrappedComponentProps & {
  deployments: DeploymentSearchResponse[]
  fields: string[]
  sortFields: string[]
  structured?: boolean
}

type DeriveDownloadBlobParams = GetModelsParams & {
  blobUrl?: string
  format: 'json' | 'csv'
}

type TopologyModel = {
  id?: string
  zones: number
  types: string[]
  size:
    | (TopologySize & {
        nodes?: number
      })
    | null
}

const customSort = {
  version: `version_sort_index`,
}

const rdigits = /^\d+$/

const messages = defineMessages({
  nodeConfiguration: {
    id: `export-deployments-format.node-configuration`,
    defaultMessage: `{ sizing } ({ zones } { zones, plural, one {zone} other {zones} }), { id } ({ types })`,
  },
  nodeConfigurationStopped: {
    id: `export-deployments-format.node-configuration-stopped`,
    defaultMessage: `stopped`,
  },
  nodeConfigurationExactSize: {
    id: `export-deployments-format.node-configuration-exact-size`,
    defaultMessage: `{ nodes }x { size } { resource }`,
  },
  nodeConfigurationFlexSize: {
    id: `export-deployments-format.node-configuration-flex-size`,
    defaultMessage: `{ size } { resource }`,
  },
})

function getCsv(settings: GetModelsParams) {
  const { fields } = settings
  const models = getModels({ ...settings, structured: false })
  const rows = models.map((model) => getModelRow(fields, model))
  const lines = [fields, ...rows].map((row) => row.join(`,`))
  const csv = lines.join(`\n`)
  return csv
}

function getJson(settings: GetModelsParams) {
  const models = getModels({ ...settings, structured: true })
  const json = JSON.stringify(models, null, 2)
  return json
}

export function getModels({
  intl,
  deployments,
  fields,
  sortFields,
  structured = false,
}: GetModelsParams) {
  const unsortedModels = deployments.map((deployment) =>
    getDeploymentModel({
      intl,
      deployment,
      structured,
    }),
  )

  const actualSortFields = sortFields.map((field) => customSort[field] || field)
  const fullModels = sortBy(unsortedModels, actualSortFields)
  const models = fullModels.map((model) => pick(model, fields))
  return models
}

function getModelRow(fields, model) {
  return fields.map(getModelField)

  function getModelField(field) {
    const rawValue = model[field]
    const value = encodeValue(rawValue)
    return value
  }
}

function getDeploymentModel({
  intl,
  deployment,
  structured,
}: WrappedComponentProps & {
  deployment: DeploymentSearchResponse
  structured: boolean
}) {
  const [esResource] = deployment.resources.elasticsearch
  const displayName = getDisplayName({ deployment })
  const regionId = getRegionId({ deployment })
  const latestSnapshotSuccess = getLatestSnapshotSuccess({ resource: esResource })
  const latestSnapshot = latestSnapshotSuccess ? moment(latestSnapshotSuccess).format() : false

  const hiddenTimestamp = getHiddenTimestamp({ deployment })
  const hidden = hiddenTimestamp ? moment(hiddenTimestamp).format() : false

  const instanceCount = countInstances({ resource: esResource }).totalReported
  const memoryCapacity = getCurrentMemoryCapacity({ resource: esResource })
  const storageCapacity = getCurrentStorageCapacity({ resource: esResource })

  const version = getVersion({ deployment })
  const pending = hasOngoingConfigurationChange({ deployment })
  const subscription = getSubscriptionLevel({ deployment })

  /* we can't use `rcompare` because lodash,
   * and we need lodash because multi-field sort
   * in lodash v5, this won't be necessary
   */
  const version_sort_index =
    version === null
      ? null
      : version
          .split(`.`)
          .map((bit) => leftPad(bit, 10, `0`))
          .join(`.`)

  const topology = getTopology({ intl, deployment, structured })

  const model = {
    id: deployment.id,
    region: regionId,
    name: displayName,
    version,
    version_sort_index,
    subscription,
    organization: getOrganizationId({ deployment }),
    platform: getPlatformId({ deployment }),
    instances: instanceCount,
    memory_capacity: memoryCapacity,
    storage_capacity: storageCapacity,
    topology,
    pending,
    healthy: deployment.healthy,
    maintenance: hasInstancesUnderMaintenance({ resource: esResource }),
    running: !isEsStopped({ deployment }),
    hidden,
    latest_snapshot: latestSnapshot,
    latest_snapshot_success: latestSnapshotSuccess,
    enabled_snapshots: hasEnabledSnapshots({ resource: esResource }),
  }

  return model
}

function getTopology({
  intl,
  deployment,
  structured,
}: WrappedComponentProps & {
  deployment: DeploymentSearchResponse
  structured: boolean
}) {
  const plan = getEsPlanFromGet({ deployment })
  const nodeConfigurations = plan ? plan.cluster_topology : []
  const planZoneCount = (plan && plan.zone_count) || 1

  if (nodeConfigurations.length === 0) {
    return null
  }

  const models = nodeConfigurations.map((nodeConfiguration) =>
    getTopologyModel({ planZoneCount, nodeConfiguration }),
  )

  if (structured) {
    return models
  }

  const topology = models.map((model) => getTopologyText({ intl, model }))

  return topology.join(`; `)
}

function getTopologyModel({
  planZoneCount,
  nodeConfiguration,
}: {
  planZoneCount: number
  nodeConfiguration: ElasticsearchClusterTopologyElement
}): TopologyModel {
  const {
    instance_configuration_id: modernId,
    node_configuration: legacyId,
    zone_count,
    node_count_per_zone: nodes,
    memory_per_node: memory,
    size,
  } = nodeConfiguration

  const types = getNodeRoles({ topologyElement: nodeConfiguration })

  const id = modernId || legacyId
  const zones = zone_count || planZoneCount

  return {
    id,
    zones,
    types,
    size: getSize(),
  }

  function getSize() {
    const exactSized = typeof nodes === `number` && typeof memory === `number`

    if (exactSized) {
      return {
        nodes,
        value: memory!,
        resource: `memory` as const,
      }
    }

    if (!size) {
      return null
    }

    return size
  }
}

function getTopologyText({
  intl: { formatMessage },
  model,
}: WrappedComponentProps & {
  model: TopologyModel
}) {
  const { id, zones, types, size } = model

  const sizing = getSizing()

  return formatMessage(messages.nodeConfiguration, {
    sizing,
    zones,
    id,
    types: types.join(`, `),
  })

  function getSizing() {
    if (size === null) {
      return formatMessage(messages.nodeConfigurationStopped)
    }

    const { nodes, value, resource } = size

    const exactSized = typeof nodes === `number` && typeof value === `number`

    if (exactSized) {
      return formatMessage(messages.nodeConfigurationExactSize, {
        nodes,
        size: prettySize(value),
        resource,
      })
    }

    return formatMessage(messages.nodeConfigurationFlexSize, {
      size: prettySize(value),
      resource,
    })
  }
}

export function deriveDownloadBlob({
  intl,
  deployments,
  fields,
  sortFields,
  blobUrl: oldBlobUrl,
  format = `csv`,
}: DeriveDownloadBlobParams) {
  const formatters = {
    csv: formatCsv,
    json: formatJson,
  }

  if (formatters[format] === undefined) {
    throw new Error(`Unknown deployments export format: "${format}"`)
  }

  if (oldBlobUrl) {
    window.URL.revokeObjectURL(oldBlobUrl)
  }

  const { content, type } = formatters[format]({
    intl,
    deployments,
    fields,
    sortFields,
  })

  const blob = new window.Blob([content], {
    type,
  })

  const blobUrl = window.URL.createObjectURL(blob)

  return { blobUrl }
}

function formatCsv(settings: GetModelsParams) {
  const content = getCsv(settings)
  const type = `text/csv;charset=utf-8`
  return { content, type }
}

function formatJson(settings: GetModelsParams) {
  const content = getJson(settings)
  const type = `application/json;charset=utf-8`
  return { content, type }
}

function encodeValue(rawValue) {
  if (rdigits.test(rawValue)) {
    return String(rawValue)
  }

  const encodedValue = String(rawValue).replace(/"/g, `""`)

  if (
    encodedValue === `undefined` ||
    encodedValue === `null` ||
    encodedValue === `false` ||
    encodedValue === `true`
  ) {
    return encodedValue
  }

  const quoted = `"${encodedValue}"`
  return quoted
}
