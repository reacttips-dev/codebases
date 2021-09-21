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

import { isPlainObject, uniqWith, isEqual } from 'lodash'

import { isEnabledConfiguration } from './conversion'

import { yamlToJson, JsonFromYaml, JsonObject } from '../yaml'
import { collapseKeysRecursively } from '../objects'

import { PlainHashMap, SliderInstanceType } from '../../types'
import { ElasticsearchClusterTopologyElement } from '../../lib/api/v1/types'

export const defaultEsUserSettings = `
# Note that the syntax for user settings can change between major versions.
# You might need to update these user settings before performing a major version upgrade.
#
# Slack integration for versions 7.0 and later must use the secure key store method.
# For more information, see:
# https://www.elastic.co/guide/en/elasticsearch/reference/current/actions-slack.html#configuring-slack
#
# Slack integration example (for versions after 5.0 and before 7.0)
# xpack.notification.slack:
#   account:
#     monitoring:
#       url: https://hooks.slack.com/services/T0A6BLEEA/B0A6D1PRD/XYZ123
#
# Slack integration example (for versions before 5.0)
# watcher.actions.slack.service:
#   account:
#     monitoring:
#       url: https://hooks.slack.com/services/T0A6BLEEA/B0A6D1PRD/XYZ123
#       message_defaults:
#        from: Watcher
#
# HipChat and PagerDuty integration are also supported. To learn more, see the documentation.
`.trim()

export const defaultKibanaUserSettings = `
# Note that the syntax for user settings can change between major versions.
# You might need to update these user settings before performing a major version upgrade.
#
# Use OpenStreetMap for tiles:
# tilemap:
#   options.maxZoom: 18
#   url: http://a.tile.openstreetmap.org/{z}/{x}/{y}.png
#
# To learn more, see the documentation.
`.trim()

export const defaultApmUserSettings = `
# Note that the syntax for user settings can change between major versions.
# You might need to update these user settings before performing a major version upgrade.
#
# To learn more, see the documentation.
`.trim()

export const defaultAppSearchUserSettings = `
# Note that the syntax for user settings can change between major versions.
# You might need to update these user settings before performing a major version upgrade.
#
# To learn more, see the documentation.
`.trim()

export const defaultEnterpriseSearchUserSettings = `
# Note that the syntax for user settings can change between major versions.
# You might need to update these user settings before performing a major version upgrade.
#
# To learn more, see the documentation.
`.trim()

export function getUserSetting(userSettingsYaml: string | undefined, field: string) {
  const parsedUserSettings = parseUserSettings(userSettingsYaml)
  return parsedUserSettings[field]
}

export function hasUserSetting(userSettingsYaml: string | undefined, field: string): boolean {
  const parsedUserSettings = parseUserSettings(userSettingsYaml)
  return findUserSetting(parsedUserSettings, field)
}

export function hasUserSettingJson(userSettingsJson: JsonFromYaml, field: string): boolean {
  const parsedUserSettings = parseUserSettingsJson(userSettingsJson)
  return findUserSetting(parsedUserSettings, field)
}

export function parseUserSettings(userSettingsYaml: string | undefined) {
  const parsedYaml = yamlToJson(userSettingsYaml || ``)
  return parseUserSettingsJson(parsedYaml)
}

function parseUserSettingsJson(userSettingsJson: JsonFromYaml) {
  const yamlObject = isPlainObject(userSettingsJson) ? (userSettingsJson as JsonObject) : {}
  return collapseKeysRecursively(yamlObject)
}

function findUserSetting(parsedUserSettings: PlainHashMap, field: string) {
  return Object.keys(parsedUserSettings).some((key) => key.startsWith(field))
}

// #47466 - Check that all the Elasticsearch instances have the same user settings. We're not aware of
// a valid case for having them differ, but a very real problem arises when security settings
// are configured on all the nodes except ML, which has caused a few support tickets. Ultimately,
// we should force the settings to be the same for all instance configurations.
export function hasInconsistentUserSettings({
  nodeConfigurations = [],
}: {
  nodeConfigurations?: ElasticsearchClusterTopologyElement[]
}): boolean {
  // disabled sliders are irrelevant to these warnings
  const enabledConfigurations = nodeConfigurations.filter(isEnabledConfiguration)

  const yamlSettings = enabledConfigurations.map(getYamlUserSettings).filter(isString)
  const parsedYamlSettings = yamlSettings.map(parseUserSettings)

  const variants = uniqWith(parsedYamlSettings, isEqual)
  const inconsistentSettings = variants.length > 1

  return inconsistentSettings

  function getYamlUserSettings(nodeConfiguration: ElasticsearchClusterTopologyElement) {
    return nodeConfiguration.elasticsearch?.user_settings_yaml
  }

  function isString(setting) {
    return typeof setting === `string`
  }
}

export function getDefaultUserSettings(sliderInstanceType: SliderInstanceType): string {
  switch (sliderInstanceType) {
    case `elasticsearch`:
      return defaultEsUserSettings
    case `kibana`:
      return defaultKibanaUserSettings
    case `apm`:
      return defaultApmUserSettings
    case `appsearch`:
      return defaultAppSearchUserSettings
    default:
      return ``
  }
}
