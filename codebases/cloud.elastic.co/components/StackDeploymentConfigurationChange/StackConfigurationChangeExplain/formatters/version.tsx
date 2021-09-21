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
import React from 'react'

import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'
import ClusterVersionChange from '../ExplainChanges/ClusterVersionChange'
import { DifferenceFormatter } from '../types'

export const versionChangeFormatter: DifferenceFormatter = {
  handles: `version-changed`,
  formatter: ({ difference, isPastHistory }) => {
    const { target, meta } = difference as Difference<{
      currentVersion: string
      nextVersion: string
    }>
    const { currentVersion, nextVersion } = meta!
    return {
      id: `${target}-version`,
      type: target,
      testParams: [currentVersion, nextVersion],
      message: (
        <ClusterVersionChange
          type={target}
          oldVersion={currentVersion}
          currentVersion={nextVersion}
          isPastHistory={isPastHistory}
        />
      ),
    }
  },
}
