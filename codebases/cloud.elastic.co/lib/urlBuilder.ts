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

import { isSliderInstanceType } from './sliders'

import { isFeatureActivated } from '../store'

import Feature from './feature'

import { ApmId, KibanaId, RegionId, SliderInstanceType } from '../types'

type UrlBuilder = (...params: string[]) => string

export function rootUrl(): string {
  return `/`
}

export function portalUrl(): string {
  return `/home`
}

export function userSettingsUrl(): string {
  return isFeatureActivated(Feature.cloudPortalEnabled) ? `/user/settings` : `/settings`
}

export function regionsUrl(): string {
  return `/platform`
}

export function regionUrl(regionId: RegionId): string {
  return `/region/${regionId}`
}

export function platformUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/platform`
}

export function nodeConfigurationsUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/node-configurations`
}

export function createNodeConfigurationUrl(regionId: RegionId): string {
  const nodeConfigurations = nodeConfigurationsUrl(regionId)
  return `${nodeConfigurations}/create`
}

export function editNodeConfigurationUrl(regionId: RegionId, nodeConfigurationId: string): string {
  const nodeConfigurations = nodeConfigurationsUrl(regionId)
  return `${nodeConfigurations}/${nodeConfigurationId}/edit`
}

export function activityFeedUrl(): string {
  return `/activity-feed`
}

export function activityFeedSliderUrl(sliderInstanceType: SliderInstanceType): string {
  return `${activityFeedUrl()}/${sliderInstanceType}`
}

export function loginUrl(): string {
  return `/login`
}

export function basicLoginUrl(): string {
  return `/login/basic`
}

export function ssoLoginUrl(): string {
  return `/login/sso`
}

export function logoutUrl(): string {
  return `/logout`
}

export function registerUrl(): string {
  return `/registration`
}

export function forgotPasswordUrl(): string {
  return `/forgot`
}

export function regionSettingsUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/settings`
}

export function regionSecurityUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/security`
}

export function snapshotRepositoriesUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/repositories`
}

export function createSnapshotRepositoryUrl(regionId: RegionId): string {
  const repositories = snapshotRepositoriesUrl(regionId)
  return `${repositories}/create`
}

export function editSnapshotRepositoryUrl(regionId, repositoryId: string): string {
  const repositories = snapshotRepositoriesUrl(regionId)
  return `${repositories}/${repositoryId}/edit`
}

export function usersUrl(): string {
  return `/customers`
}

export function userOverviewUrl(userId: string): string {
  return `/customers/${userId}`
}

export function userCreateUrl(): string {
  return `/customers/create`
}

export function managementUrl(): string {
  return `/manage`
}

export function manageRegionUrl(regionId: RegionId): string {
  return `${regionUrl(regionId)}/manage`
}

export function manageNativeUsersUrl(regionId: RegionId): string {
  return `${manageRegionUrl(regionId)}/users`
}

export function manageApiKeysUrl(regionId: RegionId): string {
  return `${manageRegionUrl(regionId)}/keys`
}

export function authenticationProvidersUrl(regionId: RegionId): string {
  return `${manageRegionUrl(regionId)}/authentication-providers`
}

export function addActiveDirectoryAuthenticationProviderUrl(regionId: RegionId): string {
  return `${manageRegionUrl(regionId)}/authentication-providers/active-directory/create`
}

export function editActiveDirectoryAuthenticationProviderUrl(
  regionId: RegionId,
  realmId: string,
): string {
  return `${manageRegionUrl(regionId)}/authentication-providers/active-directory/${realmId}`
}

export function addLdapAuthenticationProviderUrl(regionId: RegionId): string {
  return `${manageRegionUrl(regionId)}/authentication-providers/ldap/create`
}

export function editLdapAuthenticationProviderUrl(regionId: RegionId, realmId: string): string {
  return `${manageRegionUrl(regionId)}/authentication-providers/ldap/${realmId}`
}

export function addSamlAuthenticationProviderUrl(regionId: RegionId): string {
  return `${manageRegionUrl(regionId)}/authentication-providers/saml/create`
}

export function editSamlAuthenticationProviderUrl(regionId: RegionId, realmId: string): string {
  return `${manageRegionUrl(regionId)}/authentication-providers/saml/${realmId}`
}

export function elasticStackVersionsUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/elastic-stack`
}

export function platformTrustManagementUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/trust-management`
}

export function elasticStackVersionUrl(regionId: RegionId, versionId: string): string {
  const versions = elasticStackVersionsUrl(regionId)
  return `${versions}/${versionId}`
}

export function constructorsUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/constructors`
}

export function deploymentsUrl(): string {
  return `/deployments`
}

/* `resolveDeploymentUrlForEsCluster` is a bit of a hack: when we only have an ES cluster ID,
 * and we want to redirect to a deployment page, we use this function to decide
 * where to send users.
 *
 * we need to go through the cluster resolver:
 *   /deployments/resolve/cluster/us-east-1/a00/snapshots/scheduled-1337
 *
 * the resolver ends up redirecting the customer to the actual deployment:
 *   /deployments/b00/snapshots/scheduled-1337
 *
 * this function is designed in this way so that we can build reasonable URLs instead of
 * relying on some sort of "action" map for each kind of URL, or duplicating all url
 * builders we need for the Deployments API.
 */
export function resolveDeploymentUrlForEsCluster(
  buildDeploymentUrl: UrlBuilder,
  regionId: RegionId,
  esClusterId: string,
  ...rest: string[]
): string {
  const params = [':deploymentId', ...rest]
  const baseUrl = deploymentUrl(':deploymentId')
  const absoluteTargetUrl = buildDeploymentUrl(...params)

  if (!absoluteTargetUrl.startsWith(baseUrl)) {
    throw new Error(
      `resolveDeploymentUrlForEsCluster expects buildDeploymentUrl to produce deployment routes`,
    )
  }

  const relativeTargetUrl = absoluteTargetUrl.replace(baseUrl, ``)
  const baseResolveUrl = `/deployments/resolve/cluster/${regionId}/${esClusterId}`

  if (!relativeTargetUrl) {
    return baseResolveUrl
  }

  return `${baseResolveUrl}${relativeTargetUrl}`
}

export function deploymentUrl(deploymentId: string): string {
  return `/deployments/${deploymentId}`
}

export function deploymentGettingStartedUrl(deploymentId: string): string {
  return `/deployments/${deploymentId}/getting-started`
}

export function deploymentEditUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/edit`
}

export function deploymentAdvancedEditUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/edit/advanced`
}

export function deploymentEditFromAttemptUrl(deploymentId: string) {
  return {
    pathname: deploymentEditUrl(deploymentId),
    query: {
      fromAttempt: true,
    },
  }
}

export function deploymentActivityUrl(deploymentId: string = `:deploymentId`): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/activity`
}

export function deploymentIlmMigrationUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/migrate-to-index-lifecycle-management`
}

export function sliderActivityUrl(
  deploymentId: string,
  sliderInstanceType: SliderInstanceType,
): string {
  const deploymentActivity = deploymentActivityUrl(deploymentId)
  return `${deploymentActivity}/${sliderInstanceType}`
}

export function deploymentActivityElasticsearchUrl(deploymentId: string): string {
  return sliderActivityUrl(deploymentId, `elasticsearch`)
}

export function deploymentActivityKibanaUrl(deploymentId: string): string {
  return sliderActivityUrl(deploymentId, `kibana`)
}

export function deploymentActivityApmUrl(deploymentId: string): string {
  return sliderActivityUrl(deploymentId, `apm`)
}

export function securityUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/security`
}

export function operationsUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/operations`
}

export function indexCurationUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/index-curation`
}

export function performanceMetricsUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/metrics`
}

export function elasticsearchLogsUrl(deploymentId: string): string {
  const deploymentEs = elasticsearchUrl(deploymentId)
  return `${deploymentEs}/logs`
}

export function heapDumpsUrl(deploymentId: string): string {
  const operations = operationsUrl(deploymentId)
  return `${operations}/heap-dumps`
}

export function logsMonitoringUrl(deploymentId: string) {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/logs-metrics`
}

export function kibanaUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/kibana`
}

export function resolveDeploymentUrlForAnyCluster({
  regionId,
  sliderInstanceType,
  stackDeploymentId,
  clusterId,
}: {
  regionId: RegionId
  sliderInstanceType?: SliderInstanceType
  clusterId: string
  stackDeploymentId?: string
}): string {
  if (stackDeploymentId && sliderInstanceType && isSliderInstanceType(sliderInstanceType)) {
    return sliderUrl(stackDeploymentId, sliderInstanceType)
  }

  if (sliderInstanceType === `elasticsearch`) {
    return resolveDeploymentUrlForEsCluster(elasticsearchUrl, regionId, clusterId)
  }

  if (sliderInstanceType === `kibana`) {
    return resolveDeploymentUrlForKibanaCluster(regionId, clusterId)
  }

  if (sliderInstanceType === `apm`) {
    return resolveDeploymentUrlForApmCluster(regionId, clusterId)
  }

  if (sliderInstanceType === `enterprise_search`) {
    return resolveDeploymentUrlForApmCluster(regionId, clusterId)
  }

  return resolveDeploymentUrlForEsCluster(deploymentUrl, regionId, clusterId)
}

function resolveDeploymentUrlForKibanaCluster(regionId: RegionId, kibanaId: KibanaId): string {
  return `/deployments/resolve/kibana/${regionId}/${kibanaId}`
}

function resolveDeploymentUrlForApmCluster(regionId: RegionId, apmId: ApmId): string {
  return `/deployments/resolve/apm/${regionId}/${apmId}`
}

export function apmUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/apm`
}

export function sliderUrl(deploymentId: string, sliderInstanceType: SliderInstanceType): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/${sliderInstanceType}`
}

export function elasticsearchUrl(deploymentId: string): string {
  const deployment = deploymentUrl(deploymentId)
  return `${deployment}/elasticsearch`
}

export function deploymentUrls(deploymentId: string) {
  const root = deploymentUrl(deploymentId)

  return {
    advancedEdit: deploymentAdvancedEditUrl(deploymentId),
    apm: apmUrl(deploymentId),
    appsearch: sliderUrl(deploymentId, `appsearch`),
    console: clusterApiConsoleUrl(deploymentId),
    deploymentActivity: deploymentActivityUrl(deploymentId),
    edit: deploymentEditUrl(deploymentId),
    elasticsearch: elasticsearchUrl(deploymentId),
    enterprise_search: sliderUrl(deploymentId, `enterprise_search`),
    indexManagement: indexCurationUrl(deploymentId),
    kibana: kibanaUrl(deploymentId),
    logs: elasticsearchLogsUrl(deploymentId),
    metrics: performanceMetricsUrl(deploymentId),
    operations: operationsUrl(deploymentId),
    root,
    security: securityUrl(deploymentId),
    snapshots: clusterSnapshotsUrl(deploymentId),
  }
}

export function clusterSnapshotsUrl(deploymentId: string): string {
  return `${elasticsearchUrl(deploymentId)}/snapshots`
}

export function clusterApiConsoleUrl(deploymentId: string): string {
  return `${elasticsearchUrl(deploymentId)}/console`
}

export function clusterSnapshotUrl(deploymentId: string, snapshotName: string): string {
  return `${elasticsearchUrl(deploymentId)}/snapshots/${snapshotName}`
}

export function createDeploymentUrl(): string {
  return `/deployments/create`
}

export function deploymentExtensionsUrl(): string {
  return `/deployment-features/extensions`
}

export function deploymentExtensionUrl(extensionId: string): string {
  return `/deployment-features/extensions/${extensionId}/edit`
}

export function deploymentExtensionCreateUrl(): string {
  return `/deployment-features/extensions/create`
}

export function topologyUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/templates`
}

export function topologyDeploymentTemplatesUrl(regionId: RegionId): string {
  const regionTopology = topologyUrl(regionId)
  return `${regionTopology}/deployments`
}

export function topologyViewDeploymentTemplateUrl(regionId: RegionId, templateId: string): string {
  return `${topologyDeploymentTemplatesUrl(regionId)}/${templateId}`
}

export function topologyEditDeploymentTemplateUrl(regionId: RegionId, templateId: string): string {
  return `${topologyViewDeploymentTemplateUrl(regionId, templateId)}/edit`
}

export function createTopologyClusterTemplateUrl(regionId: RegionId): string {
  const regionTopology = topologyUrl(regionId)
  return `${regionTopology}/deployments/create`
}

export function topologyInstanceConfigurationsUrl(regionId: RegionId): string {
  const regionTopology = topologyUrl(regionId)
  return `${regionTopology}/instance-configurations`
}

export function topologyViewInstanceConfigurationUrl(
  regionId: RegionId,
  instanceId: string,
): string {
  const regionTopology = topologyUrl(regionId)
  return `${regionTopology}/instance-configurations/${instanceId}`
}

export function topologyEditInstanceConfigurationUrl(
  regionId: RegionId,
  instanceId: string,
): string {
  return `${topologyViewInstanceConfigurationUrl(regionId, instanceId)}/edit`
}

export function createTopologyNodeConfigurationUrl(regionId: RegionId): string {
  const regionTopology = topologyUrl(regionId)
  return `${regionTopology}/instance-configurations/create`
}

export function hostsUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/hosts`
}

export function hostsAllocatorsUrl(regionId: RegionId): string {
  const hosts = hostsUrl(regionId)
  return `${hosts}/allocators`
}

export function hostsProxiesUrl(regionId: RegionId): string {
  const hosts = hostsUrl(regionId)
  return `${hosts}/proxies`
}

export function hostsControlPlanesUrl(regionId: RegionId): string {
  const hosts = hostsUrl(regionId)
  return `${hosts}/control-planes`
}

export function hostUrl(regionId: RegionId, hostId: string): string {
  const hosts = hostsUrl(regionId)
  return `${hosts}/${hostId}`
}

export function hostAllocatorUrl(regionId: RegionId, hostId: string): string {
  const host = hostUrl(regionId, hostId)
  return `${host}/allocator`
}

export function hostAllocatorMoveNodesUrl(regionId: RegionId, hostId: string): string {
  const allocator = hostAllocatorUrl(regionId, hostId)
  return allocator
}

export function hostProxyUrl(regionId: RegionId, hostId: string): string {
  const host = hostUrl(regionId, hostId)
  return `${host}/proxy`
}

export function hostControlPlaneUrl(regionId: RegionId, hostId: string): string {
  const host = hostUrl(regionId, hostId)
  return `${host}/control-plane`
}

export function deploymentFeaturesUrl(): string {
  return `/deployment-features`
}

export function supportUrl(): string {
  return `/support`
}

export function apiKeysUrl(): string {
  return `/keys`
}

export function adminconsolesUrl(regionId: string): string {
  return `${regionUrl(regionId)}/admin-consoles`
}

export function adminconsoleOverviewUrl(regionId: string, adminconsoleId: string): string {
  return `${adminconsolesUrl(regionId)}/${adminconsoleId}`
}

export function containerSetsUrl(regionId: RegionId): string {
  const region = regionUrl(regionId)
  return `${region}/container-sets`
}

export function containerSetUrl(regionId: RegionId, containerSetId: string): string {
  const containerSets = containerSetsUrl(regionId)
  return `${containerSets}/${containerSetId}`
}

export function containerUrl(
  regionId: RegionId,
  containerSetId: string,
  containerId: string,
): string {
  const containerSet = containerSetUrl(regionId, containerSetId)
  return `${containerSet}/containers/${containerId}`
}

export function notFoundUrl(): string {
  return `/not-found`
}
