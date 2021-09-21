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
import { DifferenceCheck } from './types'
import { buildSettingsDiffCheck, processPluginOrBundleDiff } from './settings'

const fieldName = `enabled_built_in_plugins`

export const diffSystemPlugins: DifferenceCheck = buildSettingsDiffCheck({
  fields: [fieldName],
  defaultValue: [],
  diffSettings: ({ currentSettings, nextSettings, sliderInstanceType }) => {
    const currentPlugins = currentSettings.get(fieldName)
    const nextPlugins = nextSettings.get(fieldName)
    return processPluginOrBundleDiff({
      currentIds: currentPlugins,
      nextIds: nextPlugins,
      sliderInstanceType,
      addedType: `system-plugin-added`,
      removedType: `system-plugin-removed`,
    })
  },
})
