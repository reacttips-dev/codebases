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

import { EuiIcon, EuiTextColor } from '@elastic/eui'

import DeploymentRegion from '../Deployment/DeploymentRegion'

import { getRegionId } from '../../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

import './regionIndicator.scss'

type Props = {
  deployment: DeploymentSearchResponse
}

const RegionIndicator: FunctionComponent<Props> = ({ deployment }) => {
  const regionId = getRegionId({ deployment })

  if (regionId === null) {
    return null
  }

  if (regionId === `ece-region`) {
    return null
  }

  /*
   * We'd normally use `EuiFlex*` components instead of classes, but they render render using <div>
   * `RegionIndicator` is rendered as a child of a <p>, which shouldn't have <div> children
   */
  return (
    <span className='regionIndicator-container'>
      <span className='regionIndicator-icon'>
        <EuiIcon color='text' type='globe' />
      </span>

      <span>
        <EuiTextColor color='subdued'>
          <DeploymentRegion regionId={regionId} />
        </EuiTextColor>
      </span>
    </span>
  )
}

export default RegionIndicator
