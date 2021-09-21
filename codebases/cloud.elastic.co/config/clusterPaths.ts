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

const systemSetting = (...setting) => [`elasticsearch`, `system_settings`, ...setting]

export const otherPaths = {
  name: `cluster_name`,
  deploymentTemplate: `deploymentTemplate`,
}

export const planOverridePaths = {
  extendedMaintenance: [`transient`, `plan_configuration`, `extended_maintenance`],
  skipSnapshot: [`transient`, `plan_configuration`, `skip_snapshot`],
  reallocateInstances: [`transient`, `plan_configuration`, `reallocate_instances`],
  restoreFromRemoteSnapshot: [`transient`, `restore_snapshot`],
  restorePayload: [`transient`, `restore_snapshot`, `restore_payload`],
}

export const planPaths = {
  instanceCount: [`cluster_topology`, `0`, `node_count_per_zone`],
  instanceCapacity: [`cluster_topology`, `0`, `memory_per_node`],
  masterNodeCapacity: [`cluster_topology`, `1`, `memory_per_node`],
  masterNodeCount: [`cluster_topology`, `1`, `node_count_per_zone`],
  masterNodeConfigurationId: [`cluster_topology`, `1`, `node_configuration`],
  masterNodeTypes: [`cluster_topology`, `1`, `node_type`],
  masterNodeZoneCount: [`cluster_topology`, `1`, `zone_count`],
  dataNodeZoneCount: [`cluster_topology`, `0`, `zone_count`],
  nodeConfigurationId: [`cluster_topology`, `0`, `node_configuration`],
  nodeConfiguration: `node_type_id`,
  region: `region`,
  availabilityZones: `zone_count`,
  version: [`elasticsearch`, `version`],
  plugins: [`elasticsearch`, `enabled_built_in_plugins`],
  userBundles: [`elasticsearch`, `user_bundles`],
  userPlugins: [`elasticsearch`, `user_plugins`],
  extraUserSettingsSource: [`elasticsearch`, `user_settings_yaml`],
  userSettings: [`elasticsearch`, `user_settings_yaml`],
  userSettingsJson: [`elasticsearch`, `user_settings_json`],
  systemSettings: [`elasticsearch`, `system_settings`],
  numberOfShards: systemSetting(`default_shards_per_index`),
  scripting: systemSetting(`scripting`),
  inlineScripts: systemSetting(`scripting`, `inline`, `enabled`),
  fileScripts: systemSetting(`scripting`, `file`, `enabled`),
  storedScripts: systemSetting(`scripting`, `stored`, `enabled`),
  enableAutomaticIndexCreation: systemSetting(`auto_create_index`),
  destructiveRequiresName: systemSetting(`destructive_requires_name`),
  messages: [`status`, `messages`],
  waitingForPending: [`waitingForPending`],
}

export const kibanaDataPaths = {
  elasticsearchClusterId: `elasticsearch_cluster_id`,
}

export const apmDataPaths = {
  elasticsearchClusterId: `elasticsearch_cluster_id`,
}

export const kibanaPlanPaths = {
  zoneCount: `zone_count`,
  node_count_per_zone: [`cluster_topology`, `0`, `node_count_per_zone`],
  memoryPerNode: [`cluster_topology`, `0`, `memory_per_node`],
  kibana: `kibana`,
  userSettings: [`kibana`, `user_settings_yaml`],
}

export const apmPlanPaths = {
  zoneCount: `zone_count`,
  node_count_per_zone: [`cluster_topology`, `0`, `node_count_per_zone`],
  memoryPerNode: [`cluster_topology`, `0`, `memory_per_node`],
  apm: `apm`,
  userSettings: [`apm`, `user_settings_yaml`],
}

export const dataPaths = {
  userId: `user_id`,
  name: [`cluster_name`],
  marvel: `marvel`,
  snapshot: [`snapshot`],
  snapshotRepository: [`snapshot`, `repository`, `config`],
  snapshotEnabled: [`snapshot`, `enabled`],
}
