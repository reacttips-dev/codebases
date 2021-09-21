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

import SpinButton from '../../../SpinButton'

type Props = {
  onClick?: () => void
  isDisabled: boolean
  inProgress: boolean
}

export const errorMessage = (
  <FormattedMessage id='mfa.error-message' defaultMessage='Invalid code' />
)

export const switchToSmsLinkText = (
  <FormattedMessage id='mfa.switch-to-sms-link' defaultMessage='Send code via SMS' />
)

export const SubmitButton: FunctionComponent<Props> = ({ onClick, isDisabled, inProgress }) => (
  <SpinButton
    type='submit'
    data-test-id='mfa-submit-button'
    className='loginButton'
    fill={true}
    onClick={onClick}
    buttonProps={{ fullWidth: true }}
    disabled={isDisabled}
    spin={inProgress}
  >
    <FormattedMessage id='mfa.submit' defaultMessage='Verify code' />
  </SpinButton>
)
