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

import { fetchProviders, fetchProvidersIfNeeded } from '../regions/fetchProviders'
import { fetchPlatformOverview, fetchPlatformOverviewIfNeeded } from '../platform'

import { getConfigForKey } from '../../selectors'

import { ReduxState } from '../../types'

export { fetchHappySadClusters } from './fetchHappySadClusters'

export function fetchRegionListForDeploymentCreatePage() {
  return fetchRegionListImpl({
    // the Create page relies on different responses depending on whether this is ESS or ECE
    shouldFetchPlatform: isNotSaas,
    onlyIfNeeded: false,
  })
}

export function fetchRegionListForDeploymentCreatePageIfNeeded() {
  return fetchRegionListImpl({
    // the Create page relies on different responses depending on whether this is ESS or ECE
    shouldFetchPlatform: isNotSaas,
    onlyIfNeeded: true,
  })
}

export function fetchRegionList() {
  return fetchRegionListImpl({
    // when fetching a region list, we just need a list of region ids, but on AC we need more stuff
    shouldFetchPlatform: isAnyAdminconsole,
    onlyIfNeeded: false,
  })
}

export function fetchRegionListIfNeeded() {
  return fetchRegionListImpl({
    // when fetching a region list, we just need a list of region ids, but on AC we need more stuff
    shouldFetchPlatform: isAnyAdminconsole,
    onlyIfNeeded: true,
  })
}

function fetchRegionListImpl({
  shouldFetchPlatform,
  onlyIfNeeded,
}: {
  shouldFetchPlatform: (state: ReduxState) => boolean
  onlyIfNeeded: boolean
}) {
  return (dispatch, getState) => {
    const state = getState()
    const fetchPlatform = shouldFetchPlatform(state)

    if (fetchPlatform) {
      if (onlyIfNeeded) {
        return dispatch(fetchPlatformOverviewIfNeeded())
      }

      return dispatch(fetchPlatformOverview())
    }

    if (onlyIfNeeded) {
      return dispatch(fetchProvidersIfNeeded())
    }

    return dispatch(fetchProviders())
  }
}

function isAnyAdminconsole(state: ReduxState): boolean {
  return getConfigForKey(state, `APP_NAME`) === `adminconsole`
}

function isNotSaas(state: ReduxState): boolean {
  return getConfigForKey(state, `APP_PLATFORM`) !== `saas`
}
