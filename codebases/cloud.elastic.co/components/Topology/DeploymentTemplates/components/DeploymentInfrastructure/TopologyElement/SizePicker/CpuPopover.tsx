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

import { EuiButtonIcon, EuiPopover, EuiText } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

import DocLink from '../../../../../../DocLink'

type Props = {
  onClose: () => void
  isOpen: boolean
  onClick: () => void
}

const CpuPopover: FunctionComponent<Props> = ({ onClose, isOpen, onClick }) => {
  const button = (
    <EuiButtonIcon
      onClick={() => onClick()}
      iconType='iInCircle'
      color='subdued'
      aria-label='Info'
    />
  )

  return (
    <EuiPopover
      anchorPosition='upCenter'
      button={button}
      isOpen={isOpen}
      closePopover={() => onClose()}
      className='fs-unmask'
    >
      <EuiText>
        <FormattedMessage
          defaultMessage='Learn more about how {cpuAllocation}'
          id='cpu-popover-message'
          values={{
            cpuAllocation: (
              <DocLink link='vcpuBoost'>
                <FormattedMessage
                  id='vcpuInfo.learnMore'
                  defaultMessage='CPU resources get allocated.'
                />
              </DocLink>
            ),
          }}
        />
      </EuiText>
    </EuiPopover>
  )
}

export default CpuPopover
