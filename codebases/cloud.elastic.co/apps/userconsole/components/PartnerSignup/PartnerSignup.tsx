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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui'

import PartnerSignupForm from './PartnerSignupForm'
import PartnerSignupComplete from './PartnerSignupComplete'

import { AsyncRequestState, Theme } from '../../../../types'
import { PartnerUser } from '../../actions/partner'
import LandingPageContainer from '../../../../components/LandingPageContainer'
import LandingImage from '../../../../components/LandingImage'

import marketplaceLight from '../../../../files/marketplace-lightmode.svg'
import marketplaceDark from '../../../../files/marketplace-darkmode.svg'

type SignupRequestMetaData = { meta: { email: string } }

export default function PartnerSignup({
  signUpPartnerUserRequest,
  theme,
  ...rest
}: {
  signUpPartnerUserRequest: AsyncRequestState & SignupRequestMetaData
  token: any
  partner: any
  theme: Theme
  signUpGcpUser: (token: any, args: PartnerUser) => void
  signUpAwsUser: (token: any, args: PartnerUser) => void
  signUpAzureUser: (token: any, args: PartnerUser) => void
}) {
  if (signUpPartnerUserRequest.isDone && !signUpPartnerUserRequest.error) {
    return (
      <LandingPageContainer scrollPage={true}>
        <PartnerSignupComplete theme={theme} email={signUpPartnerUserRequest.meta.email} />
      </LandingPageContainer>
    )
  }

  return (
    <LandingPageContainer scrollPage={true}>
      <EuiFlexGroup
        className='partnerSignupWrapper'
        gutterSize='xl'
        justifyContent='center'
        alignItems='flexStart'
        responsive={false}
      >
        <EuiFlexItem grow={false}>
          <PartnerSignupForm signUpPartnerUserRequest={signUpPartnerUserRequest} {...rest} />
        </EuiFlexItem>
        <EuiFlexItem grow={false} className='partnerSignup-landing-image'>
          <LandingImage
            description={
              <EuiTitle>
                <h3>
                  <FormattedMessage
                    id='partnerSignupWrapper.image-description'
                    defaultMessage='Sign up for Elastic Cloud with {marketplace} billing'
                    values={{
                      marketplace: (
                        <span className='landingImage-underline'>
                          <FormattedMessage
                            id='partnerSignupWrapper.marketplace'
                            defaultMessage='marketplace'
                          />
                        </span>
                      ),
                    }}
                  />
                </h3>
              </EuiTitle>
            }
            image={marketplaceLight}
            darkImage={marketplaceDark}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </LandingPageContainer>
  )
}
