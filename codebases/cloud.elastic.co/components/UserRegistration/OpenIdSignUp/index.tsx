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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui'

import GoogleSignUp from '../../CreateAccountForm/GoogleSignUp'
import MicrosoftSignUp from '../../CreateAccountForm/MicrosoftSignUp'

const OpenIdSignUp: FunctionComponent = () => (
  <Fragment>
    <EuiSpacer />

    <div className='social-signup-form-separator'>
      <EuiText size='s'>
        <FormattedMessage id='signup-form.or-sign-up-with' defaultMessage='Or sign up with' />
      </EuiText>
    </div>

    <EuiSpacer />

    <EuiFlexGroup alignItems='center' gutterSize='s'>
      <EuiFlexItem>
        <GoogleSignUp fullText={false} />
      </EuiFlexItem>

      <EuiFlexItem>
        <MicrosoftSignUp fullText={false} />
      </EuiFlexItem>
    </EuiFlexGroup>
  </Fragment>
)

export default OpenIdSignUp
