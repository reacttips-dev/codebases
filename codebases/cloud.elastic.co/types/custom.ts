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

import { ReactNode } from 'react'
import { MessageDescriptor } from 'react-intl'

import { DisambiguateSet, IconType } from '@elastic/eui'

import {
  AllocatedInstanceStatus,
  AllocatorBuildInfo,
  AllocatorCapacityMemory,
  ApmPlan,
  ChangeSourceInfo,
  ClusterInstanceConfigurationInfo,
  ClusterMetadataInfo,
  ClusterPlanStepInfo,
  ClusterSystemAlert,
  ElasticsearchClusterBlockingIssueElement,
  ElasticsearchClusterPlan as ESV1Plan,
  ElasticsearchClusterSettings,
  ElasticsearchMonitoringInfo,
  ExternalHyperlink,
  InstanceConfiguration,
  KibanaClusterPlan,
  KibanaClusterSettings,
  MetadataItem,
  RemoteResourceRef,
} from '../lib/api/v1/types'

import { AllocatorSearchInstance } from './allocatorSearch'
import { Coordinator } from './platform'
import { AnyTopologyElement, SliderInstanceType } from './sliders'
import { StackDeployment } from './stackDeployments'

import { ElasticsearchId, KibanaId, ApmId, RegionId, Url, VersionNumber } from './ids'

export * from './ids'

// Copied from EUI, which doesn't export this - props that are common across components
export interface CommonProps {
  className?: string
  'aria-label'?: string
  'data-test-id'?: string
}

export interface AjaxRequestErrorType extends Error {
  response: Response
  body?: {
    msg?: string
  }
}

export class AjaxRequestError extends Error implements AjaxRequestErrorType {
  response: Response

  body

  constructor(message: string, { response, body }) {
    super(message)
    this.response = response
    this.body = body
  }
}

export type AsyncRequestState<TMeta = any> = {
  inProgress: boolean
  isDone: boolean
  error?: string | Error | AjaxRequestError // Can this actually be a string?
  meta: TMeta
}

export interface AccountUI {
  emailDidChange?: boolean
  newEmail?: string
}

export type ZooKeeperNodeHealth = 'CONNECTED' | 'SUSPENDED' | 'RECONNECTED' | 'LOST' | 'READ_ONLY'

interface RegionStatusCount {
  total: number
  happy?: number
  sad?: number
}

export interface Region {
  id: RegionId
  healthy: boolean
  clusters: {
    healthy: boolean
    count: RegionStatusCount
  }
  kibanas: {
    healthy: boolean
    count: RegionStatusCount
  }
  runners: {
    healthy: boolean
    count: RegionStatusCount
  }
  allocators: {
    healthy: boolean
    count: RegionStatusCount
    zones: {
      count: RegionStatusCount
    }
  }
  proxies: {
    healthy: boolean
    count: RegionStatusCount
  }
  coordinators: {
    coordinators: {
      [id: string]: Coordinator
    }
  }
  zookeeper: {
    healthy: boolean
    zookeeper: {
      [nodeId: string]: ZooKeeperNodeHealth
    }
  }
  hrefs: RegionHrefs
}

interface RegionHrefs {
  'kibana-clusters'?: string
  runners?: string
  proxies?: string
  clusters?: string
  allocators?: string
  'aws-resources'?: string
  'container-sets'?: string
  'gcp-resources'?: string
  'versions/elastic'?: string
  zookeeper?: string
  settings?: string
  'create-cluster'?: string
  'blueprint-roles'?: string
  cluster?: string
  kibana?: string
  runner?: string
  allocator?: string
  versions?: string
  'elastic-stack-version'?: string
  'coordinator-candidates'?: string
  'promote-candidate'?: string
  'delete-candidate'?: string
  'demote-coordinator'?: string
  license?: string
  'set-license'?: string
  'remove-license'?: string
  'node-configurations'?: string
  'node-configuration'?: string
}

export type KibanaMetadata = any

export type Cluster = {
  kind: 'elasticsearch' | 'kibana' | 'apm'
  id: string
  regionId: RegionId
  stackDeploymentId: string | null
  displayName: string
  isHidden: boolean
  isInitializing: boolean
  isRestarting: boolean
  isForceRestarting: boolean
  isStopped: boolean
  isStopping: boolean
  healthy: boolean
}

export type KibanaClusterInstance = {
  displayName: string
  name: string
  clusterId: string
  capacity: {
    memory: number
  }
  allocator: {
    id: string | null
    zone: string | null
  }
  status: {
    isStarted: boolean
    inMaintenanceMode: boolean
    nativeFillPercentage: number | null
  }
  version: VersionNumber | null
  instanceConfig: {
    id: string
    name: string
    resource: string
  }
}

export interface KibanaCluster extends Cluster {
  id: KibanaId
  regionId: RegionId
  clusterId: ElasticsearchId
  displayName: string
  healthy: boolean
  isInitializing: boolean
  isStopped: boolean
  isStopping: boolean
  isRestarting: boolean
  isForceRestarting: boolean
  isHidden: boolean
  hiddenTimestamp?: string | null
  plan: {
    planAttemptId: string | null
    version?: VersionNumber | null
    healthy: boolean
    isActive: boolean
    isPending: boolean
    waitingForPending: boolean
    status: {
      messages: ClusterPlanStepInfo[]
    }
    pending: {
      _source: string
    }
  }
  instances: {
    healthy: boolean
    count: {
      total: number
      notRunning: number
      running: number
    }
    record: KibanaClusterInstance[]
  }
  _raw: {
    data: KibanaMetadata
    plan: KibanaClusterPlan | any
    pendingPlan?: KibanaClusterPlan | any
    pendingSource?: ChangeSourceInfo | null
  }
  hrefs: { [key: string]: Url }
  kind: 'kibana'
  externalLinks: ExternalHyperlink[]
  settings: KibanaClusterSettings | undefined
}

export type ApmMetadata = any

export type ApmClusterInstance = {
  displayName: string
  name: string
  clusterId: string
  capacity: {
    memory: number
  }
  allocator: {
    id: string | null
    zone: string | null
  }
  status: {
    isStarted: boolean
    inMaintenanceMode: boolean
    nativeFillPercentage: number | null
  }
  version: VersionNumber | null
  instanceConfig: {
    id: string
    name: string
    resource: string
  }
}

export interface ApmCluster extends Cluster {
  id: ApmId
  regionId: RegionId
  clusterId: ElasticsearchId
  displayName: string
  healthy: boolean
  isInitializing: boolean
  isHidden: boolean
  isStopped: boolean
  isStopping: boolean
  isRestarting: boolean
  isForceRestarting: boolean
  hiddenTimestamp?: string | null // appease tslint
  plan: {
    planAttemptId: string | null
    version: VersionNumber
    healthy: boolean
    isActive: boolean
    isPending: boolean
    waitingForPending: boolean
    status: {
      messages: ClusterPlanStepInfo[]
    }
    pending: {
      _source: string
    }
  }
  instances: {
    healthy: boolean
    count: {
      total: number
      notRunning: number
      running: number
    }
    record: ApmClusterInstance[]
  }
  _raw: {
    data: ApmMetadata
    plan: ApmPlan | any
    pendingPlan?: ApmPlan | any
    pendingSource?: ChangeSourceInfo | null
  }
  hrefs: { [key: string]: Url }
  kind: 'apm'
  externalLinks: ExternalHyperlink[]
  secretToken: string
}

export type ElasticsearchClusterInstance = {
  kind: 'elasticsearch'
  clusterId: ElasticsearchId
  name: string
  displayName: string
  capacity: {
    memory: number
    memoryPlanned: number
    storage: number | null
  }
  storageMultiplier: number
  status: {
    inMaintenanceMode: boolean
    isStarted: boolean
    isRunning: boolean
    diskSpaceUsed: number | null
    oldGenFillPercentage: number | null
    nativeFillPercentage: number | null
  }
  allocator: {
    id: string | null
    zone: string | null
  }
  elasticsearch: {
    version: VersionNumber | null
    nodeTypes: { [type: string]: boolean }
  }
  isMaster: boolean
  instanceConfig: {
    name: string
    id: string
    resource: string
  }
  serviceRoles?: string[]
}

type ElasticsearchClusterHrefName =
  | 'data'
  | 'comments'
  | 'comment'
  | 'plan'
  | 'cancel-plan'
  | 'plan-attempts'
  | 'create-kibana'
  | 'cluster-acl'
  | 'set-maintenance-mode'
  | 'set-instance-status'
  | 'proxy'
  | 'reset-password'

export type ElasticsearchClusterPlan = {
  planAttemptId: string | null
  planAttemptEndTime?: Date
  version: string | null
  availabilityZones: number
  healthy: boolean
  isActive: boolean
  isCreating: boolean
  isPending: boolean
  waitingForPending: boolean
  status: {
    failed: number
    messages: ClusterPlanStepInfo[]
  }
  pending: {
    _source: string
  }
}

type ScriptingValue = boolean | 'on' | 'off' | 'sandbox'

export type Scripting = {
  inline: ScriptingValue | null
  stored: ScriptingValue | null
  file: ScriptingValue | null
}

export type RestoreSnapshot = {
  snapshot_name: string
  source_cluster_id: string
}

export type InstanceConfigurationAggregates = {
  maintModeInstances: {
    nodeCount: number
  }
  unHealthyInstances: {
    nodeCount: number
  }
  memorySum: number
  zoneCount: number
  nodeCount: number
  diskSum: number
  instanceConfig: ClusterInstanceConfigurationInfo
}

export type ElasticsearchClusterCcsRemoteHealth = {
  id: string
  compatible: boolean
  version: string
}

export interface ElasticsearchCluster extends Cluster {
  id: ElasticsearchId
  cloudId: string | null
  platform: {
    id: string
    logoString: IconType
  }
  curation?: any
  regionId: RegionId
  name: string
  displayId: string
  displayName: string
  isHidden: boolean
  isLocked: boolean
  isInitializing: boolean
  isInitialPlanFailed: boolean
  isRestarting: boolean
  isForceRestarting: boolean
  isStopped: boolean
  isStopping: boolean
  hiddenTimestamp: string | null
  healthy: boolean
  user: {
    id: string
    level: string | null
    isPremium: boolean
  }
  profile: {
    userId: string
    level: string
  }
  plan: ElasticsearchClusterPlan
  master: {
    healthy: boolean
    count: number
    instancesWithNoMaster: string[]
  }
  shards: {
    healthy: boolean
    count: {
      total: number
      available: number
      unavailable: number
    }
  }
  instances: {
    healthy: boolean
    instanceCapacity: number
    count: {
      expected: number
      total: number
      notRunning: number
      running: number
    }
    record: ElasticsearchClusterInstance[]
  }
  instanceConfigurations: InstanceConfigurationAggregates[]
  snapshots: {
    enabled: boolean
    healthy: boolean
    latest: {
      state: string | null
      success: boolean
      time: string | null
    }
    status: {
      currentStatusHealthy: boolean
      totalCount: number
      latestSuccessAt: string | null
      nextSnapshotAt: string | null
      pendingInitialSnapshot: boolean
      hasRecentEnoughSuccess: boolean
      missingInfo?: boolean
      message?: string
    }
    snapshotRepositoryId: string | null
  }
  kibana: {
    enabled: boolean
    id: KibanaId | null
  }
  apm: {
    enabled: boolean
    id: ApmId | null
  }
  marvel: {
    enabled: boolean
    out: ElasticsearchId | null
  }
  monitoringInfo?: ElasticsearchMonitoringInfo
  security: {
    isConfigured: boolean
    internalUsers: Array<{
      username: string
      validUntil: string
    }>
    config: {
      version: number
      allowAnonymous: boolean
      roles: any
      users: any
      usersPerRole: any
    }
  }
  externalLinks: ExternalHyperlink[]
  events: {
    slain: ClusterSystemAlert[]
  }
  _raw: {
    plan: ESV1Plan | null
    pendingPlan?: ESV1Plan | null
    pendingSource?: ChangeSourceInfo | null
    data: ClusterMetadataInfo
    acl: any
  }
  hrefs: { [name in ElasticsearchClusterHrefName]: Url }
  isSystemOwned: boolean
  proxyLogging: boolean
  kind: 'elasticsearch'
  fsMultiplier: number
  wasDeleted: boolean

  // For search results - probably should use a separate type
  isPending?: boolean
  isAnyInstanceUnderMaintenance?: boolean

  // Post-DNT deployments report their template's ID, so long as we supply it
  // at creation.
  deploymentTemplateId: string | null

  settings: ElasticsearchClusterSettings
  blocks: {
    healthy?: boolean
    cluster?: ElasticsearchClusterBlockingIssueElement[]
    indices?: ElasticsearchClusterBlockingIssueElement[]
  }
  cpuHardLimit: boolean
  remoteClusters: {
    enabled: boolean
    healthy: boolean
    list: ElasticsearchClusterCcsRemoteHealth[]
  }
}

export type PendingPlan = ESV1Plan & { region?: string }

export type SnapshotDetails = {
  deploymentId?: string
  deploymentName?: string
  regionId?: string | null
  snapshotDate?: string
}

export type RemoteMapping = {
  remote: RemoteResourceRef
  ccsDeployment: StackDeployment
}

export type RestorePayload = {
  indices?: string
  rename_pattern?: string
  rename_replacement?: string
}

export type AllocatorHrefs = {
  'vacate-allocator': string
  'delete-allocator': string
  'update-allocator': string
}

export type AllocatorInstance = {
  id: string
  clusterId: string
  clusterDisplayName: string
  clusterHealthy: boolean
  healthy: boolean
  instanceName: string
  capacity: number
  kind: string
  availabilityZones: number
  version: string
  plan: {
    isPending: boolean
    allocatorBeingVacated: string | undefined
  }
  instanceConfigurationId: string | undefined
  stackDeploymentId: string | undefined
  status: AllocatedInstanceStatus
}

export type Allocator = {
  id: string
  regionId: RegionId
  availabilityZone: string
  healthy: boolean
  connected: boolean
  capacity: AllocatorCapacityMemory
  instances: AllocatorInstance[]
  attributes: {
    allocator_id: string
    features: string[] | undefined
    public_hostname: string
    host_ip: string
    zone_id: string
  }
  build?: AllocatorBuildInfo
  metadata: MetadataItem[]
  tags: MetadataItem[]
  isInMaintenanceMode: boolean
  hrefs: AllocatorHrefs
  externalLinks: ExternalHyperlink[]
}

export type SnapshotRepository = {
  config: SnapshotRepositoryConfig
  repository_name: string
}

export type SnapshotRepositoryConfig = {
  settings: SnapshotRepositoryS3 | any
  type: string
}

export type SnapshotRepositoryS3 = {
  access_key: string
  secret_key: string
  bucket: string
  region: RegionId
}

export type WorkingSnapshotRepository = {
  config: {
    settings: WorkingSnapshotRepositoryS3 | any
    type: string
  }
  repository_name?: string
}

export type WorkingSnapshotRepositoryS3 = {
  access_key?: string
  secret_key?: string
  bucket?: string
  region?: RegionId
}

export type ResourceCommentType =
  | SliderInstanceType
  | 'allocator'
  | 'constructor'
  | 'runner'
  | 'proxy'

export type ResourceComment = {
  id: string
  userId: string
  message: string
  created: Date
  modified: Date
  version: string
}

export type BasePrice = {
  sku: string
  price: number
  level?: string
  free_tier:
    | {
        memory_capacity: number
        zone_count: number
      }
    | false
}

export type HerokuAuthenticationParams = {
  domain: 'heroku'
  userId: number
  regionId: string
  clusterId: string
  authToken: string
  authTokenExpiry: Date
}

export type UnavailableVersionUpgrades = {
  [minUpgradableFrom: string]: string[]
}

export type VacateItemCluster = {
  sliderInstanceType?: SliderInstanceType
  clusterId: string
  errors: string[]
}

export type VacateItem = {
  [clusterId: string]: VacateItemCluster
}

export type VacateResult = {
  failed: VacateItem
  vacating: VacateItem
}

export type PluginDescription = {
  id: string
  url: Url
  description: string
}

export type AllocatorVizInstance = AllocatorInstance | AllocatorSearchInstance

export type Theme = 'light' | 'dark'

export interface FoundUser {
  username: string
  valid_until?: string
  password_hash: string
  roles?: string[]
  password?: string
}

export type NewDeploymentCredentials = {
  username: string
  password: string
  apmToken?: string
  resetPassword?: boolean
}

export type RestartStrategy = '__all__' | '__zone__' | '__name__'

export type DeploymentStatusType =
  | 'healthy'
  | 'warning'
  | 'unhealthy'
  | 'pending'
  | 'stopping'
  | 'stopped'

export interface DeploymentStatus {
  healthy: boolean
  status: DeploymentStatusType
}

export enum DeploymentStatusSort {
  pending,
  stopping,
  unhealthy,
  warning,
  healthy,
  stopped,
}

export type PremiumSaasLevel = 'gold' | 'platinum' | 'enterprise'
export type SaasLevel = 'standard' | PremiumSaasLevel

export type PlainHashMap<TValue = any> = {
  [key: string]: TValue
}

export type StrictSubset<TSubset, TSuperset> = DisambiguateSet<TSuperset, TSubset> & TSubset

export type EsProxyResponseBody7x = {
  took: number
  timed_out: boolean
  _shards: {
    total: number
    successful: number
    skipped: number
    failed: number
  }
  hits: {
    total:
      | null
      | number
      | {
          value: number
          relation: 'eq' | 'gte'
        }
    max_score: null
    hits: any[]
  }
}

export type EsProxyResponseConsole = EsProxyResponse<string | any>

export type EsProxyResponse<TBody = any> = {
  body: TBody
  contentType: string
  status: number
  statusText: string
  requestDuration: number
}

export type LinkInfo = {
  id: string
  appKey: string
  label: MessageDescriptor
  uiUri: string
  apiUri: string | undefined
  available: boolean
  showLaunchLink: boolean
  appID: string
}

export type Keystore = {
  [key: string]: PlainHashMap<string | boolean | PlainHashMap<string>>
}

export type ArchitectureBreakdownItem = {
  sku: string | null
  price: number
  pricePointFail?: boolean
  instanceConfiguration: InstanceConfiguration | null
  nodeConfiguration: AnyTopologyElement | null
}

export type NodesVisualizationFilters = {
  instanceConfigurationId?: string
  health?: 'healthy' | 'stopped-routing' | 'node-paused' | 'unhealthy'
  dataTier?: 'data_hot' | 'data_warm' | 'data_cold' | 'data_frozen'
}

export type FeedbackType =
  | 'not_needed'
  | 'consolidating_accounts'
  | 'too_expensive'
  | 'stability_issues'
  | 'bad_support'
  | 'bad_documentation'
  | 'other'

export type RoutableBreadcrumb = {
  text: NonNullable<ReactNode>
  to?: string
}
