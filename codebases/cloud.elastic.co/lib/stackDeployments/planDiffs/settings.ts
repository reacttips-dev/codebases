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
import { difference, get, last } from 'lodash'
import { diff as deepDiff } from 'deep-diff'

import { SliderInstanceType } from '../../../types'
import { Difference, DifferenceArgs, DifferenceCheck, DifferenceType } from './types'
import { getInstanceConfiguration } from './topology'
import { hasChangedPath, hasNext } from './preconditions'
import { groupDiffs } from '../../diff'

type SettingsDiffArgs = {
  currentSettings: Map<string, any>
  nextSettings: Map<string, any>
} & DifferenceArgs
interface SettingsDiffBuilderArgs {
  fields: string[]
  defaultValue?: any
  diffSettings: (args: SettingsDiffArgs) => Array<Difference<any>>
}

export function buildSettingsDiffCheck({
  fields,
  defaultValue,
  diffSettings,
}: SettingsDiffBuilderArgs): DifferenceCheck {
  function pathBuilder(args: DifferenceArgs): string[][] {
    const basePath = getBaseSettingsPath(args)
    return fields.map((f) => [...basePath, f])
  }

  return {
    preconditions: [hasNext, hasChangedPath({ pathBuilder, defaultValue })],
    check: (args) => {
      const { current, next } = args
      const paths = pathBuilder(args)
      const currentSettings = new Map(
        paths.map((path) => [last(path) as string, get(current, path, defaultValue)]),
      )
      const nextSettings = new Map(
        paths.map((path) => [last(path) as string, get(next, path, defaultValue)]),
      )

      return diffSettings({
        ...args,
        currentSettings,
        nextSettings,
      })
    },
  }
}

interface SettingsDifferenceMeta {
  key?: string
  nextValue?: string
  currentValue?: string
}

export function processSettingsDiff({
  currentSettings,
  nextSettings,
  sliderInstanceType,
  addedType,
  changedType,
  removedType,
}: {
  currentSettings: any
  nextSettings: any
  sliderInstanceType: SliderInstanceType
  addedType: DifferenceType
  changedType: DifferenceType
  removedType: DifferenceType
}): Array<Difference<SettingsDifferenceMeta>> {
  const settingsDiff = deepDiff(currentSettings, nextSettings)
  const diffByKind = groupDiffs(settingsDiff)
  const settingsAdded = diffByKind.N.map(
    (setting): Difference<SettingsDifferenceMeta> => ({
      type: addedType,
      target: sliderInstanceType,
      meta: {
        key: setting.path && setting.path[0],
        nextValue: String(setting.rhs),
      },
    }),
  )

  const settingsChanged = diffByKind.E.map(
    (setting): Difference<SettingsDifferenceMeta> => ({
      type: changedType,
      target: sliderInstanceType,
      meta: {
        key: setting.path && setting.path[0],
        currentValue: setting.path && setting.lhs.toString(),
        nextValue: String(setting.rhs),
      },
    }),
  )

  const settingsRemoved = diffByKind.D.map(
    (setting): Difference<SettingsDifferenceMeta> => ({
      type: removedType,
      target: sliderInstanceType,
      meta: {
        key: setting.path && setting.path[0],
      },
    }),
  )

  return [...settingsAdded, ...settingsChanged, ...settingsRemoved]
}

export function processPluginOrBundleDiff({
  currentIds,
  nextIds,
  sliderInstanceType,
  addedType,
  removedType,
}: {
  currentIds: string[]
  nextIds: string[]
  sliderInstanceType: SliderInstanceType
  addedType: DifferenceType
  removedType: DifferenceType
}): Array<Difference<{ id: string }>> {
  const added = difference(nextIds, currentIds).map(
    (id): Difference<{ id: string }> => ({
      type: addedType,
      target: sliderInstanceType,
      meta: {
        id,
      },
    }),
  )
  const removed = difference(currentIds, nextIds).map(
    (id): Difference<{ id: string }> => ({
      type: removedType,
      target: sliderInstanceType,
      meta: {
        id,
      },
    }),
  )

  return [...added, ...removed]
}

function getBaseSettingsPath({
  sliderInstanceType,
  next,
  current,
  instanceConfigurations,
}: DifferenceArgs): string[] {
  // User Settings for APM and Kibana are managed globally
  if (sliderInstanceType !== `elasticsearch`) {
    return [sliderInstanceType]
  }

  if (!next?.cluster_topology) {
    return [sliderInstanceType]
  }

  if (!instanceConfigurations) {
    return [sliderInstanceType]
  }

  const topologyIndex = next.cluster_topology.findIndex((topologyElement, i) => {
    const currentTopologyElement = get(current, [`cluster_topology`, String(i)])
    const instanceConfiguration =
      getInstanceConfiguration(topologyElement, instanceConfigurations) ||
      getInstanceConfiguration(currentTopologyElement, instanceConfigurations)

    return instanceConfiguration?.instance_type === sliderInstanceType
  })

  if (topologyIndex === -1) {
    return [sliderInstanceType]
  }

  return [`cluster_topology`, String(topologyIndex), sliderInstanceType]
}
