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

import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { get } from 'lodash'

// FIXME: Use the asyncRequest registry instead
import {
  enableTwoFactorReqId,
  stopDeploymentReqId,
  createClusterReqId,
  createTempShieldUserReqId,
  deleteTempShieldUserReqId,
  fetchRecoveryInfoReqId,
  fetchUserReqId,
} from '../actions/asyncRequests/handcraftedReqIds'

import adminconsoleLoggingSettings, * as fromAdminconsoleLoggingSettings from './adminconsoleLoggingSettings'
import adminconsoles, * as fromAdminconsoles from './adminconsoles'
import allocatorLoggingSettings, * as fromAllocatorLoggingSettings from './allocatorLoggingSettings'
import allocators, * as fromAllocators from './allocators'
import allocatorSearch, * as fromAllocatorSearch from './allocatorSearch'
import apiBaseUrl, * as fromApiBaseUrl from './apiBaseUrl'
import apiKeys, * as fromApiKeys from './apiKeys'
import apmPlans, * as fromApmPlans from './apmPlans'
import apms, * as fromApms from './apms'
import apmTokens from './apms/apmTokens'
import appSearchToEnterpriseSearchMigrationProgress, * as fromAppSearchToEnterpriseSearchMigrationProgress from './appSearchToEnterpriseSearchMigrationProgress'
import asyncRequests, * as fromAsyncRequests from './asyncRequests'
import auth, * as fromAuth from './auth'
import authenticationInfo, * as fromAuthenticationInfo from './authenticationInfo'
import authMethods from './authMethods'
import blogs, * as fromBlogs from './blogs'
import blueprint, * as fromBlueprint from './blueprint'
import ccsEligibleRemotes, * as fromCcsEligibleRemotes from './ccsEligibleRemotes'
import ccsSettings, * as fromCcsSettings from './ccsSettings'
import cloudStatus, * as fromStatus from './status'
import clusterConsole, * as fromClusterConsole from './clusterConsole'
import clusterDiagnosticBundles, * as fromClusterDiagnosticBundles from './clusterDiagnosticBundles'
import clusterHealth, * as fromClusterHealth from './clusters/clusterHealth'
import clusterKeystore, * as fromClusterKeystore from './clusterKeystore'
import clusterLogs, * as fromClusterLogs from './clusterLogs'
import clusterProxy, * as fromClusterProxy from './clusterProxy'
import clusterRecoveryInfo, * as fromRecoveryInfo from './clusters/recoveryInfo'
import clusters, * as fromClusters from './clusters'
import clustersCredentials, * as fromClustersCredentials from './clusters/clustersCredentials'
import clustersForAdvancedEditing, * as fromClustersForAdvancedEditing from './clustersForAdvancedEditing'
import clusterSnapshots, * as fromClusterSnapshots from './clusterSnapshots'
import config from './config'
import constructorLoggingSettings, * as fromConstructorLoggingSettings from './constructorLoggingSettings'
import containerSets, * as fromContainerSets from './containerSets'
import coordinatorDemotions, * as fromCoordinatorDemotions from './runners/demoteCoordinator'
import coordinators, * as fromCoordinators from './runners/fetchCoordinators'
import currentAccount, * as fromCurrentAccount from './currentAccount'
import currentUser, * as fromCurrentUser from './currentUser'
import deleteAllocator, * as fromDeleteAllocator from './allocators/deleteAllocator'
import deploymentAlias, * as fromDeploymentAlias from './deploymentAlias'
import deploymentDomainName, * as fromDeploymentDomainName from './deploymentDomainName'
import deploymentExtensions, * as fromDeploymentExtensions from './deploymentExtensions'
import deploymentHeapDumps, * as fromDeploymentHeapDumps from './deploymentHeapDumps'
import deploymentTemplates, * as fromDeploymentTemplates from './deploymentTemplates'
import deprecations, * as fromDeprecations from './deprecations'
import eula, * as fromEula from './eula'
import feeds, * as fromFeeds from './feeds'
import globalDeploymentTemplates, * as fromGlobalDeploymentTemplates from './globalDeploymentTemplates'
import happySadClusters, * as fromHappySadClusters from './happySadClusters'
import instanceConfigurations, * as fromInstanceConfigurations from './instanceConfigurations'
import instanceTypes, * as fromInstanceTypes from './instanceTypes'
import ipFilter, * as fromIpFilter from './ipFilter'
import kibanaPlans, * as fromKibanaPlans from './kibanaPlans'
import kibanas, * as fromKibanas from './kibanas'
import licenses, * as fromLicenses from './licenses'
import localUsers, * as fromLocalUsers from './localUsers'
import managedApiKeys, * as fromManagedApiKeys from './apiKeys/managedApiKeys'
import mfaDevices, * as fromMfaDevices from './mfaDevices'
import migratedClusterTemplate, * as fromMigratedClusterTemplate from './migratedClusterTemplate'
import newTempShieldUser from './clusters/newTempShieldUser'
import nodeConfigurations, * as fromNodeConfigurations from './nodeConfigurations'
import nodeStats, * as fromNodeStats from './nodeStats'
import notificationMessages from './notificationMessages'
import organizations, * as fromOrganizations from './organizations'
import pendingTemplate from './pendingTemplate'
import phoneHomeConfig, * as fromPhoneHomeConfig from './phoneHomeConfig'
import phoneHomeDisabled, * as fromPhoneHomeDisabled from './phoneHomeDisabled'
import plans, * as fromPlans from './plans'
import platform, * as fromPlatform from './platform'
import providers, * as fromProviders from './providers'
import proxies, * as fromProxies from './proxies'
import regions, * as fromRegions from './regions'
import resourceComments, * as fromResourceComments from './resourceComments'
import root from './root'
import runnerLoggingSettings, * as fromRunnerLoggingSettings from './runnerLoggingSettings'
import runners, * as fromRunners from './runners'
import saasUsers, * as fromSaasUsers from './saasUsers'
import saveClusterAcl, * as fromSaveClusterAcl from './clusters/saveClusterAcl'
import search, * as fromSearch from './search'
import searchAllClusters, * as fromSearchAllClusters from './searchAllClusters'
import searchClusters, * as fromSearchClusters from './searchClusters'
import searchForAnything, * as fromSearchForAnything from './searchForAnything'
import snapshotRepositories, * as fromSnapshotRepositories from './snapshotRepositories'
import snapshotSettings, * as fromSnapshotSettings from './snapshotSettings'
import snapshotStatus, * as fromSnapshotStatus from './snapshotStatus'
import stackDeploymentDryRuns, * as fromStackDeploymentDryRuns from './stackDeploymentDryRuns'
import stackDeployments, * as fromStackDeployments from './stackDeployments'
import stackDeploymentSearches, * as fromStackDeploymentSearches from './stackDeploymentSearches'
import storedProcedures, * as fromStoredProcedures from './storedProcedures'
import theme from './theme'
import tls, * as fromTls from './tls'
import trafficFilters, * as fromTrafficFilters from './trafficFilters'
import trustManagement, * as fromTrustManagement from './trustManagement'
import user, * as fromUser from './user'
import vacate, * as fromVacate from './vacate'
import vacateValidate, * as fromVacateValidate from './vacateValidate'
import vacateEsClusters, * as fromVacateEsClusters from './vacateEsClusters'
import versions, * as fromElasticStackVersions from './elasticStack'

import adminconsoleReducers from '../apps/adminconsole/reducers'
import userconsoleReducers from '../apps/userconsole/reducers'
import skuPickerReducers from '../apps/sku-picker/reducers'

import history from '../lib/history'

import { getConfigForKeyFrom } from '../store'

import {
  ApmId,
  ReduxState,
  ElasticsearchId,
  KibanaId,
  RegionId,
  VersionNumber,
  CloudAppConfig,
} from '../types'

import Permission from '../lib/api/v1/permissions'

export function getReducers(config: CloudAppConfig) {
  // @ts-ignore I think the problem here is that we haven't typed all the actions...?
  return combineReducers<ReduxState>({
    ...getCommonReducers(),
    ...getAppSpecificReducers(config),
  })
}

function getCommonReducers() {
  const router = connectRouter(history)

  return {
    adminconsoleLoggingSettings,
    adminconsoles,
    allocatorLoggingSettings,
    allocators,
    allocatorSearch,
    apiBaseUrl,
    apiKeys,
    apmPlans,
    apms,
    apmTokens,
    appSearchToEnterpriseSearchMigrationProgress,
    asyncRequests,
    auth,
    authenticationInfo,
    authMethods,
    blogs,
    blueprint,
    ccsEligibleRemotes,
    ccsSettings,
    cloudStatus,
    clusterConsole,
    clusterDiagnosticBundles,
    clusterHealth,
    clusterKeystore,
    clusterLogs,
    clusterProxy,
    clusterRecoveryInfo,
    clusters,
    clustersCredentials,
    clustersForAdvancedEditing,
    clusterSnapshots,
    config,
    constructorLoggingSettings,
    containerSets,
    coordinatorDemotions,
    coordinators,
    currentAccount,
    currentUser,
    deleteAllocator,
    deploymentAlias,
    deploymentDomainName,
    deploymentExtensions,
    deploymentHeapDumps,
    deploymentTemplates,
    deprecations,
    eula,
    feeds,
    globalDeploymentTemplates,
    happySadClusters,
    instanceConfigurations,
    instanceTypes,
    ipFilter,
    kibanaPlans,
    kibanas,
    licenses,
    localUsers,
    managedApiKeys,
    mfaDevices,
    migratedClusterTemplate,
    newTempShieldUser,
    nodeConfigurations,
    nodeStats,
    notificationMessages,
    organizations,
    pendingTemplate,
    phoneHomeConfig,
    phoneHomeDisabled,
    plans,
    platform,
    providers,
    proxies,
    regions,
    resourceComments,
    root,
    router,
    runnerLoggingSettings,
    runners,
    saasUsers,
    saveClusterAcl,
    search,
    searchAllClusters,
    searchClusters,
    searchForAnything,
    snapshotRepositories,
    snapshotSettings,
    snapshotStatus,
    stackDeploymentDryRuns,
    stackDeployments,
    stackDeploymentSearches,
    storedProcedures,
    theme,
    tls,
    trafficFilters,
    trustManagement,
    user,
    vacate,
    vacateValidate,
    vacateEsClusters,
    versions,
  }
}

function getAppSpecificReducers(config: CloudAppConfig) {
  if (getConfigForKeyFrom(config, `APP_NAME`) === `userconsole`) {
    return userconsoleReducers
  }

  if (getConfigForKeyFrom(config, `APP_NAME`) === `sku-picker`) {
    return skuPickerReducers
  }

  return adminconsoleReducers // SaaS adminconsole and Cloud Enterprise
}

export * from './asyncRequests/registry'

export { getRawConfig } from './config'

export const getRoot = (state: ReduxState) => state.root
export const getNewTempShieldUser = (state: ReduxState) => state.newTempShieldUser
export const getTheme = (state: ReduxState) => state.theme
export const getNotificationsState = (state: ReduxState, notificationType) =>
  state.notificationMessages[notificationType]

export const getStoredProcedure = (state: ReduxState, storedProcedureId) =>
  fromStoredProcedures.getStoredProcedure(state.storedProcedures, storedProcedureId)

export const getRegionIds = (state: ReduxState) => fromRegions.getRegionIds(state.regions)

export const getRegion = (state: ReduxState, regionId: RegionId) =>
  fromRegions.getRegion(state.regions, regionId)

export const getRegionSettings = (state: ReduxState, regionId) =>
  fromRegions.getRegionSettings(state.regions, regionId)

export const getAllocator = (state: ReduxState, regionId: RegionId, allocatorId: string) =>
  fromAllocators.getAllocator(state.allocators, regionId, allocatorId)

export const getAdminconsoles = (state: ReduxState, regionId: string) =>
  fromAdminconsoles.getAdminconsoles(state.adminconsoles, regionId)

export const getAdminconsoleLoggingSettings = (
  state: ReduxState,
  regionId: string,
  adminconsoleId: string,
) =>
  fromAdminconsoleLoggingSettings.getAdminconsoleLoggingSettings(
    state.adminconsoleLoggingSettings,
    regionId,
    adminconsoleId,
  )

export const getRunnerLoggingSettings = (state: ReduxState, regionId: string, runnerId: string) =>
  fromRunnerLoggingSettings.getRunnerLoggingSettings(
    state.runnerLoggingSettings,
    regionId,
    runnerId,
  )

export const getAllocatorLoggingSettings = (
  state: ReduxState,
  regionId: string,
  allocatorId: string,
) =>
  fromAllocatorLoggingSettings.getAllocatorLoggingSettings(
    state.allocatorLoggingSettings,
    regionId,
    allocatorId,
  )

export const getConstructorLoggingSettings = (
  state: ReduxState,
  regionId: string,
  constructorId: string,
) =>
  fromConstructorLoggingSettings.getConstructorLoggingSettings(
    state.constructorLoggingSettings,
    regionId,
    constructorId,
  )

export const getRoles = (state: ReduxState, regionId: RegionId) =>
  fromBlueprint.getRoles(state.blueprint.roles, regionId)

export const getCluster = (state: ReduxState, regionId: RegionId, clusterId: ElasticsearchId) =>
  fromClusters.getCluster(state.clusters, regionId, clusterId)

export const getClusterForAdvancedEditing = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) =>
  fromClustersForAdvancedEditing.getClusterForAdvancedEditing(
    state.clustersForAdvancedEditing,
    regionId,
    clusterId,
  )

export const getDeletedClusters = (state: ReduxState) =>
  fromClusters.getDeletedClusters(state.clusters)

export const getClusterSnapshots = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromClusterSnapshots.getClusterSnapshots(state.clusterSnapshots, regionId, clusterId)

export const getClusterSnapshotByName = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
  snapshotName: string,
) =>
  fromClusterSnapshots.getClusterSnapshotByName(
    state.clusterSnapshots,
    regionId,
    clusterId,
    snapshotName,
  )

export const getSnapshotRestore = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromClusterSnapshots.getSnapshotRestore(state.clusterSnapshots, regionId, clusterId)

export const getClusterCredentials = (state: ReduxState, id: string, refId: string) =>
  fromClustersCredentials.getClusterCredentials(state.clustersCredentials, id, refId)

export const getResourceComments = (
  state: ReduxState,
  regionId: RegionId,
  resourceType: string,
  resourceId: string,
) =>
  fromResourceComments.getResourceComments(
    state.resourceComments,
    regionId,
    resourceType,
    resourceId,
  )

export const getDeploymentHeapDumps = (state: ReduxState, deploymentId: string) =>
  fromDeploymentHeapDumps.getDeploymentHeapDumps(state.deploymentHeapDumps, deploymentId)

export const getLicense = (state: ReduxState, regionId: RegionId) =>
  fromLicenses.getLicense(state.licenses, regionId)

export const getStopClusterStatus = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => getAsyncRequestStatus(state, stopDeploymentReqId(regionId, clusterId))

export const getClusterRecoveryInfo = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromRecoveryInfo.getRecoveryInfo(state.clusterRecoveryInfo, regionId, clusterId)

export const getClusterHealth = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromClusterHealth.getClusterHealth(state.clusterHealth, regionId, clusterId)

export const getClusterProxyResponse = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromClusterProxy.getClusterProxyResponse(state.clusterProxy, regionId, clusterId)

export const getClusterProxyRequest = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromClusterConsole.getClusterConsoleRequest(state.clusterConsole, regionId, clusterId)

export const getClusterProxyRequestHistory = (state: ReduxState) =>
  fromClusterConsole.getClusterConsoleRequestHistory(state.clusterConsole)

export const getKibana = (state: ReduxState, regionId: RegionId, kibanaId: KibanaId) =>
  fromKibanas.getKibana(state.kibanas, regionId, kibanaId)

export const getApm = (state: ReduxState, regionId: RegionId, apmId: ApmId) =>
  fromApms.getApm(state.apms, regionId, apmId)

export const getApmPlanAttempts = (state: ReduxState, regionId: RegionId, apmId: ApmId) =>
  fromApmPlans.getPlanAttemptsWithDiff(state.apmPlans, regionId, apmId)

export const getPendingApmPlanAttempt = (state: ReduxState, regionId: RegionId, apmId: ApmId) =>
  fromApmPlans.getPendingPlanAttempt(state.apmPlans, regionId, apmId)

export const getCreateClusterStatus = (state: ReduxState) =>
  getAsyncRequestStatus(state, createClusterReqId())

export const getCreateTempShieldUsersInformation = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => getAsyncRequestStatus(state, createTempShieldUserReqId(regionId, clusterId))

export const getDeleteTempShieldUsersInformation = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => getAsyncRequestStatus(state, deleteTempShieldUserReqId(regionId, clusterId))

export const getPlanAttempts = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromPlans.getPlanAttempts(state.plans, regionId, clusterId)

export const getPendingPlanAttempt = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromPlans.getPendingPlanAttempt(state.plans, regionId, clusterId)

export const getPlanAttemptsWithDiff = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromPlans.getPlanAttemptsWithDiff(state.plans, regionId, clusterId)

export const getKibanaPlanAttempts = (state: ReduxState, regionId: RegionId, kibanaId: KibanaId) =>
  fromKibanaPlans.getKibanaPlanAttemptsWithDiff(state.kibanaPlans, regionId, kibanaId)

export const getPendingKibanaPlanAttempt = (
  state: ReduxState,
  regionId: RegionId,
  kibanaId: KibanaId,
) => fromKibanaPlans.getPendingKibanaPlanAttempt(state.kibanaPlans, regionId, kibanaId)

export const getSaveClusterAclInformation = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => fromSaveClusterAcl.getSaveClusterAclInformation(state.saveClusterAcl, regionId, clusterId)

export const getFetchRecoveryInfoRequest = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) => getAsyncRequestStatus(state, fetchRecoveryInfoReqId(regionId, clusterId))

export const getDeleteAllocatorInformation = (
  state: ReduxState,
  regionId: RegionId,
  allocatorId: string,
) => fromDeleteAllocator.getDeleteAllocatorInformation(state.deleteAllocator, regionId, allocatorId)

export const getRunner = (state: ReduxState, regionId: RegionId, runnerId: string) =>
  fromRunners.getRunner(state.runners, regionId, runnerId)

export const getDemoteCoordinator = (state: ReduxState, regionId: RegionId, runnerId: string) =>
  fromCoordinatorDemotions.getDemoteCoordinator(state.coordinatorDemotions, regionId, runnerId)

export const getCoordinatorById = (state: ReduxState, regionId: RegionId, runnerId: string) =>
  fromCoordinators.getCoordinatorById(state.coordinators, regionId, runnerId)

export const getVersionStacks = (state: ReduxState, regionId: RegionId) =>
  fromElasticStackVersions.getVersionStacks(state.versions, regionId)

export const getVersionStack = (state: ReduxState, regionId: RegionId, version: string) =>
  fromElasticStackVersions.getVersionStack(state.versions, regionId, version)

export const getVersionWhitelist = (state: ReduxState, regionId: RegionId) =>
  fromElasticStackVersions.getVersionWhitelist(state.versions, regionId)

export const getProxies = (state: ReduxState, regionId: RegionId) =>
  fromProxies.getProxies(state.proxies, regionId)

export const getRegionConstructors = (state: ReduxState, regionId: RegionId) =>
  fromRegions.getRegionConstructors(state.regions, regionId)

export const getAllocatorVacate = (state: ReduxState, regionId: RegionId, allocatorId) =>
  fromVacate.getAllocatorVacate(state.vacate, regionId, allocatorId)

export const getAllocatorVacateValidate = (
  state: ReduxState,
  regionId: RegionId,
  allocatorId: string,
) => fromVacateValidate.getAllocatorVacateValidate(state.vacateValidate, regionId, allocatorId)

export function getEsClusterVacate(
  state: ReduxState,
  regionId: string,
  clusterId: string,
  instanceIds: string[],
) {
  return fromVacateEsClusters.getEsClusterVacate(
    state.vacateEsClusters,
    regionId,
    clusterId,
    instanceIds,
  )
}

export function getEsClusterVacateValidate(
  state: ReduxState,
  regionId: string,
  clusterId: string,
  instanceIds: string[],
) {
  return fromVacateEsClusters.getEsClusterVacateValidate(
    state.vacateEsClusters,
    regionId,
    clusterId,
    instanceIds,
  )
}
export const getSearchById = (state: ReduxState, id: string) =>
  fromSearch.getSearchById(state.search, id)

export const getSearchForAnythingById = (state: ReduxState, id: string) =>
  fromSearchForAnything.getSearchForAnythingById(state.searchForAnything, id)

export const getSearchClustersById = (state: ReduxState, id: string) =>
  fromSearchClusters.getSearchClustersById(state.searchClusters, id)

export const getSearchAllClustersById = (state: ReduxState, id) =>
  fromSearchAllClusters.getSearchAllClustersById(state.searchAllClusters, id)

export const isEulaAccepted = (state: ReduxState) => fromEula.isAccepted(state.eula)

export const isPhoneHomeEnabled = (state: ReduxState) =>
  fromPhoneHomeConfig.isEnabled(state.phoneHomeConfig)

export const isPhoneHomeDisabled = (state: ReduxState) =>
  fromPhoneHomeDisabled.isPhoneHomeDisabled(state.phoneHomeDisabled)

export const getEnableTwoFactorRequest = (state: ReduxState) =>
  getAsyncRequestStatus(state, enableTwoFactorReqId())

export const getMfa = (state: ReduxState) => fromAuth.getMfa(state.auth)

export const getMfaDevices = (state: ReduxState, userId: string) =>
  fromMfaDevices.getMfaDevices(state.mfaDevices, userId)

export const getUser = (state: ReduxState) => fromUser.getUser(state.user)

export const getAuthenticationInfo = (state: ReduxState) =>
  fromAuthenticationInfo.getAuthenticationInfo(state.authenticationInfo)

export const getClusterDiagnosticBundle = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
) =>
  fromClusterDiagnosticBundles.getClusterDiagnosticBundle(
    state.clusterDiagnosticBundles,
    regionId,
    clusterId,
  )

export const getClusterLogs = (state: ReduxState, regionId: RegionId, clusterId: ElasticsearchId) =>
  fromClusterLogs.getClusterLogs(state.clusterLogs, regionId, clusterId)

export const getUserRequest = (state: ReduxState) => getAsyncRequestStatus(state, fetchUserReqId())

export const getNodeConfigurations = (state: ReduxState, regionId: RegionId) =>
  fromNodeConfigurations.getByRegion(state.nodeConfigurations, regionId)

export const getNodeConfiguration = (
  state: ReduxState,
  regionId: RegionId,
  nodeConfigurationId: string,
) => fromNodeConfigurations.getById(state.nodeConfigurations, regionId, nodeConfigurationId)

export const getNodeStats = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
  nodeId: string,
) => fromNodeStats.getById(state.nodeStats, regionId, clusterId, nodeId)

export const getSnapshotRepositories = (state: ReduxState, regionId) =>
  fromSnapshotRepositories.getByRegion(state.snapshotRepositories, regionId)

export const getSnapshotRepository = (
  state: ReduxState,
  regionId: RegionId,
  repositoryId: string,
) => fromSnapshotRepositories.getById(state.snapshotRepositories, regionId, repositoryId)

export const getSnapshotSettings = (state: ReduxState, regionId: RegionId, clusterId: string) =>
  fromSnapshotSettings.snapshotSetting(state.snapshotSettings, regionId, clusterId)

export const getPlatformOverview = (state: ReduxState) =>
  fromPlatform.getPlatformOverview(state.platform)

export const getRegionInfo = (state: ReduxState, regionId: string) =>
  fromPlatform.getRegionInfo(state.platform, regionId)

export const getPlatformByRegion = (state: ReduxState, regionId: string) =>
  fromPlatform.getPlatformByRegion(state.platform, regionId)

export const getTlsCertificate = (state: ReduxState, regionId: RegionId, certificateTypeId) =>
  fromTls.getById(state.tls, regionId, certificateTypeId)

export const getAsyncRequestStatus = (state: ReduxState, id) =>
  fromAsyncRequests.getAsyncRequest(state.asyncRequests, id)

export const getBuildTagMismatch = (state: ReduxState) =>
  fromAsyncRequests.getBuildTagMismatch(state.asyncRequests)

export const getAllocatorSearchResults = (state: ReduxState, regionId: RegionId, queryId: string) =>
  fromAllocatorSearch.getResults(state.allocatorSearch, regionId, queryId)

export const getInstanceTypes = (state: ReduxState, regionId) =>
  fromInstanceTypes.getInstanceTypes(state.instanceTypes, regionId)

export const getInstanceConfigurations = (state: ReduxState, regionId) =>
  fromInstanceConfigurations.getInstanceConfigurations(state.instanceConfigurations, regionId)

export const getInstanceConfiguration = (state: ReduxState, regionId: RegionId, id) =>
  fromInstanceConfigurations.getInstanceConfiguration(state.instanceConfigurations, regionId, id)

export const getDeploymentTemplates = (
  state: ReduxState,
  regionId: RegionId,
  stackVersion: VersionNumber | null,
) =>
  fromDeploymentTemplates.getDeploymentTemplates(state.deploymentTemplates, regionId, stackVersion)

export const getVisibleDeploymentTemplates = (
  state: ReduxState,
  regionId: RegionId,
  stackVersion: VersionNumber | null,
) =>
  fromDeploymentTemplates.getVisibleDeploymentTemplates(
    state.deploymentTemplates,
    regionId,
    stackVersion,
  )

export const getHotWarmTemplate = (
  state: ReduxState,
  regionId: RegionId,
  deploymentTemplateId: string,
  stackVersion: VersionNumber | null = null,
) =>
  fromDeploymentTemplates.getHotWarmTemplate(
    state.deploymentTemplates,
    regionId,
    deploymentTemplateId,
    stackVersion,
  )

export const getDeploymentTemplate = (
  state: ReduxState,
  regionId: RegionId,
  templateId: string,
  stackVersion: VersionNumber | null = null,
) =>
  fromDeploymentTemplates.getDeploymentTemplate(
    state.deploymentTemplates,
    regionId,
    templateId,
    stackVersion,
  )

export const getSaasUsers = (state: ReduxState) => fromSaasUsers.getSaasUsers(state.saasUsers)

export const getSaasUser = (state: ReduxState, userId: string) =>
  fromSaasUsers.getSaasUser(state.saasUsers, userId)

export const getIpFilterRuleset = (state: ReduxState, rulesetId: string) =>
  fromIpFilter.getRuleset(state.ipFilter, rulesetId)

export const getIpFilterRulesets = (state: ReduxState) => fromIpFilter.getRulesets(state.ipFilter)

export const getIpFilterAssociationsByAllRuleset = (state: ReduxState) =>
  state.ipFilter.associations.byRulesetId

export const getIpFilterAssociationByDeployment = (state: ReduxState, deploymentId: string) =>
  fromIpFilter.getAssociationsByDeployment(state.ipFilter, deploymentId)

export const getSnapshotStatus = (
  state: ReduxState,
  regionId: RegionId,
  clusterId: ElasticsearchId,
  snapshotId: string,
) => fromSnapshotStatus.getSnapshotStatus(state.snapshotStatus, regionId, clusterId, snapshotId)

export const getLocalUsers = (state: ReduxState) => fromLocalUsers.getUsers(state.localUsers)

export const getPendingMigratedTemplate = (state: ReduxState, clusterId: ElasticsearchId) =>
  fromMigratedClusterTemplate.getMigratedClusterTemplate(state.migratedClusterTemplate, clusterId)

export const getCcsSettings = (state: ReduxState, deploymentId: string) =>
  fromCcsSettings.getCcsSettings(state.ccsSettings, deploymentId)

export const getCcsEligibleRemotes = (state: ReduxState, version: string) =>
  fromCcsEligibleRemotes.getCcsEligibleRemotes(state.ccsEligibleRemotes, version)

export const getCurrentUser = (state: ReduxState) =>
  fromCurrentUser.getCurrentUser(state.currentUser)

export const isCurrentUser = (state: ReduxState, username: string) =>
  fromCurrentUser.isCurrentUser(state.currentUser, username)

export const currentUserHasPermission = (state: ReduxState, permissions: Permission[]) =>
  fromCurrentUser.hasPermission(state.currentUser, permissions)

export const getPendingTemplate = (state: ReduxState) => state.pendingTemplate
export const getApiKeys = (state: ReduxState) => fromApiKeys.getApiKeys(state.apiKeys)

export const getManagedApiKeys = (state: ReduxState) =>
  fromManagedApiKeys.getManagedApiKeys(state.managedApiKeys)

export const getStackDeployment = (state: ReduxState, deploymentId) =>
  fromStackDeployments.getStackDeployment(state.stackDeployments, deploymentId)

export const getUpdateDeploymentDryRunResult = (state: ReduxState, deploymentId: string) =>
  fromStackDeploymentDryRuns.getUpdateDeploymentDryRunResult(
    state.stackDeploymentDryRuns,
    deploymentId,
  )

export const getProviders = (state) => fromProviders.getProviders(state.providers)
export const getProvidersNames = (state) => fromProviders.getProvidersNames(state.providers)

export const getRegionIdsByProvider = (state: ReduxState, providerId) =>
  fromProviders.getRegionIdsByProvider(state.providers, providerId)

export const getRegionsByProvider = (state: ReduxState, providerId) =>
  fromProviders.getRegionsByProvider(state.providers, providerId)

export const getProviderIdByRegion = (state: ReduxState, regionId) =>
  fromProviders.getProviderIdByRegion(state.providers, regionId)

export const getRegionName = (state: ReduxState, regionId) =>
  fromProviders.getRegionName(state.providers, regionId)

export const getRegionsByIds = (state) => fromProviders.getRegionsByIds(state.providers)

export const getDefaultRegionId = (state: ReduxState): RegionId => {
  const defaultProvider = fromProviders.getDefaultProvider(state.providers)
  const defaultRegionId =
    get(defaultProvider, [`regions`, `0`, `identifier`]) || get(getRegionIds(state), [`0`])

  return defaultRegionId
}

export const getDefaultDeploymentTemplate = (
  state: ReduxState,
  regionId,
  stackVersion,
): RegionId => {
  const deploymentTemplates = fromDeploymentTemplates.getVisibleDeploymentTemplates(
    state.deploymentTemplates,
    regionId,
    stackVersion,
  )
  const defaultDeploymentTemplate =
    get(deploymentTemplates, [`0`, `identifier`]) || get(getRegionIds(state), [`0`])

  return defaultDeploymentTemplate
}

export const getStackDeploymentCreateResponse = (state: ReduxState, deploymentId) =>
  fromStackDeployments.getStackDeploymentCreateResponse(state.stackDeployments, deploymentId)

export const getDeletedStackDeploymentIds = (state) =>
  fromStackDeployments.getDeletedStackDeploymentIds(state.stackDeployments)

export const getStackDeploymentsFromSearch = (state, queryId) =>
  fromStackDeploymentSearches.getStackDeploymentsFromSearch(state.stackDeploymentSearches, queryId)

export const getCloudStatus = (state: ReduxState) => fromStatus.getCloudStatus(state.cloudStatus)
export const getBlogs = (state: ReduxState) => fromBlogs.getBlogs(state.blogs)

export const getFeed = (state: ReduxState, feed, version, cropAt) =>
  fromFeeds.getOrderedFeed(state.feeds, feed, version, cropAt)

export const getAuthMethods = (state: ReduxState) => state.authMethods

export const getContainerSets = (state: ReduxState, regionId: string) =>
  fromContainerSets.getContainerSets(state.containerSets, regionId)

export const getContainerSet = (state: ReduxState, regionId: string, containerSetId: string) =>
  fromContainerSets.getContainerSet(state.containerSets, regionId, containerSetId)

export const getContainer = (
  state: ReduxState,
  regionId: string,
  containerSetId: string,
  containerId: string,
) => fromContainerSets.getContainer(state.containerSets, regionId, containerSetId, containerId)

export const getTrafficFilterRulesets = (state: ReduxState, regionId?: string) =>
  fromTrafficFilters.getTrafficFilterRulesets(state.trafficFilters, regionId)

export function getLastApiError(state: ReduxState) {
  return fromAsyncRequests.getLastApiError(state.asyncRequests)
}

export function getKeystore(state: ReduxState, deploymentId: string, refId: string) {
  return fromClusterKeystore.getKeystore(state.clusterKeystore, deploymentId, refId)
}

export function getAppSearchToEnterpriseSearchMigrationProgress(
  state: ReduxState,
  deploymentId: string,
) {
  return fromAppSearchToEnterpriseSearchMigrationProgress.getAppSearchToEnterpriseSearchMigrationProgress(
    state.appSearchToEnterpriseSearchMigrationProgress,
    deploymentId,
  )
}

export function getDeploymentExtensions(state: ReduxState) {
  return fromDeploymentExtensions.getDeploymentExtensions(state.deploymentExtensions)
}

export function getDeploymentExtension(state: ReduxState, extensionId: string) {
  return fromDeploymentExtensions.getDeploymentExtension(state.deploymentExtensions, extensionId)
}
export const getGlobalDeploymentTemplates = (state: ReduxState) =>
  fromGlobalDeploymentTemplates.getGlobalDeploymentTemplates(state.globalDeploymentTemplates)

export function getDeprecations(
  state: ReduxState,
  regionId: string,
  clusterId: string,
  version: VersionNumber,
) {
  return fromDeprecations.getDeprecations(state.deprecations, regionId, clusterId, version)
}

export function getHappySadClusters(state: ReduxState, regionId: string) {
  return fromHappySadClusters.getHappySadClusters(state.happySadClusters, regionId)
}

export function getApiBaseUrl(state: ReduxState) {
  return fromApiBaseUrl.getApiBaseUrl(state.apiBaseUrl)
}

export function deploymentAliasEditAccess(state: ReduxState) {
  return fromDeploymentAlias.deploymentAliasEditAccess(state.deploymentAlias)
}

export function getDeploymentDomainName(state: ReduxState, regionId: string) {
  return fromDeploymentDomainName.getDeploymentDomainName(state.deploymentDomainName, regionId)
}

export function getTrustRelationships(state: ReduxState, regionId: string) {
  return fromTrustManagement.getTrustRelationships(state.trustManagement, regionId)
}

export function getTrustRelationshipsWithoutLocal(state: ReduxState, regionId: string) {
  return fromTrustManagement.getTrustRelationshipsWithoutLocal(state.trustManagement, regionId)
}

export function getTrustRelationship(
  state: ReduxState,
  regionId: string,
  trustRelationshipId: string,
) {
  return fromTrustManagement.getTrustRelationship(
    state.trustManagement,
    regionId,
    trustRelationshipId,
  )
}

export function getLocalTrustRelationship(state: ReduxState, regionId: string) {
  return fromTrustManagement.getLocalTrustRelationship(state.trustManagement, regionId)
}

export function getCurrentAccount(state: ReduxState) {
  return fromCurrentAccount.getCurrentAccount(state.currentAccount)
}

export function getOrganizations(state: ReduxState) {
  return fromOrganizations.getOrganizations(state.organizations)
}

export function getOrganization(state: ReduxState, organizationId: string) {
  return fromOrganizations.getOrganization(state.organizations, organizationId)
}

export function getOrganizationInvitations(state: ReduxState, organizationId: string) {
  return fromOrganizations.getOrganizationInvitations(state.organizations, organizationId)
}

export function getOrganizationMembers(state: ReduxState, organizationId: string) {
  return fromOrganizations.getOrganizationMembers(state.organizations, organizationId)
}
