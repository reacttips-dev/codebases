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

import React, { Fragment, FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiText } from '@elastic/eui'

import { CuiLink, CuiRouterLinkButton } from '../../../../../cui'
import messages from '../messages'

import { buildLoginUrl } from '../../../../../lib/urlUtils'

interface Props {
  locationQueryString: string
}

const LoginButton: FunctionComponent<Props> = ({ locationQueryString }): ReactElement => {
  const loginUrl = buildLoginUrl({ locationQueryString })

  return (
    <Fragment>
      <EuiText textAlign='right' size='s' className='cloud-landing-page-login-link'>
        <FormattedMessage
          id='cloud-landing-page.login-link-message'
          defaultMessage='Already have an account? {link}'
          values={{
            link: (
              <CuiRouterLinkButton
                size='s'
                fill={true}
                className='cloud-landing-page-login-link'
                data-test-id='cloud-landing-page.login-link'
                to={loginUrl}
              >
                <FormattedMessage {...messages.login} />
              </CuiRouterLinkButton>
            ),
          }}
        />
      </EuiText>

      <CuiLink
        data-test-id='cloud-landing-page.login-link'
        className='cloud-landing-page-login-link-mobile'
        to={loginUrl}
      >
        <FormattedMessage {...messages.login} />
      </CuiLink>
    </Fragment>
  )
}

export default LoginButton
