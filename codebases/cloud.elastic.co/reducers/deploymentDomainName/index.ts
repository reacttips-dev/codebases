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
  FETCH_DEPLOYMENT_DOMAIN_NAME,
  UPDATE_DEPLOYMENT_DOMAIN_NAME,
} from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

export type State = {
  [regionId: string]: string | null
}

export default function deploymentDomainNameReducer(state: State = {}, action) {
  if (action.type === FETCH_DEPLOYMENT_DOMAIN_NAME) {
    const { regionId } = action.meta

    if (!action.error && action.payload) {
      return replaceIn(state, [regionId], action.payload.value)
    }
  }

  if (action.type === UPDATE_DEPLOYMENT_DOMAIN_NAME) {
    const { regionId } = action.meta

    if (!action.error && action.payload) {
      return replaceIn(state, [regionId], action.payload.value)
    }
  }

  return state
}

export function getDeploymentDomainName(state: State, regionId: string): string | null {
  return state[regionId] || null
}
