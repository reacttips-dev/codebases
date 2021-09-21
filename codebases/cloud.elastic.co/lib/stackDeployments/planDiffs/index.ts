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

import { flatMap } from 'lodash'
import { diffAutoscaling } from './autoscaling'
import { diffCuration } from './elasticsearch'
import { diffLogging, diffMetrics } from './observability'
import { diffPruneOrphans } from './pruneOrphans'
import { diffTopology } from './topology'
import { Difference, DifferenceArgs, DifferenceCheck } from './types'
import { diffSystemSettings } from './systemSettings'
import { diffUserSettings } from './userSettings'
import { diffVersion } from './version'
import { diffSystemPlugins } from './systemPlugins'
import { diffUserBundles, diffUserPlugins } from './userPluginsAndBundles'

const allDifferenceChecks: DifferenceCheck[] = [
  diffPruneOrphans,
  diffAutoscaling,
  diffTopology,
  diffVersion,
  diffCuration,
  diffLogging,
  diffMetrics,
  diffSystemSettings,
  diffUserSettings,
  diffSystemPlugins,
  diffUserPlugins,
  diffUserBundles,
]

export const diffPlan = (
  args: DifferenceArgs,
  checks = allDifferenceChecks,
): Array<Difference<any>> => {
  const applicableChecks = checks.filter(({ preconditions }) =>
    preconditions.every((precondition) => precondition(args)),
  )
  return flatMap(applicableChecks.map(({ check }) => check(args)))
}
