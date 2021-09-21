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

import { EuiText } from '@elastic/eui'

import { CuiLink, CuiRouterLinkButton } from '../../../../../cui'
import messages from '../messages'
import { buildRegisterUrl } from '../../../../../lib/urlUtils'

interface Props {
  locationQueryString: string
}

const SignupButton: FunctionComponent<Props> = ({ locationQueryString }) => {
  const registerUrl = buildRegisterUrl({ search: locationQueryString })

  return (
    <Fragment>
      <EuiText size='s' textAlign='right' className='cloud-landing-page-login-link'>
        <FormattedMessage
          id='login-form.sign-up'
          defaultMessage="Don't have an account? {signUpLink}"
          values={{
            signUpLink: (
              <CuiRouterLinkButton
                size='s'
                to={registerUrl}
                className='cloud-landing-page-sign-up-link'
                data-test-id='cloud-landing-page.sign-up-link'
                fill={true}
              >
                <FormattedMessage {...messages.signup} />
              </CuiRouterLinkButton>
            ),
          }}
        />
      </EuiText>

      <CuiLink
        data-test-id='cloud-landing-page.sign-up-link'
        className='cloud-landing-page-sign-up-link-mobile'
        to={registerUrl}
      >
        <FormattedMessage {...messages.signup} />
      </CuiLink>
    </Fragment>
  )
}

export default SignupButton
