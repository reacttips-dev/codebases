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
import { RouteComponentProps } from 'react-router'
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui'

import { RegistrationSource } from '../../../actions/auth/auth'
import { buildOpenIdSignUpQuery, MarketoParamsType } from '../../../lib/urlUtils'

import googleIcon from '../../../files/google-logo.svg'

import './googleSignUp.scss'

interface Props {
  fullText?: boolean
  location: RouteComponentProps['location']
  loginWithGoogle: (
    args?: { fromURI?: string; source?: RegistrationSource; settings?: string } & MarketoParamsType,
  ) => void
}

const GoogleSignUp: FunctionComponent<Props> = ({
  fullText = true,
  location: { search },
  loginWithGoogle,
}) => (
  <EuiButton
    onClick={() => loginWithGoogle(buildOpenIdSignUpQuery(search))}
    className='google-signup-form-button'
    fullWidth={true}
  >
    <EuiFlexGroup alignItems='center' gutterSize='s' responsive={false}>
      <EuiFlexItem>
        <EuiIcon size='original' type={googleIcon} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiText size='s'>
          {fullText ? (
            <FormattedMessage
              id='google-signup-form.signup-google'
              defaultMessage='Sign up with Google'
            />
          ) : (
            <FormattedMessage id='google-signup-form.google' defaultMessage='Google' />
          )}
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiButton>
)

export default GoogleSignUp
