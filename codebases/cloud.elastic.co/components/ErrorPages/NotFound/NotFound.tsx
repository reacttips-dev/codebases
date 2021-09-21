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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiButton, EuiEmptyPrompt, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui'

import { CuiRouterLinkButton } from '../../../cui'

import HttpErrorPage from '../HttpErrorPage'

import history from '../../../lib/history'

import { loginUrl } from '../../../lib/urlBuilder'

import { Theme } from '../../../types'

import errorImg from '../../../files/404_rainy_cloud_light.png'
import errorImgDark from '../../../files/404_rainy_cloud_dark.png'

export interface Props {
  theme: Theme
  showLoginButton: boolean
}

const themes = {
  light: errorImg,
  dark: errorImgDark,
}

const NotFound: FunctionComponent<Props> = ({ theme, showLoginButton }) => (
  <HttpErrorPage>
    <EuiEmptyPrompt
      iconType={themes[theme]}
      titleSize='m'
      title={
        <h2>
          <FormattedMessage id='http-errors.not-found.title' defaultMessage='Page not found' />
        </h2>
      }
      body={
        <EuiText size='s'>
          <FormattedMessage
            id='http-errors.not-found.content'
            defaultMessage='We must have our head in the clouds, sorry about that.'
          />
        </EuiText>
      }
      actions={
        <EuiFlexGroup justifyContent='center' alignItems='center' gutterSize='l'>
          {showLoginButton ? (
            <EuiFlexItem grow={false}>
              <div data-test-id='not-found-login-button'>
                <CuiRouterLinkButton
                  fill={true}
                  to={loginUrl()}
                  className='http-error-pages-button'
                >
                  <FormattedMessage id='http-errors-pages.login-button' defaultMessage='Log in' />
                </CuiRouterLinkButton>
              </div>
            </EuiFlexItem>
          ) : (
            <Fragment>
              <EuiFlexItem grow={false}>
                <div data-test-id='not-found-go-back-button'>
                  <EuiButton
                    iconType='arrowLeft'
                    fill={false}
                    color='text'
                    onClick={() => history.goBack()}
                    className='http-error-pages-button'
                  >
                    <FormattedMessage
                      id='http-errors-pages.go-back-button'
                      defaultMessage='Go back'
                    />
                  </EuiButton>
                </div>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <div data-test-id='not-found-home-button'>
                  <CuiRouterLinkButton fill={true} to='/' className='http-error-pages-button'>
                    <FormattedMessage id='http-errors-pages.home-button' defaultMessage='Home' />
                  </CuiRouterLinkButton>
                </div>
              </EuiFlexItem>
            </Fragment>
          )}
        </EuiFlexGroup>
      }
    />
  </HttpErrorPage>
)

export default NotFound
