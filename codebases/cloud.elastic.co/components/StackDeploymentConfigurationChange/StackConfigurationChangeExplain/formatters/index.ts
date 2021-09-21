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

import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'
import { ExplainedChange } from '../types'
import { autoscalingDisabledFormatter, autoscalingEnabledFormatter } from './autoscaling'
import { esCurationDestFormatter, esCurationSourceFormatter } from './elasticsearch'
import {
  observabilityChangedFormatter,
  observabilityDisabledFormatter,
  observabilityEnabledFormatter,
} from './observability'
import { pruneOrphansFormatter } from './pruneOrphans'
import {
  systemSettingAddedFormatter,
  systemSettingChangedFormatter,
  systemSettingRemovedFormatter,
  userSettingAddedFormatter,
  userSettingChangedFormatter,
  userSettingRemovedFormatter,
} from './systemAndUserSettings'
import { systemPluginAddedFormatter, systemPluginRemovedFormatter } from './systemPlugins'
import {
  autoscalingLimitsChangedFormatter,
  disabledTopologyElementFormatter,
  instanceCountChangedFormatter,
  instanceSizeChangedFormatter,
  zoneCountChangedFormatter,
} from './topology'
import {
  userBundleAddedFormatter,
  userBundleChangedFormatter,
  userBundleRemovedFormatter,
  userBundleUpdatedFormatter,
  userPluginAddedFormatter,
  userPluginChangedFormatter,
  userPluginRemovedFormatter,
  userPluginUpdatedFormatter,
} from './userPluginsAndBundles'
import { versionChangeFormatter } from './version'

const formattersByType = (() => {
  const formatters = [
    pruneOrphansFormatter,
    autoscalingEnabledFormatter,
    autoscalingDisabledFormatter,
    autoscalingLimitsChangedFormatter,
    disabledTopologyElementFormatter,
    instanceCountChangedFormatter,
    instanceSizeChangedFormatter,
    zoneCountChangedFormatter,
    versionChangeFormatter,
    esCurationSourceFormatter,
    esCurationDestFormatter,
    observabilityEnabledFormatter,
    observabilityDisabledFormatter,
    observabilityChangedFormatter,
    systemSettingAddedFormatter,
    systemSettingChangedFormatter,
    systemSettingRemovedFormatter,
    userSettingAddedFormatter,
    userSettingChangedFormatter,
    userSettingRemovedFormatter,
    systemPluginAddedFormatter,
    systemPluginRemovedFormatter,
    userPluginAddedFormatter,
    userPluginRemovedFormatter,
    userPluginChangedFormatter,
    userPluginUpdatedFormatter,
    userBundleAddedFormatter,
    userBundleRemovedFormatter,
    userBundleChangedFormatter,
    userBundleUpdatedFormatter,
  ]
  return new Map(formatters.map((f) => [f.handles, f.formatter]))
})()

export function formatDifferences({
  differences,
  isPastHistory,
}: {
  differences: Array<Difference<any>>
  isPastHistory: boolean
}): ExplainedChange[] {
  return differences
    .map((difference) => {
      const formatter = formattersByType.get(difference.type)
      return (
        formatter &&
        formatter({
          difference,
          isPastHistory,
        })
      )
    })
    .filter((change): change is ExplainedChange => change !== undefined)
}
