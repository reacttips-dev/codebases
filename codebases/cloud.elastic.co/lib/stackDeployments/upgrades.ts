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

import { isEmpty, isObject, get, omit } from 'lodash'

import { sanitizeUpdateRequestBeforeSend } from './updates'
import {
  getUpsertVersion,
  getVersion,
  isSystemOwned,
  getEsPlan,
  getFirstEsCluster,
} from './selectors'

import { preparePlanBeforeUpdateCluster } from '../clusters'
import { strategies } from '../clusterStrategies'

import { getPlanWithUpdatedCustomPlugins, getIncompatibleCustomPlugins } from '../plugins'

import { replaceIn, updateIn } from '../immutability-helpers'

import { diff, gte, lt } from '../semver'

import {
  DeploymentUpdateRequest,
  ElasticsearchClusterTopologyElement,
  ElasticsearchPayload,
  ElasticsearchSystemSettings,
  Extension,
} from '../api/v1/types'
import { StackDeployment } from '../../types'

type SettingsUpdater = (settings: ElasticsearchSystemSettings) => ElasticsearchSystemSettings

export function isMajorVersionChange(previous?: string | null, current?: string | null): boolean {
  if (!previous || !current) {
    return false
  }

  return diff(previous, current) === `major`
}

export function getUpdateRequestWithPluginsAndTransforms({
  updateRequest,
  deploymentUnderEdit,
  extensions,
  selectedPluginUrls,
}: {
  updateRequest: DeploymentUpdateRequest
  deploymentUnderEdit: StackDeployment
  extensions: Extension[]
  selectedPluginUrls: string[]
}): DeploymentUpdateRequest {
  const version = getUpsertVersion({ deployment: updateRequest })!

  const updateRequestWithTransforms = getUpdateRequestWithTransforms({
    updateRequest,
    deploymentUnderEdit,
    version,
  })

  const updateRequestWithPlugins = getUpdateRequestWithPlugins({
    updateRequest: updateRequestWithTransforms,
    deploymentUnderEdit,
    extensions,
    selectedPluginUrls,
  })

  const sanitizedUpdateRequest = sanitizeUpdateRequestBeforeSend({
    deployment: updateRequestWithPlugins,
  })

  return sanitizedUpdateRequest
}

function getUpdateRequestWithTransforms({
  updateRequest,
  deploymentUnderEdit,
  version,
}: {
  updateRequest: DeploymentUpdateRequest
  deploymentUnderEdit: StackDeployment
  version: string
}): DeploymentUpdateRequest {
  return replaceIn(
    updateRequest,
    ['resources', 'elasticsearch', '0'],
    getVersionUpdateTransforms({
      deployment: updateRequest,
      deploymentUnderEdit,
      version,
    }),
  )
}

function getUpdateRequestWithPlugins({
  updateRequest,
  deploymentUnderEdit,
  extensions,
  selectedPluginUrls,
}: {
  updateRequest: DeploymentUpdateRequest
  deploymentUnderEdit: StackDeployment
  extensions: Extension[]
  selectedPluginUrls: string[]
}): DeploymentUpdateRequest {
  const plan = getEsPlan({ deployment: updateRequest })!
  const version = getVersion({ deployment: deploymentUnderEdit })
  const pendingVersion = getUpsertVersion({ deployment: updateRequest })
  const removedPlugins = getIncompatibleCustomPlugins(version, pendingVersion, plan)
  const newPlan = getPlanWithUpdatedCustomPlugins(
    selectedPluginUrls,
    removedPlugins,
    extensions!,
    plan,
  )

  const planOverrides = {
    transient: {
      strategy: strategies.autodetect,
    },
  }

  // apply same fancy transformations that `saveClusterPlan` would
  const esPlan = preparePlanBeforeUpdateCluster({
    plan: newPlan,
    planOverrides,
  })

  const updatedDeploymentRequest = replaceIn(
    updateRequest,
    ['resources', 'elasticsearch', '0', 'plan'],
    esPlan,
  )

  return updatedDeploymentRequest
}

function getVersionUpdateTransforms({
  deployment,
  deploymentUnderEdit,
  version,
}: {
  deployment: DeploymentUpdateRequest
  deploymentUnderEdit: StackDeployment
  version: string
}): ElasticsearchPayload {
  const esCluster = getFirstEsCluster({ deployment })!
  const currentVersion = getVersion({ deployment: deploymentUnderEdit })

  if (!currentVersion) {
    return esCluster
  }

  if (!isMajorVersionChange(currentVersion, version)) {
    const systemOwned = isSystemOwned({ deployment: deploymentUnderEdit })

    if (gte(version, `5.0.0`) && lt(version, `6.0.0`) && systemOwned) {
      return upgradeSystemClusterPlanTo5xx(esCluster)
    }

    return esCluster
  }

  // We're performing a major upgrade

  if (gte(version, `6.0.0`)) {
    if (lt(currentVersion, `6.0.0`)) {
      return upgradePlanTo6x(esCluster)
    }

    return esCluster
  }

  if (gte(version, `5.0.0`)) {
    if (lt(currentVersion, `5.0.0`)) {
      return upgradePlanTo5x(esCluster)
    }

    return esCluster
  }

  return esCluster
}

function upgradePlanTo5x(esCluster: ElasticsearchPayload): ElasticsearchPayload {
  return updateSystemSettings(esCluster, (settings) => ({
    ...omit(settings, [`default_shards_per_index`]),
    scripting: {
      file: get(settings, [`scripting`, `file`]),
      inline: get(settings, [`scripting`, `inline`]),
      stored: get(settings, [`scripting`, `stored`]),
      expressions_enabled: true,
      mustache_enabled: true,
      painless_enabled: true,
    },
    watcher_trigger_engine: `scheduler`,
    monitoring_collection_interval: -1,
    reindex_whitelist: get(settings, [`reindex_whitelist`], [`*.io:*`, `*.com:*`]),
  }))
}

// We need to prepare system clusters for upgrading to 6 and above where scripting is required
// this makes system cluster scripting settings consistent between clusters created ECE 1.x
// and clusters created more recently. See https://github.com/elastic/cloud/issues/28402
function upgradeSystemClusterPlanTo5xx(esCluster: ElasticsearchPayload): ElasticsearchPayload {
  return updateSystemSettings(esCluster, (settings) => {
    const enableScripting = {
      inline: { enabled: true },
      stored: { enabled: true },
    }

    const oldSettings = isObject(settings) ? settings : {}
    const oldScripting = isObject(oldSettings.scripting) ? oldSettings.scripting : {}

    return {
      ...oldSettings,
      scripting: {
        ...oldScripting,
        ...enableScripting,
      },
    }
  })
}

/**
 * Scripting config has changed a lot in 6.x, and so the defaults have too.
 * @param {Object} cluster the pending cluster state
 */
function upgradePlanTo6x(esCluster: ElasticsearchPayload): ElasticsearchPayload {
  const updatedSettings = updateSystemSettings(esCluster, (settings) => ({
    ...settings,
    scripting: {
      inline: { enabled: true },
      stored: { enabled: true },
    },
  }))

  const isSystemCluster = Boolean(esCluster.settings?.metadata?.system_owned)

  if (isSystemCluster) {
    // there are legacy scripting settings that are set in `user_settings_json`
    // when system clusters are created that don't work on 6.x, so we must remove them
    return updateElasticsearchSegment(updatedSettings, (elasticsearch) => ({
      ...elasticsearch,
      user_settings_json: {},
    }))
  }

  return updatedSettings
}

function updateSystemSettings(
  esCluster: ElasticsearchPayload,
  updater: SettingsUpdater,
): ElasticsearchPayload {
  if (isEmpty(esCluster.plan.cluster_topology)) {
    return updateIn(esCluster, [`plan`, `elasticsearch`, `system_settings`], updater)
  }

  return esCluster.plan.cluster_topology.reduce(
    (
      updatedCluster: ElasticsearchPayload,
      _nodeConfiguration: ElasticsearchClusterTopologyElement,
      index: number,
    ) => updateIn(updatedCluster, getSettingsPath(index), updater),
    esCluster,
  )

  function getSettingsPath(index: number): string[] {
    return [`plan`, `cluster_topology`, `${index}`, `elasticsearch`, `system_settings`]
  }
}

function updateElasticsearchSegment(
  esCluster: ElasticsearchPayload,
  updater: SettingsUpdater,
): ElasticsearchPayload {
  if (isEmpty(esCluster.plan.cluster_topology)) {
    return updateIn(esCluster, [`plan`, `elasticsearch`], updater)
  }

  return esCluster.plan.cluster_topology.reduce(
    (
      updatedCluster: ElasticsearchPayload,
      _nodeConfiguration: ElasticsearchClusterTopologyElement,
      index: number,
    ) => updateIn(updatedCluster, getSettingsPath(index), updater),
    esCluster,
  )

  function getSettingsPath(index: number): string[] {
    return [`plan`, `cluster_topology`, `${index}`, `elasticsearch`]
  }
}
