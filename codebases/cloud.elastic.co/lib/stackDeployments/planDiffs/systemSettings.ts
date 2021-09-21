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
import { flatten as flattenObject } from '../../flatten'
import { buildSettingsDiffCheck, processSettingsDiff } from './settings'

const fieldName = `system_settings`

export const diffSystemSettings: DifferenceCheck = buildSettingsDiffCheck({
  fields: [fieldName],
  diffSettings: ({ currentSettings, nextSettings, sliderInstanceType }) =>
    processSettingsDiff({
      sliderInstanceType,
      currentSettings: flattenObject(currentSettings.get(fieldName)) || {},
      nextSettings: flattenObject(nextSettings.get(fieldName)) || {},
      addedType: `system-setting-added`,
      changedType: `system-setting-changed`,
      removedType: `system-setting-removed`,
    }),
})
