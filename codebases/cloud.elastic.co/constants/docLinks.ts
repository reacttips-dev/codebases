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

import { DocLinkDefinitions } from '../types'

const docLinks: DocLinkDefinitions = {
  // TODO @cloud-writers
  activeDirectoryProviderCaCertsDocLink: {
    ece: {
      href: 'configure-rbac.html',
      hash: 'prepare-ad-certificates',
    },
  },
  addCapacityDocLink: {
    ece: { href: `add-capacity.html` },
  },
  addEceLicenseDocLink: {
    ece: { href: `add-license.html` },
  },
  apiReferenceDocLink: {
    ece: {
      href: `api-reference.html`,
    },
    ess: {
      href: `restful-api.html`,
    },
  },
  apmUserSettingsDocLink: {
    ece: {
      href: `manage-apm-settings.html`,
    },
    ess: {
      href: `manage-apm-settings.html`,
    },
  },
  appsearchUserSettingsDocLink: {
    ece: {
      href: `manage-appsearch-settings.html`,
    },
    ess: {
      href: `manage-appsearch-settings.html`,
    },
  },
  autoscalingDocLink: {
    ece: {
      href: `autoscaling.html`,
      hash: `autoscaling-factors`,
    },
    ess: {
      href: `autoscaling.html`,
      hash: `autoscaling-factors`,
    },
  },
  autoscalingEnableDocLink: {
    ece: {
      href: `autoscaling.html`,
      hash: `autoscaling-enable`,
    },
    ess: {
      href: `autoscaling.html`,
      hash: `autoscaling-enable`,
    },
  },
  autoscalingUpdateSettingsLink: {
    ece: {
      href: `autoscaling.html`,
      hash: `autoscaling-update`,
    },
    ess: {
      href: `autoscaling.html`,
      hash: `autoscaling-update`,
    },
  },
  cloudIdDocLink: {
    ece: { href: `cloud-id.html` },
    ess: { href: `cloud-id.html` },
    ess_heroku: { href: `cloud-id.html` },
  },
  clusterPerfMetricsMonitoringDocLink: {
    ess: { href: `monitoring.html` },
    ess_heroku: { href: `monitoring.html` },
  },
  configureAllocatorTagsLink: {
    ece: { href: `configuring-ece-tag-allocators.html` },
  },
  createDeployment: {
    ece: { href: `create-deployment.html` },
    ess: { href: `create-deployment.html` },
    ess_heroku: { href: `create-deployment.html` },
  },
  customizeDeployment: {
    ess: {
      href: `customize-deployment.html`,
    },
    ess_heroku: {
      href: `customize-deployment.html`,
    },
    ece: {
      href: `customize-deployment.html`,
    },
  },
  crossClusterRestoreDocLink: {
    ess: {
      href: `restoring-snapshots.html`,
      hash: `restore-snapshot`,
    },
    ess_heroku: {
      href: `restoring-snapshots.html`,
      hash: `restore-snapshot`,
    },
    ece: {
      href: `snapshots.html`,
      hash: `restore-snapshot`,
    },
  },
  configureKeystore: {
    ess: {
      href: `configuring-keystore.html`,
    },
    ess_heroku: {
      href: `configuring-keystore.html`,
    },
    ece: {
      href: `configuring-keystore.html`,
    },
  },
  configureSettingsDocLink: {
    ess: {
      href: `configure-settings.html`,
    },
    ess_heroku: {
      href: `configure-settings.html`,
    },
  },
  deploymentHelpNextSteps: {
    ess: {
      href: `getting-started-next-steps.html`,
    },
    ess_heroku: {
      href: `getting-started-next-steps.html`,
    },
    ece: {
      href: `stack-getting-started.html`,
    },
  },
  enableMonitoringDocLink: {
    ece: {
      href: `enable-logging-and-monitoring.html`,
    },
    ess: {
      href: `enable-logging-and-monitoring.html`,
    },
    ess_heroku: {
      href: `enable-logging-and-monitoring.html`,
    },
  },
  enterpriseSearchUserSettingsDocLink: {
    ece: {
      href: `manage-enterprise-search-settings.html`,
    },
    ess: {
      href: `manage-enterprise-search-settings.html`,
    },
  },
  upgradeAppSearchDocLink: {
    ece: {
      href: `upgrade-appsearch.html`,
    },
    ess: {
      href: `upgrade-appsearch.html`,
    },
  },
  esUserSettingsDocLink: {
    ece: {
      href: `add-user-settings.html`,
    },
    ess: {
      href: `add-user-settings.html`,
    },
    ess_heroku: {
      href: `add-user-settings.html`,
    },
  },
  elasticsearchUserSettingsDocLink: {
    ece: {
      href: `add-user-settings.html`,
    },
    ess: {
      href: `add-user-settings.html`,
    },
  },
  faultToleranceDocLink: {
    ece: { href: `ha.html` },
    ess: { href: `planning.html`, hash: `ha` },
    ess_heroku: { href: `planning.html`, hash: `ha` },
  },
  gettingStartedDocLink: {
    ess: {
      href: `getting-started.html`,
    },
    ess_heroku: {
      href: `getting-started.html`,
    },
    ece: {
      href: `stack-getting-started.html`,
    },
  },
  helpDocLink: {
    ece: { href: `index.html` },
    ess: { href: `index.html` },
    ess_heroku: { href: `index.html` },
  },
  securityDocLink: {
    ess: {
      href: `security.html`,
    },
    ess_heroku: {
      href: `security.html`,
    },
    ece: {
      href: `securing-clusters.html`,
    },
  },
  customBundlesDocLink: {
    ess: {
      href: `custom-bundles.html`,
    },
    ess_heroku: {
      href: `custom-bundles.html`,
    },
  },
  accountBillingContactsDocLink: {
    ess: {
      href: `billing-contacts.html`,
    },
    ess_heroku: {
      href: `billing-contacts.html`,
    },
  },
  accountWatcherDocLink: {
    ess: {
      href: `watcher.html`,
      hash: `ec-watcher-whitelist`,
    },
    ess_heroku: {
      href: `watcher.html`,
      hash: `ec-watcher-whitelist`,
    },
  },
  mfaDocLink: {
    ess: {
      href: `account-security.html`,
    },
    ess_heroku: {
      href: `account-security.html`,
    },
  },
  accountBillingDetailsDocLink: {
    ess: {
      href: `billing-cc.html`,
    },
  },
  accountBillingGcpDocLink: {
    ess: {
      href: `billing-gcp.html`,
      hash: `billing-gcp-account-change`,
    },
  },
  indexManagementDocLink: {
    ece: { href: `configure-index-management.html` },
    ess: { href: `configure-index-management.html` },
    ess_heroku: { href: `configure-index-management.html` },
  },
  indexManagementTemplatesDocLink: {
    ece: {
      href: `configure-templates-index-management.html`,
    },
  },
  kibanaUserSettingsDocLink: {
    ece: {
      href: `manage-kibana-settings.html`,
    },
    ess: {
      href: `manage-kibana-settings.html`,
    },
    ess_heroku: {
      href: `manage-kibana-settings.html`,
    },
  },
  apiConsoleDocLink: {
    ess: {
      href: `api-console.html`,
    },
    ess_heroku: {
      href: `api-console.html`,
    },
    ece: {
      href: `api-console.html`,
    },
  },

  // TODO @cloud-writers
  ldapProviderCaCertsDocLink: {
    ece: {
      href: `configure-rbac.html`,
      hash: `prepare-ldap-certificates`,
    },
  },
  authProviderRoleMappingDocLink: {
    ece: {
      href: `configure-rbac.html`,
      hash: `user-role-permissions`,
    },
  },
  jvmMemoryPressure: {
    ess: {
      href: `memory-pressure.html`,
    },
    ece: {
      href: `memory-pressure.html`,
    },
    ess_heroku: {
      href: `memory-pressure.html`,
    },
  },
  manageElasticStackDocLink: {
    ece: { href: `manage-elastic-stack.html` },
  },
  manageSnapshotReposDocLink: {
    ece: { href: `manage-repositories.html` },
  },
  manageSystemPasswords: {
    ece: {
      href: 'manage-system-passwords.html',
    },
  },
  installNewHosts: {
    ece: { href: `installing-additional.html` },
  },
  separateRunnerRolesLink: {
    ece: { href: `roles.html` },
  },
  manageTlsCertsDocLink: {
    ece: { href: `manage-certificates.html` },
  },
  migrateDataReindex: {
    ece: { href: `migrate-data.html`, hash: `reindex-remote` },
    ess: {
      href: `migrate-data.html`,
      hash: `reindex-remote`,
    },
    ess_heroku: {
      href: `migrate-data.html`,
      hash: `reindex-remote`,
    },
  },
  migrateDataRestore: {
    ece: {
      href: `migrate-data.html`,
      hash: `restore-snapshots`,
    },
    ess: {
      href: `migrate-data.html`,
      hash: `restore-snapshots`,
    },
    ess_heroku: {
      href: `migrate-data.html`,
      hash: `restore-snapshots`,
    },
  },
  monitoringEceDocLink: {
    ece: { href: `monitoring-ece-access.html` },
  },
  moveNodesDocLink: {
    ece: { href: `move-nodes.html` },
  },
  phoneHome: {
    ece: { href: `phone-home.html` },
  },
  pluginsDocLink: {
    ess: { href: `adding-plugins.html` },
    ess_heroku: { href: `adding-plugins.html` },
    ece: { href: `add-plugins.html` },
  },
  samlAttributeMappingDocLink: {
    ece: {
      href: `configure-rbac.html`,
      hash: `saml-attributes`,
    },
  },
  samlGeneralSettingsDocLink: {
    ece: {
      href: `configure-rbac.html`,
      hash: `create-saml-profiles`,
    },
  },
  samlSigningConfiguration: {
    ece: {
      href: `configure-rbac.html`,
      hash: `configure-outgoing-certificates`,
    },
  },
  samlEncryptionConfiguration: {
    ece: {
      href: `configure-rbac.html`,
      hash: `encrypt-saml`,
    },
  },
  samlSslConfiguration: {
    ece: {
      href: 'configure-rbac.html',
      hash: 'saml-ssl-configuration',
    },
  },
  snapshotRetentionDocLink: {
    ess: {
      href: `restoring-snapshots.html`,
      hash: `change-retention-period`,
    },
    ess_heroku: {
      href: `restoring-snapshots.html`,
      hash: `change-retention-period`,
    },
    ece: {
      href: `snapshots.html`,
      hash: `change-retention-period`,
    },
  },
  templatesDocLink: {
    ece: { href: `getting-started-profiles.html` },
    ess: { href: `getting-started-profiles.html` },
    ess_heroku: { href: `getting-started-profiles.html` },
  },
  createDeploymentDocLink: {
    ece: { href: `getting-started-solutions.html` },
    ess: { href: `getting-started-solutions.html` },
    ess_heroku: { href: `getting-started-solutions.html` },
  },
  templateMigration: {
    ess: {
      href: `migrate-templates.html`,
    },
    ess_heroku: {
      href: `migrate-templates.html`,
    },
  },
  upgradingDocLink: {
    ess: { href: `upgrade-deployment.html` },
    ess_heroku: { href: `upgrade-deployment.html` },
    ece: { href: `upgrade-deployment.html` },
  },
  whereMonitoringIsSentDocLink: {
    ece: {
      href: `enable-logging-and-monitoring.html`,
      hash: `enable-logging-and-monitoring`,
    },
    ess: {
      href: `enable-logging-and-monitoring.html`,
      hash: `enable-logging-and-monitoring`,
    },
    ess_heroku: {
      href: `enable-logging-and-monitoring.html`,
      hash: `enable-logging-and-monitoring`,
    },
  },
  resetElasticPassword: {
    ess: {
      href: `password-reset.html`,
    },
    ece: {
      href: `password-reset-elastic.html`,
    },
  },
  apiKeysDocLink: {
    ess: { href: `restful-api.html` },
    ess_heroku: { href: `restful-api.html` },
    ece: { href: `restful-api-authentication.html`, hash: `ece-api-keys` },
  },
  machineLearningDocLink: {
    stack: {
      href: `machine-learning/current/ml-overview.html`,
    },
  },
  graphDocLink: {
    stack: {
      href: `kibana/current/xpack-graph.html`,
    },
  },
  upgradeAssistantDocLink: {
    stack: {
      href: `kibana/current/upgrade-assistant.html`,
    },
  },
  officialPluginsDocLink: {
    stack: {
      href: `elasticsearch/plugins/current/index.html`,
    },
  },
  officialPluginsAuthorHelpDocLink: {
    stack: {
      href: `elasticsearch/plugins/current/plugin-authors.html`,
    },
  },
  fieldSecurityDocLink: {
    stack: {
      href: `elasticsearch/reference/current/field-level-security.html`,
    },
  },
  snapshotsDocLink: {
    stack: {
      href: `elasticsearch/reference/current/modules-snapshots.html`,
    },
  },
  shardsDocLink: {
    stack: {
      href: `elasticsearch/reference/current/disk-allocator.html`,
    },
  },
  elasticsearchGettingStartedDocLink: {
    stack: {
      href: `elasticsearch/reference/current/getting-started.html`,
    },
  },
  kibanaGettingStartedDocLink: {
    stack: {
      href: `kibana/current/getting-started.html`,
      hash: `getting-started`,
    },
  },
  apmOverviewDocLink: {
    stack: {
      href: `apm/get-started/current/overview.html`,
    },
  },
  kibanaIntroductionDocLink: {
    stack: {
      href: `kibana/current/introduction.html`,
    },
  },
  elasticsearchIntroductionDocLink: {
    stack: {
      href: `elasticsearch/reference/current/modules-node.html#data-node`,
    },
  },
  planForProduction: {
    ece: { href: `ha.html` },
    ess: { href: `planning.html` },
    ess_heroku: { href: `planning.html` },
  },
  ingestIntroductionDocLink: {
    stack: {
      href: `elasticsearch/reference/current/modules-node.html`,
    },
  },
  faqGettingStarted: {
    ess: {
      href: `faq-getting-started.html`,
    },
  },
  kibanaMonitoringDataLink: {
    stack: {
      href: `kibana/current/monitoring-data.html`,
    },
  },
  esCatIndices: {
    stack: {
      href: `elasticsearch/reference/current/cat-indices.html`,
    },
  },
  esFailedShards: {
    stack: {
      href: `elasticsearch/reference/current/cluster-reroute.html`,
      hash: `_retry_failed_shards`,
    },
  },
  shield: {
    stack: {
      href: `shield/current/index.html`,
    },
  },
  shieldDefiningRoles: {
    stack: {
      href: `shield/current/defining-roles.html`,
    },
  },
  esJvmSection: {
    stack: {
      href: `elasticsearch/guide/current/_monitoring_individual_nodes.html`,
      hash: `_jvm_section`,
    },
  },
  manageTrafficFiltersIp: {
    ece: { href: `traffic-filtering-ip.html` },
    ess: { href: `traffic-filtering-ip.html` },
  },
  manageTrafficFiltersVpc: {
    ece: { href: `traffic-filtering-vpc.html` },
    ess: { href: `traffic-filtering-vpc.html` },
  },
  manageTrafficFiltersVnet: {
    ece: { href: `traffic-filtering-vnet.html` },
    ess: { href: `traffic-filtering-vnet.html` },
  },
  manageTrafficFiltersVpcHowToUse: {
    ece: { href: `traffic-filtering-vpc.html`, hash: `how-to-use` },
    ess: { href: `traffic-filtering-vpc.html`, hash: `how-to-use` },
  },
  manageTrafficFiltersVpcFindEndpoint: {
    ece: { href: `traffic-filtering-vpc.html`, hash: `find-your-endpoint` },
    ess: { href: `traffic-filtering-vpc.html`, hash: `find-your-endpoint` },
  },
  manageTrafficFiltersVpcFindResourceName: {
    ece: { href: `traffic-filtering-vnet.html`, hash: `find-your-resource-name` },
    ess: { href: `traffic-filtering-vnet.html`, hash: `find-your-resource-name` },
  },
  manageTrafficFiltersVpcFindResourceId: {
    ece: { href: `traffic-filtering-vnet.html`, hash: `find-your-resource-id` },
    ess: { href: `traffic-filtering-vnet.html`, hash: `find-your-resource-id` },
  },
  configureDeploymenTrafficFilters: {
    ece: { href: `traffic-filtering-deployment-configuration.html` },
    ess: { href: `traffic-filtering-deployment-configuration.html` },
    ess_heroku: { href: `traffic-filtering-deployment-configuration.html` },
  },
  readonlyAppSearchEnterpriseSearch: {
    ece: {
      href: `appsearch-readonly.html`,
    },
    ess: {
      href: `appsearch-readonly.html`,
    },
  },
  addCcrSettings: {
    ece: {
      href: `add-ccr-settings.html`,
    },
    ess: {
      href: `add-ccr-settings.html`,
    },
  },
  trustManagement: {
    ece: {
      href: `trust-management.html`,
    },
    ess: {
      href: `trust-management.html`,
    },
  },
  changeEceApiUrl: {
    ece: { href: `config-api-base-url.html` },
  },
  subscriptionLevels: {
    ess: {
      href: `licensing.html`,
    },
  },
  accountBilling: {
    ess: {
      href: `billing.html`,
    },
  },
  billingECU: {
    ess: {
      href: `billing-ecu.html`,
    },
  },
  billingFAQ: {
    ess: {
      href: `faq-billing.html`,
    },
  },
  annualContractsFAQ: {
    ess: {
      href: `faq-billing.html`,
      hash: `faq-annualprepaid`,
    },
  },
  billingCalculationFAQ: {
    ess: {
      href: `billing-dimensions.html`,
    },
  },
  stopBillingCharges: {
    ess: {
      href: `billing-stop.html`,
    },
  },
  entSearchStorageIncrease: {
    stack: {
      href: `enterprise-search/current/upgrading-from-enterprise-search-7-11-and-earlier.html`,
    },
  },
  nodeTypesDocLink: {
    ece: {
      href: `node-types.html`,
    },
    ess: {
      href: `node-types.html`,
    },
  },
  migrateCCS: {
    ess: {
      href: `migrate-ccs.html`,
    },
  },
  enableCCS: {
    ess: {
      href: `enable-ccs.html`,
    },
  },
  fleetOverview: {
    stack: {
      href: `fleet/current/fleet-overview.html`,
    },
  },
  frozenTier: {
    stack: {
      href: `elasticsearch/reference/master/data-tiers.html#frozen-tier`,
    },
  },
  apmServerOverview: {
    stack: {
      href: `apm/server/current/index.html`,
    },
  },
  removingADataTier: {
    ess: {
      href: `disable-data-tier.html`,
    },
    ece: {
      href: `disable-data-tier.html`,
    },
  },
  vcpuBoost: {
    ess: {
      href: `vcpu-boost-instance.html`,
    },
    ece: {
      href: `vcpu-boost-instance.html`,
    },
  },
  remoteClusterCompatibility: {
    stack: {
      href: `elasticsearch/reference/master/modules-remote-clusters.html#gateway-nodes-selection`,
    },
  },
}

export default docLinks
