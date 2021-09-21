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

import azureIcon from '../../../files/azure-logo.svg'

interface Props {
  fullText?: boolean
  location: RouteComponentProps['location']
  loginWithAzure: (
    args?: { fromURI?: string; source?: RegistrationSource; settings?: string } & MarketoParamsType,
  ) => void
}

const MicrosoftSignUp: FunctionComponent<Props> = ({
  fullText = true,
  location: { search },
  loginWithAzure,
}) => (
  <EuiButton
    onClick={() => loginWithAzure(buildOpenIdSignUpQuery(search))}
    className='azure-signup-form-button'
    fullWidth={true}
  >
    <EuiFlexGroup alignItems='center' gutterSize='s' responsive={false}>
      <EuiFlexItem>
        <EuiIcon size='original' type={azureIcon} />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiText size='s'>
          {fullText ? (
            <FormattedMessage
              id='signup-form.signup-azure'
              defaultMessage='Sign up with Microsoft'
            />
          ) : (
            <FormattedMessage id='signup-form.azure' defaultMessage='Microsoft' />
          )}
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiButton>
)

export default MicrosoftSignUp
