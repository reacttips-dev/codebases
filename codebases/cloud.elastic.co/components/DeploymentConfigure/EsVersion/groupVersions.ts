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

import { flow, forEach, groupBy, sortBy } from 'lodash'

import { major, parse, rcompare } from '../../../lib/semver'

import { VersionNumber } from '../../../types'

// Versions grouped by (1) stability, (2) major version
type GroupedVersions = {
  stable?: VersionNumber[][]
  prerelease?: VersionNumber[][]
}

export default function groupVersions(rawVersions: VersionNumber[]): GroupedVersions {
  // sort into final on-page order to ensure ids are in order
  const sortedVersions = flow([
    (versions) => versions.slice().sort(rcompare), // descending order
    (versions) => sortBy(versions, (v) => !isPrerelease(v)), // prerelease at top
  ])(rawVersions)

  const byStability = groupBy(sortedVersions, (v) => (isPrerelease(v) ? `prerelease` : `stable`))

  const groupedVersions = {}

  forEach(byStability, (versions, stability) => {
    const byMajor = groupBy(versions, major)

    groupedVersions[stability] = Object.keys(byMajor).reduce((result, majorNumber) => {
      result.push(byMajor[majorNumber])
      return result
    }, [] as VersionNumber[][])
  })

  return groupedVersions
}

export function isPrerelease(version) {
  const parsed = parse(version)

  if (!parsed) {
    return false
  }

  // We use patch versions of e.g. 99 or 98 to mean something specific - they're not real releases.
  return parsed.prerelease.length > 0 || parsed.patch > 95
}
