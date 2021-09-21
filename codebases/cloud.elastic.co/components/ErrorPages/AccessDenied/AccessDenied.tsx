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

import { EuiButton, EuiEmptyPrompt, EuiLink, EuiSpacer, EuiText } from '@elastic/eui'

import HttpErrorPage from '../HttpErrorPage'

import history from '../../../lib/history'

import { supportPortalUrl } from '../../../apps/userconsole/urls'

import errorImg from '../../../files/403_rainy_cloud_light.png'
import errorImgDark from '../../../files/403_rainy_cloud_dark.png'

type Props = {
  theme: 'dark' | 'light'
  source?: string | string[] | null
}

const themes = {
  light: errorImg,
  dark: errorImgDark,
}

const AccessDenied: FunctionComponent<Props> = ({ theme, source }) => (
  <HttpErrorPage>
    <EuiEmptyPrompt
      titleSize='m'
      iconType={themes[theme]}
      title={
        <h2>
          <FormattedMessage id='http-errors.access-denied.title' defaultMessage='Access denied' />
        </h2>
      }
      body={
        source === `support` ? (
          <Fragment>
            <EuiText size='s'>
              <FormattedMessage
                id='http-errors.access-denied.content-support'
                defaultMessage='You do not have access to {support}. Please contact an active support contact within your organization to add you as an additional support contact.'
                values={{
                  support: <EuiLink href={supportPortalUrl}>support.elastic.co</EuiLink>,
                }}
              />
            </EuiText>
            <EuiSpacer size='s' />
            <EuiText size='s'>
              <FormattedMessage
                id='http-errors.access-denied.contact-support'
                defaultMessage='If you still need assistance, please email {support}.'
                values={{
                  support: <EuiLink href='mailto:support@elastic.co'>support@elastic.co</EuiLink>,
                }}
              />
            </EuiText>
          </Fragment>
        ) : (
          <EuiText size='s'>
            <FormattedMessage
              id='http-errors.access-denied.content'
              defaultMessage="Sorry to rain on your parade, but you don't have permissions to access this page"
            />
          </EuiText>
        )
      }
      actions={
        <EuiButton
          fill={true}
          onClick={() => history.replace('/')}
          className='http-error-pages-button'
        >
          <FormattedMessage id='http-errors-pages.home-button' defaultMessage='Home' />
        </EuiButton>
      }
    />
  </HttpErrorPage>
)

export default AccessDenied
