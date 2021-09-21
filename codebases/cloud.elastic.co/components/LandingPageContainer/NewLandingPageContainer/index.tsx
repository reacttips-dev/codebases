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

import React, { Fragment, FunctionComponent, ReactNode } from 'react'

import { EuiPanel, EuiPanelProps, EuiSpacer, EuiTitle, EuiText } from '@elastic/eui'

import Header from './Header'
import { CuiThemedIcon } from '../../../cui'

import './landingPageContainer.scss'

interface Props {
  title?: ReactNode
  subtitle?: ReactNode
  image?: string
  darkImage?: string
  panelProps?: EuiPanelProps
  type?: 'login' | 'signup'
  isLoading?: boolean
  verticalSpacing?: boolean
  infoMessage?: ReactNode
}

const LandingPageContainer: FunctionComponent<Props> = ({
  children,
  title,
  subtitle,
  image,
  darkImage,
  isLoading,
  type,
  verticalSpacing,
  panelProps,
  infoMessage,
}) => (
  <div className='cloud-landing-page'>
    {!isLoading && <Header type={type} />}

    <EuiSpacer size={verticalSpacing ? 'xl' : 'l'} />

    <div className='cloud-landing-page-content'>
      <EuiPanel
        className='cloud-landing-page-panel cloud-landing-page-form-panel cloud-landing-page-panel-narrow'
        hasShadow={true}
        {...panelProps}
      >
        {image && (
          <Fragment>
            <CuiThemedIcon
              className='cloud-landing-page-panel-image'
              size='original'
              lightType={image}
              darkType={darkImage ? darkImage : image}
            />

            <EuiSpacer size='l' />
          </Fragment>
        )}

        {title && (
          <EuiTitle className='cloud-landing-page-form-panel-title' size='m'>
            <h1>{title}</h1>
          </EuiTitle>
        )}

        {subtitle && (
          <Fragment>
            <EuiSpacer size='s' />

            <EuiText size='m' textAlign='center' color='subdued'>
              {subtitle}
            </EuiText>
          </Fragment>
        )}

        <EuiSpacer size='xl' />

        {children}
      </EuiPanel>
      {infoMessage}
    </div>
  </div>
)

export default LandingPageContainer
