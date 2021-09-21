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

import React, { FunctionComponent } from 'react'

import { EuiIcon } from '@elastic/eui'

import { getPlatform, getPlatformInfoById } from '../../../lib/platform'

type Props = {
  regionId?: string | null
}

const DeploymentProvider: FunctionComponent<Props> = ({ regionId }) => {
  if (!regionId) {
    return null
  }

  if (regionId === `ece-region`) {
    return null
  }

  const platformId = getPlatform(regionId)
  const platform = getPlatformInfoById(platformId)

  if (!platform) {
    return null
  }

  return <EuiIcon type={platform.iconType} aria-label={platform.title} color='text' size='xl' />
}

export default DeploymentProvider
