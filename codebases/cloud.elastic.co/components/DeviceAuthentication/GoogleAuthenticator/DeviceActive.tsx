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
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui'
import cx from 'classnames'
import RemoveDeviceButton from '../RemoveDeviceButton'
import { AsyncRequestState } from '../../../types'

interface Props {
  canRemove: boolean
  mfaEnabled: boolean
  onRemoveMfaDevice: () => void
  removeMfaDeviceRequest: AsyncRequestState
}

const DeviceActive: FunctionComponent<Props> = ({
  mfaEnabled,
  canRemove,
  onRemoveMfaDevice,
  removeMfaDeviceRequest,
}) => (
  <EuiFlexGroup direction='column' gutterSize='s'>
    <EuiFlexItem>
      <EuiText size='s'>
        <FormattedMessage
          id='google-authenticator-configured-info'
          defaultMessage='Google authenticator app configured. You will be asked for a 6 digit security code at login.'
        />
      </EuiText>
    </EuiFlexItem>
    <EuiFlexItem>
      <EuiFlexGroup alignItems='center' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup alignItems='center' responsive={false} gutterSize='s'>
            <EuiFlexItem grow={false}>
              <EuiIcon type='check' color='secondary' />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText
                className={cx('google-authenticator-verified', {
                  'user-settings-disabled-label': !mfaEnabled,
                })}
              >
                <FormattedMessage
                  id='google-authenticator-verified-device'
                  defaultMessage='Verified device'
                />
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <RemoveDeviceButton
            className='google-authenticator-remove-button'
            disabled={!canRemove}
            onClick={onRemoveMfaDevice}
            spin={removeMfaDeviceRequest.inProgress}
            text={
              <FormattedMessage
                id='google-authenticator-remove-button'
                defaultMessage='remove device'
              />
            }
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default DeviceActive
