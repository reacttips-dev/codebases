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

import { WATCH_APP_SEARCH_MIGRATION_SNAPSHOT } from '../../constants/actions'

import { StackDeployment } from '../../types'

export function watchAppSearchMigrationSnapshot({
  deployment,
  snapshotName,
}: {
  deployment: StackDeployment
  snapshotName: string
}) {
  return {
    type: WATCH_APP_SEARCH_MIGRATION_SNAPSHOT,
    payload: snapshotName,
    meta: { deploymentId: deployment.id },
  }
}
