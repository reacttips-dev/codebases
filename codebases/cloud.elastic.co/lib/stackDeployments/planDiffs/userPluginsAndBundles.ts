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
import { intersection, isEqual, keyBy } from 'lodash'
import { DifferenceCheck, DifferenceType } from './types'
import { buildSettingsDiffCheck, processPluginOrBundleDiff } from './settings'
import { ElasticsearchUserBundle, ElasticsearchUserPlugin } from '../../api/v1/types'

type FieldName = `user_plugins` | `user_bundles`

function buildDifferenceCheck({
  fieldName,
  addedType,
  removedType,
  changedType,
  updatedType,
}: {
  fieldName: FieldName
  addedType: DifferenceType
  removedType: DifferenceType
  changedType: DifferenceType
  updatedType: DifferenceType
}): DifferenceCheck {
  return buildSettingsDiffCheck({
    fields: [fieldName],
    defaultValue: [],
    diffSettings: ({ currentSettings, nextSettings, sliderInstanceType }) => {
      const currentById = keyBy<ElasticsearchUserPlugin | ElasticsearchUserBundle>(
        currentSettings.get(fieldName),
        `url`,
      )
      const nextById = keyBy<ElasticsearchUserPlugin | ElasticsearchUserBundle>(
        nextSettings.get(fieldName),
        `url`,
      )

      const currentIds = Object.keys(currentById)
      const nextIds = Object.keys(nextById)

      const differences = processPluginOrBundleDiff({
        currentIds,
        nextIds,
        sliderInstanceType,
        addedType,
        removedType,
      }).map((d) => {
        const byId = d.type === addedType ? nextById : currentById
        const name = byId[d.meta!.id].name

        return {
          ...d,
          meta: {
            id: d.meta!.id,
            name,
          },
        }
      })

      const maybeChanged = intersection(nextIds, currentIds)
      const changed = maybeChanged
        .map((id) => ({
          id,
          current: currentById[id],
          next: nextById[id],
        }))
        .filter(({ current, next }) => !isEqual(current, next))
        .map(({ id, current, next }) => {
          if (current.name !== next.name) {
            return {
              type: changedType,
              target: sliderInstanceType,
              meta: {
                id,
                current: current.name,
                next: next.name,
              },
            }
          }

          return {
            type: updatedType,
            target: sliderInstanceType,
            meta: {
              next: next.name,
            },
          }
        })

      return [...differences, ...changed]
    },
  })
}

export const diffUserBundles = buildDifferenceCheck({
  fieldName: `user_bundles`,
  addedType: `user-bundle-added`,
  removedType: `user-bundle-removed`,
  changedType: `user-bundle-changed`,
  updatedType: `user-bundle-updated`,
})

export const diffUserPlugins = buildDifferenceCheck({
  fieldName: `user_plugins`,
  addedType: `user-plugin-added`,
  removedType: `user-plugin-removed`,
  changedType: `user-plugin-changed`,
  updatedType: `user-plugin-updated`,
})
