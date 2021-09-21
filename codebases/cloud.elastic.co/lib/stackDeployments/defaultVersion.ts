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

import { parse as parseVersion, rcompare } from '../semver'

import { VersionNumber } from '../../types'

import { StackVersionConfig } from '../api/v1/types'

type Props = {
  versionStacks: StackVersionConfig[] | null
  version: VersionNumber | null
  setVersion: (version: VersionNumber) => void
}

export function invalidateDefaultVersion({ versionStacks, version, setVersion }: Props) {
  if (!versionStacks || versionStacks.length === 0) {
    return
  }

  const versions = versionStacks.map((versionStack) => versionStack.version!).filter(Boolean)

  if (version && versions.includes(version)) {
    return
  }

  const defaultVersion = getDefaultVersion(versions)

  setVersion(defaultVersion)
}

function getDefaultVersion(versions: string[]): string {
  const sorted = sortVersions(versions)
  const withoutPrerelease = sorted.filter(whereNotPrerelease)

  return withoutPrerelease[0] || sorted[0]
}

function whereNotPrerelease(version: string): boolean {
  const parsed = parseVersion(version)

  if (!parsed) {
    return false
  }

  // We use patch versions of e.g. 99 or 98 to mean something specific - they're not real releases.
  return parsed.patch < 95 && parsed.prerelease.length === 0
}

function sortVersions(versions: string[]): string[] {
  return versions.slice().sort(rcompare)
}
