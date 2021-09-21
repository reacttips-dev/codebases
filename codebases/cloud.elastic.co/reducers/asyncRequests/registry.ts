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

import * as actions from '../../constants/actions'

import { getAsyncRequestState } from './'

import { getConfigForKey } from '../../store'

export function fetchRegionListRequest(state, ...rest) {
  const defaultRegionId = Boolean(getConfigForKey(`DEFAULT_REGION`))

  if (defaultRegionId) {
    return fetchPlatformRequest(state, ...rest)
  }

  return fetchProvidersRequest(state, ...rest)
}

export const fetchRootRequest = getAsyncRequestState(actions.FETCH_ROOT)
export const fetchUserRequest = getAsyncRequestState(actions.FETCH_USER)
export const fetchRegionRequest = getAsyncRequestState(actions.FETCH_REGION)
export const fetchRegionSettingsRequest = getAsyncRequestState(actions.FETCH_REGION_SETTINGS)
export const saveRegionSettingRequest = getAsyncRequestState(actions.SAVE_REGION_SETTING)
export const deleteRegionSettingRequest = getAsyncRequestState(actions.DELETE_REGION_SETTING)
export const fetchClusterRequest = getAsyncRequestState(actions.FETCH_CLUSTER)
export const fetchLicenseRequest = getAsyncRequestState(actions.FETCH_LICENSE)
export const addLicenseRequest = getAsyncRequestState(actions.SET_LICENSE)
export const removeLicenseRequest = getAsyncRequestState(actions.REMOVE_LICENSE)
export const acceptEulaRequest = getAsyncRequestState(actions.ACCEPT_EULA)
export const fetchResetPasswordStatus = getAsyncRequestState(actions.RESET_CLUSTER_PASSWORD)
export const fetchNodeConfigurationsRequest = getAsyncRequestState(
  actions.FETCH_NODE_CONFIGURATIONS,
)
export const saveClusterDataRequest = getAsyncRequestState(actions.SAVE_CLUSTER_DATA)
export const setAllocatorMaintenanceModeRequest = getAsyncRequestState(
  actions.SET_ALLOCATOR_MAINTENANCE_MODE,
)
export const getAllocatorRequest = getAsyncRequestState(actions.FETCH_ALLOCATOR)
export const getPhoneHomeConfigRequest = getAsyncRequestState(actions.UPDATE_PHONE_HOME_ENABLED)
export const renameClusterRequest = getAsyncRequestState(actions.RENAME_CLUSTER)
export const saveClusterMonitoringRequest = getAsyncRequestState(actions.SAVE_CLUSTER_MONITORING)
export const cancelClusterMonitoringRequest = getAsyncRequestState(
  actions.CANCEL_CLUSTER_MONITORING,
)
export const saveClusterPlanRequest = getAsyncRequestState(actions.SAVE_CLUSTER_PLAN)
export const fetchRunnerRequest = getAsyncRequestState(actions.FETCH_RUNNER)
export const deleteRunnerRequest = getAsyncRequestState(actions.DELETE_RUNNER)
export const deleteDeploymentRequest = getAsyncRequestState(actions.DELETE_DEPLOYMENT)
export const setProxyLoggingRequest = getAsyncRequestState(actions.SET_PROXY_LOGGING)
export const fetchVersionsRequest = getAsyncRequestState(actions.FETCH_VERSIONS)
export const fetchVersionRequest = getAsyncRequestState(actions.FETCH_VERSION)
export const deleteKibanaRequest = getAsyncRequestState(actions.DELETE_KIBANA)
export const fetchKibanaRequest = getAsyncRequestState(actions.FETCH_KIBANA)
export const kibanaPlanAttemptsRequest = getAsyncRequestState(actions.FETCH_KIBANA_PLAN_ATTEMPTS)
export const restartKibanaRequest = getAsyncRequestState(actions.RESTART_KIBANA)
export const stopKibanaRequest = getAsyncRequestState(actions.STOP_KIBANA)
export const updateKibanaPlanRequest = getAsyncRequestState(actions.UPDATE_KIBANA_PLAN)
export const updateKibanaDataRequest = getAsyncRequestState(actions.SAVE_KIBANA_DATA)
export const fetchPlatformRequest = getAsyncRequestState(actions.FETCH_PLATFORM)
export const fetchTlsCertificateRequest = getAsyncRequestState(actions.FETCH_TLS_CERTIFICATE)
export const uploadTlsCertificateRequest = getAsyncRequestState(actions.UPLOAD_TLS_CERTIFICATE)
export const downloadClusterDiagnosticBundleRequest = getAsyncRequestState(
  actions.DOWNLOAD_CLUSTER_DIAGNOSTIC_BUNDLE,
)
export const cancelPlanRequest = getAsyncRequestState(actions.CANCEL_PLAN)
export const fetchSnapshotRepositoryRequest = getAsyncRequestState(
  actions.FETCH_SNAPSHOT_REPOSITORY,
)
export const fetchSnapshotRepositoriesRequest = getAsyncRequestState(
  actions.FETCH_SNAPSHOT_REPOSITORIES,
)
export const deleteSnapshotRepositoryRequest = getAsyncRequestState(
  actions.DELETE_SNAPSHOT_REPOSITORY,
)
export const upsertSnapshotRepositoryRequest = getAsyncRequestState(
  actions.UPSERT_SNAPSHOT_REPOSITORY,
)
export const setSnapshotRepositoryRequest = getAsyncRequestState(actions.SET_SNAPSHOT_REPOSITORY)
export const disableSnapshotsForClusterRequest = getAsyncRequestState(
  actions.DISABLE_SNAPSHOTS_FOR_CLUSTER,
)
export const fetchSnapshotSettingsRequest = getAsyncRequestState(actions.FETCH_SNAPSHOT_SETTINGS)
export const updateSnapshotSettingsRequest = getAsyncRequestState(actions.UPDATE_SNAPSHOT_SETTINGS)
export const restartClusterRequest = getAsyncRequestState(actions.RESTART_CLUSTER)
export const downloadClusterLogsRequest = getAsyncRequestState(actions.DOWNLOAD_CLUSTER_LOGS)
export const uploadStackPackRequest = getAsyncRequestState(actions.UPLOAD_STACK_PACK)
export const setMaintenanceModeRequest = getAsyncRequestState(actions.SET_MAINTENANCE_MODE)
export const setKibanaMaintenanceModeRequest = getAsyncRequestState(
  actions.SET_KIBANA_MAINTENANCE_MODE,
)
export const setApmMaintenanceModeRequest = getAsyncRequestState(actions.SET_APM_MAINTENANCE_MODE)

export const setInstanceStatusRequest = getAsyncRequestState(actions.SET_INSTANCE_STATUS)
export const setKibanaInstanceStatusRequest = getAsyncRequestState(
  actions.SET_KIBANA_INSTANCE_STATUS,
)
export const setApmInstanceStatusRequest = getAsyncRequestState(actions.SET_APM_INSTANCE_STATUS)

export const setDiskQuotaRequest = getAsyncRequestState(actions.SET_DISK_QUOTA)
export const setInstanceCapacityRequest = getAsyncRequestState(actions.SET_INSTANCE_CAPACITY)
export const retryFailedShardAllocationsRequest = getAsyncRequestState(
  actions.RETRY_FAILED_SHARD_ALLOCATIONS,
)
export const fetchSnapshotsRequest = getAsyncRequestState(actions.FETCH_SNAPSHOTS)
export const restoreSnapshotRequest = getAsyncRequestState(actions.RESTORE_SNAPSHOT)
export const hideClusterRequest = getAsyncRequestState(actions.HIDE_CLUSTER)
export const deleteStackVersionRequest = getAsyncRequestState(actions.DELETE_STACK_VERSION)
export const fetchDeprecationsRequest = getAsyncRequestState(actions.FETCH_DEPRECATIONS)
export const fetchDeprecationsAssistantRequest = getAsyncRequestState(
  actions.FETCH_DEPRECATIONS_ASSISTANT,
)
export const fetchShardCountsRequest = getAsyncRequestState(actions.FETCH_SHARD_COUNTS)
export const addAllocatorTagRequest = getAsyncRequestState(actions.ADD_ALLOCATOR_TAG)
export const removeAllocatorTagRequest = getAsyncRequestState(actions.REMOVE_ALLOCATOR_TAG)
export const searchAllocatorsRequest = getAsyncRequestState(actions.SEARCH_ALLOCATORS)
export const searchRunnersRequest = getAsyncRequestState(actions.SEARCH_RUNNERS)
export const searchClusterRequest = getAsyncRequestState(actions.SEARCH_CLUSTERS)
export const searchAllClustersRequest = getAsyncRequestState(actions.SEARCH_ALL_CLUSTERS)
export const callStoredProcedureRequest = getAsyncRequestState(actions.CALL_STORED_PROCEDURE)
export const getPlanAttemptsRequest = getAsyncRequestState(actions.FETCH_PLAN_ATTEMPTS)
export const fetchInstanceTypesRequest = getAsyncRequestState(actions.FETCH_INSTANCE_TYPES)
export const fetchInstanceConfigurationsRequest = getAsyncRequestState(
  actions.FETCH_INSTANCE_CONFIGURATIONS,
)
export const deleteInstanceConfigurationRequest = getAsyncRequestState(
  actions.DELETE_INSTANCE_CONFIGURATION,
)
export const fetchInstanceConfigurationRequest = getAsyncRequestState(
  actions.FETCH_INSTANCE_CONFIGURATION,
)
export const createInstanceConfigurationRequest = getAsyncRequestState(
  actions.CREATE_INSTANCE_CONFIGURATION,
)
export const updateInstanceConfigurationRequest = getAsyncRequestState(
  actions.UPDATE_INSTANCE_CONFIGURATION,
)
export const fetchDeploymentTemplatesRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_TEMPLATES,
)
export const fetchDeploymentTemplateRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_TEMPLATE,
)
export const fetchGlobalDeploymentTemplatesRequest = getAsyncRequestState(
  actions.FETCH_GLOBAL_DEPLOYMENT_TEMPLATES,
)
export const createDeploymentTemplateRequest = getAsyncRequestState(
  actions.CREATE_DEPLOYMENT_TEMPLATE,
)
export const deleteDeploymentTemplateRequest = getAsyncRequestState(
  actions.DELETE_DEPLOYMENT_TEMPLATE,
)
export const updateDeploymentTemplateRequest = getAsyncRequestState(
  actions.UPDATE_DEPLOYMENT_TEMPLATE,
)
export const vacateEsClusterRequest = getAsyncRequestState(actions.VACATE_ES_CLUSTER)
export const vacateEsClusterValidateRequest = getAsyncRequestState(
  actions.VACATE_ES_CLUSTER_VALIDATE,
)
export const vacateAllocatorRequest = getAsyncRequestState(actions.VACATE_ALLOCATOR)
export const vacateAllocatorValidateRequest = getAsyncRequestState(
  actions.VACATE_ALLOCATOR_VALIDATE,
)
export const createDeploymentRequest = getAsyncRequestState(actions.CREATE_DEPLOYMENT)
export const getLoginRequest = getAsyncRequestState(actions.LOG_IN)
export const getSubmitMfaResponseRequest = getAsyncRequestState(actions.SUBMIT_MFA_RESPONSE)
export const updateIndexPatternsRequest = getAsyncRequestState(
  actions.UPDATE_CURATION_INDEX_PATTERNS,
)
export const queryClusterProxyRequest = getAsyncRequestState(actions.QUERY_CLUSTER_PROXY)
export const createIpFilterRuleRequest = getAsyncRequestState(actions.CREATE_IP_FILTER_RULE)
export const createIpFilterRulesetRequest = getAsyncRequestState(actions.CREATE_IP_FILTER_RULESET)
export const createIpFilterRulesetAssociationRequest = getAsyncRequestState(
  actions.CREATE_IP_FILTER_RULESET_ASSOCIATION,
)
export const deleteIpFilterRulesetAssociationRequest = getAsyncRequestState(
  actions.DELETE_IP_FILTER_RULESET_ASSOCIATIONS,
)
export const deleteIpFilterRuleRequest = getAsyncRequestState(actions.DELETE_IP_FILTER_RULE)
export const deleteIpFilterRulesetRequest = getAsyncRequestState(actions.DELETE_IP_FILTER_RULESET)
export const getIpFilterRulesetDeploymentAssociationsRequest = getAsyncRequestState(
  actions.FETCH_IP_FILTER_RULESET_DEPLOYMENT_ASSOCIATIONS,
)
export const getIpFilterDeploymentRulesetAssociationsRequest = getAsyncRequestState(
  actions.FETCH_IP_FILTER_DEPLOYMENT_RULESET_ASSOCIATIONS,
)
export const getIpFilterRulesetsRequest = getAsyncRequestState(actions.FETCH_IP_FILTER_RULESETS)
export const getIpFilterRulesetRequest = getAsyncRequestState(actions.FETCH_IP_FILTER_RULESET)
export const updateIpFilterRuleRequest = getAsyncRequestState(actions.UPDATE_IP_FILTER_RULE)
export const updateIpFilterRulesetRequest = getAsyncRequestState(actions.UPDATE_IP_FILTER_RULESET)
export const fetchSaasUserRequest = getAsyncRequestState(actions.FETCH_SAAS_USER)
export const fetchClusterForAdvancedEditingRequest = getAsyncRequestState(
  actions.FETCH_CLUSTER_FOR_ADVANCED_EDITING,
)
export const fetchApmRequest = getAsyncRequestState(actions.FETCH_APM)
export const restartApmRequest = getAsyncRequestState(actions.RESTART_APM)
export const stopApmRequest = getAsyncRequestState(actions.STOP_APM)
export const apmPlanAttemptsRequest = getAsyncRequestState(actions.FETCH_APM_PLAN_ATTEMPTS)
export const updateApmPlanRequest = getAsyncRequestState(actions.UPDATE_APM_PLAN)
export const fetchSnapshotStatusRequest = getAsyncRequestState(actions.FETCH_SNAPSHOT_STATUS)
export const updateApmDataRequest = getAsyncRequestState(actions.SAVE_APM_DATA)
export const resetApmTokenRequest = getAsyncRequestState(actions.RESET_APM_TOKEN)
export const deleteApmRequest = getAsyncRequestState(actions.DELETE_APM)
export const submitUserFeedbackRequest = getAsyncRequestState(actions.SUBMIT_USER_FEEDBACK)
export const fetchAllUsersRequest = getAsyncRequestState(actions.FETCH_ALL_USERS)
export const fetchLocalUserRequest = getAsyncRequestState(actions.FETCH_LOCAL_USER)
export const createUserRequest = getAsyncRequestState(actions.CREATE_USER)
export const updateUserRequest = getAsyncRequestState(actions.UPDATE_USER)
export const deleteUserRequest = getAsyncRequestState(actions.DELETE_USER)
export const fetchMfaDevicesRequest = getAsyncRequestState(actions.FETCH_MFA_DEVICES)
export const deleteEmailSuppressionsRequest = getAsyncRequestState(
  actions.DELETE_EMAIL_SUPPRESSIONS,
)
export const resetMfaRequest = getAsyncRequestState(actions.RESET_MFA)
export const fetchWhitelistedVersionRequest = getAsyncRequestState(
  actions.FETCH_WHITELISTED_VERSIONS,
)
export const removeWhitelistedVersionRequest = getAsyncRequestState(
  actions.DELETE_WHITELISTED_VERSION,
)
export const addWhitelistedVersionRequest = getAsyncRequestState(actions.PUT_WHITELISTED_VERSION)
export const fetchAuthMethodsRequest = getAsyncRequestState(actions.FETCH_AUTH_METHODS)
export const takeSnapshotRequest = getAsyncRequestState(actions.TAKE_SNAPSHOT)
export const setCpuHardLimitRequest = getAsyncRequestState(actions.SET_CPU_HARD_LIMIT)
export const validateMigrateTemplate = getAsyncRequestState(actions.SET_PENDING_MIGRATE_TEMPLATE)
export const fetchCcsSettingsRequest = getAsyncRequestState(actions.FETCH_CCS_SETTINGS)
export const updateCcsSettingsRequest = getAsyncRequestState(actions.UPDATE_CCS_SETTINGS)
export const createSecretRequest = getAsyncRequestState(actions.CREATE_SECRET)
export const deleteSecretRequest = getAsyncRequestState(actions.DELETE_SECRET)
export const fetchCurrentUserRequest = getAsyncRequestState(actions.FETCH_CURRENT_USER)
export const updateCurrentUserRequest = getAsyncRequestState(actions.UPDATE_CURRENT_USER)
export const startConstructorMaintenanceModeRequest = getAsyncRequestState(
  actions.START_CONSTRUCTOR_MAINTENANCE_MODE,
)
export const stopConstructorMaintenanceModeRequest = getAsyncRequestState(
  actions.STOP_CONSTRUCTOR_MAINTENANCE_MODE,
)
export const fetchCcsEligibleRemotesRequest = getAsyncRequestState(
  actions.FETCH_CCS_ELIGIBLE_REMOTES,
)
export const fetchResourceCommentsRequest = getAsyncRequestState(actions.FETCH_RESOURCE_COMMENTS)
export const createResourceCommentRequest = getAsyncRequestState(actions.CREATE_RESOURCE_COMMENT)
export const deleteResourceCommentRequest = getAsyncRequestState(actions.DELETE_RESOURCE_COMMENT)
export const updateResourceCommentRequest = getAsyncRequestState(actions.UPDATE_RESOURCE_COMMENT)
export const herokuAuthHandshakeRequest = getAsyncRequestState(actions.HEROKU_AUTH_HANDSHAKE)
export const enableHeapDumpsRequest = getAsyncRequestState(actions.ENABLE_HEAP_DUMPS_ON_OOM)
export const disableHeapDumpsRequest = getAsyncRequestState(actions.DISABLE_HEAP_DUMPS_ON_OOM)
export const fetchHeapDumpsRequest = getAsyncRequestState(actions.FETCH_HEAP_DUMPS)
export const startHeapDumpCaptureRequest = getAsyncRequestState(actions.CAPTURE_HEAP_DUMP)
export const fetchApiKeysRequest = getAsyncRequestState(actions.FETCH_API_KEYS)
export const fetchManagedApiKeysRequest = getAsyncRequestState(actions.FETCH_MANAGED_API_KEYS)
export const revokeApiKeyRequest = getAsyncRequestState(actions.REVOKE_API_KEY)
export const generateApiKeyRequest = getAsyncRequestState(actions.GENERATE_API_KEY)
export const revokeApiKeysRequest = getAsyncRequestState(actions.REVOKE_API_KEYS)
export const fetchStackDeploymentRequest = getAsyncRequestState(actions.FETCH_STACK_DEPLOYMENT)
export const createStackDeploymentRequest = getAsyncRequestState(actions.CREATE_STACK_DEPLOYMENT)
export const deleteStackDeploymentRequest = getAsyncRequestState(actions.DELETE_STACK_DEPLOYMENT)
export const fetchProvidersRequest = getAsyncRequestState(actions.FETCH_PROVIDERS)
export const searchStackDeploymentsRequest = getAsyncRequestState(actions.SEARCH_STACK_DEPLOYMENTS)
export const updateStackDeploymentRequest = getAsyncRequestState(actions.UPDATE_STACK_DEPLOYMENT)
export const updateStackDeploymentDryRunRequest = getAsyncRequestState(
  actions.UPDATE_STACK_DEPLOYMENT_DRY_RUN,
)
export const restartStackDeploymentResourceRequest = getAsyncRequestState(
  actions.RESTART_DEPLOYMENT_RESOURCE,
)
export const restartStackDeploymentEsResourceRequest = getAsyncRequestState(
  actions.RESTART_DEPLOYMENT_ES_RESOURCE,
)
export const shutdownStackDeploymentRequest = getAsyncRequestState(actions.SHUTDOWN_DEPLOYMENT)
export const shutdownStackDeploymentResourceRequest = getAsyncRequestState(
  actions.SHUTDOWN_DEPLOYMENT_RESOURCE,
)
export const upgradeStackDeploymentResourceRequest = getAsyncRequestState(
  actions.UPGRADE_DEPLOYMENT_RESOURCE,
)
export const deleteStackDeploymentResourceRequest = getAsyncRequestState(
  actions.DELETE_DEPLOYMENT_RESOURCE,
)
export const setDeploymentResourceMetadataRequest = getAsyncRequestState(
  actions.SET_DEPLOYMENT_RESOURCE_METADATA,
)
export const cancelDeploymentResourcePlanRequest = getAsyncRequestState(
  actions.CANCEL_DEPLOYMENT_RESOURCE_PLAN,
)
export const restoreStackDeploymentRequest = getAsyncRequestState(actions.RESTORE_DEPLOYMENT)
export const extendTrialRequest = getAsyncRequestState(actions.EXTEND_TRIAL)
export const fetchCloudStatusRequest = getAsyncRequestState(actions.FETCH_CLOUD_STATUS)
export const fetchBlogsRequest = getAsyncRequestState(actions.FETCH_BLOGS)
export const fetchBlueprintRolesRequest = getAsyncRequestState(actions.FETCH_BLUEPRINT_ROLES)
export const createSaasUserAdminRequest = getAsyncRequestState(actions.CREATE_SAAS_USER_ADMIN)
export const createSaasUserRequest = getAsyncRequestState(actions.CREATE_SAAS_USER)
export const updateRolesRequest = getAsyncRequestState(actions.UPDATE_RUNNER_ROLES)
export const demoteCoordinatorRequest = getAsyncRequestState(actions.DEMOTE_COORDINATOR)
export const fetchFeedRequest = getAsyncRequestState(actions.FETCH_FEED)
export const updateSaasUserProfileRequest = getAsyncRequestState(actions.UPDATE_SAAS_USER_PROFILE)
export const fetchAuthenticationInfoRequest = getAsyncRequestState(
  actions.FETCH_AUTHENTICATION_INFO,
)
export const enableElevatedPermissionsRequest = getAsyncRequestState(
  actions.ENABLE_ELEVATED_PERMISSIONS,
)
export const disableElevatedPermissionsRequest = getAsyncRequestState(
  actions.DISABLE_ELEVATED_PERMISSIONS,
)
export const searchForAnythingRequest = getAsyncRequestState(actions.SEARCH_FOR_ANYTHING)
export const fetchAdminconsolesRequest = getAsyncRequestState(actions.FETCH_ADMINCONSOLES)
export const fetchAdminconsoleLoggingSettingsRequest = getAsyncRequestState(
  actions.FETCH_ADMINCONSOLE_LOGGING_SETTINGS,
)
export const patchAdminconsoleLoggingSettingsRequest = getAsyncRequestState(
  actions.PATCH_ADMINCONSOLE_LOGGING_SETTINGS,
)
export const enableSlmRequest = getAsyncRequestState(actions.ENABLE_SLM)
export const executeSlmPolicyRequest = getAsyncRequestState(actions.EXECUTE_SLM_POLICY)
export const fetchContainerSetsRequest = getAsyncRequestState(actions.FETCH_CONTAINER_SETS)
export const fetchContainerSetRequest = getAsyncRequestState(actions.FETCH_CONTAINER_SET)
export const fetchContainerRequest = getAsyncRequestState(actions.FETCH_CONTAINER)
export const startContainerRequest = getAsyncRequestState(actions.START_CONTAINER)
export const stopContainerRequest = getAsyncRequestState(actions.STOP_CONTAINER)
export const fetchRunnerLoggingSettingsRequest = getAsyncRequestState(
  actions.FETCH_RUNNER_LOGGING_SETTINGS,
)
export const patchRunnerLoggingSettingsRequest = getAsyncRequestState(
  actions.PATCH_RUNNER_LOGGING_SETTINGS,
)
export const fetchAllocatorLoggingSettingsRequest = getAsyncRequestState(
  actions.FETCH_ALLOCATOR_LOGGING_SETTINGS,
)
export const patchAllocatorLoggingSettingsRequest = getAsyncRequestState(
  actions.PATCH_ALLOCATOR_LOGGING_SETTINGS,
)
export const fetchConstructorLoggingSettingsRequest = getAsyncRequestState(
  actions.FETCH_CONSTRUCTOR_LOGGING_SETTINGS,
)
export const patchConstructorLoggingSettingsRequest = getAsyncRequestState(
  actions.PATCH_CONSTRUCTOR_LOGGING_SETTINGS,
)
export const createTrafficFilterRulesetRequest = getAsyncRequestState(
  actions.CREATE_TRAFFIC_FILTER_RULESET,
)
export const createTrafficFilterRulesetAssociationRequest = getAsyncRequestState(
  actions.CREATE_TRAFFIC_FILTER_RULESET_ASSOCIATION,
)
export const deleteTrafficFilterRulesetAssociationRequest = getAsyncRequestState(
  actions.DELETE_TRAFFIC_FILTER_RULESET_ASSOCIATION,
)
export const deleteTrafficFilterRulesetRequest = getAsyncRequestState(
  actions.DELETE_TRAFFIC_FILTER_RULESET,
)
export const fetchTrafficFilterRulesetDeploymentAssociationsRequest = getAsyncRequestState(
  actions.FETCH_TRAFFIC_FILTER_RULESET_DEPLOYMENT_ASSOCIATIONS,
)
export const fetchTrafficFilterDeploymentRulesetAssociationsRequest = getAsyncRequestState(
  actions.FETCH_TRAFFIC_FILTER_DEPLOYMENT_RULESET_ASSOCIATIONS,
)
export const fetchTrafficFilterRulesetsRequest = getAsyncRequestState(
  actions.FETCH_TRAFFIC_FILTER_RULESETS,
)
export const fetchTrafficFilterRulesetRequest = getAsyncRequestState(
  actions.FETCH_TRAFFIC_FILTER_RULESET,
)
export const updateTrafficFilterRulesetRequest = getAsyncRequestState(
  actions.UPDATE_TRAFFIC_FILTER_RULESET,
)
export const setAppSearchReadOnlyModeRequest = getAsyncRequestState(
  actions.SET_APP_SEARCH_READ_ONLY_MODE,
)

export const createDeploymentExtensionRequest = getAsyncRequestState(
  actions.CREATE_DEPLOYMENT_EXTENSION,
)
export const deleteDeploymentExtensionRequest = getAsyncRequestState(
  actions.DELETE_DEPLOYMENT_EXTENSION,
)
export const fetchDeploymentExtensionRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_EXTENSION,
)
export const fetchDeploymentExtensionsRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_EXTENSIONS,
)
export const updateDeploymentExtensionRequest = getAsyncRequestState(
  actions.UPDATE_DEPLOYMENT_EXTENSION,
)
export const uploadDeploymentExtensionRequest = getAsyncRequestState(
  actions.UPLOAD_DEPLOYMENT_EXTENSION,
)
export const setDeploymentMonitoringRequest = getAsyncRequestState(
  actions.SET_MONITORING_DEPLOYMENT,
)
export const stopDeploymentMonitoringRequest = getAsyncRequestState(
  actions.STOP_MONITORING_DEPLOYMENT,
)
export const fetchHappySadClustersRequest = getAsyncRequestState(actions.FETCH_HAPPY_SAD_CLUSTERS)

export const fetchTrustRelationshipsRequest = getAsyncRequestState(
  actions.FETCH_TRUST_RELATIONSHIPS,
)
export const fetchTrustRelationshipRequest = getAsyncRequestState(actions.FETCH_TRUST_RELATIONSHIP)
export const createTrustRelationshipRequest = getAsyncRequestState(
  actions.CREATE_TRUST_RELATIONSHIP,
)
export const updateTrustRelationshipRequest = getAsyncRequestState(
  actions.UPDATE_TRUST_RELATIONSHIP,
)
export const deleteTrustRelationshipRequest = getAsyncRequestState(
  actions.DELETE_TRUST_RELATIONSHIP,
)

export const fetchApiBaseUrlRequest = getAsyncRequestState(actions.FETCH_API_BASE_URL)
export const updateApiBaseUrlRequest = getAsyncRequestState(actions.UPDATE_API_BASE_URL)

export const fetchDeploymentDomainNameRequest = getAsyncRequestState(
  actions.FETCH_DEPLOYMENT_DOMAIN_NAME,
)
export const updateDeploymentDomainNameRequest = getAsyncRequestState(
  actions.UPDATE_DEPLOYMENT_DOMAIN_NAME,
)

export const enableCrossClusterReplicationRequest = getAsyncRequestState(
  actions.ENABLE_CROSS_CLUSTER_REPLICATION,
)

export const fetchCurrentAccountRequest = getAsyncRequestState(actions.FETCH_CURRENT_ACCOUNT)
export const updateCurrentAccountRequest = getAsyncRequestState(actions.UPDATE_CURRENT_ACCOUNT)

export const updateDeploymentDomainAliasRequest = getAsyncRequestState(
  actions.UPDATE_DEPLOYMENT_ALIAS,
)

export const deploymentDomainAliasEditAccessRequest = getAsyncRequestState(
  actions.DEPLOYMENT_ALIAS_EDIT_ACCESS,
)

export const fetchDeploymentDomainAliasEditAccessRequest = getAsyncRequestState(
  actions.GET_DEPLOYMENT_ALIAS_EDIT_ACCESS,
)

export const updateDeploymentDomainAliasEditAccessRequest = getAsyncRequestState(
  actions.UPDATE_DEPLOYMENT_ALIAS_EDIT_ACCESS,
)

export const fetchElasticSearchServicePricesRequest = getAsyncRequestState(actions.FETCH_ESS_PRICES)
export const fetchProxiesRequest = getAsyncRequestState(actions.FETCH_PROXIES)

export const fetchNodeStatsRequest = getAsyncRequestState(actions.FETCH_NODE_STATS)

export const createOrganizationRequest = getAsyncRequestState(actions.CREATE_ORGANIZATION)
export const updateOrganizationRequest = getAsyncRequestState(actions.UPDATE_ORGANIZATION)
export const deleteOrganizationRequest = getAsyncRequestState(actions.DELETE_ORGANIZATION)
export const fetchOrganizationRequest = getAsyncRequestState(actions.FETCH_ORGANIZATION)
export const fetchOrganizationsRequest = getAsyncRequestState(actions.FETCH_ORGANIZATIONS)

export const createOrganizationInvitationRequest = getAsyncRequestState(
  actions.CREATE_ORGANIZATION_INVITATION,
)

export const deleteOrganizationInvitationsRequest = getAsyncRequestState(
  actions.DELETE_ORGANIZATION_INVITATIONS,
)

export const fetchOrganizationInvitationsRequest = getAsyncRequestState(
  actions.FETCH_ORGANIZATION_INVITATIONS,
)

export const createOrganizationMembershipRequest = getAsyncRequestState(
  actions.CREATE_ORGANIZATION_MEMBERSHIP,
)

export const deleteOrganizationMembershipsRequest = getAsyncRequestState(
  actions.DELETE_ORGANIZATION_MEMBERSHIPS,
)

export const fetchOrganizationMembershipsRequest = getAsyncRequestState(
  actions.FETCH_ORGANIZATION_MEMBERSHIPS,
)
