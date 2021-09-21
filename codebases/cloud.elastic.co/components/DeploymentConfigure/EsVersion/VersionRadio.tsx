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

import React, { FunctionComponent, ReactNode } from 'react'
import cx from 'classnames'
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiRadio, EuiToolTip } from '@elastic/eui'
import { VersionNumber } from '../../../types'

import './versionRadio.scss'

interface Props {
  value: VersionNumber
  stability: string
  disabled?: boolean | null
  id: string
  name: string
  label: string
  checked: boolean
  onChange: () => void
  disabledReason?: ReactNode
  isWhitelisted?: boolean
}

const VersionRadio: FunctionComponent<Props> = ({
  value,
  stability,
  disabled,
  disabledReason,
  isWhitelisted = true,
  ...rest
}) => {
  const isDisabled = disabled || false

  const radioComponent = (
    <EuiRadio
      className={cx({ 'stackVersion-notWhitelisted': !isWhitelisted })}
      data-test-id={`deploymentConfigure-esVersion-${value}`}
      value={value}
      disabled={isDisabled}
      {...rest}
    />
  )

  if (disabled) {
    return (
      <EuiFlexItem grow={false} className={`${stability}-esVersionInput-radioContainer`}>
        <EuiFlexGroup alignItems='center' gutterSize='s'>
          <EuiFlexItem grow={false}>{radioComponent}</EuiFlexItem>

          {disabledReason && (
            <EuiFlexItem>
              <EuiToolTip position='right' content={disabledReason}>
                <EuiIcon color='danger' type='alert' />
              </EuiToolTip>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </EuiFlexItem>
    )
  }

  return (
    <EuiFlexItem grow={false} className={`${stability}-esVersionInput-radioContainer`}>
      {radioComponent}
    </EuiFlexItem>
  )
}

export default VersionRadio
