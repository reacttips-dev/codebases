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
import { FormattedMessage } from 'react-intl'
import { EuiButtonEmpty, EuiToolTip } from '@elastic/eui'
import SpinButton from '../SpinButton'

interface Props {
  className?: string
  disabled: boolean
  onClick: () => void
  spin: boolean
  text: React.ReactChild
}

const RemoveDeviceButton: FunctionComponent<Props> = ({
  className,
  disabled,
  onClick,
  spin,
  text,
}) => {
  const Button = (
    <SpinButton
      buttonType={EuiButtonEmpty}
      color='danger'
      spin={spin}
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-test-id='remove-mfa-device'
    >
      {text}
    </SpinButton>
  )

  return (
    <div className='remove-mfa-device-button'>
      {disabled ? (
        <EuiToolTip
          position='top'
          content={
            <FormattedMessage
              id='device-authentication-tooltip'
              defaultMessage='Disable multi-factor authentication first'
            />
          }
        >
          {Button}
        </EuiToolTip>
      ) : (
        Button
      )}
    </div>
  )
}

export default RemoveDeviceButton
