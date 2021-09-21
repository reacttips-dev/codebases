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
import cx from 'classnames'
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui'
import RemoveDeviceButton from '../RemoveDeviceButton'
import { AsyncRequestState } from '../../../types'

interface Props {
  canRemove: boolean
  mfaEnabled: boolean
  phoneNumber: string
  onRemoveMfaDevice: () => void
  removeMfaDeviceRequest: AsyncRequestState
}

const DeviceActive: FunctionComponent<Props> = ({
  canRemove,
  mfaEnabled,
  onRemoveMfaDevice,
  phoneNumber,
  removeMfaDeviceRequest,
}) => (
  <EuiFlexGroup direction='column' gutterSize='s'>
    <EuiFlexItem>
      <EuiText size='s'>
        <FormattedMessage
          id='text-message-authentication-configured-info'
          defaultMessage='Mobile phone number configured for receiving security codes'
        />
      </EuiText>
    </EuiFlexItem>
    <EuiFlexItem>
      <EuiFlexGroup
        alignItems='center'
        responsive={false}
        gutterSize='s'
        className='text-message-authentication-configured-number-info'
      >
        <EuiFlexItem grow={false}>
          <EuiFlexGroup alignItems='center' responsive={false} gutterSize='s'>
            <EuiFlexItem grow={false}>
              <EuiIcon type='check' color='secondary' />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText
                className={cx('text-message-authentication-configured-number', {
                  'user-settings-disabled-label': !mfaEnabled,
                })}
              >
                {phoneNumber.replace(/.(?=.{4})/g, '*')}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <RemoveDeviceButton
            className='text-message-authentication-remove-button'
            disabled={!canRemove}
            onClick={onRemoveMfaDevice}
            spin={removeMfaDeviceRequest.inProgress}
            text={
              <FormattedMessage
                id='text-message-authentication-remove-button'
                defaultMessage='remove'
              />
            }
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default DeviceActive
