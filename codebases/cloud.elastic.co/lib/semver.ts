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

import semver from 'semver'

/**
 * This module exists in order change semver's behaviour with any "prerelease"
 * part of semantic versions. Normally, if a version has a prerelease tag
 * (for example, 1.2.3-alpha.3) then it will only be allowed to satisfy comparator
 * sets if at least one comparator with the same [major, minor, patch] tuple also
 * has a prerelease tag.
 *
 * The functions in this module cause prerelease tags to be ignored, since we attach
 * little significance to them. You might occasionally see `x.y.z-feature`, but these
 * should be treated as `x.y.z` in comparisons.
 */

/**
 * Parses the supplied version and returns the same version minus any prerelease tag.
 * @param {string} version a semantic version
 * @return {string} a semantic version mionus any prerelease tag.
 */
function removePrerelease(version: string): string {
  const parsed = semver.parse(version)

  if (!parsed) {
    return version
  }

  // eslint-disable-next-line no-shadow
  const { major, minor, patch } = parsed
  return `${major}.${minor}.${patch}`
}

export function satisfies(version: string, range: string): boolean {
  return semver.satisfies(removePrerelease(version), range)
}

export function maxSatisfying(
  versions: string[],
  range: string,
  { ignoreTags = true }: { ignoreTags?: boolean } = {},
): null | string {
  if (ignoreTags) {
    return semver.maxSatisfying(versions.map(removePrerelease), range)
  }

  return semver.maxSatisfying(versions, range)
}

export function lt(v1: string, v2: string): boolean {
  return semver.lt(removePrerelease(v1), removePrerelease(v2))
}

export function gt(v1: string, v2: string): boolean {
  return semver.gt(removePrerelease(v1), removePrerelease(v2))
}

export function gte(v1: string, v2: string): boolean {
  return semver.gte(removePrerelease(v1), removePrerelease(v2))
}

export function diff(v1: string, v2: string): null | string {
  return semver.diff(removePrerelease(v1), removePrerelease(v2))
}

export function major(version: string): number {
  const parsed = semver.parse(version)

  if (!parsed) {
    throw new Error(`Failed to parse version: [${version}]`)
  }

  return parsed.major
}

export function minor(version: string): number {
  const parsed = semver.parse(version)

  if (!parsed) {
    throw new Error(`Failed to parse version: [${version}]`)
  }

  return parsed.minor
}

/**
 * Export some functions for convenience, so that code doesn't have to
 * import this module and also `semver`. Note that comparisons are fine
 * with prerelease suffixes.
 */

export { rcompare, parse, sort, valid } from 'semver'
