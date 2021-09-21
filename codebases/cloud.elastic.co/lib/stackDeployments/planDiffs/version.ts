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

import { get, has, isEqual } from 'lodash'
import { hasNext } from './preconditions'
import { DifferenceCheck } from './types'

export const diffVersion: DifferenceCheck = {
  preconditions: [hasNext],
  check: ({ current, next, sliderInstanceType }) => {
    const versionPath = [sliderInstanceType, `version`]

    if (!has(next, versionPath)) {
      return []
    }

    const currentVersion = get(current, versionPath)
    const nextVersion = get(next, versionPath)

    if (isEqual(nextVersion, currentVersion)) {
      return []
    }

    return [
      {
        type: `version-changed`,
        target: sliderInstanceType,
        meta: {
          currentVersion,
          nextVersion,
        },
      },
    ]
  },
}
