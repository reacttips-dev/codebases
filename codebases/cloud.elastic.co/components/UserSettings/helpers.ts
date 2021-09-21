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

import { canSeeApiKeys } from '../../lib/apiKeys'

import { getCurrentUser } from '../../reducers'
import { isFeatureActivated, getConfigForKey } from '../../store'

import Feature from '../../lib/feature'
import { ReduxState, CloudAppFamily, CloudAppName } from '../../types'

// TODO: this logic doesn't belong in here, it belongs in lib/ or whatever
export function hasUserSettings(state: ReduxState): boolean {
  const appFamily = getConfigForKey<CloudAppFamily>(`APP_FAMILY`)
  const appName = getConfigForKey<CloudAppName>(`APP_NAME`)
  const currentUser = getCurrentUser(state)

  return (isFeatureActivated(Feature.manageRbac) &&
    appName === 'adminconsole' &&
    appFamily === 'cloud-enterprise' &&
    currentUser) as boolean
}

export function showApiKeys(state: ReduxState): boolean {
  const appFamily = getConfigForKey<CloudAppFamily>(`APP_FAMILY`)
  const appName = getConfigForKey<CloudAppName>(`APP_NAME`)
  const currentUser = getCurrentUser(state)

  if (!canSeeApiKeys()) {
    return false
  }

  // ECE built-in read-only users
  if (
    appName === 'adminconsole' &&
    appFamily === 'cloud-enterprise' &&
    currentUser &&
    currentUser.builtin
  ) {
    return false
  }

  return true
}
