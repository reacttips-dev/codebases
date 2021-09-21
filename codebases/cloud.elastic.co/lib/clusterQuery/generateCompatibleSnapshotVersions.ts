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

/**
 * These are coming from https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html#modules-snapshots
 * A snapshot of an index created in 5.x can be restored to 6.x.
 * A snapshot of an index created in 2.x can be restored to 5.x.
 * A snapshot of an index created in 1.x can be restored to 2.x.
 */

export default function generateCompatibleSnapshotVersions(version: string): string[] {
  if (version == null) {
    return []
  }

  // creating a 2.x cluster you can restore snapshots that were with version 2 and 1
  if (satisfies(version, `>=2.0 <5`)) {
    return [`2.`, `1.`]
  }

  // creating a 5.x cluster you can restore snapshots that were with version 5 and 2
  if (satisfies(version, `>=5.0 <6`)) {
    return [`5.`, `2.`]
  }

  // creating a 6.x cluster you can restore snapshots that were with version 6 and 5
  if (satisfies(version, `>=6.0 <7`)) {
    return [`6.`, `5.`]
  }

  // creating a 7.x cluster you can restore snapshots that were with version 7
  if (satisfies(version, `>=7`)) {
    return [`7.`, `6.`]
  }

  return []
}
