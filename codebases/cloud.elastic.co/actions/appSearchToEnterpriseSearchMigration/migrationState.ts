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

import {
  START_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION,
  STOP_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION,
} from '../../constants/actions'

import { StackDeployment } from '../../types'

export function startAppSearchToEnterpriseSearchMigration({
  deployment,
}: {
  deployment: StackDeployment
}) {
  return {
    type: START_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION,
    meta: { deploymentId: deployment.id },
  }
}

export function stopAppSearchToEnterpriseSearchMigration({
  deployment,
}: {
  deployment: StackDeployment
}) {
  return {
    type: STOP_APP_SEARCH_TO_ENTERPRISE_SEARCH_MIGRATION,
    meta: { deploymentId: deployment.id },
  }
}
