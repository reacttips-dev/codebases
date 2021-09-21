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

import { StackVersionConfig } from '../../lib/api/v1/types'

export function getWhitelistedVersions(
  versionStacks: StackVersionConfig[] | null,
  areVersionsWhitelisted: boolean,
) {
  if (areVersionsWhitelisted) {
    // if in SaaS, we have the concept of whitelisting, so want to filter to get only the whitelisted ones
    return versionStacks
      ? versionStacks
          .filter((versionStack) => versionStack.whitelisted)
          .map((versionStack) => versionStack.version!)
      : []
  }

  // if not in SaaS, we don't have whitelisting, so all versions are whitelisted
  return versionStacks ? versionStacks.map((versionStack) => versionStack.version!) : []
}
