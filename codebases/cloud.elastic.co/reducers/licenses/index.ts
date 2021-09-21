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

import { get } from 'lodash'

import { FETCH_LICENSE, REMOVE_LICENSE, SET_LICENSE } from '../../constants/actions'
import { License, AsyncAction } from '../../types'
import { LicenseInfo as ApiLicenseInfo, LicenseObject, UsageStats } from '../../lib/api/v1/types'

interface LicenseState {
  license: License | null
  fetched: boolean
}

export interface State {
  [regionId: string]: LicenseState
}

interface RemoveLicenseAction extends AsyncAction<typeof REMOVE_LICENSE> {
  meta: { regionId: string; state: 'started' | 'failed' | 'success' }
}

interface FetchLicenseAction extends AsyncAction<typeof FETCH_LICENSE, LicenseObject> {
  meta: { regionId: string; state: 'started' | 'failed' | 'success' }
}

interface SetLicenseAction extends AsyncAction<typeof SET_LICENSE> {
  meta: {
    regionId: string
    state: 'started' | 'failed' | 'success'
    license: LicenseObject
  }
}

type Action = RemoveLicenseAction | FetchLicenseAction | SetLicenseAction

// usageStats shouldn't be a partial, but it's easier than explaining to TypeScript
// why we apply a default of {}
function createLicense(license: ApiLicenseInfo, usageStats: Partial<UsageStats> = {}): License {
  return {
    licenseType: license.type,
    expires: new Date(license.expiry_date_in_millis),
    issued: new Date(license.issue_date_in_millis),
    issuedTo: license.issued_to,
    maxInstances: license.max_instances,
    maxResourceUnits: license.max_resource_units,
    issuer: license.issuer,
    total_connected_memory_total: usageStats.total_connected_memory_total,
  }
}

const initialLicenseState: LicenseState = {
  license: null,
  fetched: false,
}

function licenseReducer(state: LicenseState = initialLicenseState, action: Action) {
  if (action.type === REMOVE_LICENSE) {
    if (!action.error && action.payload) {
      return {
        license: null,
        fetched: true,
      }
    }
  }

  if (action.type === FETCH_LICENSE || action.type === SET_LICENSE) {
    // the license endpoint might return 404 when we've deleted the license
    if (action.error) {
      return {
        license: null,
        fetched: get(action.payload, [`response`, `status`]) === 404,
      }
    }

    if (action.type === FETCH_LICENSE && action.payload && action.payload.license) {
      return {
        license: createLicense(action.payload.license, action.payload.usage_stats),
        fetched: true,
      }
    }

    if (action.type === SET_LICENSE && action.meta.state === `success` && action.meta.license) {
      return {
        license: createLicense(action.meta.license.license),
        fetched: true,
      }
    }
  }

  return state
}

export default function licensesReducer(licenses: State = {}, action: Action): State {
  switch (action.type) {
    case FETCH_LICENSE:
    case SET_LICENSE:
    case REMOVE_LICENSE:
      const { regionId } = action.meta

      return {
        ...licenses,
        [regionId]: licenseReducer(licenses[regionId], action),
      }

    default:
      return licenses
  }
}

export function getLicense(state: State, regionId: string): License | null | undefined {
  const licenseState = state[regionId]

  if (!licenseState) {
    return undefined
  }

  const { fetched, license } = licenseState

  return fetched ? license : undefined
}
