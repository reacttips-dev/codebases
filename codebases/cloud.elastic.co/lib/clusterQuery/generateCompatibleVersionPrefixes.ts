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

import { satisfies } from '../semver'

export default function generateCompatibleVersionPrefixes(version: string): string[] {
  if (version == null) {
    return []
  }

  if (satisfies(version, `2.0 - 2.2`)) {
    return [`2.0.`, `2.1.`, `2.2.`]
  }

  if (satisfies(version, `2.3 - 2.4`)) {
    return [`2.3.`, `2.4.`]
  }

  if (satisfies(version, `>=5.0 <6`)) {
    return [`5.`]
  }

  if (satisfies(version, `>=6.0 <7`)) {
    return [`6.`]
  }

  if (satisfies(version, `>=7.0`)) {
    return [`7.`]
  }

  return []
}
