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
import invariant from 'invariant'

import { DifferenceCheck } from './types'
import { flatten as flattenObject } from '../../flatten'
import { buildSettingsDiffCheck, processSettingsDiff } from './settings'
import { yamlToJson } from '../../yaml'

const yamlFieldName = `user_settings_yaml`
const jsonFieldName = `user_settings_json`

export const diffUserSettings: DifferenceCheck = buildSettingsDiffCheck({
  fields: [yamlFieldName, jsonFieldName],
  diffSettings: ({ sliderInstanceType, currentSettings, nextSettings }) => {
    invariant(
      definedKeys(currentSettings) <= 1,
      `Only one user settings field should be defined in the current plan`,
    )
    invariant(
      definedKeys(currentSettings) <= 1,
      `Only one user settings field should be defined in the next plan`,
    )

    const differences = processSettingsDiff({
      sliderInstanceType,
      currentSettings: getSettings(
        currentSettings.get(yamlFieldName),
        currentSettings.get(jsonFieldName),
      ),
      nextSettings: getSettings(nextSettings.get(yamlFieldName), nextSettings.get(jsonFieldName)),
      addedType: `user-setting-added`,
      changedType: `user-setting-changed`,
      removedType: `user-setting-removed`,
    })

    const currentSettingsFormat = currentSettings.get(yamlFieldName) !== undefined ? 'YAML' : 'JSON'
    const nextSettingsFormat = nextSettings.get(yamlFieldName) !== undefined ? 'YAML' : 'JSON'
    const currentIsDefined = definedKeys(currentSettings) > 0
    const nextIsDefined = definedKeys(nextSettings) > 0

    if (currentIsDefined && nextIsDefined && currentSettingsFormat !== nextSettingsFormat) {
      differences.push({
        type: `user-setting-format-changed`,
        target: sliderInstanceType,
        meta: {
          currentValue: currentSettingsFormat,
          nextValue: nextSettingsFormat,
        },
      })
    }

    return differences
  },
})

function getSettings(yaml, json) {
  try {
    return flattenObject(yaml ? yamlToJson(yaml) : json) || {}
  } catch (e) {
    return {}
  }
}

function definedKeys(settings: Map<string, any>): number {
  return Array.from(settings.values()).filter((v) => v !== undefined).length
}
