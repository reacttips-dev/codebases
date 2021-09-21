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

enum Feature {
  basicAuthProxyPass = 'FEATURE_BASIC_AUTH_PROXY_PASS',
  blockExpandingPlanMessages = 'FEATURE_BLOCK_EXPANDING_PLAN_MESSAGES',

  // Although the name here doesn't follow the FEATURE_* pattern, its usage is feature-like.
  userconsoleRunFullStory = 'CLOUD_USERCONSOLE_RUN_FULLSTORY',
  convertLegacyPlans = 'FEATURE_CONVERT_LEGACY_PLANS',
  crossClusterSearch = 'FEATURE_CROSS_CLUSTER_SEARCH',

  // Indicates whether an environment has a repository that all deployments use by default for backups. */
  defaultSnapshotRepository = 'FEATURE_DEFAULT_SNAPSHOT_REPOSITORY',

  disableEditingKibanaMemory = 'FEATURE_DISABLE_EDITING_KIBANA_MEMORY',
  disableNodeControlsIfPlanPending = 'FEATURE_DISABLE_NODE_CONTROLS_IF_PLAN_PENDING',
  diskQuotaOverride = 'FEATURE_DISK_QUOTA_OVERRIDE',
  downloadActivityJson = 'FEATURE_DOWNLOAD_ACTIVITY_JSON',
  downloadClusterLogs = 'FEATURE_DOWNLOAD_CLUSTER_LOGS',
  eula = 'FEATURE_EULA',
  experimentalSettings = 'FEATURE_EXPERIMENTAL_SETTINGS',
  exportDeployments = 'FEATURE_EXPORT_DEPLOYMENTS',
  hideAdminReapplyButton = 'FEATURE_HIDE_ADMIN_REAPPLY_BUTTON',
  hideClusterInsteadOfDelete = 'FEATURE_HIDE_CLUSTER_INSTEAD_OF_DELETE',
  hideClusterInsteadOfStop = 'FEATURE_HIDE_CLUSTER_INSTEAD_OF_STOP',
  hideConfigChangeStrategy = 'FEATURE_HIDE_CONFIG_CHANGE_STRATEGY',
  hideCreateClusterButton = 'FEATURE_HIDE_CREATE_CLUSTER_BUTTON',
  hideExtraFailoverOptions = 'FEATURE_HIDE_EXTRA_FAILOVER_OPTIONS',
  hideIrrelevantSectionsFromGovCloud = 'FEATURE_HIDE_IRRELEVANT_SECTIONS_FROM_GOV_CLOUD',
  hidePauseInstance = 'FEATURE_HIDE_PAUSE_INSTANCE',
  hidePlanDetails = 'FEATURE_HIDE_PLAN_DETAILS',
  ilmFeature = 'FEATURE_ILM_FEATURE',
  ilmMigrationFeature = 'FEATURE_ILM_MIGRATION',
  ilmTemplateMigrationFeature = 'FEATURE_ILM_TEMPLATE_MIGRATION',
  includeFeatureFilter = 'FEATURE_INCLUDE_FEATURE_FILTER',
  intercomChat = 'FEATURE_INTERCOM_CHAT',
  instanceCapacityOverride = 'FEATURE_INSTANCE_CAPACITY_OVERRIDE',
  ipFilteringEnabled = 'FEATURE_IP_FILTERING_ENABLED',
  lookupSaasUsers = 'FEATURE_LOOKUP_SAAS_USERS',

  // Pairs with the 'Rbac' flag in the API.
  manageRbac = 'FEATURE_MANAGE_RBAC',
  rbacPermissions = 'FEATURE_RBAC_PERMISSIONS',

  migrateTemplate = 'FEATURE_MIGRATE_TEMPLATE',
  nodeConfigurations = 'FEATURE_NODE_CONFIGURATIONS',
  oauth = 'FEATURE_OAUTH',
  phoneHome = 'FEATURE_PHONE_HOME',
  readonlyIndexCurationTargets = 'FEATURE_READONLY_INDEX_CURATION_TARGETS',
  regionNames = 'FEATURE_REGION_NAMES',
  registrationButtons = 'FEATURE_REGISTRATION_BUTTONS',
  resourceComments = 'FEATURE_RESOURCE_COMMENTS',
  saasClusterMetrics = 'FEATURE_SAAS_CLUSTER_METRICS',
  saasFilters = 'FEATURE_SAAS_FILTERS',
  searchClusterLock = 'FEATURE_SEARCH_CLUSTER_LOCK',
  showAccountActivity = 'FEATURE_SHOW_ACCOUNT_ACTIVITY',
  showAdvancedEditor = 'FEATURE_SHOW_ADVANCED_EDITOR',
  showBillingPage = 'FEATURE_SHOW_BILLING_PAGE',
  showDashboardLinks = 'FEATURE_SHOW_DASHBOARD_LINKS',
  showHelpPage = 'FEATURE_SHOW_HELP_PAGE',
  showNativeMemoryPressure = 'FEATURE_SHOW_NATIVE_MEMORY_PRESSURE',
  showPrices = 'FEATURE_SHOW_PRICES',
  showSecurityPage = 'FEATURE_SHOW_SECURITY_PAGE',
  enableInvoiceAdminActions = 'FEATURE_ENABLE_INVOICE_ADMIN_ACTIONS',
  showSimpleAttribution = 'FEATURE_SHOW_SIMPLE_ATTRIBUTION',
  showTakeSnapshotButton = 'FEATURE_SHOW_TAKE_SNAPSHOT_BUTTON',
  hideKibanaDelete = 'FEATURE_HIDE_KIBANA_DELETE',
  sudo = 'FEATURE_SUDO',
  tempShieldUsers = 'FEATURE_TEMP_SHIELD_USERS',
  testActiveDirectoryConfiguration = 'FEATURE_TEST_ACTIVE_DIRECTORY_CONFIGURATION',
  testLdapConfiguration = 'FEATURE_TEST_LDAP_CONFIGURATION',
  toggleClusterLock = 'FEATURE_TOGGLE_CLUSTER_LOCK',
  toggleCpuHardLimit = 'FEATURE_TOGGLE_CPU_HARD_LIMIT',
  ucIlmBetaBadge = 'FEATURE_UC_ILM_BETA_BADGE',
  whitelistingStack = 'FEATURE_WHITELISTING_STACK',
  apiRequestExamples = 'FEATURE_API_REQUEST_EXAMPLES',
  showKibanaDetailsEvenWhenHidden = 'FEATURE_SHOW_KIBANA_DETAILS_EVEN_WHEN_HIDDEN',
  cloudPortalEnabled = 'FEATURE_CLOUD_PORTAL_ENABLED',
  apiKeys = 'FEATURE_API_KEYS',
  oktaAuthenticationEnabled = 'FEATURE_OKTA_AUTHENTICATION_ENABLED',
  trainingTileCoursesLinkVisible = 'FEATURE_MY_COURSES_LINK_IN_PORTAL_TRAINING_TILE',
  adminConsoles = 'FEATURE_ADMIN_CONSOLES',
  containerSets = 'FEATURE_CONTAINER_SETS',
  buildTagMismatch = 'FEATURE_TAG_MISMATCH',
  trafficFiltering = 'FEATURE_TRAFFIC_FILTERING',
  crossEnvCCSCCR = 'FEATURE_CROSS_ENV_CCS_CCR',
  googleTrackingId = 'GOOGLE_ANALYTICS_TRACKING_ID',
}

export default Feature
