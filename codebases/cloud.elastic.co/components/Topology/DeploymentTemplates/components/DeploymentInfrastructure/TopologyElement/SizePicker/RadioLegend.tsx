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
import { FormattedMessage } from 'react-intl'

import { EuiText } from '@elastic/eui'

const RadioLegend = ({ primaryKey, secondaryKey }) => {
  const keyLabels = {
    memory: (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-sizeSlider-memoryLabel'
        defaultMessage='RAM'
      />
    ),
    storage: (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-sizeSlider-storageLabel'
        defaultMessage='Storage'
      />
    ),
    cpu: (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-sizeSlider-cpuLabel'
        defaultMessage='vCPU'
      />
    ),
  }
  return (
    <div className='deploymentInfrastructure-topologyElement-sizeSlider-radioLegend'>
      <EuiText size='xs' color='subdued'>
        {keyLabels[primaryKey]}
      </EuiText>
      {secondaryKey && (
        <EuiText size='xs' color='subdued'>
          {keyLabels[secondaryKey]}
        </EuiText>
      )}
    </div>
  )
}

export default RadioLegend
