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

import React, { Fragment, ReactNode } from 'react'
import { IntlShape } from 'react-intl'

import {
  capitalize,
  find,
  flatMap,
  get,
  groupBy,
  intersectionWith,
  maxBy,
  sumBy,
  set,
} from 'lodash'

import { EuiBadge, EuiToolTip } from '@elastic/eui'

import RatioLabel from '../../components/Topology/DeploymentTemplates/components/RatioLabel'

import { getInstanceCount, getInstanceSize, getSize, isEnabledConfiguration } from './conversion'

import { faultToleranceZones } from './faultTolerance'

import prettySize from '../prettySize'
import { formatCenticent } from '../money'
import { messages, dedicatedNodeTypeMessages } from './messages'

import {
  getSliderPrettyName,
  sortNodeTypes,
  isSliderInstanceType,
  isValidSliderNodeType,
} from '../sliders'

import {
  blobStorageMultiplier,
  getNumber,
} from '../../components/Topology/DeploymentTemplates/components/DeploymentInfrastructure/TopologyElement/helpers'

import { getConfigForKey } from '../../store'

import {
  getNodeRoles,
  getUnhiddenNodeRoles,
  isMaster,
  isDedicatedML,
  isDedicatedMaster,
  isHot,
  isWarm,
  isCold,
  isFrozen,
} from '../stackDeployments'

import {
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
  AppSearchTopologyElement,
} from '../api/v1/types'

import {
  AllNodeRoles,
  AnyTopologyElement,
  ArchitectureBreakdownItem,
  ArchitectureSummary,
  BasePrice,
  BillingSubscriptionLevel,
  EsNodeType,
  InstanceType,
  NodeConfiguration,
  NodeType,
  ProfileState,
  RegionId,
  VersionNumber,
  ZoneSummary,
  ZoneSummaryCounts,
  ZoneSummaryInstance,
} from '../../types'

export type SummaryItems = Array<{
  title: ReactNode
  description: ReactNode
  id?: string
}>

export type RelevantProfileState = {
  level: NonNullable<ProfileState>['level']
}

type ConfigurationItem = {
  title: string
  type: string
  titleClass?: string
  descriptionClass?: string
  description?: ReactNode
  summaryItems?: SummaryItems
}

type ConfigurationItems = ConfigurationItem[]

const topEsTypes: EsNodeType[] = [`data`, `master`, `ml`, `ingest`]

const dedicatedNodeTypes: EsNodeType[] = [`master`, `ingest`]

function deriveNodeType(
  nodeConfiguration: AnyTopologyElement | null,
  instance_type: InstanceType | string,
) {
  if (!nodeConfiguration) {
    return instance_type // sanity
  }

  if (instance_type !== `elasticsearch`) {
    return instance_type
  }

  const activeNodeTypes: AllNodeRoles = getNodeRoles({
    topologyElement: nodeConfiguration,
  })

  // In the unlikely event that we can't work out the best Elasticsearch node type,
  // default it to data
  if (activeNodeTypes.length === 0) {
    return `data`
  }

  const bestEsTypes = intersectionWith(topEsTypes, activeNodeTypes, (type, role) =>
    role.startsWith(type),
  )

  return bestEsTypes.length > 0 ? bestEsTypes[0] : activeNodeTypes[0]
}

export function getArchitectureDescription({
  nodeConfigurations,
  instanceConfigurations = [],
  version,
}: {
  nodeConfigurations: NodeConfiguration[]
  instanceConfigurations?: InstanceConfiguration[] | null
  version: VersionNumber | undefined
}): ArchitectureSummary {
  const zones = [] as ZoneSummary[]
  const instanceKey = {}
  const dataNodeTypes = new Set()

  for (const zoneCount of faultToleranceZones) {
    const zone = [] as ZoneSummary

    for (const nodeConfiguration of nodeConfigurations) {
      const {
        instance_configuration_id,
        zone_count = 1,
        size,
        memory_per_node,
        node_count_per_zone,
      } = nodeConfiguration as ElasticsearchClusterTopologyElement

      const enabled = isEnabledConfiguration(nodeConfiguration)

      if (!enabled) {
        continue
      }

      const instanceConfiguration = find(instanceConfigurations, {
        id: instance_configuration_id,
      })

      if (!instanceConfiguration) {
        continue
      }

      const isElasticsearch = instanceConfiguration.instance_type === `elasticsearch`

      if (zoneCount > zone_count && (zoneCount !== 1 || isElasticsearch)) {
        continue
      }

      const type = deriveNodeType(nodeConfiguration, instanceConfiguration.instance_type)

      const { resource, sizes, default_size } = instanceConfiguration.discrete_sizes
      const sizeValue = size ? size.value || default_size : undefined

      const numberOfInstances = getInstanceCount({
        size: sizeValue,
        sizes,
        exactInstanceCount: node_count_per_zone,
      })

      const instanceSize = getInstanceSize({
        size: sizeValue,
        sizes,
        exactSize: memory_per_node,
      })

      const sliderInstanceType = instanceConfiguration.instance_type

      const sliderNodeTypes: NodeType[] | undefined = getNodeRoles({
        topologyElement: nodeConfiguration,
        version,
      }).filter((sliderNodeType) =>
        isValidSliderNodeType({ sliderInstanceType, sliderNodeType }),
      ) as NodeType[]

      const instance: ZoneSummaryInstance = {
        id: instanceConfiguration.id || instanceConfiguration.name,
        name: instanceConfiguration.name,
        type,
        sliderInstanceType,
        sliderNodeType: sliderNodeTypes,
        size: <RatioLabel resource={resource} size={instanceSize!} />,
      }

      if (type?.startsWith('data')) {
        const storageSize = getSize({
          resource: `storage`,
          size,
          exactSize: memory_per_node,
          exactInstanceCount: node_count_per_zone,
          instanceConfiguration,
        })
        instance.storage = (
          <RatioLabel key='arch-viz-storage' resource='storage' size={storageSize} />
        )
        instance.storagePerInstance = (
          <RatioLabel
            key='arch-viz-storage-per-instance'
            resource='storage'
            size={storageSize / numberOfInstances}
          />
        )

        dataNodeTypes.add(instance.id)
        instance.index = Array.from(dataNodeTypes).indexOf(instance.id)
      }

      for (let i = 0; i < numberOfInstances; i++) {
        zone.push(instance)
      }

      if (instanceKey[type] === undefined) {
        instanceKey[type] = {}
      }

      instanceKey[type][instance_configuration_id] = instance
    }

    if (zone.length > 0) {
      const sortedZone = zone.sort((a, b) => sortNodeTypes(a.type, b.type))
      zones.push(sortedZone)
    }
  }

  const sortedKeys = Object.keys(instanceKey).sort(sortNodeTypes)
  const keys = flatMap(sortedKeys, (type) =>
    Object.keys(instanceKey[type]).map((key) => {
      const counts = getInstanceAndZoneCounts(zones, key)
      return [instanceKey[type][key], counts]
    }),
  ) as Array<[ZoneSummaryInstance, ZoneSummaryCounts]>

  return { zones, keys }
}

export function getInstanceAndZoneCounts(
  zones: ZoneSummaryInstance[][],
  key: string,
): ZoneSummaryCounts {
  return zones.reduce(
    (accum, zone) => {
      const matches = zone.filter(({ id }) => key === id)

      if (matches.length) {
        accum.zones += 1
        accum.instances += matches.length
      }

      return accum
    },
    { zones: 0, instances: 0 },
  )
}

export function getArchitectureSummaryItems({
  intl: { formatMessage },
  instanceConfigurations,
  nodeConfigurations,
  deploymentName,
  deploymentVersion,
}: {
  intl: IntlShape
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: NodeConfiguration[]
  deploymentName?: string
  deploymentVersion?: string
}): ConfigurationItems {
  const nodeTypes = sumNodeTypes(nodeConfigurations, instanceConfigurations)

  const subtotalMemory = sumMemory({ instanceConfigurations, nodeConfigurations })
  const systemAddedMemory = sumSystemAddedMemory({ instanceConfigurations, nodeConfigurations })
  const totalMemory = subtotalMemory + systemAddedMemory

  // We only want to show storage for es data nodes
  const esDataNodes = getEsDataNodes({ instanceConfigurations, nodeConfigurations })
  const totalStorage = sumStorage({
    instanceConfigurations,
    nodeConfigurations: esDataNodes,
  })

  const configurationItems = [] as ConfigurationItems

  if (deploymentName) {
    configurationItems.push({
      title: formatMessage(messages.summaryName),
      type: `title`,
      description: (
        <EuiToolTip position='left' content={deploymentName}>
          <span>{deploymentName}</span>
        </EuiToolTip>
      ),
    })
  }

  if (deploymentVersion) {
    configurationItems.push({
      title: formatMessage(messages.summaryVersion),
      type: `title`,
      description: (
        <EuiBadge className='architecture-summary--version'>v{deploymentVersion}</EuiBadge>
      ),
    })
  }

  Object.keys(nodeTypes)
    .sort((a, b) => sortNodeTypes(a, b))
    .map((node) => {
      const instanceTitle = isSliderInstanceType(node)
        ? formatMessage(
            getSliderPrettyName({ sliderInstanceType: node, version: deploymentVersion }),
          )
        : node
      const dedicatedNodeItems = dedicatedNodeTypes
        .filter((dedicatedNodeType) => nodeTypes[node][dedicatedNodeType])
        .map((dedicatedNodeType) => ({
          id: dedicatedNodeType,
          title: formatMessage(dedicatedNodeTypeMessages[dedicatedNodeType]),
          description: prettySize(nodeTypes[node][dedicatedNodeType]),
        }))

      configurationItems.push({
        title: instanceTitle,
        type: node,
        summaryItems: [
          ...(node === `elasticsearch` ? renderElasticsearchNodeSummary(nodeTypes[node]) : []),
          ...(nodeTypes[node].memory
            ? [
                {
                  id: `memory`,
                  title: formatMessage(messages.summaryMemory),
                  description: prettySize(nodeTypes[node].memory),
                },
              ]
            : []),
          ...dedicatedNodeItems,
        ],
      })
    })

  configurationItems.push({
    title: formatMessage(messages.total),
    type: `total`,
    titleClass: `total`,
    summaryItems: [
      {
        id: `storage`,
        title: formatMessage(messages.summaryTotalStorage),
        description: prettySize(totalStorage),
      },
      {
        id: `memory`,
        title: formatMessage(messages.summaryTotalMemory),
        description: prettySize(totalMemory),
      },
    ],
  })
  return configurationItems

  function renderElasticsearchNodeSummary(node): SummaryItems {
    if (node.storage) {
      return [
        {
          id: `storage`,
          title: formatMessage(messages.summaryStorage),
          description: prettySize(node.storage),
        },
      ]
    }

    return [
      { rawSize: node.hotStorage, message: messages.hotStorage },
      { rawSize: node.hotMemory, message: messages.hotMemory },
      { rawSize: node.warmStorage, message: messages.warmStorage },
      { rawSize: node.warmMemory, message: messages.warmMemory },
      { rawSize: node.coldStorage, message: messages.coldStorage },
      { rawSize: node.coldMemory, message: messages.coldMemory },
      { rawSize: node.frozenMemory * blobStorageMultiplier, message: messages.frozenStorage }, // Memory * blob storage is the display value we use for frozen storage
      { rawSize: node.frozenMemory, message: messages.frozenMemory },
    ]
      .filter(({ rawSize }) => rawSize)
      .map(({ rawSize, message }) => ({
        id: 'storage',
        title: formatMessage(message),
        description: prettySize(rawSize),
      }))
  }
}

function getTier(topologyElement): string | undefined {
  return (
    (isFrozen({ topologyElement }) && `frozen`) ||
    (isCold({ topologyElement }) && `cold`) ||
    (isWarm({ topologyElement }) && `warm`) ||
    (isHot({ topologyElement }) && `hot`) ||
    undefined
  )
}

export function sumNodeTypes(nodeConfigurations, instanceConfigurations) {
  const hasTieBreaker = hasTiebreakerMaster(nodeConfigurations, instanceConfigurations)
  const result = {}

  nodeConfigurations.forEach((nodeConfig) => {
    const instanceType = getInstanceType({ nodeConfig, instanceConfigurations })
    const memory = sumMemory({
      instanceConfigurations,
      nodeConfigurations: [nodeConfig],
    })

    const storage = sumStorage({
      instanceConfigurations,
      nodeConfigurations: [nodeConfig],
    })

    if (storage === 0 && memory === 0) {
      return
    }

    const isDedicated = isDedicatedNodeType(nodeConfig)

    if (isDedicated) {
      const dedicatedNodeType = getOnlyNodeType(nodeConfig)!
      set(result, [instanceType, dedicatedNodeType], memory)
    } else {
      if (
        hasTieBreaker &&
        instanceType === `elasticsearch` &&
        isMaster({ topologyElement: nodeConfig })
      ) {
        set(result, [instanceType, `master`], 1024)
      }

      const tier = getTier(nodeConfig)

      if (!tier) {
        set(result, [instanceType], {
          ...(result[instanceType] || {}),
          memory: memory + get(result, [instanceType, memory], 0),
          storage: storage + get(result, [instanceType, storage], 0),
        })
      } else {
        set(result, [instanceType], {
          ...(result[instanceType] || {}),
          [`${tier}Storage`]: storage,
          [`${tier}Memory`]: memory,
        })
      }
    }
  })

  return result
}

function getInstanceType({ nodeConfig, instanceConfigurations }) {
  if (isDedicatedML({ topologyElement: nodeConfig })) {
    return 'ml'
  }

  const instanceConfiguration = instanceConfigurations.find(
    ({ id }) => id === nodeConfig.instance_configuration_id,
  )

  return instanceConfiguration && instanceConfiguration.instance_type
}

function getEsDataNodes({ instanceConfigurations, nodeConfigurations }) {
  return nodeConfigurations.filter((nodeConfig) => {
    const instanceType = getInstanceType({ nodeConfig, instanceConfigurations })

    if (instanceType !== `elasticsearch`) {
      return false
    }

    const isDedicated = isDedicatedNodeType(nodeConfig)
    return !isDedicated
  })
}

export function getOnlyNodeType(
  topologyElement: ElasticsearchClusterTopologyElement,
): string | null {
  const nodeTypes = getUnhiddenNodeRoles({ topologyElement })
  return nodeTypes.length === 1 ? nodeTypes[0] : null
}

function isDedicatedNodeType(nodeConfig) {
  return dedicatedNodeTypes.some((dedicatedNodeType) => {
    const onlyNodeType = getOnlyNodeType(nodeConfig)
    return onlyNodeType === dedicatedNodeType
  })
}

export function getArchitecturePricingItems({
  intl: { formatMessage },
  regionId,
  nodeConfigurations,
  instanceConfigurations,
  basePrices,
  level,
  isAutoscalingEnabled,
}: {
  intl: IntlShape
  regionId: RegionId
  nodeConfigurations: NodeConfiguration[]
  instanceConfigurations: InstanceConfiguration[]
  basePrices: BasePrice[] | undefined
  level: BillingSubscriptionLevel
  isAutoscalingEnabled?: boolean
}): SummaryItems {
  if (!basePrices) {
    return []
  }

  const { hourlyRate, tiebreakerPrice, breakdownHourlyRate } = getHourlyRate({
    regionId,
    nodeConfigurations,
    instanceConfigurations,
    basePrices,
    level,
  })

  if (hourlyRate === 0) {
    return []
  }

  return getNativePricingItems(isAutoscalingEnabled)

  function getNativePricingItems(isAutoscalingEnabled?: boolean): SummaryItems {
    return [
      getPriceDescription({ id: `total`, price: hourlyRate }, isAutoscalingEnabled),
      ...getBreakdownHourlyRate(),
    ]
  }

  function getBreakdownHourlyRate() {
    const breakdownRatesById = groupBy(breakdownHourlyRate, ({ id }) =>
      id?.startsWith(`data`) ? `data` : id,
    )
    // if we have 2 data node (hi-lo) sum price per type
    const breakdownHourlyRates = Object.keys(breakdownRatesById).reduce((breakdownRates, id) => {
      let priceSum = sumBy(breakdownRatesById[id], `price`)

      if (id?.startsWith(`data`) && breakdownRatesById.master) {
        priceSum += breakdownRatesById.master[0].price
      }

      breakdownRates.push({ price: priceSum, id })
      return breakdownRates
    }, [] as Array<{ price: number; id: string }>)
    return breakdownHourlyRates.map((rates) => getPriceDescription(rates, isAutoscalingEnabled))
  }

  function getPriceDescription({ id, price }, isAutoscalingEnabled) {
    if (price === 0) {
      return {
        id,
        title: isAutoscalingEnabled
          ? formatMessage(messages.initialHourlyRate)
          : formatMessage(messages.hourlyRate),
        description: <Fragment>{formatMessage(messages.free)}</Fragment>,
      }
    }

    const money = formatCenticent(price, 4)

    return {
      descriptionClass: 'hourly-price',
      id,
      title: isAutoscalingEnabled
        ? formatMessage(messages.initialHourlyRate)
        : formatMessage(messages.hourlyRate),
      ...(id?.startsWith(`data`) && tiebreakerPrice
        ? { tiebreakerPrice: formatCenticent(tiebreakerPrice.price, 4) }
        : {}),
      description: <Fragment>{money}</Fragment>,
    }
  }
}

export function getHourlyRate({
  basePrices,
  regionId,
  instanceConfigurations,
  nodeConfigurations,
  level,
}: {
  basePrices: BasePrice[]
  regionId: RegionId
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: Array<ElasticsearchClusterTopologyElement | AppSearchTopologyElement>
  level: BillingSubscriptionLevel
}) {
  const isProduction = getConfigForKey(`NODE_ENV`) === `production`
  const activeConfigurations = nodeConfigurations.filter(whereNodeConfigurationIsValid)

  const breakdown = activeConfigurations
    .map(getNodeConfigurationPrice)
    .filter((item) => item !== null) as ArchitectureBreakdownItem[]

  const tiebreakerPrice: ArchitectureBreakdownItem | null = getTiebreakerHourlyRate()

  if (tiebreakerPrice) {
    breakdown.push(tiebreakerPrice)
  }

  const hourlyRate = sumBy(breakdown.map((item) => item!.price))

  const breakdownHourlyRate = breakdown.map((item) => {
    const type = deriveNodeType(
      item.nodeConfiguration,
      get(item, [`instanceConfiguration`, `instance_type`]),
    )

    return {
      id: type === `ingest` ? `data` : type,
      price: item.price,
    }
  })

  return {
    breakdown,
    hourlyRate,
    breakdownHourlyRate,
    tiebreakerPrice,
  }

  function whereNodeConfigurationIsValid(nodeConfiguration) {
    const enabled = isEnabledConfiguration(nodeConfiguration)

    if (enabled === false) {
      return false
    }

    const { instance_configuration_id: id } = nodeConfiguration
    const instanceConfiguration = find(instanceConfigurations, {
      id,
    })

    return instanceConfiguration != null // sanity
  }

  function getNodeConfigurationPrice(
    nodeConfiguration: ElasticsearchClusterTopologyElement,
  ): ArchitectureBreakdownItem | null {
    const { instance_configuration_id: id } = nodeConfiguration
    const instanceConfiguration = find(instanceConfigurations, {
      id,
    }) as InstanceConfiguration

    if (!instanceConfiguration) {
      return null
    }

    return getPrice({
      regionId,
      nodeConfiguration,
      instanceConfiguration,
      basePrices,
      level,
    })
  }

  function getTiebreakerHourlyRate(): ArchitectureBreakdownItem | null {
    const hasDedicatedMaster = activeConfigurations.some((topologyElement) =>
      isDedicatedMaster({ topologyElement }),
    )

    if (hasDedicatedMaster) {
      return null
    }

    const hasTieBreaker = hasTiebreakerMaster(nodeConfigurations, instanceConfigurations)

    if (!hasTieBreaker) {
      return null
    }

    const tieBreakerInstanceConfiguration = getTiebreakerMaster(instanceConfigurations)

    if (!tieBreakerInstanceConfiguration) {
      return {
        sku: null,
        price: 0, // sanity
        pricePointFail: true,
        instanceConfiguration: null,
        nodeConfiguration: null,
      }
    }

    const dedicatedMasterBasePrice = find(basePrices, (price) =>
      matchDedicatedMasterBasePrice({
        price,
        userLevel: level,
        id: tieBreakerInstanceConfiguration.id,
      }),
    )

    if (dedicatedMasterBasePrice == null) {
      if (!isProduction) {
        console.warn(`Did not find a base price for "dedicated master".`)
      }

      return {
        sku: null,
        price: 0, // sanity
        pricePointFail: true,
        instanceConfiguration: null,
        nodeConfiguration: null,
      }
    }

    const { sku } = dedicatedMasterBasePrice

    const instanceConfiguration = find(instanceConfigurations, (config) => {
      if (get(config, [`metadata`, `sku`]) === sku) {
        return true
      }

      return config.id === sku
    })

    if (instanceConfiguration == null) {
      return {
        sku: null,
        price: 0, // sanity
        pricePointFail: true,
        instanceConfiguration: null,
        nodeConfiguration: null,
      }
    }

    // we explicitly want to add a surcharge for the 1 GB 1 AZ tiebreaker,
    // priced as a dedicated master
    const nodeConfiguration: ElasticsearchClusterTopologyElement = {
      instance_configuration_id: instanceConfiguration.id,
      node_type: { data: false, master: true, ingest: false },
      zone_count: 1,
      size: {
        resource: `memory`,
        value: 1024,
      },
    }

    const fullSku = getFullSku({
      regionId,
      sku: dedicatedMasterBasePrice.sku,
      userLevel: level,
      capacity: 1024,
      zones: 1,
    })

    return {
      sku: fullSku,
      price: dedicatedMasterBasePrice.price,
      instanceConfiguration,
      nodeConfiguration,
    }
  }
}

function getPrice({
  basePrices,
  instanceConfiguration,
  nodeConfiguration,
  regionId,
  level,
}: {
  basePrices: BasePrice[]
  instanceConfiguration: InstanceConfiguration
  nodeConfiguration: NodeConfiguration
  regionId: RegionId
  level: BillingSubscriptionLevel
}): ArchitectureBreakdownItem | null {
  const {
    size,
    memory_per_node,
    node_count_per_zone,
    zone_count = 1,
  } = nodeConfiguration as ElasticsearchClusterTopologyElement

  // the SKU for an instance configuration might be different from its ID
  // this is so we can flexibly determine how an instance configuration
  // should be priced, regardless of its ID
  const { id, metadata } = instanceConfiguration
  const sku = get(metadata, [`sku`], id)

  const memorySize = getSize({
    resource: `memory`,
    size,
    exactSize: memory_per_node,
    exactInstanceCount: node_count_per_zone,
    instanceConfiguration,
  })

  const memorySizeAcrossZones = memorySize * zone_count
  const memorySizeAcrossZonesInGb = memorySizeAcrossZones / 1024
  const fullSku = getFullSku({
    sku,
    regionId,
    userLevel: level,
    capacity: memorySize,
    zones: zone_count,
  })

  /* [1] free tier filters needs to match the current configuration in order
   *     for us to consider the configuration to be free.
   *
   * [2] when we fail to match free tier prices to the current configuration,
   *     we need to ensure we don't inadvertently match against an empty price
   *     meant to be matched only for the free tier.
   *
   * Example:
   * - We have a 2048 MB, 1 zone configuration of "aws.data.m4"
   * - Prices include:
   *   {
   *     "sku": "aws.data.m4",
   *     "free_tier": {
   *       "memory_capacity": 512,
   *       "zone_count": 1
   *     }
   *   }
   *
   * - If we didn't explictly match `free_tier` against `false` in [2],
   *   we'd be at risk of applying a free tier discount, even when the user went
   *   for a configuration that isn't considered free (2GB),
   *   because we'd match the 512MB free tier.
   */
  const freeTier = find(basePrices, {
    sku,
    free_tier: {
      // [1]
      memory_capacity: memorySize,
      zone_count,
    },
  })

  if (freeTier) {
    return {
      sku: fullSku,
      price: 0, // instance configuration settings match free tier
      instanceConfiguration,
      nodeConfiguration,
    }
  }

  const basePrice = find(basePrices, {
    sku,
    level,
    free_tier: false, // [2]
  }) as BasePrice

  if (basePrice == null) {
    return {
      sku: fullSku,
      price: 0, // sanity
      pricePointFail: true,
      instanceConfiguration,
      nodeConfiguration,
    }
  }

  const { price } = basePrice

  return {
    sku: fullSku,
    price: price * memorySizeAcrossZonesInGb,
    instanceConfiguration,
    nodeConfiguration,
  }
}

function matchDedicatedMasterBasePrice({
  price,
  userLevel,
  id,
}: {
  price: BasePrice
  userLevel: string
  id: string | undefined
}): boolean {
  const { sku, level, free_tier } = price

  return (
    sku === id &&
    level === userLevel &&
    (free_tier === false || (free_tier.memory_capacity === 1024 && free_tier.zone_count === 1))
  )
}

function sumMemory({
  instanceConfigurations,
  nodeConfigurations,
}: {
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: NodeConfiguration[]
}): number {
  return sumBy(nodeConfigurations, (nodeConfiguration) => {
    const {
      instance_configuration_id,
      size,
      memory_per_node,
      node_count_per_zone,
      zone_count = 1,
    } = nodeConfiguration as ElasticsearchClusterTopologyElement

    const enabled = isEnabledConfiguration(nodeConfiguration)

    if (!enabled) {
      return 0
    }

    const instanceConfiguration = find(instanceConfigurations, {
      id: instance_configuration_id,
    }) as InstanceConfiguration

    if (!instanceConfiguration) {
      return 0
    }

    const memorySize = getSize({
      resource: `memory`,
      size,
      exactSize: memory_per_node,
      exactInstanceCount: node_count_per_zone,
      instanceConfiguration,
    })
    return memorySize * zone_count
  })
}

function sumSystemAddedMemory({
  instanceConfigurations,
  nodeConfigurations,
}: {
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: NodeConfiguration[]
}): number {
  const hasTiebreaker = hasTiebreakerMaster(nodeConfigurations, instanceConfigurations)

  const tiebreakerMemory = hasTiebreaker ? 1024 : 0
  return tiebreakerMemory
}

function sumStorage({
  instanceConfigurations,
  nodeConfigurations,
}: {
  instanceConfigurations: InstanceConfiguration[]
  nodeConfigurations: NodeConfiguration[]
}): number {
  return sumBy(nodeConfigurations, (nodeConfiguration) => {
    const {
      instance_configuration_id,
      size,
      memory_per_node,
      node_count_per_zone,
      zone_count = 1,
    } = nodeConfiguration as ElasticsearchClusterTopologyElement

    const enabled = isEnabledConfiguration(nodeConfiguration)

    if (!enabled) {
      return 0
    }

    const instanceConfiguration = find(instanceConfigurations, {
      id: instance_configuration_id,
    }) as InstanceConfiguration

    if (!instanceConfiguration) {
      return 0
    }

    if (isFrozen({ topologyElement: nodeConfiguration })) {
      const blobStorageSize = getNumber({
        instanceResource: `memory`,
        storageMultiplier: instanceConfiguration.storage_multiplier,
        totalSize: size!.value,
        resourceType: `storage`,
        isBlobStorage: true,
      })

      return blobStorageSize * zone_count
    }

    const storageSize = getSize({
      resource: `storage`,
      size,
      exactSize: memory_per_node,
      exactInstanceCount: node_count_per_zone,
      instanceConfiguration,
    })

    return storageSize * zone_count
  })
}

export function getMaxZoneCount({
  nodeConfigurations,
}: {
  nodeConfigurations: NodeConfiguration[]
}): number {
  const enabledConfigurations = nodeConfigurations.filter((configuration) =>
    isEnabledConfiguration(configuration),
  )
  const maxConfiguration = maxBy(enabledConfigurations, `zone_count`)
  return get(maxConfiguration, [`zone_count`], 0)
}

/**
 * Determines whether a topology element can be disabled.
 *
 * @param {'elasticsearch' | 'kibana' | 'apm'} instanceType
 * @param {ElasticsearchClusterTopologyElement | KibanaClusterTopologyElement | ApmTopologyElement} nodeConfiguration
 * @return {boolean}
 */
export function canDisableConfiguration({
  nodeConfiguration,
  instanceConfiguration: { instance_type },
  dedicatedMasterThreshold,
}: {
  nodeConfiguration: AnyTopologyElement
  instanceConfiguration: { instance_type: string }
  dedicatedMasterThreshold?: number
}): boolean {
  // SPECIAL CASES

  // a dedicated master threshold trumps user choice

  if (
    dedicatedMasterThreshold != null &&
    isDedicatedMaster({ topologyElement: nodeConfiguration })
  ) {
    return false
  }

  // GENERIC CASES

  // use the first-class indicator if present

  if (instance_type === `elasticsearch`) {
    if ((nodeConfiguration as ElasticsearchClusterTopologyElement).topology_element_control) {
      return (
        (nodeConfiguration as ElasticsearchClusterTopologyElement).topology_element_control?.min
          ?.value === 0
      )
    }
  }

  // else fall back to pre-topology_element_control hard coded approach

  if (instance_type === `elasticsearch`) {
    const activeNodeTypes = getNodeRoles({ topologyElement: nodeConfiguration })

    if (activeNodeTypes.length === 1 && [`ml`, `ingest`].includes(activeNodeTypes[0])) {
      return true
    }
  }

  if (instance_type === `apm`) {
    return true
  }

  if (instance_type === `enterprise_search`) {
    return true
  }

  return false
}

export function getSuperRegion(regionId: string): string {
  const startIndex = regionId.startsWith(`aws-`) ? 4 : 0
  const superRegionSlug = regionId.slice(startIndex, startIndex + 2)
  const superRegion = superRegionSlug.toUpperCase()
  return superRegion
}

// Mirrors accounter code at https://github.com/elastic/cloud/blob/275f2c674136159b353d8f4990717941339e5222/python-services/found_services/accounter/accounter_service.py#L483
function getFullSku({
  sku: base_sku,
  regionId: region,
  userLevel,
  capacity,
  zones: azs,
}: {
  sku: string
  regionId: string
  userLevel: 'enterprise' | 'platinum' | 'gold' | 'standard'
  capacity: number
  zones: number
}) {
  const prefix = getSkuPrefix(userLevel)
  const fullSku = `${prefix}${base_sku}_${region}_${capacity}_${azs}`

  return fullSku
}

function getSkuPrefix(userLevel: string): string {
  if (userLevel !== `standard`) {
    return `Cloud-${capitalize(userLevel)}_`
  }

  return ``
}

function hasTiebreakerMaster(nodeConfigurations, instanceConfigurations) {
  const activeConfigurations = nodeConfigurations.filter((nodeConfiguration) => {
    const enabled = isEnabledConfiguration(nodeConfiguration)

    if (enabled === false) {
      return false
    }

    const { instance_configuration_id: id } = nodeConfiguration
    const instanceConfiguration = find(instanceConfigurations, {
      id,
    })

    return instanceConfiguration != null // sanity
  })
  const multiZoneMasterEligibleCounts = activeConfigurations.map((nodeConfiguration) => {
    const {
      instance_configuration_id: id,
      zone_count = 0,
      size,
      node_count_per_zone,
    } = nodeConfiguration

    const activeNodeTypes = getNodeRoles({ topologyElement: nodeConfiguration })

    if (!activeNodeTypes.includes(`master`)) {
      return 0
    }

    const instanceConfiguration = find(instanceConfigurations, {
      id,
    }) as InstanceConfiguration

    if (!instanceConfiguration) {
      return 0
    }

    const {
      instance_type,
      discrete_sizes: { sizes },
    } = instanceConfiguration

    if (instance_type !== `elasticsearch`) {
      return 0
    }

    const instanceCount = getInstanceCount({
      size: size ? size.value : undefined,
      sizes,
      exactInstanceCount: node_count_per_zone,
    })

    const masterEligibleCount =
      instanceCount * (typeof zone_count === `number` && zone_count > 1 ? zone_count : 0)

    return masterEligibleCount
  })

  const totalMultiZoneMasterEligibleCount = sumBy(multiZoneMasterEligibleCounts)

  if (totalMultiZoneMasterEligibleCount === 0) {
    return false // no multi-AZ master-eligibles means no tiebreaker needed
  }

  if (totalMultiZoneMasterEligibleCount % 2 !== 0) {
    return false // odd number of multi-AZ master-eligibles means no tiebreaker needed
  }

  return true
}

function getTiebreakerMaster(instanceConfigurations): InstanceConfiguration {
  return instanceConfigurations.find(
    (nodeConfiguration) =>
      nodeConfiguration.node_types &&
      nodeConfiguration.node_types.length === 1 &&
      nodeConfiguration.node_types[0] === 'master',
  )
}
