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

import { getFirstSliderClusterFromGet, getSliderVersion } from '../stackDeployments'
import { satisfies } from '../semver'

import { DeploymentGetResponse } from '../api/v1/types'

export enum ApmMode {
  Standalone = `standalone`,
  Managed = `managed`,
}

const MANAGED_APM_VERSION_RANGE = `>=7.14.0`

export function getApmMode({ deployment }: { deployment?: DeploymentGetResponse }): ApmMode | null {
  if (!deployment) {
    return null
  }

  const apmResource = getFirstSliderClusterFromGet({ deployment, sliderInstanceType: `apm` })

  if (!apmResource) {
    return null
  }

  const version = getSliderVersion({ deployment, sliderInstanceType: `apm` })

  const managedApmAvailable = Boolean(version && satisfies(version, MANAGED_APM_VERSION_RANGE))

  if (!managedApmAvailable) {
    return null
  }

  if (apmResource.info.metadata?.raw?.apm_server_mode === `managed`) {
    return ApmMode.Managed
  }

  return ApmMode.Standalone
}
